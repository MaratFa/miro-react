import { createRectFromPoints } from "../../domain/rect";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type SelectionWindowViewState = {
  type: "selection-window";
  startPoint: {
    x: number;
    y: number;
  };
  endPoint: {
    x: number;
    y: number;
  };
};

export function useSelectionWindowWiewModel({
  nodesModel,
  setViewState,
  canvasRect,
}: ViewModelParams) {
  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);
    return {
      selectionWindow: rect,
      nodes: nodesModel.nodes,
      window: {
        onMouseUp: () => {
          setViewState(goToIdle());
        },
      },
    };
  };
}

export function goToSelectionWindow(
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number }
): SelectionWindowViewState {
  return {
    type: "selection-window",
    startPoint,
    endPoint,
  };
}
