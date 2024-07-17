
import { PenpotShape, PenpotFrame, PenpotStroke } from '@penpot/plugin-types';
import type { PluginUIEvent, DeckEvent, CardField } from './model';


export const cardSizes = [
    ["Dixit (80 x 120 mm)", 302, 454],
    ["Tarot (70 x 120)", 265, 454],
    ["French tarot (61 x 112)", 231, 423],
    ["Wonder (65 x 100)", 246, 378],
    ["Volcano (70 x 110)", 265, 416],
    ["Euro (59 x 92)", 223, 348],
    ["Asia (57,5 x 89)", 217, 337],
    ["Standard (63,5 x 88)", 240, 333],
    ["USA (56 x 87)", 212, 329],
    ["Square L (80x80)", 302, 302],
    ["Desert (50 x 75)", 189, 284],
    ["Square S (70 x 70)", 265, 265],
    ["Mini EURO (45 x 68)", 170, 257],
    ["Mini Asia (43 x 65)", 163, 246],
    ["Mini USA (41 x 63)", 155, 238]];


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
        } if (child.children?.length > 0) {
            let inner = findByName((child as PenpotFrame), name);
            if (inner) {
                return inner;
            }
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
    inside.borderRadius = 5;

    inside.strokes = [
        {
            strokeColor: '#000000',
            strokeStyle: 'solid',
            strokeWidth: 5,
            strokeAlignment: 'inner',
        },
    ];

    let size = parseInt(message.size)
    let width: number = cardSizes[size][1];
    let height: number = cardSizes[size][2];

    if (message.orientation == "landscape") {
        width = cardSizes[size][2];
        height = cardSizes[size][1];
    }

    front.resize(width, height);
    inside.resize(width - 10, height - 10);
    inside.x = 5;
    inside.y = 5;

    front.appendChild(inside);

    back = (front.clone() as PenpotFrame);
    back.name = "Back";
    back.x += front.width + 50;

    penpot.closePlugin();
}


function handleCreateDeck(message: DeckEvent) {
    const root: PenpotFrame = (penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000") as PenpotFrame);
    if (root.children.length == 0) {
        createDeck(message);
    } else {
        penpot.ui.sendMessage({ "type": "ERROR_DECK_CREATE_PAGE_NOT_EMPTY" });
    }
}

function handleIsPageEmpty() {
    const root: PenpotFrame = (penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000") as PenpotFrame);
    penpot.ui.sendMessage({ "type": "PAGE_EMPTY", "data": (root.children.length == 0) });
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
            penpot.ui.sendMessage({ "type": "IMAGE_CREATED", "data": { "num": num, "name": name, "id": shape.fills[0].fillImage?.id, "imageId": shape.id } });
        })
        .catch((err) => console.error(err));
}

function forjeCards(cardsData: []) {
    let output: PenpotFrame;
    let shapes = penpot.currentPage.findShapes({ name: "Output" })
    if (shapes.length > 0) {
        shapes[0].remove();
    }

    output = penpot.createFrame();
    output.name = "Output";
    output.y = 500;
    output.resize(794, 1123);
    let flex = output.addFlexLayout();
    flex.columnGap = 30;
    flex.wrap = "wrap"; //TODO API BUG
    flex.justifyContent = "center";
    flex.alignContent = "start";

    const baseCard = (penpot.currentPage.findShapes({ name: "Front" })[0] as PenpotFrame);

    let card2: PenpotFrame;
    for (let i = 0; i < cardsData.length; i++) {
        let cardData = cardsData[i];
        card2 = (baseCard.clone() as PenpotFrame)
        card2.name = "card" + String(i + 1).padStart(2, '0');
        for (var prop in cardData) {
            if (cardData.hasOwnProperty(prop)) {
                let field = findByName(card2, prop);
                if (field.type == "text") {
                    field.characters = cardData[prop];
                } else {
                    let imageId = cardData[prop].split("|")[0];
                    let image = penpot.currentPage.getShapeById(imageId);
                    field.fills = image.fills;
                }
            }
        }
        output.appendChild(card2);
    }

    penpot.closePlugin();
}


penpot.ui.onMessage((message: PluginUIEvent) => {
    console.log("[plugin] message: ");
    console.log(message);

    if (message.type === "create-deck") {
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
    } else if (message.type === "forje-cards") {
        forjeCards(message.data.cardsData);
    } else if (message.type === "is-page-empty") {
        handleIsPageEmpty();
    }


});


