import { RefCallback, useCallback, useEffect, useRef, useState } from "react";

export type NodeRect = {
  width: number;
  height: number;
};

export type NodesRectsMap = Record<string, NodeRect>;

export const useNodesRects = () => {
  const [nodesRects, setNodesRects] = useState<NodesRectsMap>({});

  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  const nodeRef: RefCallback<Element> = useCallback((el) => {
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const nodesToUpdate = Object.fromEntries(
          entries
            .map((entry) => [
              (entry.target as HTMLElement).dataset.id,
              {
                width: entry.contentRect.width,
                height: entry.contentRect.height,
              },
            ])
            .filter((entry) => !!entry[0])
        );

        setNodesRects((prev) => ({
          ...prev,
          ...nodesToUpdate,
        }));
      });
    }

    const resizeObserver = resizeObserverRef.current;

    if (el) {
      resizeObserver.observe(el);
      return () => {
        setNodesRects((prev) => {
          const newNodesRects = { ...prev };
          delete newNodesRects[(el as HTMLElement).dataset.id ?? ""];
          return newNodesRects;
        });
        resizeObserver.unobserve(el);
      };
    }
  }, []);

  useEffect(
    () => () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    },
    []
  );

  return {
    nodeRef,
    nodesRects,
  };
};
