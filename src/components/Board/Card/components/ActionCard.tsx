import React from "react";
import { Actions, CardContainer } from "../Card.styles";
import { getColourFor } from "../../../../logic/cards";
import { ActionCard, CardProps } from "../Card.types";

const ActionCard = ({ card, moves }: CardProps<ActionCard>) => (
  <CardContainer style={{ backgroundColor: getColourFor(card.value) }}>
    <h1>
      (£{card.value}) {card.title}
    </h1>
    <p>{card.subtitle}</p>
    <Actions>
      {Object.entries(moves).map(([name, func], i) => (
        <button key={i} onClick={func}>
          {name}
        </button>
      ))}
    </Actions>
  </CardContainer>
);

export default ActionCard;
