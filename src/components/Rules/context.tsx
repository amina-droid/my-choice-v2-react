import React, { FC, useContext, useMemo, useState } from 'react';

type RulesState = {
  block?: BlockTypes;
  setBlock: (block?: BlockTypes) => void
}
const RulesContext = React.createContext<RulesState>({
  setBlock: () => {},
});

export const useRulesContext = () => useContext(RulesContext);

export type BlockTypes = 'inner' | 'outer' | 'circles' | 'resources' | 'process'

export const RulesContextProvider: FC = ({ children }) => {
  const [visibleBlock, setVisibleBlock] = useState<BlockTypes>();
  const context = useMemo<RulesState>(() => ({
    block: visibleBlock,
    setBlock: setVisibleBlock,
  }), [visibleBlock]);

  return (
    <RulesContext.Provider value={context}>
      {children}
    </RulesContext.Provider>
  );
};
