import { AddStickerViewState, useAddStickerViewModel } from "./variants/add-sticker";
import { IdleViewState, useIdleViewModel } from "./variants/idle";
import { ViewModelParams } from "./view-model-params";
import { ViewModel } from "./view-model-type";

type ViewState = AddStickerViewState | IdleViewState;

export function useViewModel(params: ViewModelParams) {
  const [viewState, setViewState] = useState<ViewState>({
    type: "idle",
    selectedIds: new Set(),
  });

  const addStickerViewModel = useAddStickerViewModel(params);
  const idleViewModel = useIdleViewModel(params);

  let viewModel: ViewModel;
  switch (params.viewStateModel.viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      viewModel = idleViewModel(params.viewStateModel.viewState);
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return viewModel;
}
