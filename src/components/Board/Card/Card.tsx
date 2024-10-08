import React from "react";
import { Card, CardProps } from "./Card.types";
import ActionCard from "./components/ActionCard";
import DualPropertyCard from "./components/DualPropertyCard";
import MoneyCard from "./components/Moneycard";
import PropertyWildCard from "./components/PropertyWildCard.";
import SinglePropertyCard from "./components/SinglePropertyCard";

const Card = ({ card, moves }: CardProps<Card>) => {
  switch (card.type) {
    case "action":
      return <ActionCard card={card} moves={moves} />;
    case "money":
      return <MoneyCard card={card} moves={moves} />;
    case "property":
      switch (card.colour.length) {
        case 1:
          return <SinglePropertyCard card={card} moves={moves} />;
        case 2:
          return <DualPropertyCard card={card} moves={moves} />;
        case 10:
          return <PropertyWildCard card={card} moves={moves} />;
        default:
          throw Error("unexpected card colour length");
      }
    default:
      throw Error("unexpected card type");
  }
};

export default Card;
