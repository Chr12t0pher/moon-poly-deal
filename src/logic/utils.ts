import {Card} from "./cards";
import {RandomAPI} from "boardgame.io/dist/types/src/plugins/random/random";

export function takeFromArray<T>(n: number, from: Array<T>, to: Array<T>): Array<T> {
    for (let i = 0; i < n; i++) {
        to.push(from.splice(0, 1)[0]);
    }

    return to;
}

export function dealFunction(deck: Array<Card>, discard: Array<Card>, to: Array<Card>, random: RandomAPI) {
    if (deck.length >= 2) {
        takeFromArray(2, deck, to);
    } else if (deck.length === 1) {
        takeFromArray(1, deck, to);
        takeFromArray(discard.length, discard, deck);
        random.Shuffle(deck);
        takeFromArray(1, deck, to);
    } else {
        takeFromArray(discard.length, discard, deck);
        random.Shuffle(deck);
        takeFromArray(2, deck, to);
    }
}