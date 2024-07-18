
import { PenpotShape, PenpotFrame, PenpotStroke } from '@penpot/plugin-types';
import type { PluginUIEvent, DeckEvent, CardField } from './model';


export const cardSizes = [
    ["Dixit (80 x 120 mm)", 945, 1417],
    ["Tarot (70 x 120 mm)", 827, 1417],
    ["French tarot (61 x 112 mm)", 720, 1323],
    ["Wonder (65 x 100 mm)", 768, 1181],
    ["Volcano (70 x 110 mm)", 827, 1299],
    ["Euro (59 x 92 mm)", 697, 1086],
    ["Asia (57,5 x 89 mm)", 679, 1051],
    ["Standard (Poker) (63,5 x 88 mm)", 750, 1039],
    ["USA (56 x 87 mm)", 661, 1027],
    ["Square L (80x80 mm)", 945, 945],
    ["Desert (50 x 75 mm)", 590, 886],
    ["Square S (70 x 70 mm)", 827, 827],
    ["Mini EURO (45 x 68 mm)", 531, 803],
    ["Mini Asia (43 x 65 mm)", 508, 768],
    ["Mini USA (41 x 63 mm)", 484, 744]];


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
    inside.borderRadius = 50;

    inside.strokes = [
        {
            strokeColor: '#000000',
            strokeStyle: 'solid',
            strokeWidth: 12,
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
    inside.resize(width - 48, height - 48);
    inside.x = 24;
    inside.y = 24;

    front.appendChild(inside);

    back = (front.clone() as PenpotFrame);
    back.name = "Back";
    back.x += front.width + 100;

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



function cloneCard(card, cardData, cardNum) {
    let card2 = (card.clone() as PenpotFrame)
    card2.name = "card" + cardNum.padStart(2, '0');
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
    return card2;
}

function addCard(output, card, x, y) {
    card.x = x;
    card.y = y;

    output.appendChild(card);

    x += card.width;
    if ((x + card.width) > output.width) {
        x = 0;
        y += card.height;
    }
    return [x, y];
}


function addCutMarks(frame: PenpotFrame, clone = true) {
    let cutMFrame = penpot.createFrame();
    cutMFrame.name = "cutMFrame";
    cutMFrame.resize(frame.width + 200, frame.height + 200);

    let rect = penpot.createRectangle();
    rect.resize(200, 2);
    rect.x = 0;
    rect.y = 98;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(200, 2);
    rect.x = cutMFrame.width - 200;
    rect.y = 98;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(200, 2);
    rect.x = 0;
    rect.y = cutMFrame.height - 100;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(200, 2);
    rect.x = cutMFrame.width - 200;
    rect.y = cutMFrame.height - 100;
    cutMFrame.appendChild(rect);


    rect = penpot.createRectangle();
    rect.resize(2, 200);
    rect.x = 98;
    rect.y = 0;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(2, 200);
    rect.x = cutMFrame.width - 100;
    rect.y = 0;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(2, 200);
    rect.x = 98;
    rect.y = cutMFrame.height - 200;
    cutMFrame.appendChild(rect);

    rect = penpot.createRectangle();
    rect.resize(2, 200);
    rect.x = cutMFrame.width - 100;
    rect.y = cutMFrame.height - 200;
    cutMFrame.appendChild(rect);

    if (clone) {
        frame = (frame.clone() as PenpotFrame);
    }
    frame.x = 100;
    frame.y = 100;
    cutMFrame.appendChild(frame);

    return cutMFrame;
}

function countRectsFit(rectA, rectB) {
    const countWidth = Math.floor(rectA.width / rectB.width);
    const countHeight = Math.floor(rectA.height / rectB.height);
    return countWidth * countHeight;
}

function forjeCards(cardsData: [], type: string, cutMarks: boolean) {
    console.log("start forjecards", type, cutMarks);
    let shapes = penpot.currentPage.findShapes({ name: "Output" })
    if (shapes.length > 0) {
        shapes[0].remove();
    }


    let baseFront = (penpot.currentPage.findShapes({ name: "Front" })[0] as PenpotFrame);
    let baseBack = (penpot.currentPage.findShapes({ name: "Back" })[0] as PenpotFrame);

    let card: PenpotFrame;
    let output: PenpotFrame;
    let tmpFront: PenpotFrame;
    let tmpBack: PenpotFrame;

    let x = baseFront.x;
    let y = baseFront.y + baseFront.height + 400;

    output = penpot.createFrame();
    output.name = "Output";
    output.x = x;
    output.y = y;

    console.log("y: " + y)

    if (type == "standard") {

        if (cutMarks) {
            tmpFront = addCutMarks(baseFront);
            tmpBack = addCutMarks(baseBack);

            baseFront = tmpFront;
            baseBack = tmpBack;
        }

        output.resize(baseFront.width * (cardsData.length + 1), baseFront.height);
    } else if (type == "tabletop") {
        output.resize(baseFront.width * 10, baseFront.height * 7);
    }

    if ((type == "tabletop") || (type == "standard")) {
        for (let i = 0; i < cardsData.length; i++) {
            card = cloneCard(baseFront, cardsData[i], String(i + 1));
            [x, y] = addCard(output, card, x, y);
        }

        card = (baseBack.clone() as PenpotFrame);
        card.x = output.width - card.width;
        card.y = output.y + output.height - card.height;
        output.appendChild(card);
    } else if (type == "printplay") {
        tmpFront = penpot.createFrame();
        tmpFront.name = "tmpFront";
        tmpFront.resize(baseFront.width, baseFront.height * 2);
        let backClone = baseBack.clone();
        backClone.rotate(180);
        tmpFront.appendChild(backClone);
        backClone.x = 0;
        backClone.y = 0;
        let frontClone = baseFront.clone();
        tmpFront.appendChild(frontClone);
        frontClone.x = 0;
        frontClone.y = frontClone.height;
        if (cutMarks) {
            tmpFront = addCutMarks(tmpFront, false);
        }
        baseFront = tmpFront;


        // A4


        let page: PenpotFrame;
        let cardsPerPage: number;
        let width: number;
        let height: number;
        let fitPortrait = countRectsFit({ width: 2480, height: 3508 }, { width: baseFront.width, height: baseFront.height });
        let fitLandscape = countRectsFit({ width: 3508, height: 2480 }, { width: baseFront.width, height: baseFront.height });

        console.log("fitPortrait ", fitPortrait);
        console.log("fitLandscape ", fitLandscape);

        if (fitPortrait >= fitLandscape) {
            width = 2480;
            height = 3508;
            cardsPerPage = fitPortrait;
        } else {
            width = 3508;
            height = 2480;
            cardsPerPage = fitLandscape;
        }

        let numPages = Math.ceil(cardsData.length / cardsPerPage);
        let numCard = 0;

        output.resize(width, (height + 100) * numPages);


        let cardsPerLine = Math.floor(width / baseFront.width);
        let linesPerPage = Math.floor(height / baseFront.height);
        let gapH = Math.floor((width - cardsPerLine * baseFront.width) / (cardsPerLine + 1));
        let gapV = Math.floor((height - linesPerPage * baseFront.height) / (linesPerPage + 1));

        for (let i = 0; i < numPages; i++) {
            page = penpot.createFrame();
            page.name = "Page " + String(i + 1).padStart(2, '0');
            page.resize(width, height);
            page.x = output.x;
            page.y = output.y + i * (height + 100);

            x = page.x + gapH;
            y = page.y;

            for (let j = 0; j < cardsPerPage; j++) {
                if (j % cardsPerLine == 0) {
                    y += gapV;
                }

                card = cloneCard(baseFront, cardsData[numCard], String(numCard + 1));
                [x, y] = addCard(page, card, x, y);
                x += gapH;
                numCard++;
                if (numCard >= cardsData.length) {
                    break;
                }
            }
            output.appendChild(page);

            console.log("page y " + page.y);
        }

    }

    tmpFront?.remove();
    tmpBack?.remove();

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
        forjeCards(message.data.cardsData, message.data.type, (message.data.cutMarks == "true"));
    } else if (message.type === "is-page-empty") {
        handleIsPageEmpty();
    }


});


