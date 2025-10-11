import { ViewStateModel } from "../model/view-state";
import { NodesModel } from "../model/nodes";
import { CanvasRect } from "../hooks/use-canvas-rect";

export type ViewModelParams = {
  viewStateModel: ViewStateModel;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
};
