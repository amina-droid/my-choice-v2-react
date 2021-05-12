import React, { FC } from 'react';
import CustomScroll from 'react-custom-scroll';
import { ActivePlayer } from '../../../apollo';
import PlayerRow from './PlayerRow';

import s from './PlayersTable.module.sass';

type PlayersTableProps = {
  players: ActivePlayer[];
  mover?: string;
};

const PlayersTable: FC<PlayersTableProps> = ({ players, mover }) => {
  return (
    <CustomScroll allowOuterScroll keepAtBottom>
      <div className={s.playerTable}>
        {players.map(player => (
          <PlayerRow player={player} key={player._id} mover={mover} />
        ))}
      </div>
    </CustomScroll>
  );
};

export default PlayersTable;
