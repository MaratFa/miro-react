import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./model/nodes";
import { useCanvasRect } from "./hooks/use-canvas-rect";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { useViewModel } from "./view-model/use-view-model";
import { useWindowEvents } from "./hooks/use-window-events";
import { SelectionWindow } from "./ui/selection-window";
import { Overlay } from "./ui/overlay";
import { Layout } from "./ui/layout";
import { Dots } from "./ui/dots";
import { Canvas } from "./ui/canvas";
import { Sticker } from "./ui/sticker";
import { Actions } from "./ui/actions";
import { ActionButton } from "./ui/action-button";
import { useNodesDimensions } from "./hooks/use-nodes-dimensions";
import { useWindowPositionModel } from "./model/window-position";
import { Point, vectorFromPoints } from "./domain/points";

function BoardPage() {
  const nodesModel = useNodes();
  const windowPositionModel = useWindowPositionModel();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { nodeRef, nodesDimensions } = useNodesDimensions();

  const viewModel = useViewModel({
    nodesModel,
    canvasRect,
    nodesDimensions,
    windowPositionModel,
  });

  useWindowEvents(viewModel);

  const windowPosition =
    viewModel.windowPosition ?? windowPositionModel.position;
  return (
    <Layout ref={focusLayoutRef} onKeyDown={viewModel.layot?.onKeyDown}>
      <Dots windowPosition={windowPosition} />

      <Canvas
        ref={canvasRef}
        overlay={
          <Overlay
            onClick={viewModel.overlay?.onClick}
            onMouseDown={viewModel.overlay?.onMouseDown}
            onMouseUp={viewModel.overlay?.onMouseUp}
          />
        }
        onClick={viewModel.canvas?.onClick}
        windowPosition={windowPosition}
      >
        {viewModel.nodes.map((node) => (
          <Sticker key={node.id} {...node} ref={nodeRef} />
        ))}
        {viewModel.selectionWindow && (
          <SelectionWindow {...viewModel.selectionWindow} />
        )}
        <Arrow start={{ x: 30, y: 50 }} end={{ x: 90, y: 90 }} />
      </Canvas>
      <Actions>
        <ActionButton
          isActive={viewModel.actions?.addSticker?.isActive}
          onClick={viewModel.actions?.addSticker?.onClick}
        >
          <StickerIcon />
        </ActionButton>
        <ActionButton isActive={false} onClick={() => {}}>
          <ArrowRightIcon />
        </ActionButton>
      </Actions>
    </Layout>
  );
}

export const Component = BoardPage;

function Arrow({ start, end }: { start: Point; end: Point }) {
  const diff = vectorFromPoints(start, end);
  const angle = Math.atan2(diff.y, diff.x);
  const arrowRightAngle = angle + Math.PI * (1 - 1 / 6);
  const arrowLeftAngle = angle - Math.PI * (1 - 1 / 6);









  return (
    <svg className="absolute left-0 top-0 pointer-events-none">
      <path
        stroke="black"
        strokeWidth={2}
        strokeLinecap="round"
        d={`M${start.x} ${start.y} L${end.x} ${end.y}`}
      />
    </svg>
  );
}
