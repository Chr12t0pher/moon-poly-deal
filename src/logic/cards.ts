import {stdout} from "process";

export type Card = ActionCard | MoneyCard | PropertyCard;

export interface ActionCard {
    title: ActionName;
    type: "action"
    value: number;
    subtitle: string;
}

export enum ActionName {
    DEAL_BREAKER = "Deal Breaker",
    JUST_SAY_NO = "Just Say No!",
    SLY_DEAL = "Sly Deal",
    FORCED_DEAL = "Forced Deal",
    DEBT_COLLECTOR = "Debt Collector",
    ITS_MY_BIRTHDAY = "It's My Birthday",
    PASS_GO = "Pass Go",
    DOUBLE_THE_RENT = "Double The Rent"
}

export interface MoneyCard {
    type: "money"
    value: number;
}

export interface PropertyCard {
    name: string;
    type: "property"
    value: number;
    colour: PropertyColour[];
}

export const getColourFor = (value: number): string => {
    switch (value) {
        case 0:
            return "#ffffff";
        case 1:
            return "#c1c258";
        case 2:
            return "#ccb298";
        case 3:
            return "#87bd9f";
        case 4:
            return "#83a8da";
        case 5:
            return "#7978d5";
        case 10:
            return "#d58c47";
        default:
            throw Error("Invalid value: " + value);
    }
}


export enum PropertyColour {
    BROWN= "Brown",
    LIGHT_BLUE = "Light Blue",
    PINK = "Pink",
    ORANGE = "Orange",
    RED = "Red",
    YELLOW = "Yellow",
    GREEN = "Green",
    DARK_BLUE = "Dark Blue",
    STATION = "Station",
    UTILITY = "Utility"
}

export interface PropertySetInfo {
    colour: string;
    number: number;
    rent: number[];
}

export const PROPERTY_SETS: {[key in PropertyColour]: PropertySetInfo} = {
    [PropertyColour.BROWN]: {
        colour: "#663300",
        number: 2,
        rent: [1, 2]
    },
    [PropertyColour.LIGHT_BLUE]: {
        colour: "#0099cc",
        number: 3,
        rent: [1, 2, 3]
    },
    [PropertyColour.PINK]: {
        colour: "#cc44cc",
        number: 3,
        rent: [1, 2, 4]
    },
    [PropertyColour.ORANGE]: {
        colour: "#ff6600",
        number: 3,
        rent: [1, 3, 5]
    },
    [PropertyColour.RED]: {
        colour: "#ff0000",
        number: 3,
        rent: [2, 3, 6]
    },
    [PropertyColour.YELLOW]: {
        colour: "#ffff33",
        number: 3,
        rent: [2, 4, 6]
    },
    [PropertyColour.GREEN]: {
        colour: "#339933",
        number: 3,
        rent: [2, 4, 7]
    },
    [PropertyColour.DARK_BLUE]: {
        colour: "#000066",
        number: 2,
        rent: [3, 8]
    },
    [PropertyColour.STATION]: {
        colour: "#000000",
        number: 4,
        rent: [1, 2, 3, 4]
    },
    [PropertyColour.UTILITY]: {
        colour: "#d3d3d3",
        number: 2,
        rent: [1, 2]
    }
}

function ofCards(card: Card, number: number): Array<Card> {
    return Array(number).fill(null).map(_ => JSON.parse(JSON.stringify(card)));
}

export const DECK: Array<Card> = [

    // actions
    ofCards({
        title: ActionName.DEAL_BREAKER,
        type: "action",
        subtitle: "Steal a complete set of properties from any player. (Includes any buildings.)",
        value: 5
    } as ActionCard, 2),
    ofCards({
        title: ActionName.JUST_SAY_NO,
        type: "action",
        subtitle: "Use any time when an action card is played against you.",
        value: 4
    } as ActionCard, 3),
    ofCards({
        title: ActionName.SLY_DEAL,
        type: "action",
        subtitle: "Steal a property from the player of your choice.",
        value: 3
    } as ActionCard, 3),
    ofCards({
        title: ActionName.FORCED_DEAL,
        type: "action",
        subtitle: "Swap any property with another player.",
        value: 3
    } as ActionCard, 4),
    ofCards({
        title: ActionName.DEBT_COLLECTOR,
        type: "action",
        subtitle: "Force any player to pay you £5m.",
        value: 3
    } as ActionCard, 3),
    ofCards({
        title: ActionName.ITS_MY_BIRTHDAY,
        type: "action",
        subtitle: "All players give you £2m as a 'gift'.",
        value: 2
    } as ActionCard, 3),
    ofCards({
        title: ActionName.PASS_GO,
        type: "action",
        subtitle: "Draw 2 extra cards.",
        value: 1
    } as ActionCard, 10),
    ofCards({
        title: ActionName.DOUBLE_THE_RENT,
        type: "action",
        subtitle: "Needs to be played with a rent card.",
        value: 1
    } as ActionCard, 2),


    // properties
    {
        "name": "Old Kent Road",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.BROWN]
    } as PropertyCard,
    {
        "name": "Whitechapel Road",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.BROWN]
    } as PropertyCard,
    {
        "name": "The Angel, Islington",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.LIGHT_BLUE]
    } as PropertyCard,
    {
        "name": "Euston Road",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.LIGHT_BLUE]
    } as PropertyCard,
    {
        "name": "Pentonville Road",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.LIGHT_BLUE]
    } as PropertyCard,
    {
        "name": "Pall Mall",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.PINK]
    } as PropertyCard,
    {
        "name": "Northumberland Avenue",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.PINK]
    } as PropertyCard,
    {
        "name": "Whitehall",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.PINK]
    } as PropertyCard,
    {
        "name": "Bow Street",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.ORANGE]
    } as PropertyCard,
    {
        "name": "Marlborough Street",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.ORANGE]
    } as PropertyCard,
    {
        "name": "Vine Street",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.ORANGE]
    } as PropertyCard,
    {
        "name": "Strand",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.RED]
    } as PropertyCard,
    {
        "name": "Fleet Street",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.RED]
    } as PropertyCard,
    {
        "name": "Trafalgar Square",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.RED]
    } as PropertyCard,
    {
        "name": "Leicester Square",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.YELLOW]
    } as PropertyCard,
    {
        "name": "Coventry Street",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.YELLOW]
    } as PropertyCard,
    {
        "name": "Piccadilly",
        "type": "property",
        "value": 3,
        "colour": [PropertyColour.YELLOW]
    } as PropertyCard,
    {
        "name": "Regent Street",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.GREEN]
    } as PropertyCard,
    {
        "name": "Oxford Street",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.GREEN]
    } as PropertyCard,
    {
        "name": "Bond Street",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.GREEN]
    } as PropertyCard,
    {
        "name": "Park Lane",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.DARK_BLUE]
    } as PropertyCard,
    {
        "name": "Mayfair",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.DARK_BLUE]
    } as PropertyCard,
    {
        "name": "King's Cross Station",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.STATION]
    } as PropertyCard,
    {
        "name": "Marylebone Station",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.STATION]
    } as PropertyCard,
    {
        "name": "Fenchurch St Station",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.STATION]
    } as PropertyCard,
    {
        "name": "Liverpool Street Station",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.STATION]
    } as PropertyCard,
    {
        "name": "Electric Company",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.UTILITY]
    } as PropertyCard,
    {
        "name": "Water Works",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.UTILITY]
    } as PropertyCard,


    // wildcards
    {
        "name": "Wildcard",
        "type": "property",
        "value": 1,
        "colour": [PropertyColour.BROWN, PropertyColour.LIGHT_BLUE]
    } as PropertyCard,
    {
        "name": "Wildcard",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.STATION, PropertyColour.LIGHT_BLUE]
    } as PropertyCard,
    {
        "name": "Wildcard",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.STATION, PropertyColour.GREEN]
    } as PropertyCard,
    {
        "name": "Wildcard",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.STATION, PropertyColour.UTILITY]
    } as PropertyCard,
    {
        "name": "Wildcard",
        "type": "property",
        "value": 4,
        "colour": [PropertyColour.GREEN, PropertyColour.DARK_BLUE]
    } as PropertyCard,
    ofCards({
        "name": "Wildcard",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.PINK, PropertyColour.ORANGE]
    } as PropertyCard, 2),
    ofCards({
        "name": "Wildcard",
        "type": "property",
        "value": 2,
        "colour": [PropertyColour.RED, PropertyColour.YELLOW]
    } as PropertyCard, 2),
    ofCards({
        "name": "Wildcard",
        "type": "property",
        "value": 0,
        "colour": Object.values(PropertyColour)
    } as PropertyCard, 2),

    // money cards
    ofCards({
        type: "money",
        value: 1
    } as MoneyCard, 6),
    ofCards({
        type: "money",
        value: 2
    } as MoneyCard, 5),
    ofCards({
        type: "money",
        value: 3
    } as MoneyCard, 3),
    ofCards({
        type: "money",
        value: 4
    } as MoneyCard, 3),
    ofCards({
        type: "money",
        value: 5
    } as MoneyCard, 2),
    {
        type: "money",
        value: 10
    } as MoneyCard,


].flat();