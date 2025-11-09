import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";

export function useMouseDown({ setViewState, canvasRect }: ViewModelParams) {
  const handleOverlayMouseDown = (
    idleState: IdleViewState,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      canvasRect
    );
    setViewState({
      ...idleState,
      mouseDown: {
        type: "overlay",
        x: point.x,
        y: point.y,
      },
    });
  };

  const handleNodeMouseDown = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent<HTMLElement>
  ) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      canvasRect
    );
    setViewState({
      ...idleState,
      mouseDown: {
        type: "node",
        nodeId,
        x: point.x,
        y: point.y,
      },
    });
  };

  const getIsStickerMouseDown = (idleState: IdleViewState, nodeId: string) => {
    return (
      idleState.mouseDown?.type === "node" &&
      idleState.mouseDown.nodeId === nodeId
    );
  };

  const handleWindowMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      setViewState({
        ...idleState,
        mouseDown: undefined,
      });
    }
  };

  return {
    handleOverlayMouseDown,
    handleWindowMouseUp,
    handleNodeMouseDown,
    getIsStickerMouseDown,
  };
}
