import {Game} from "boardgame.io";
import {G, Hands} from "./index";
import {Card, DECK, PROPERTY_SETS, PropertyCard, PropertyColour} from "./cards";
import {dealFunction, takeFromArray} from "./utils";
import {INVALID_MOVE} from "boardgame.io/core";
import {
    MAX_ACTIONS_PER_TURN,
    MAX_CARDS_IN_HAND,
    STAGE_MOVE_PROPERTY
} from "./constants";

const MoonPolyDeal: Game<G> = {
        name: "MoonPolyDeal",
        minPlayers: 2,
        setup: ({ctx, random}): G => {
            const deck = random.Shuffle(DECK);

            const players = ctx.playOrder.reduce((hands, playerId) => {
                hands[playerId] = {
                    inventory: takeFromArray(5, deck, []),
                    bank: [],
                    properties: []
                }
                return hands;
            }, {} as Hands);

            return {
                players,
                deck,
                discard: [],
                state: {
                    actionsRemaining: MAX_ACTIONS_PER_TURN
                }
            }
        },

        playerView: ({G, playerID}) => ({
            ...G,
            deck: [],
            players: Object.entries(G.players).map(([id, value]) => ({
                ...value,
                inventory: (id === playerID || playerID === null) ? value.inventory : []
            }))
        }),

        moves: {
            playProperty: ({G, ctx, events, playerID}, cardIndex: number) => {
                const cards = G.players[playerID].inventory;
                if (cardIndex > cards.length) {
                    console.error("cardIndex out of range");
                    return INVALID_MOVE;
                }
                const card = cards[cardIndex];

                if (card.type === "money") {
                    console.log("Can't play a money card.");
                    return INVALID_MOVE;
                }

                if (G.state.actionsRemaining == 0) {
                    console.log(`Only ${MAX_ACTIONS_PER_TURN} actions per turn permitted.`);
                    return INVALID_MOVE;
                }


                G.state.actionsRemaining--;

                if (card.type === "property") {
                    G.state.fromCardIndex = cardIndex;
                    events.setStage(STAGE_MOVE_PROPERTY);
                    return;
                } else {

                }
            },

            bankCard: ({G, ctx, playerID}, cardIndex) => {
                const cards = G.players[playerID].inventory;
                if (cardIndex > cards.length) {
                    console.error("cardIndex out of range");
                    return INVALID_MOVE;
                }
                const card = cards[cardIndex];

                if (card.value === 0) {
                    console.log("Can't bank cards without a value as money.");
                    return INVALID_MOVE;
                }

                if (card.type === "property") {
                    console.log("Can't bank property cards.");
                    return INVALID_MOVE;
                }

                if (G.state.actionsRemaining == 0) {
                    console.log(`Only ${MAX_ACTIONS_PER_TURN} actions per turn permitted.`);
                    return INVALID_MOVE;
                }


                G.state.actionsRemaining--;

                const moneyCard = cards.splice(cardIndex, 1)[0];
                G.players[playerID].bank.push(moneyCard);
            },

            flipWildcardProperty: ({G, ctx, playerID}, stackIndex: number, cardIndex: number) => {
                const stacks = G.players[playerID].properties;
                if (stackIndex > stacks.length) {
                    console.error("stackIndex out of range");
                    return INVALID_MOVE;
                }
                const stack = stacks[stackIndex];

                if (cardIndex > stack.length) {
                    console.error("cardIndex out of range");
                    return INVALID_MOVE;
                }
                const card = stack[cardIndex];

                card.colour.reverse();

                if (stack.length > 1) { // move a flipped wildcard to a new stack, the colour will be wrong
                    const propertyCard = stack.splice(cardIndex, 1)[0] as PropertyCard;
                    G.players[playerID].properties.push([propertyCard]);
                }
            },

            moveProperty: ({G, ctx, events, playerID}, stackIndex: number, cardIndex: number) => {
                const stacks = G.players[playerID].properties;
                if (stackIndex > stacks.length) {
                    console.error("stackIndex out of range");
                    return INVALID_MOVE;
                }
                const stack = stacks[stackIndex];

                if (cardIndex > stack.length) {
                    console.error("cardIndex out of range");
                    return INVALID_MOVE;
                }

                G.state.fromStackIndex = stackIndex
                G.state.fromCardIndex = cardIndex;
                events.setStage(STAGE_MOVE_PROPERTY);
            },

            discardCard: ({G, ctx, playerID}, cardIndex: number) => {
                const cards = G.players[playerID].inventory;
                if (cardIndex > cards.length) {
                    console.error("cardIndex out of range");
                    return;
                }

                if (cards.length <= MAX_CARDS_IN_HAND) {
                    console.log(`Don't need to discard, less than ${MAX_CARDS_IN_HAND} cards in hand.`);
                    return;
                }

                const discardedCard = cards.splice(cardIndex, 1)[0];
                G.discard.push(discardedCard);
            },

            endTurn: ({G, events, playerID}) => {
                if (G.players[playerID].inventory.length > MAX_CARDS_IN_HAND) {
                    console.log(`Only ${MAX_CARDS_IN_HAND} cards allowed, play or discard some!`);
                    return;
                }

                G.state.actionsRemaining = MAX_ACTIONS_PER_TURN;
                events.endTurn();
            }
        },


        turn: {
            onBegin: ({G, ctx, random}) => {
                dealFunction(G.deck, G.discard, G.players[ctx.currentPlayer].inventory, random);
            },
            stages: {
                [STAGE_MOVE_PROPERTY]: {
                    moves: {
                        moveProperty: ({G, ctx, events, playerID}, toStackIndex: number) => {
                            let source: Array<Card>;
                            if (G.state.fromStackIndex !== undefined) { // moving within properties
                                source = G.players[playerID].properties[G.state.fromStackIndex!]
                            } else { // moving from hand
                                source = G.players[playerID].inventory;
                            }

                            const card = source[G.state.fromCardIndex!] as PropertyCard;
                            const colour = card.colour[0]; // todo: auto-flip wildcard if necessary + rainbow wildcard

                            const propertySet = G.players[playerID].properties[toStackIndex];
                            if (propertySet) {
                                for (let property of propertySet) {
                                    if (!property.colour.includes(colour)) {
                                        console.log(`Can't play ${colour} property with ${property.name}.`);
                                        return INVALID_MOVE;
                                    }
                                }

                                if (propertySet.length + 1 > PROPERTY_SETS[colour].number) {
                                    console.log(`${colour} set is already full.`);
                                    return INVALID_MOVE;
                                }

                            } else if (card.colour.length > 2) {
                                console.log("Can't play rainbow wildcard on it's own.");
                                return INVALID_MOVE;
                            } else if (source.length === 1) {
                                console.log("Can't move single card to a new stack.");
                                return INVALID_MOVE;
                            }


                            const propertyCard = source.splice(G.state.fromCardIndex!, 1)[0] as PropertyCard;
                            if (propertySet) {
                                propertySet.push(propertyCard);
                            } else {
                                G.players[playerID].properties.push([propertyCard]);
                            }


                            G.state.fromCardIndex = undefined;
                            G.state.fromStackIndex = undefined;
                            events.endStage();
                        }
                    }
                },

                "play_passGo": {
                    moves: {
                        play: {
                            move: ({G, ctx, events, random, playerID}) => {
                                dealFunction(G.deck, G.discard, G.players[playerID].inventory, random);
                                events.endStage();
                            },
                            undoable: false
                        }
                    }
                }
            }
        }
    }
;

export default MoonPolyDeal;