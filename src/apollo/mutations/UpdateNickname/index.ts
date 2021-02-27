import { loader } from 'graphql.macro';

export * from './types/UpdateNickname';

export const UPDATE_NICKNAME = loader('./query.gql');
