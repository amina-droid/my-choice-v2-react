import React, { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ReactComponent as Dice0 } from './Dice0.svg';
import { ReactComponent as Dice1 } from './Dice1.svg';
import { ReactComponent as Dice2 } from './Dice2.svg';
import { ReactComponent as Dice3 } from './Dice3.svg';
import { ReactComponent as Dice4 } from './Dice4.svg';
import { ReactComponent as Dice5 } from './Dice5.svg';
import { ReactComponent as Dice6 } from './Dice6.svg';

import s from './Dice.module.sass';
import timeout from '../../../utils/timeout';

const diceEdges = [
  <Dice0 key="0" />,
  <Dice1 key="1" />,
  <Dice2 key="2" />,
  <Dice3 key="3" />,
  <Dice4 key="4" />,
  <Dice5 key="5" />,
  <Dice6 key="6" />,
];

const getRandom = () => {
  return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
};

type DiceProps = {
  ready?: boolean;
  onRoll?: (value: number) => void;
  onRollComplete?: () => void;
};

type DiceStatus = 'ready' | 'roll' | 'disabled';

const Dice: FC<DiceProps> = ({ ready, onRoll, onRollComplete }) => {
  const [diceStatus, setDiceStatus] = useState<DiceStatus>('disabled');
  const readyRef = useRef<boolean>();
  const [currentDice, setCurrentDice] = useState<number>(0);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) {
      setDiceStatus(prev => {
        if (prev === 'disabled') {
          return 'ready';
        }
        return prev;
      });
    } else {
      setCurrentDice(0);
    }
  }, [ready]);

  const clickDice = async () => {
    setDiceStatus('roll');
    const randomNumber = getRandom();
    onRoll?.(randomNumber);
    await timeout(1000);
    setCurrentDice(randomNumber);
    setDiceStatus('disabled');

    await timeout(500);
    onRollComplete?.();
    await timeout(1500);
    if (readyRef.current) {
      setDiceStatus('ready');
    }
    setCurrentDice(0);
  };

  const className = s[`${diceStatus}Dice`];
  return (
    <div className={s.container}>
      <button
        type="button"
        className={cn(s.diceBtn, className)}
        onClick={clickDice}
        disabled={diceStatus !== 'ready'}
      >
        {diceEdges[currentDice]}
      </button>
    </div>
  );
};

export default Dice;
