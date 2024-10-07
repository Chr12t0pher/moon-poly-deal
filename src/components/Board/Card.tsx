import React from "react";
import {ActionCard, Card, MoneyCard, PropertyCard, getColourFor, PROPERTY_SETS} from "../../logic/cards";
import styled from "styled-components";

interface CardProps<T extends Card> {
    card: T;
    moves: { [key in string]: () => void };
}

const CardContainer = styled.div`
  position: relative;
  display: flex;

  width: 15rem;
  height: 24rem;

  flex-direction: column;
  align-items: center;

  background-color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
`;

const PropertyName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 90%;
  height: 20%;
  margin-top: 1rem;

  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;

  border: 1px solid black;

  > * {
  }
`;

const ValueIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.3rem;

  width: 3rem;
  height: 3rem;

  line-height: 3rem;
  font-size: 1.5rem;
  text-align: center;

  background-color: white;
  border: 1px solid black;
  border-radius: 50%;
`;

const Actions = styled.div`
  position: absolute;
  top: -0.6rem;
  width: 100%;

  display: flex;
  justify-content: center;
  column-gap: 1rem;
  
  z-index: 10;
`;

const Card: React.FunctionComponent<CardProps<Card>> = ({card, moves}) => {
    switch (card.type) {
        case "action":
            return <ActionCard_ card={card} moves={moves}/>;
        case "money":
            return <MoneyCard_ card={card} moves={moves}/>;
        case "property":
            switch (card.colour.length) {
                case 1:
                    return <SinglePropertyCard_ card={card} moves={moves}/>
                case 2:
                    return <DualPropertyCard_ card={card} moves={moves}/>
                case 10:
                    return <PropertyWildCard_ card={card} moves={moves}/>
                default:
                    throw Error("unexpected card colour length");
            }
        default:
            throw Error("unexpected card type");
    }
}

const SinglePropertyCard_: React.FunctionComponent<CardProps<PropertyCard>> = ({card, moves}) => {
    const setInfo = PROPERTY_SETS[card.colour[0]];
    return <CardContainer>
        <PropertyName style={{backgroundColor: setInfo.colour}}>
            <div>{card.name}</div>
        </PropertyName>
        <ValueIcon>£{card.value}</ValueIcon>

        <p>Rent:</p>
        <ol>
            {setInfo.rent.map((rentCost, i) => <li key={i}>£{rentCost}</li>)}
        </ol>

        <Actions>{Object.entries(moves).map(([name, func], i) => <button key={i} onClick={func}>{name}</button>)}</Actions>
    </CardContainer>
}

const DualPropertyCard_: React.FunctionComponent<CardProps<PropertyCard>> = ({card, moves}) => {
    return <CardContainer style={{display: "block"}}>
        {card.colour.map((colour, i) => {
            const setInfo = PROPERTY_SETS[colour];
            return <CardContainer key={i}
                                  style={{position: "absolute", backgroundColor: "transparent", border: "none", transform: `rotate(${i * 180}deg)`}}>
                <PropertyName style={{backgroundColor: setInfo.colour}}>
                    <div>WILD CARD</div>
                </PropertyName>
                <ValueIcon>£{card.value}</ValueIcon>

                <div style={{paddingRight: "8rem"}}>
                    <p>Rent:</p>
                    <ol>
                        {setInfo.rent.map((rentCost, i) => <li key={i}>£{rentCost}</li>)}
                    </ol>
                </div>
            </CardContainer>
        })}

        <Actions>{Object.entries(moves).map(([name, func], i) => <button key={i} onClick={func}>{name}</button>)}</Actions>
    </CardContainer>
}

const PropertyWildCard_: React.FunctionComponent<CardProps<PropertyCard>> = ({card, moves}) => {
    return <CardContainer>
        <h1>(£{card.value}) Property Wild Card</h1>
    </CardContainer>
}

const ActionCard_: React.FunctionComponent<CardProps<ActionCard>> = ({card, moves}) => {
    return <CardContainer style={{backgroundColor: getColourFor(card.value)}}>
        <h1>(£{card.value}) {card.title}</h1>
        <p>{card.subtitle}</p>
        <Actions>{Object.entries(moves).map(([name, func], i) => <button key={i} onClick={func}>{name}</button>)}</Actions>
    </CardContainer>
}


const MoneyCard_: React.FunctionComponent<CardProps<MoneyCard>> = ({card, moves}) => {

    return <CardContainer style={{backgroundColor: getColourFor(card.value)}}>
        <h1>£{card.value}</h1>

        <Actions>{Object.entries(moves).map(([name, func], i) => <button key={i} onClick={func}>{name}</button>)}</Actions>
    </CardContainer>
}


export default Card;