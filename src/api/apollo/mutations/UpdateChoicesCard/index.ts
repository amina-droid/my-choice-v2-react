import { loader } from 'graphql.macro';

export * from './types/UpdateChoicesCard';

export const UPDATE_CHOICES_CARD = loader('./query.gql');
