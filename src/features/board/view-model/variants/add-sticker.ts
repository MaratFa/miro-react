import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";

export type AddStickerViewState = {
  type: "add-sticker";
};

export function useAddStickerViewModel({
  nodesModel,
  viewStateModel,
  canvasRect,
}: ViewModelParams) {
  return (): ViewModel => ({
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
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => viewStateModel.goToIdle(),
      },
    },
  });
}
