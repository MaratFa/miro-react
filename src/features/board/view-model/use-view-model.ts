import { useState } from "react";
import {
  AddStickerViewState,
  useAddStickerViewModel,
} from "./variants/add-sticker";
import { IdleViewState, useIdleViewModel } from "./variants/idle";
import { ViewModelParams } from "./view-model-params";
import { ViewModel } from "./view-model-type";
import {
  SelectionWindowViewState,
  useSelectionWindowWiewModel,
} from "./variants/selection-window";

export type ViewState =
  | AddStickerViewState
  | IdleViewState
  | SelectionWindowViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
  const [viewState, setViewState] = useState<ViewState>({
    type: "idle",
    selectedIds: new Set(),
  });

  const newParams = {
    ...params,
    setViewState,
  };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowWiewModel(newParams);

  let viewModel: ViewModel;
  switch (viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      console.log("idle", viewState);

      viewModel = idleViewModel(viewState);
      break;
    }
    case "selection-window": {
      viewModel = selectionWindowViewModel(viewState);
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return viewModel;
}
