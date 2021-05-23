import React, { PropsWithChildren, RefObject, Suspense, useContext } from 'react';
import ReactDOM from 'react-dom';

import Spin from 'antd/es/spin';

const GameFieldSvg = React.lazy(() => import('./GameFieldSvg'));

const SVGContext = React.createContext<RefObject<SVGSVGElement> | null>(null);
export const useSVGContext = () => useContext(SVGContext);

export const GameFieldSVG = React.forwardRef<SVGSVGElement, PropsWithChildren<{}>>(({
  children,
}, ref) => {
  return (
    <SVGContext.Provider value={ref as RefObject<SVGSVGElement>}>
      <StaticGameField ref={ref} />
      {(ref as RefObject<SVGSVGElement>)?.current && ReactDOM.createPortal(
        children,
        (ref as RefObject<SVGSVGElement>).current!,
      )}
    </SVGContext.Provider>
  );
});

const StaticGameField = React.memo(
  React.forwardRef<SVGSVGElement>(({ children }, ref) => {
    return (
      <Suspense fallback={<Spin size="large" />}>
        <GameFieldSvg ref={ref} />
      </Suspense>
    );
  }),
);
