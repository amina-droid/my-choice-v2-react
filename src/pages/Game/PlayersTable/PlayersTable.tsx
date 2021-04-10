import React, { FC } from 'react';
import { ActivePlayer } from '../../../apollo';
import PlayerRow from './PlayerRow';

type PlayersTableProps = {
  players: ActivePlayer[];
  mover?: string;
};

const PlayersTable: FC<PlayersTableProps> = ({ players, mover }) => {
  return (
    <div>
      {players.map(player => (
        <PlayerRow player={player} key={player._id} mover={mover} />
      ))}
    </div>
  );
};

export default PlayersTable;
