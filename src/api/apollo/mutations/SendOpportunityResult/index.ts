import { loader } from 'graphql.macro';

export * from './types/SendOpportunityResult';

export const SEND_OPPORTUNITY_RESULT = loader('./query.gql');
