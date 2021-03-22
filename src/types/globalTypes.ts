/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FieldType {
  Activity = "Activity",
  Dream = "Dream",
  Incident = "Incident",
  Offer = "Offer",
  Opportunity = "Opportunity",
  Problem = "Problem",
  Reaction = "Reaction",
  Situation = "Situation",
  Start = "Start",
}

export enum GameStatus {
  Awaiting = "Awaiting",
  ChoiceDream = "ChoiceDream",
  Finished = "Finished",
  InProgress = "InProgress",
}

export enum PlayerPosition {
  Awaiting = "Awaiting",
  Inner = "Inner",
  Outer = "Outer",
  Start = "Start",
}

export enum UserRole {
  Admin = "Admin",
  Moderator = "Moderator",
  User = "User",
}

export interface ChoicesCardInput {
  choices: OptionInput[];
  description: string;
  type: FieldType;
}

export interface OptionInput {
  description: string;
  resources: ResourcesInput;
}

export interface ResourcesInput {
  dark?: number | null;
  lives?: number | null;
  money?: number | null;
  white?: number | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
