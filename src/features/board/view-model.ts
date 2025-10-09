import { ViewStateModel } from "./view-state-model";
import { CanvasRect } from "./use-canvas-rect";
import { NodesModel } from "./nodes";

type ViewModeNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ViewModel = {
  nodes: ViewModeNode[];
  layot?: {
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  };
  canvas?: {
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
  actions?: {
    addSticker?: {
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      isActive?: boolean;
    };
  };
};

export function useViewMode({
  viewStateModel,
  nodesModel,
  canvasRect,
}: {
  viewStateModel: ViewStateModel;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
}) {
  let viewModel: ViewModel;

  switch (viewStateModel.viewState.type) {
    case "add-sticker":
      viewModel = {
        nodes: nodesModel.nodes,
        layot: {
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              viewStateModel.goToIdle();
            }
          },
        },
        canvas: {
          onClick: (e) => {
            if (!canvasRect) return;
            nodesModel.addSticker({
              text: "Default",
              x: e.clientX - canvasRect.x,
              y: e.clientY - canvasRect.y,
            });
            viewStateModel.goToIdle();
          },
        },
      };
      break;
    case "idle": {
      const viewState = viewStateModel.viewState;
      viewModel = {
        nodes: nodesModel.nodes.map((node) => ({
          ...node,
          isSelected: viewState.selectedIds.has(node.id),
          onClick: (e) => {
            if (e.ctrlKey || e.shiftKey) {
              viewStateModel.selection([node.id], "toggle");
            } else {
              viewStateModel.selection([node.id], "replace");
            }
          },
        })),
        layot: {
          onKeyDown: (e) => {
            if (e.key === "s") {
              viewStateModel.goToAddSticker();
            }
          },
        },
        actions: {
          addSticker: {
            isActive: false,
            onClick: () => {
              viewStateModel.goToAddSticker();
            },
          },
        },
      };
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return viewModel;
}
