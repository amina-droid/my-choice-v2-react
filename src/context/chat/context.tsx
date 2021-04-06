import React, { useContext, useMemo, useState } from 'react';

type GameTopic = {
  name: string;
  topic: string;
}
interface State {
  game?: GameTopic
  setGame: (game: GameTopic) => void;
  resetGame: () => void
}

const ChatContext = React.createContext<State>({
  setGame: () => {},
  resetGame: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState<GameTopic>();

  const handlers: State = useMemo(() => ({
    setGame,
    resetGame: () => setGame(undefined),
  }), []);

  const value: State = useMemo(() => (
    game
      ? ({
        game,
        ...handlers,
      })
      : ({
        game: undefined,
        ...handlers,
      })
  ), [game]);

  return (
    <ChatContext.Provider
      value={value}
    >
      {children}
    </ChatContext.Provider>
  );
};
