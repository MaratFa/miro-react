import { distanceFromPoints } from "../../../domain/points";
import { pointOnScreenToCanvas } from "../../../domain/screen-to-canvas";
import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { goToAddSticker } from "./../add-sticker";
import { goToSelectionWindow } from "./../selection-window";
import { Selection } from "../../../domain/selection";
import { goToEditSticker } from "./../edit-sticker";
import { useSelection } from "./use-selection";
import { useDeleteSelected } from "./useDeleteSelected";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useGoToEditSticker(params: ViewModelParams) {
  const { setViewState } = params;

  const handleNodeClick = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (
      idleState.selectedIds.size === 1 &&
      idleState.selectedIds.has(nodeId) &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      setViewState(goToEditSticker(nodeId));
      return { preventNext: true };
    }

    return {
      preventNext: false,
    };
  };

  const handleKeyDown = (
    idleState: IdleViewState,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Delete") {
      if (idleState.selectedIds.size === 1) {
        const [id] = idleState.selectedIds.values();
        setViewState(goToEditSticker(id)
  )

  return {
    handleNodeClick,
  }
}

export function useGoToAddSticker(params: ViewModelParams) {}

export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel, canvasRect, setViewState } = params;

  const selection = useSelection(params);
  const deleteSelected = useDeleteSelected(params);
  const goToEditSticker = useGoToEditSticker(params);

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
        if (
          !e.shiftKey &&
          !e.altKey &&
          !e.metaKey &&
          !e.ctrlKey &&
          idleState.selectedIds.size === 1
        ) {
          const [id] = idleState.selectedIds.values();
          setViewState(goToEditSticker(id));
          return;
        }
        if (e.key === "s") {
          setViewState(goToAddSticker());
        }

        deleteSelected.handleKeyDown(idleState, e);
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
        onClick: () => {
          setViewState(goToAddSticker());
        },
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
