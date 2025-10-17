import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { Button } from "@/shared/ui/kit/button";
import { useNodes } from "./model/nodes";
import React from "react";
import { useCanvasRect } from "./hooks/use-canvas-rect";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { useViewModel } from "./view-model/use-view-model";

import { useWindowEvents } from "./hooks/use-window-events";
import { SelectionWindow } from "./ui/SelectionWindow";
import { Overlay } from "./ui/Overlay";
import { Layout } from "./ui/Layout";
import { Dots } from "./ui/Dots";
import { Canvas } from "./ui/Canvas";
import { Sticker } from "./ui/Sticker";
import { Actions } from "./ui/Actions";

function BoardPage() {
  const nodesModel = useNodes();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();

  const viewModel = useViewModel({
    nodesModel,
    canvasRect,
  });

  useWindowEvents(viewModel);

  return (
    <Layout ref={focusLayoutRef} onKeyDown={viewModel.layot?.onKeyDown}>
      <Dots />

      <Canvas ref={canvasRef} onClick={viewModel.canvas?.onClick}>
        <Overlay
          onClick={viewModel.overlay?.onClick}
          onMouseDown={viewModel.overlay?.onMouseDown}
          onMouseUp={viewModel.overlay?.onMouseUp}
        />
        {viewModel.nodes.map((node) => (
          <Sticker
            key={node.id}
            text={node.text}
            x={node.x}
            y={node.y}
            selected={node.isSelected}
            onClick={node.onClick}
          />
        ))}
      </Canvas>
      {viewModel.selectionWindow && (
        <SelectionWindow {...viewModel.selectionWindow} />
      )}
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

function ActionButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        isActive
          ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-60000"
          : ""
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
