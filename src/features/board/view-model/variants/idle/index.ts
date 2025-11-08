import { distanceFromPoints } from "../../../domain/points";
import { pointOnScreenToCanvas } from "../../../domain/screen-to-canvas";
import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { goToSelectionWindow } from "./../selection-window";
import { Selection } from "../../../domain/selection";
import { useSelection } from "./use-selection";
import { useDeleteSelected } from "./useDeleteSelected";
import { useGoToEditSticker } from "./useGoToEditSticker";
import { useGoToAddSticker } from "./useGoToAddSticker";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

function useMouseDown({ setViewState, canvasRect }: ViewModelParams) {
  const handleOverlayMouseDown = (
    idleState: IdleViewState,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setViewState({
      ...idleState,
      mouseDown: pointOnScreenToCanvas(
        {
          x: e.clientX,
          y: e.clientY,
        },
        canvasRect
      ),
    });
  };

  const handleOverlayMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      setViewState({
        ...idleState,
        mouseDown: undefined,
      });
    }

    return {
      handleOverlayMouseDown,
    };
  };
}







export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel, canvasRect, setViewState } = params;

  const selection = useSelection(params);
  const deleteSelected = useDeleteSelected(params);
  const goToEditSticker = useGoToEditSticker(params);
  const goToAddSticker = useGoToAddSticker(params);
  const mouseDown = useMouseDown(params);

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),
      onClick: (e) => {
        const clickResult = goToEditSticker.handleNodeClick(
          idleState,
          node.id,
          e
        );

        if (clickResult.preventNext) return;
        selection.handleNodeClick(idleState, node.id, e);
      },
    })),
    layot: {
      onKeyDown: (e) => {
        const keyDownResult = goToEditSticker.handleKeyDown(idleState, e);
        if (keyDownResult.preventNext) return;

        deleteSelected.handleKeyDown(idleState, e);
        goToAddSticker.handleKeyDown(e);
      },
    },
    overlay: {
      onMouseDown: (e) => {
        setViewState({
          ...idleState,
          mouseDown: pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect
          ),
        });
      },
      onMouseUp: () => selection.handleOverlayMouseUp(idleState),
    },
    window: {
      onMouseMove: (e) => {
        if (idleState.mouseDown) {
          const currentPoint = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect
          );

          if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
            setViewState(
              goToSelectionWindow({
                startPoint: idleState.mouseDown,
                endPoint: currentPoint,
                initialSelectedIds: e.shiftKey
                  ? idleState.selectedIds
                  : undefined,
              })
            );
          }
        }
      },
      onMouseUp: () => {
        setViewState({
          ...idleState,
          mouseDown: undefined,
        });
      },
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: goToAddSticker.handleActionClick,
      },
    },
  });
}

export function goToIdle({
  selectedIds,
}: { selectedIds?: Selection } = {}): IdleViewState {
  return {
    type: "idle",
    selectedIds: selectedIds ?? new Set(),
  };
}
