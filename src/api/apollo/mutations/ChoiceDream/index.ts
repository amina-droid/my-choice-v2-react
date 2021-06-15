import { loader } from 'graphql.macro';

export * from './types/ChoiceDream';

export const CHOICE_DREAM = loader('./query.gql');
