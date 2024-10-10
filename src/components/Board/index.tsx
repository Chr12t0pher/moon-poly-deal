import React from "react";
import {BoardProps} from "boardgame.io/react";
import {G} from "../../logic";
import Card from "./Card/Card";
import {
    MAX_ACTIONS_PER_TURN, STAGE_CHOOSE_TARGET,
    STAGE_MOVE_PROPERTY, STAGE_PAY_PLAYER,
} from "../../logic/constants";
import styled from "styled-components";

const CardList = styled.div`
  display: flex;
  gap: 1rem;
`;

const CardSet = styled.div`
  display: flex;
  flex-direction: column;
`;

const Board = ({G, ctx, moves, playerID, undo}: BoardProps<G>) => {
    const stage = ctx.activePlayers ? ctx.activePlayers[playerID!] : null;

    const board = <div>
        <h1>Board</h1>
        {Object.entries(G.players).map(([id, value]) => {
            const activePlayer = id === playerID;
            const currentPlayer = id === ctx.currentPlayer;
            return <div key={id}>
                    <h2>{id}</h2>
                    {stage === STAGE_CHOOSE_TARGET && !activePlayer ? <button onClick={() => moves.chooseTarget(id)}>Choose Target</button> : ""}
                    <h3>Properties</h3>
                    <CardList>
                        {value.properties.map((set, setIndex) =>
                            <CardSet key={setIndex}>
                                {set.map((card, cardIndex) => {
                                    const moveFunctions: { [key in string]: (...args: any) => void; } = {};

                                    switch (stage) {
                                        case STAGE_MOVE_PROPERTY:
                                            moveFunctions["Add"] = () => moves.moveProperty(setIndex);
                                            break;
                                        case STAGE_PAY_PLAYER:
                                            if (card.value > 0) {
                                                moveFunctions["Pay"] = () => moves.payPlayer(setIndex, cardIndex);
                                            }
                                            break;
                                        default:
                                            if (currentPlayer) {
                                                moveFunctions["Move"] = () => moves.moveProperty(setIndex, cardIndex);
                                                if (card.colour.length === 2) {
                                                    moveFunctions["Flip"] = () => moves.flipWildcardProperty(setIndex, cardIndex);
                                                }
                                            }
                                            break;
                                    }

                                    return <Card key={cardIndex} card={card} moves={moveFunctions}/>;
                                })}
                            </CardSet>
                        )}

                        {stage === STAGE_MOVE_PROPERTY
                            ? <button onClick={() => moves.moveProperty(value.properties.length, null)}>New Set</button>
                            : ""}
                    </CardList>

                    <h3>
                        Bank (£{value.bank.reduce((acc, card) => card.value + acc, 0)})
                    </h3>
                    <CardList>
                        {value.bank.map((card, cardIndex) => {
                            const moveFunctions: { [key in string]: (...args: any) => void; } = {};

                            switch (stage) {
                                case STAGE_PAY_PLAYER:
                                    if (activePlayer) {
                                        moveFunctions["Pay"] = () => moves.payPlayer(-1, cardIndex);
                                    }
                                    break;
                            }

                            return <Card key={cardIndex} card={card} moves={moveFunctions}/>
                        })}
                    </CardList>
                </div>
            }
        )}
    </div>;

    const hand = playerID
        ? <div>
            <h2>Inventory</h2>
            <CardList>
                {G.players[playerID!].inventory.map((card, i) => {
                    const cardMoves: { [key in string]: () => void } = {};

                    if (!stage) {
                        if (G.state.actionsRemaining > 0) {
                            if (["action", "property"].includes(card.type)) {
                                cardMoves["Play"] = () => moves.playCard(i);
                            }

                            if (["action", "money"].includes(card.type)) {
                                cardMoves["Bank"] = () => moves.bankCard(i);
                            }
                        }

                        if (G.players[playerID!].inventory.length > 7) {
                            cardMoves["Discard"] = () => moves.discardCard(i);
                        }
                    }

                    return <Card card={card} moves={cardMoves}/>;
                })}
            </CardList>
        </div>
        : "";

    return <div>
        {playerID === ctx.currentPlayer
            ? <>
                <button onClick={() => moves.endTurn()}>
                    End Turn ({G.state.actionsRemaining}/{MAX_ACTIONS_PER_TURN} actions remaining)
                </button>
                <button onClick={undo}>Undo</button>
            </>
            : ""
        }
        {board}
        {hand}
    </div>
};

export default Board;
