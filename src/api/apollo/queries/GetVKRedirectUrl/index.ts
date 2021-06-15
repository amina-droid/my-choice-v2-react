import { loader } from 'graphql.macro';

export * from './types/GetVKOAuthRedirect';

export const GET_VK_OATH_REDIRECT_URL = loader('./query.gql');
