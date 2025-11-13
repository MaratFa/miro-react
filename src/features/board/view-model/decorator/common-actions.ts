import { goToAddArrow } from "../variants/add-arrow";
import { goToAddSticker } from "../variants/add-sticker";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";

export function useCommonActionsDecorator({ setViewState }: ViewModelParams) {
  return (viewModel: ViewModel): ViewModel => {
    return {
      ...viewModel,
      layot: {
        ...viewModel.layot,
        onKeyDown: (e) => {
          viewModel.layot?.onKeyDown?.(e);
          if (e.key === "s") {
            setViewState(goToAddSticker());
          }
          if (e.key === "a") {
            setViewState(goToAddArrow());
          }
        },
      },
      actions: {
        addArrow: {
          isActive: false,
          onClick: () => setViewState(goToAddArrow()),
        },
        addSticker: {
          isActive: false,
          onClick: () => setViewState(goToAddSticker()),
        },
        ...viewModel.actions,
      },
    };
  };
}
