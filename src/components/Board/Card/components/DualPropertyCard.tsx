import React from "react";
import { PROPERTY_SETS } from "../../../../logic/cards";
import {
  Actions,
  CardContainer,
  PropertyName,
  ValueIcon,
} from "../Card.styles";
import { CardProps, PropertyCard } from "../Card.types";

const DualPropertyCard = ({ card, moves }: CardProps<PropertyCard>) => (
  // todo why we nesting
  <CardContainer style={{ display: "block" }}>
    {card.colour.map((colour, i) => {
      const setInfo = PROPERTY_SETS[colour];
      return (
        <CardContainer
          key={i}
          // todo move into styled component
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            border: "none",
            transform: `rotate(${i * 180}deg)`,
          }}
        >
          <PropertyName
            color={setInfo.colour}
            style={{ backgroundColor: setInfo.colour }}
          >
            <div>WILD CARD</div>
          </PropertyName>
          <ValueIcon color={setInfo.colour}>£{card.value}</ValueIcon>

          <div style={{ paddingRight: "8rem" }}>
            <p>Rent:</p>
            <ol>
              {setInfo.rent.map((rentCost, i) => (
                <li key={i}>£{rentCost}</li>
              ))}
            </ol>
          </div>
        </CardContainer>
      );
    })}

    <Actions>
      {Object.entries(moves).map(([name, func], i) => (
        <button key={i} onClick={func}>
          {name}
        </button>
      ))}
    </Actions>
  </CardContainer>
);

export default DualPropertyCard;
