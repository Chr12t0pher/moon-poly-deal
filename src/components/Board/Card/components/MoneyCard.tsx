import React from "react";
import { getColourFor } from "../../../../logic/cards";
import { Actions, CardContainer } from "../Card.styles";
import { CardProps, MoneyCard } from "../Card.types";

const MoneyCard = ({ card, moves }: CardProps<MoneyCard>) => (
  <CardContainer style={{ backgroundColor: getColourFor(card.value) }}>
    <h1>£{card.value}</h1>

    <Actions>
      {Object.entries(moves).map(([name, func], i) => (
        <button key={i} onClick={func}>
          {name}
        </button>
      ))}
    </Actions>
  </CardContainer>
);

export default MoneyCard;
