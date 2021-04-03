import React, { FC } from 'react';
import { ActivePlayer } from '../../../apollo';
import PlayerRow from './PlayerRow';

import s from './PlayersTable.module.sass';

type PlayersTableProps = {
  players: ActivePlayer[];
};

const PlayersTable: FC<PlayersTableProps> = ({ players }) => {
  return (
    <div>
      {players.map((player) => (
        <PlayerRow player={player} key={player._id} />
      ))}
    </div>
  );
};

export default PlayersTable;
