import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./nodes";
import { useBoardViewState } from "./view-state";
import { Ref, RefCallback, useCallback } from "react";

const useCanvasRect = () => {
  const canvasRef: RefCallback<HTMLDivElement> = useCallback((el) => {
    console.log(el);
    
    return () => {};
  }, []);

  return {
    canvasRef,
  };
};

function BoardPage() {
  const { nodes, addSticker } = useNodes();
  const { viewState, goToIdle, goToAddSticker } = useBoardViewState();
  const { canvasRef } = useCanvasRect();

  return (
    <Layout>
      <Dots />
      <Canvas
      ref={canvasRef}
        onClick={(e) => {
          if (viewState.type === "add-sticker") {
            addSticker({
              text: "Default",
              x: e.clientX,
              y: e.clientY,
            });
            goToIdle();
          }
        }}
      >
        {nodes.map((node) => (
          <Sticker text={node.text} x={node.x} y={node.y} />
        ))}
      </Canvas>
      <Actions>
        <ActionButton
          isActive={viewState.type === "add-sticker"}
          onClick={() => {
            if (viewState.type === "add-sticker") {
              goToIdle();
            } else {
              goToAddSticker();
            }
          }}
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow relative" tabIndex={0}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
  );
}

function Canvas({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div ref={ref} {...props} className="absolute inset-0">
      {children}
    </div>
  );
}

function Sticker({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <div
      className="absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {text}
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
      {children}
    </div>
  );
}

function ActionButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
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
