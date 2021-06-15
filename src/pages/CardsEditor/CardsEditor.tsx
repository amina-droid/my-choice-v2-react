import React from 'react';

import { withAccess } from 'shared/AccessHOC/AccessHOC';
import { FieldType, UserRole } from 'types';

import AddCard from './AddCard';
import CardList from './CardList';

import s from './CardsEditor.module.sass';

export const FIELD_DICTIONARY = {
  [FieldType.Start]: 'Старт',
  [FieldType.Situation]: 'Ситуация',
  [FieldType.Incident]: 'Случай',
  [FieldType.Offer]: 'Предложение',
  [FieldType.Reaction]: 'Реакция',
  [FieldType.Opportunity]: 'Возможность',
  [FieldType.Dream]: 'Мечта-тест',
  [FieldType.Activity]: 'Активность',
  [FieldType.Problem]: 'Проблема',
};

type Resources = {
  lives?: number;
  money?: number;
  white?: number;
  dark?: number;
};

const CardsEditor = () => {
  return (
    <div className={s.container}>
      <AddCard />
      <CardList />
    </div>
  );
};

export default withAccess([UserRole.Admin, UserRole.Moderator], true)(CardsEditor);
