import { PlayerID } from "boardgame.io";
import { Card, PropertyCard } from "./cards";

export interface Hand {
  inventory: Array<Card>;
  properties: Array<Array<PropertyCard>>;
  bank: Array<Card>;
}

export type Hands = { [key in PlayerID]: Hand };

export interface TurnState {
  actionsRemaining: number;
  fromCardIndex?: number;
  fromStackIndex?: number;
  toStackIndex?: number;
}

export interface G {
  players: Hands;
  deck: Array<Card>;
  discard: Array<Card>;
  state: TurnState;
}
