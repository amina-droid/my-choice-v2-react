import React, { useEffect } from 'react';
import { withPageAccess } from '../../shared/PageAccessHOC/PageAccessHOC';
import { FieldType, UserRole } from '../../types';

import s from './CardsEditor.module.sass';
import AddCard from './AddCard';
import CardList from './CardList';

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

export default withPageAccess([UserRole.Admin, UserRole.Moderator])(CardsEditor);
