import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type SelectionWindowViewState = {
  type: "selection-window";
};

export function useSelectionWindowWiewModel({
  nodesModel,
  setViewState,
  canvasRect,
}: ViewModelParams) {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
  });
}

export function goToAddSticker(): SelectionWindowViewState {
  return {
    type: "add-sticker",
  }
}