import React from "react";
import {createRoot} from "react-dom/client";
import {Client} from "boardgame.io/react";
import game from "./logic/game";
import Board from "./components/Board";

const Game = Client({game, board: Board});

const App = () => (
    <Game  />
);

createRoot(document.getElementById("root")!).render(<App/>);