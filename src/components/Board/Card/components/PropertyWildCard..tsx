import React from "react";
import { CardProps, PropertyCard } from "../Card.types";
import { CardContainer } from "../Card.styles";

const PropertyWildCard = ({ card, moves }: CardProps<PropertyCard>) => (
  <CardContainer>
    <h1>(£{card.value}) Property Wild Card</h1>
  </CardContainer>
);

export default PropertyWildCard;
