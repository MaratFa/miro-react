import { Point } from "../../domain/points";
import { createRectFromPoints, isPointInRect, Rect } from "../../domain/rect";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { selectItems } from "../../domain/selection";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type SelectionWindowViewState = {
  type: "selection-window";
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds: Set<string>;
};

export function useSelectionWindowWiewModel({
  nodesModel,
  setViewState,
  canvasRect,
  nodesRects,
}: ViewModelParams) {
  const getNodes = (state: SelectionWindowViewState, selectionRect: Rect) =>
    nodesModel.nodes.map((node) => {
      return {
        ...node,
        isSelected:
          isPointInRect(node, selectionRect) ||
          state.initialSelectedIds.has(node.id),
      };
    });

  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);
    return {
      selectionWindow: rect,
      nodes: getNodes(state, rect),
      window: {
        onMouseMove: (e) => {
          const currentPoint = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect
          );
          setViewState({
            ...state,
            endPoint: currentPoint,
          });
        },
        onMouseUp: () => {
          const nodesIdsInRect = nodesModel.nodes
            .filter((node) => isPointInRect(node, rect))
            .map((node) => node.id);

          console.log(nodesIdsInRect);

          setViewState(
            goToIdle({
              selectedIds: selectItems(
                state.initialSelectedIds,
                nodesIdsInRect,
                "add"
              ),
            })
          );
        },
      },
    };
  };
}

export function goToSelectionWindow({
  endPoint,
  startPoint,
  initialSelectedIds,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  initialSelectedIds?: Set<string>;
}): SelectionWindowViewState {
  return {
    type: "selection-window",
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
}
