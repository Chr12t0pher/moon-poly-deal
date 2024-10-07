import React from "react";
import {BoardProps} from "boardgame.io/react";
import {G} from "../../logic";
import Card from "./Card";
import {MAX_ACTIONS_PER_TURN, STAGE_CHOOSE_ACTION, STAGE_MOVE_PROPERTY} from "../../logic/constants";
import styled from "styled-components";
import {Ctx} from "boardgame.io";

const CardList = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CardSet = styled.div`
  display: flex;
  flex-direction: column;
`;

const Board = ({G, ctx, moves, playerID, events, isActive}: BoardProps<G>) => {

    return <div>
        {playerID === ctx.currentPlayer
            ?
            <button onClick={() => moves.endTurn()}>End Turn ({G.state.actionsRemaining}/{MAX_ACTIONS_PER_TURN} actions
                remaining)</button>
            : ""}

        <div>l
            <h1>Board</h1>
            {Object.entries(G.players).map(([id, value]) => {
                const stage = ctx.activePlayers ? ctx.activePlayers[id] : null;

                return <div>
                    <h2>{id}</h2>
                    <h3>Properties</h3>
                    <CardList>
                        {value.properties.map((set, setIndex) => <CardSet>{set.map((card, cardIndex) => {
                            const moveFunctions: { [key in string]: (...args: any) => void } = {};

                            switch (stage) {
                                case STAGE_MOVE_PROPERTY:
                                    moveFunctions["Add"] = () => moves.moveProperty(setIndex);
                                    break;
                                default:
                                    if (ctx.currentPlayer === id) {
                                        moveFunctions["Move"] = () => moves.moveProperty(setIndex, cardIndex);
                                        if (card.colour.length === 2) {
                                            moveFunctions["Flip"] = () => moves.flipWildcardProperty(setIndex, cardIndex);
                                        }
                                    }
                                    break;
                            }

                            return <Card card={card} moves={moveFunctions}/>
                        })}</CardSet>)}

                        {stage === STAGE_MOVE_PROPERTY
                            ? <button onClick={() => moves.moveProperty(value.properties.length, null)}>New Set</button>
                            : ""}

                    </CardList>

                    <h3>Bank (£{value.bank.reduce((acc, card) => card.value + acc, 0)})</h3>
                    <CardList>
                        {value.bank.map(card => <Card card={card} moves={{}}/>)}
                    </CardList>

                </div>
            })}

        </div>

        {playerID
            ? <div>
                <h2>Inventory</h2>
                <CardList>
                    {G.players[playerID!].inventory.map((card, i) => {
                        const cardMoves: { [key in string]: () => void } = {};

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

                        return <Card card={card} moves={cardMoves}/>
                    })}
                </CardList>
            </div>
            : ""}
    </div>
}

export default Board;