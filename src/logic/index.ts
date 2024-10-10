import { PlayerID } from "boardgame.io";
import {ActionCard, Card, PropertyCard} from "../components/Board/Card/Card.types";

export interface Hand {
  inventory: Array<Card>;
  properties: Array<Array<PropertyCard>>;
  bank: Array<Card>;
}

export type Hands = { [key in PlayerID]: Hand };

export interface TurnState {
  actionsRemaining: number;
  actionUndoable: boolean;

  fromCardIndex?: number;
  fromStackIndex?: number;
  toStackIndex?: number;



  action?: ActionCard;
  amountDue?: number;
  amountDueTo?: PlayerID;
  amountRemaining?: {[key in PlayerID]: number | undefined};
}

export interface G {
  players: Hands;
  deck: Array<Card>;
  discard: Array<Card>;
  state: TurnState;
}
