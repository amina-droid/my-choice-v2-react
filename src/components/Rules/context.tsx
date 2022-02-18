import React, { FC, useContext, useMemo, useState } from 'react';
import { last, dropRight } from 'lodash';

type RulesState = {
  block: BlockTypes;
  history: number;
  setBlock: (block: BlockTypes) => void;
  backBlock: () => void;
}
const RulesContext = React.createContext<RulesState>({
  block: 'main',
  history: 0,
  setBlock: () => { },
  backBlock: () => { },
});

export const useRulesContext = () => useContext(RulesContext);

export type BlockTypes =
  'inner' | 'outer' | 'circles'
  | 'resources' | 'process' | 'main'
  | 'gameplay' | 'situation' | 'incident'
  | 'offer' | 'reaction' | 'opportunity'
  | 'dream' | 'activity' | 'problem'
  | 'life' | 'money' | 'white' | 'dark'

export const RulesContextProvider: FC = ({ children }) => {
  const [visibleBlocks, setVisibleBlocks] = useState<BlockTypes[]>([]);

  const context = useMemo<RulesState>(() => ({
    block: last(visibleBlocks) ?? 'main',
    history: visibleBlocks.length,
    setBlock: (newBlock) => setVisibleBlocks((prevBlocks) => [...prevBlocks, newBlock]),
    backBlock: () => setVisibleBlocks((prevBlocks) => dropRight(prevBlocks)),
  }), [setVisibleBlocks, visibleBlocks]);

  return (
    <RulesContext.Provider value={context}>
      {children}
    </RulesContext.Provider>
  );
};
