import { Server } from "boardgame.io/server";
import MoonPolyDeal from "./logic/game";

const server = Server({ games: [MoonPolyDeal] });
server.run(parseInt(process.env.REACT_APP_PORT ?? "8000"));
