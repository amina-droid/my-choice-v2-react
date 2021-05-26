import { useEffect, useRef, useState } from 'react';

export default ({ root = null, rootMargin, threshold = 0 }: IntersectionObserverInit) => {
  const [entry, updateEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element | null>(null);

  const observer = useRef(
    new window.IntersectionObserver(([ent]) => updateEntry(ent), {
      root,
      rootMargin,
      threshold,
    }),
  );

  useEffect(
    () => {
      const { current: currentObserver } = observer;
      currentObserver.disconnect();

      if (node) currentObserver.observe(node!);

      return () => currentObserver.disconnect();
    },
    [node],
  );

  return [setNode, entry] as const;
};
