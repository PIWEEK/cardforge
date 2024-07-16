
import { PenpotShape, PenpotFrame, PenpotStroke } from '@penpot/plugin-types';
import type { PluginUIEvent, DeckEvent, CardField } from './model';



console.log("Hello from the plugin!");

let front: PenpotFrame;
let back: PenpotFrame;

penpot.ui.open("CardForge", "", {
    width: 1200,
    height: 650,
});


function loadCardsData() {
    let data = penpot.currentPage.getPluginData("cardsData");
    console.log("loaded cards data:", data);
    let cardsData = JSON.parse(data);
    penpot.ui.sendMessage({ "type": "CARDS_DATA", "data": cardsData });
}


function isValidField(shape: PenpotShape) {
    return (shape.name?.startsWith("#") &&
        ((shape.type == "text") ||
            ((shape.type == "rect") &&
                (shape.fills?.length) == 1 &&
                (shape["fills"][0]["fillImage"]))));
}


function findFields(frame: PenpotFrame, fields: CardField[]) {
    for (let i = 0; i < frame.children.length; i++) {
        let child = frame.children[i];
        if (isValidField(child)) {
            let type = (child["type"] == "text") ? "text" : "image";
            fields.push({ "name": child["name"], "type": type, "id": child.id });
        }
        if (child.hasOwnProperty("children")) {
            findFields((child as PenpotFrame), fields);
        }
    }
    return fields;
}


function loadCardFields() {
    const root: PenpotFrame = (penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000") as PenpotFrame);
    const card = (findByName(root, "Front") as PenpotFrame);

    const fields = findFields(card, [])

    const assetsUrl = "https://early.penpot.dev/assets/by-file-media-id/";
    penpot.ui.sendMessage({ "type": "CARD_FIELDS", "data": { fields: fields, assetsUrl: assetsUrl } });
}


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

    const images = penpot.createFrame();
    images.name = "_Images";
    images.y = - 1000;
    images.hidden = true;


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
        penpot.ui.sendMessage({ "type": "ERROR_DECK_CREATE_PAGE_NOT_EMPTY" });
    }
}



function createImage(data: Uint8Array, mimeType: string, num: number, name: string) {
    penpot
        .uploadMediaData('image', data, mimeType)
        .then((data) => {
            const shape = penpot.createRectangle();
            shape.resize(data.width, data.height);
            shape.fills = [{ fillOpacity: 1, fillImage: data }];
            shape.x = 0;
            shape.y = 0;

            const images = (penpot.currentPage.findShapes({ name: "_Images" })[0] as PenpotFrame);
            images.appendChild(shape);
            penpot.ui.sendMessage({ "type": "IMAGE_CREATED", "data": { "num": num, "name": name, "id": shape.fills[0].fillImage?.id } });
        })
        .catch((err) => console.error(err));
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


    } else if (message.type === "create-deck") {
        handleCreateDeck((message as DeckEvent));
    } else if (message.type === "save-cards-data") {
        penpot.currentPage.setPluginData("cardsData", JSON.stringify(message.data));
    } else if (message.type === "load-cards-data") {
        loadCardsData();
    } else if (message.type === "load-card-fields") {
        loadCardFields();
    } else if (message.type === "create-image-data") {
        const { data, mimeType, num, name } = message.data as {
            data: Uint8Array;
            mimeType: string;
            num: number;
            name: string;
        };
        createImage(data, mimeType, num, name);
    }


});


