import { Point } from "../../domain/points";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type DrawArrowViewState = {
  type: "draw-arrow";
  startPoint: Point;
};

export function useDrawArrowViewModel({
  nodesModel,
  setViewState,
}: ViewModelParams) {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setViewState(goToIdle());
        }
      },
    },
    actions: {
      addArrow: {
        isActive: true,
      },
    },
  });
}

export function goToDrawArrow(startPoint: Point): DrawArrowViewState {
  return {
    type: "draw-arrow",
    startPoint,
  };
}
