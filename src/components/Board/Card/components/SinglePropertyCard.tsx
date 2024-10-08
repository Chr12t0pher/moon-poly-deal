import React from "react";
import {
  Actions,
  CardContainer,
  PropertyName,
  ValueIcon,
} from "../Card.styles";
import { PROPERTY_SETS } from "../../../../logic/cards";
import { Card, CardProps } from "../Card.types";

const SinglePropertyCard = ({ card, moves }: CardProps<Card>) => {
  const setInfo = PROPERTY_SETS[card.colour[0]];

  return (
    <CardContainer>
      <div
        style={{
          // todo style component
          border: "1px solid black",
          height: "100%",
          width: "100%",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 10,
          paddingTop: 0,
          boxSizing: "border-box",
        }}
      >
        <PropertyName color={setInfo.colour}>
          <div>{card.name}</div>
          <ValueIcon color={setInfo.colour}>£{card.value}</ValueIcon>
        </PropertyName>

        <p>Rent:</p>
        <ol>
          {setInfo.rent.map((rentCost, i) => (
            <li key={i}>£{rentCost}</li>
          ))}
        </ol>

        <Actions>
          {Object.entries(moves).map(([name, func], i) => (
            <button key={i} onClick={func}>
              {name}
            </button>
          ))}
        </Actions>
      </div>
    </CardContainer>
  );
};

export default SinglePropertyCard;
