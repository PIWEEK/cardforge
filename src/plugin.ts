
import { PenpotShape, PenpotFrame } from '@penpot/plugin-types';
import type { PluginUIEvent } from './model';



console.log("Hello from the plugin!");

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


function createDeck(message: PluginUIEvent) {
    penpot.currentPage.name = message.name;
}


function handleCreateDeck(message: PluginUIEvent) {
    const root: PenpotFrame = penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000");
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
        handleCreateDeck(message);
    }
});


