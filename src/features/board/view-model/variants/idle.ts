import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useIdleViewModel({
  nodesModel,
  viewStateModel,
}: ViewModelParams) {
  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: idleState.selectedIds.has(node.id),
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
    overlay: {
      onClick: () => {
        viewStateModel.selection([], "replace");
      },
      onMouseDown: (e) => {
        console.log("onMouseDown", e);
      },
    },
    window: {
      onMouseMove: (e) => {
        console.log("onMouseMove", e);
      },
      onMouseUp: (e) => {
        console.log("onMouseUp", e);
      }
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: () => {
          viewStateModel.goToAddSticker();
        },
      },
    },
  });
}
