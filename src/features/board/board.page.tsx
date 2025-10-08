import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { Button } from "@/shared/ui/kit/button";
import { useNodes } from "./nodes";
import { useViewModel } from "./view-model";
import { Ref } from "react";
import { useCanvasRect } from "./use-canvas-rect";
import { useLayoutFocus } from "./use-layout-focus";
import clsx from "clsx";

type ViewModeNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type ViewModel = {
  nodes: ViewModeNode[];
  layot?: {
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  };
  canvas?: {
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
};

function BoardPage() {
  const { nodes, addSticker } = useNodes();
  const viewModelLast = useViewModel();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();

  let viewModel: ViewModel;

  switch (viewModelLast.viewState.type) {
    case "add-sticker":
      viewModel = {
        nodes: nodes,
        layot: {
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              viewModelLast.goToIdle();
            }
          },
        },
        canvas: {
          onClick: (e) => {
            if (!canvasRect) return;
            addSticker({
              text: "Default",
              x: e.clientX - canvasRect.x,
              y: e.clientY - canvasRect.y,
            });
            viewModelLast.goToIdle();
          },
        },
      };
      break;
    case "idle": {
      const viewState = viewModelLast.viewState;
      viewModel = {
        nodes: nodes.map((node) => ({
          ...node,
          isSelected: viewState.selectedIds.has(node.id),
          onClick: (e) => {
            if (e.ctrlKey || e.shiftKey) {
              viewModelLast.selection([node.id], "toggle");
            } else {
              viewModelLast.selection([node.id], "replace");
            }
          },
        })),
        layot: {
          onKeyDown: (e) => {
            if (e.key === "s") {
              viewModelLast.goToAddSticker();
            }
          },
        },
      };
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return (
    <Layout ref={focusLayoutRef} onKeyDown={viewModel.layot?.onKeyDown}>
      <Dots />
      <Canvas ref={canvasRef} onClick={viewModel.canvas?.onClick}>
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
      <Actions>
        <ActionButton
          isActive={viewModelLast.viewState.type === "add-sticker"}
          onClick={() => {
            if (viewModelLast.viewState.type === "add-sticker") {
              viewModelLast.goToIdle();
            } else {
              viewModelLast.goToAddSticker();
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

function Layout({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="grow relative" tabIndex={0} ref={ref} {...props}>
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

function Sticker({
  text,
  x,
  y,
  onClick,
  selected,
}: {
  text: string;
  x: number;
  y: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
}) {
  return (
    <button
      className={clsx(
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
        selected && "outline outline-2 outline-blue-500"
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {text}
    </button>
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
