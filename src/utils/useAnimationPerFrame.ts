import { useRef, useEffect } from 'react';
import { isNil } from 'lodash';

const useAnimationFrame = (cb: (time: number) => void) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (!isNil(previousTimeRef.current)) {
      const deltaTime = time - previousTimeRef.current;
      cb(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []); // Make sure the effect runs only once
};

export default useAnimationFrame;
