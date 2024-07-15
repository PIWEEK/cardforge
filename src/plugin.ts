
import { PenpotShape, PenpotFrame, PenpotStroke } from '@penpot/plugin-types';
import type { PluginUIEvent, DeckEvent } from './model';



console.log("Hello from the plugin!");

let front: PenpotFrame;
let back: PenpotFrame;

penpot.ui.open("CardForge", "", {
    width: 1200,
    height: 650,
});



// see findShapes
function findByName(parent: PenpotFrame, name: string) {
    for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        if ((child.hasOwnProperty("name")) && (child["name"] === name)) {
            return child;
        }
    }
}


function createDeck(message: DeckEvent) {
    penpot.currentPage.name = message.name;

    front = penpot.createFrame();
    front.name = "Front";

    const inside = penpot.createFrame();
    inside.name = "inside";
    inside.borderRadius = 10;

    inside.strokes = [
        {
            strokeColor: '#000000',
            strokeStyle: 'solid',
            strokeWidth: 10,
            strokeAlignment: 'inner',
        },
    ];

    console.log(message);

    if (message.size == "P1") {
        if (message.orientation == "portrait") {
            front.resize(238, 333);
            inside.resize(218, 313);
        } else {
            front.resize(333, 238);
            inside.resize(313, 218);
        }
        inside.x = 10;
        inside.y = 10;
    }

    front.appendChild(inside);

    back = (front.clone() as PenpotFrame);
    back.name = "Back";
    back.x += front.width + 50;
}


function handleCreateDeck(message: DeckEvent) {
    const root: PenpotFrame = (penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000") as PenpotFrame);
    if (root.children.length == 0) {
        createDeck(message);
    } else {
        penpot.ui.sendMessage("ERROR_DECK_CREATE_PAGE_NOT_EMPTY");
    }
}

penpot.ui.onMessage((message: PluginUIEvent) => {
    console.log("message: ", message);
    if (message.type === "duplicate") {
        // const card = findByName(root, "Card");
        // console.log("Card: ", card);
        // let card2 = card.clone();
        // card2.name = 'card01';
        // card2.x += 500;
        // console.log("Card2: ", card2);
        // let text = findByName(card2, "#name");
        // text.characters = "Inventores";
        //
        // let image = findByName(card2, "#img");
        // console.log(image);
        // image.fills = inventores.fills;
        // console.log(image.fills);


    }

    if (message.type === "create-deck") {
        handleCreateDeck((message as DeckEvent));
    }
});


