import React, { FC, useState } from 'react';
import { Button } from 'antd';
import cn from 'classnames';
import { ReactComponent as Dice0 } from './Dice0.svg';
import { ReactComponent as Dice1 } from './Dice1.svg';
import { ReactComponent as Dice2 } from './Dice2.svg';
import { ReactComponent as Dice3 } from './Dice3.svg';
import { ReactComponent as Dice4 } from './Dice4.svg';
import { ReactComponent as Dice5 } from './Dice5.svg';
import { ReactComponent as Dice6 } from './Dice6.svg';

import s from './Dice.module.sass';

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
};

const Dice: FC<DiceProps> = ({ ready, onRoll }) => {
  const [diceIsActive, setDiceIsActive] = useState<boolean>(false);
  const [currentDice, setCurrentDice] = useState<number>(0);

  const clickDice = () => {
    setDiceIsActive(true);
    const randomNumber = getRandom();
    onRoll && onRoll(randomNumber);
    setTimeout(() => {
      setCurrentDice(randomNumber);
      setDiceIsActive(false);
    }, 1500);
  };

  const className = ready ? (diceIsActive ? s.rollDice : s.readyDice) : s.disabledDice;

  return (
    <div className={s.container}>
      <button
        type="button"
        className={cn(s.diceBtn, className)}
        onClick={clickDice}
        disabled={!ready}
      >
        {diceEdges[currentDice]}
      </button>
    </div>
  );
};

export default Dice;
