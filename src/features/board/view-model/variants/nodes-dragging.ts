import { Point } from "../../domain/points";
import {
  createRectFromDimensions,
  createRectFromPoints,
  isRectsIntersecting,
  Rect,
} from "../../domain/rect";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { selectItems } from "../../domain/selection";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type nodesDraggingViewState = {
  type: "nodes-window";
  startPoint: Point;
  endPoint: Point;
  nodesToMove: Set<string>;
};

export function useNodesDraggingWiewModel({
  nodesModel,
  setViewState,
  canvasRect,
  nodesDimensions,
}: ViewModelParams) {
  const getNodes = (state: nodesDraggingViewState, selectionRect: Rect) =>
    nodesModel.nodes.map((node) => {
    




      
      return {
        ...node,
        isSelected:
          isRectsIntersecting(nodeRect, selectionRect) ||
          state.initialSelectedIds.has(node.id),
      };
    });

  return (state: nodesDraggingViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);
    const nodes = getNodes(state, rect);

    return {
      nodesDragging: rect,
      nodes,
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
          const nodesIdsInRect = nodes
            .filter((node) => node.isSelected)
            .map((node) => node.id);

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

export function goToNodesDragging({
  endPoint,
  startPoint,
  initialSelectedIds,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  initialSelectedIds?: Set<string>;
}): nodesDraggingViewState {
  return {
    type: "selection-window",
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
}
