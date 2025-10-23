import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type EditStickerViewState = {
  type: "edit-sticker";
  stickerId: string;
};

export function useEditStickerViewModel({
  nodesModel,
  setViewState,
  canvasRect,
}: ViewModelParams) {
  return (viewState: EditStickerViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => {
      if (node.id === viewState.stickerId) {
        return {
          ...node,
          isSelected: true,
        };
      }

      return node;
    }),
    layot: {
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setViewState(goToIdle());
        }
      },
    },
    overlay: {
      onClick: () => setViewState(goToIdle()),
    },
  });
}

export function goToEditSticker(stickerId: string): EditStickerViewState {
  return {
    type: "edit-sticker",
    stickerId,
  };
}
