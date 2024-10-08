import { ActionName, PropertyColour } from "../../../logic/cards";

export interface CardProps<T extends Card> {
  card: T;
  moves: { [key in string]: () => void };
}

export interface PropertySetInfo {
  colour: string;
  number: number;
  rent: number[];
}

export type Card = ActionCard | MoneyCard | PropertyCard;

export interface ActionCard {
  title: ActionName;
  name: string
  type: "action";
  value: number;
  subtitle: string;
}

export interface MoneyCard {
  type: "money";
  name: string
  value: number;
}

export interface PropertyCard {
  name: string;
  type: "property";
  value: number;
  colour: PropertyColour[];
}
