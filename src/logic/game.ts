import {Game, PlayerID} from "boardgame.io";
import {G, Hands} from "./index";
import {
    DECK,
    PROPERTY_SETS,
    PropertyColour,
} from "./cards";
import {dealFunction, hasNothingOfValue, takeFromArray} from "./utils";
import {INVALID_MOVE} from "boardgame.io/core";
import {
    MAX_ACTIONS_PER_TURN,
    MAX_CARDS_IN_HAND, STAGE_CHOOSE_TARGET,
    STAGE_MOVE_PROPERTY, STAGE_PAY_PLAYER,
} from "./constants";
import {PropertyCard, Card} from "../components/Board/Card/Card.types";
import {playAction} from "./actions";

const MoonPolyDeal: Game<G> = {
    name: "MoonPolyDeal",
    minPlayers: 2,
    setup: ({ctx, random}): G => {
        const deck = random.Shuffle(DECK);

        const players = ctx.playOrder.reduce((hands, playerId) => {
            hands[playerId] = {
                inventory: takeFromArray(5, deck, []),
                bank: [],
                properties: [],
            };
            return hands;
        }, {} as Hands);

        return {
            players,
            deck,
            discard: [],
            state: {
                actionsRemaining: MAX_ACTIONS_PER_TURN,
                actionUndoable: true
            },
        };
    },

    playerView: ({G, playerID}) => ({
        ...G,
        deck: [],
        players: Object.entries(G.players).map(([id, value]) => ({
            ...value,
            inventory: id === playerID || playerID === null ? value.inventory : [],
        })),
    }),

    moves: {
        playCard: {
            move: ({G, ctx, events, random, playerID}, cardIndex: number) => {
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
                    playAction(G, ctx, events, playerID, random, cardIndex);
                }
            },
            undoable: ({G}) => G.state.actionUndoable
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

            if (stack.length > 1) {
                // move a flipped wildcard to a new stack, the colour will be wrong
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

            G.state.fromStackIndex = stackIndex;
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
                console.log(
                    `Don't need to discard, less than ${MAX_CARDS_IN_HAND} cards in hand.`
                );
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
        },
    },

    turn: {
        onBegin: ({G, ctx, random}) => {
            G.state.actionUndoable = true;
            dealFunction(G.deck, G.discard, G.players[ctx.currentPlayer].inventory, random);
        },

        stages: {
            [STAGE_MOVE_PROPERTY]: {
                moves: {
                    moveProperty: ({G, ctx, events, playerID}, toStackIndex: number) => {
                        let source: Array<Card>;
                        if (G.state.fromStackIndex !== undefined) {
                            // moving within properties
                            source = G.players[playerID].properties[G.state.fromStackIndex!];
                        } else {
                            // moving from hand
                            source = G.players[playerID].inventory;
                        }

                        const card = source[G.state.fromCardIndex!] as PropertyCard;
                        const colour: PropertyColour = card.colour[0]; // todo: auto-flip wildcard if necessary + rainbow wildcard

                        const propertySet = G.players[playerID].properties[toStackIndex];
                        if (propertySet) {
                            for (let property of propertySet) {
                                if (!property.colour.includes(colour)) {
                                    console.log(
                                        `Can't play ${colour} property with ${property.name}.`
                                    );
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

                        const propertyCard = source.splice(
                            G.state.fromCardIndex!,
                            1
                        )[0] as PropertyCard;
                        if (propertySet) {
                            propertySet.push(propertyCard);
                        } else {
                            G.players[playerID].properties.push([propertyCard]);
                        }

                        G.state.fromCardIndex = undefined;
                        G.state.fromStackIndex = undefined;
                        events.endStage();
                    },
                },
            },

            [STAGE_PAY_PLAYER]: {
                moves: {
                    payPlayer: ({G, ctx, events, playerID}, stackIndex, cardIndex) => {
                        let source: Array<Card>;
                        if (stackIndex !== -1) {
                            // paying from properties
                            source = G.players[playerID].properties[stackIndex];
                        } else {
                            // paying from bank
                            source = G.players[playerID].bank;
                        }

                        if (!source) {
                            console.error("stackIndex out of range");
                            return INVALID_MOVE;
                        }

                        const card = source[cardIndex];
                        if (!card) {
                            console.error("cardIndex out of range");
                            return INVALID_MOVE;
                        }

                        if (card.value === 0) {
                            console.log("Card has no value.");
                            return INVALID_MOVE;
                        }

                        if (!G.state.amountRemaining![playerID]) {
                            console.log("Don't owe any more money.");
                            return INVALID_MOVE;
                        }


                        source.splice(cardIndex, 1);
                        G.state.amountRemaining![playerID]! -= card.value;

                        const targetPlayer = G.players[G.state.amountDueTo!];
                        if (card.type === "property") {
                            targetPlayer.properties.push([card]);
                        } else {
                            targetPlayer.bank.push(card);
                        }

                        // todo: just say no

                        if (G.state.amountRemaining![playerID]! <= 0 || hasNothingOfValue(G.players[playerID])) {
                            delete G.state.amountRemaining![playerID];

                            if (Object.keys(G.state.amountRemaining!).length === 0) {
                                // everyone has paid, clean up
                                delete G.state.amountRemaining;
                                delete G.state.action;
                                delete G.state.amountDueTo;
                            }

                            events.endStage();
                        }
                    }
                }
            },

            [STAGE_CHOOSE_TARGET]: {
                moves: {
                    chooseTarget: ({G, ctx, events, playerID}, target: PlayerID) => {
                        if (!ctx.playOrder.includes(target)) {
                            console.error("Invalid target");
                            return INVALID_MOVE;
                        }

                        if (target === playerID) {
                            console.log("Can't target yourself.")
                            return INVALID_MOVE;
                        }

                        if (hasNothingOfValue(G.players[target])) {
                            console.log("Target has nothing of value.");
                            return INVALID_MOVE;
                        }

                        G.state.amountDueTo = playerID;
                        G.state.amountRemaining = {[target]: G.state.amountDue};

                        events.endStage();
                        events.setActivePlayers({
                            value: {
                                [target]: STAGE_PAY_PLAYER
                            }
                        });

                        delete G.state.amountDue;
                    }
                }
            }
        },
    },
};

export default MoonPolyDeal;
