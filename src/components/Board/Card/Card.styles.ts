import styled from "styled-components";
import getTextColor from "../../../helpers/getTextColor";

export const CardContainer = styled.div`
  box-shadow: 1px 0px 2px grey;
  position: relative;
  display: flex;
  width: 15rem;
  height: 24rem;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  transition: 0.5s ease;

  &:hover {
    box-shadow: 5px 1px 5px #a8a8a8;
    transform: scale(1.02, 1.02);
  }

  margin: 0;
`;

export const PropertyName = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  color: ${({ color }) => getTextColor(color)};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 90%;
  height: 20%;
  margin-top: 1rem;

  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid black;
  border-radius: 0.5em;

  > * {
  }
`;

export const ValueIcon = styled.div<{ color: string }>`
  position: absolute;
  top: 1.5rem;
  left: 1.75rem;

  width: 2rem;
  height: 2rem;

  font-size: 1rem;
  text-align: center;
  align-content: center;

  background-color: white;
  border: ${({ color }) => `0.15rem solid ${color}`};
  border-radius: 50%;
  outline: 1px solid black;
`;

export const Actions = styled.div`
  position: absolute;
  top: -0.6rem;
  width: 100%;

  display: flex;
  justify-content: center;
  column-gap: 1rem;

  z-index: 10;
`;
