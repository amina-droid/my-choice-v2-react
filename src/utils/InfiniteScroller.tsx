import React, { FC, useEffect } from 'react';
import useIntersect from './useIntersect';

type Props = {
  className?: string;
  onLoad?: () => void
}

const InfiniteScroller: FC<Props> = ({
  className,
  onLoad,
  children,
}) => {
  const [ref, entry] = useIntersect({
    root: null,
    rootMargin: '20px',
    threshold: 1.0,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onLoad?.();
    }
  }, [entry, onLoad]);

  return (
    <div ref={ref} className={className}>{children}</div>
  );
};

export default InfiniteScroller;
