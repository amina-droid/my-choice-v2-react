/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ResourceType } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ShareResources
// ====================================================

export interface ShareResources {
  shareResources: boolean;
}

export interface ShareResourcesVariables {
  from: ResourceType;
  to: ResourceType;
}
