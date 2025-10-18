import { RefCallback, useCallback, useState } from "react";

export type NodeRect = {
  width: number;
  height: number;
};

export type NodesRectsMap = Record<string, NodeRect>;

export const useNodesRect = () => {
  const [nodesRects, setNodesRects] = useState<NodesRectsMap>({});

  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  const nodeRef: RefCallback<HTMLElement> = useCallback((el) => {
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
        }
      });
    }


    









  }, []);

  return {
    canvasRef,
    canvasRect,
  };
};
