import { distanceFromPoints } from "@/features/board/domain/points";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";

export function useGoToNodesDragging(params: ViewModelParams) {
  const { canvasRect } = params;

  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (idleState.mouseDown && idleState.mouseDown.type === "node") {
      const currentPoint = pointOnScreenToCanvas(
        {
          x: e.clientX,
          y: e.clientY,
        },
        canvasRect
      );

      if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
        console.log("nodes gragging");
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
}
