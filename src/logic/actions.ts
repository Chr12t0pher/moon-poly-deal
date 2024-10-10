import {G} from "./index";
import {Ctx, PlayerID} from "boardgame.io";
import {EventsAPI} from "boardgame.io/dist/types/src/plugins/events/events";
import {ActionCard} from "../components/Board/Card/Card.types";
import {ActionName} from "./cards";
import {dealFunction} from "./utils";
import {RandomAPI} from "boardgame.io/dist/types/src/plugins/random/random";
import {STAGE_CHOOSE_TARGET} from "./constants";

export function playAction(G: G, ctx: Ctx, events: EventsAPI, playerID: PlayerID, random: RandomAPI, cardIndex: number) {
    const card = G.players[playerID].inventory.splice(cardIndex, 1)[0] as ActionCard;

    switch (card.title) {
        case ActionName.PASS_GO:
            G.state.actionUndoable = false;
            dealFunction(G.deck, G.discard, G.players[playerID].inventory, random);
            break;

        case ActionName.DEBT_COLLECTOR:
            G.state.action = card;
            G.state.amountDue = 5;
            events.setStage(STAGE_CHOOSE_TARGET);
            break;

    }
}
