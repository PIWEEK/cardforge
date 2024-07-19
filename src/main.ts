
import "./style.css";

import type {
  PluginUIEvent,
  CardField
} from './model';


////////////////////////// GENERAL
/*
function listenerFunction(this: HTMLElement, ev: Event) {
  ev.preventDefault();
  sendMessage({ type: 'duplicate' })
}
*/

let assetsUrl = "";

function sendMessage(message: PluginUIEvent) {
  parent.postMessage(message, '*');
}


function initMessageListener() {
  window.addEventListener("message", (event) => {
    console.log("[main] received:");
    console.log(event);
    if (event.data.type == "ERROR_DECK_CREATE_PAGE_NOT_EMPTY") {
      createDeckShowError(true);
    } else if (event.data.type == "CARDS_DATA") {
      loadCardsData(event.data.data);
    } else if (event.data.type == "CARD_FIELDS") {
      assetsUrl = event.data.data.assetsUrl;
      cardFields = event.data.data.fields;
      loadCardFields();
    } else if (event.data.type == "IMAGE_CREATED") {
      updateImageInfo(event.data.data.num, event.data.data.name, event.data.data.id, event.data.data.imageId);
    } else if (event.data.type == "PAGE_EMPTY") {
      if (event.data.data) {
        changeTab("create");
      } else {
        changeTab("cards");
      }
    }
  });
}


///////////////////////////// TAB SELECTORS

const tabSelectors = document.querySelectorAll('.tab-selector');
const tabs = document.querySelectorAll('.tab');

function changeTab(name: string) {
  for (const element of tabSelectors) {
    element.classList.remove("current");
  }
  document.getElementById("ts-" + name)?.classList.add("current");

  for (const element of tabs) {
    element.classList.add("hidden");
  }

  document.getElementById("tab-" + name)?.classList.remove("hidden");
  showForgeCards(false);
}

function initTabSelectors() {
  for (const element of tabSelectors) {
    element.addEventListener('click', () => {
      changeTab(element.dataset.tab)
    });
  }
}


///////////////////////////// CREATE DECK


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



function createDeck(this: HTMLElement, ev: Event) {
  ev.preventDefault();
  let name = document.getElementById("create-deck-name")?.value;
  let size = document.getElementById("create-deck-size")?.value;
  let orientation = document.getElementById("create-deck-orientation")?.value;

  sendMessage({ type: 'create-deck', name: name, size: size, orientation: orientation, data: null })

}


function createDeckShowError(show: boolean) {

  if (show) {
    document.getElementById("box-create-error")?.classList.remove("hidden");
    document.getElementById("box-create")?.classList.add("hidden");
  } else {
    document.getElementById("box-create-error")?.classList.add("hidden");
    document.getElementById("box-create")?.classList.remove("hidden");
  }

}

function initcardSizes() {
  let select = document.getElementById("create-deck-size");
  select.innerHTML = "";
  let option;
  for (let i = 0; i < cardSizes.length; i++) {
    option = document.createElement("option");
    option.value = "" + i;
    option.innerText = cardSizes[i][0];
    select?.appendChild(option);
  }
  select.value = 7;
}

function initCreateDeck() {
  document.getElementById("create-deck-frm")?.addEventListener("submit", createDeck);
  document.getElementById("box-create-error-close")?.addEventListener("click", () => { createDeckShowError(false) });
  initcardSizes();
}



////////////////////////////// CARDS

const cardList = document.getElementById("card-list");
let cardFields: CardField[] = [];
let cardsData: any[] = [];


function saveCardsData() {
  sendMessage({ type: 'save-cards-data', data: JSON.stringify(cardsData) });
}

function updateImageInfo(num: number, name: string, id: string, imageId: string) {
  cardsData[num - 1][name] = imageId + "|" + id;
  saveCardsData();
}

function loadCardsData(data: string) {
  if (data) {
    cardsData = JSON.parse(data);
    reloadCardEntries();
  }
}

function createCardEntry(num: number, cardData: any) {
  let entry = document.createElement("div");
  entry.classList.add("card-entry");
  entry.id = "card-entry-" + num;

  let actions = document.createElement("div");
  actions.classList.add("card-actions");

  let copy = document.createElement("div");
  copy.classList.add("card-action-copy");
  copy.addEventListener("click", () => { copyCard(num) });
  actions.appendChild(copy);

  let del = document.createElement("div");
  del.classList.add("card-action-delete");
  del.addEventListener("click", () => { deleteCard(num) });
  actions.appendChild(del);

  let number = document.createElement("div");
  number.classList.add("card-num");
  number.innerText = String(num).padStart(2, '0');
  entry.appendChild(number);

  for (let i = 0; i < cardFields.length; i++) {
    if (cardFields[i].type == "text") {
      let div = document.createElement("div");
      div.classList.add("card-text");

      let input = document.createElement("input");
      if (cardData.hasOwnProperty(cardFields[i].name)) {
        input.value = cardData[cardFields[i].name];
      }
      input.addEventListener("blur", () => { saveCardText(num, cardFields[i].name, input.value) });
      div.appendChild(input);

      entry.appendChild(div);
    } else {
      let div = document.createElement("div");
      div.classList.add("card-image");
      let img = document.createElement("img");


      let fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      div.appendChild(fileInput);


      if (cardData.hasOwnProperty(cardFields[i].name)) {
        let assetId = cardData[cardFields[i].name].split("|")[1];
        img.src = assetsUrl + assetId;
        div.classList.add("card-image-full");
      } else {
        img.src = "images/add_image.png";
      }

      div.appendChild(img);
      img.addEventListener("click", () => { fileInput.click() });
      fileInput.addEventListener("change", (ev: Event) => { saveCardImage(num, cardFields[i].name, img, ev) });

      entry.appendChild(div);
    }
  }

  entry.appendChild(actions);
  return entry;
}

function addEmptyCard() {
  let cardData = {};
  cardsData.push(cardData);
  let entry = createCardEntry(cardsData.length, cardData);
  cardList?.appendChild(entry);
  saveCardsData();
  cardList.scrollTop = cardList?.scrollHeight;
}

function deleteCard(num: number) {
  cardsData.splice((num - 1), 1);
  saveCardsData();
  reloadCardEntries();
}

function copyCard(num: number) {
  let card = structuredClone(cardsData[num - 1]);
  cardsData.splice(num - 1, 0, card);
  saveCardsData();

  reloadCardEntries();
}

function saveCardText(num: number, name: string, val: string) {
  cardsData[num - 1][name] = val;
  saveCardsData();
}


function handleImagePreview(fileInput, previewContainer) {
  const file = fileInput.files[0];

  fileInput.dataset.dirty = true;

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageBlob = event.target.result;
      const imageUrl = URL.createObjectURL(new Blob([imageBlob], { type: 'image/jpeg' }));

      previewContainer.src = imageUrl;

    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("Please select an image first!");
  }
}


async function saveCardImage(num: number, name: string, img: HTMLImageElement, event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput?.files?.length) {
    const file = fileInput?.files[0];

    if (file) {
      const buff = await file.arrayBuffer();
      const data = new Uint8Array(buff);
      const mimeType = file.type;

      const imageUrl = URL.createObjectURL(new Blob([data], { type: mimeType }));
      img.src = imageUrl;
      img.parentNode.classList.add("card-image-full");

      sendMessage({ type: 'create-image-data', data: { data, mimeType, num, name } });
      fileInput.value = '';
    }
  }
}




function loadCardFields() {
  //cardFields = [{ "name": "Nombre", "type": "text" }, { "name": "Fuerza", "type": "text" }];
  const cardHeader = document.getElementById("cards-header");
  const cardsHeaderActions = document.getElementById("cards-header-actions");

  document.querySelectorAll('.card-header').forEach(e => e.remove());
  for (let i = 0; i < cardFields.length; i++) {
    let field = cardFields[i];
    let div = document.createElement("div");
    div.classList.add("card-header");
    if (field.type == "image") {
      div.classList.add("card-image");
    } else {
      div.classList.add("card-text");
    }
    div.innerText = field.name.substring(1);
    cardHeader?.insertBefore(div, cardsHeaderActions)
  }


  sendMessage({ type: 'load-cards-data', data: "" });
}


function reloadCardEntries() {
  document.querySelectorAll('.card-entry').forEach(e => e.remove());

  for (let i = 0; i < cardsData.length; i++) {
    let entry = createCardEntry(i + 1, cardsData[i]);
    cardList?.appendChild(entry);
  }
}

function showForgeCards(showForge: boolean) {
  if (showForge) {
    document.getElementById("cards-container")?.classList.add("hidden");
    document.getElementById("box-forge")?.classList.remove("hidden");
    document.getElementById("forge-type").value = "standard";
    document.getElementById("forge-cut-marks").value = "true";
    changeForgeType();
    changeCutMarks();
  } else {
    document.getElementById("cards-container")?.classList.remove("hidden");
    document.getElementById("box-forge")?.classList.add("hidden");
  }
}

function forgeCards() {
  let cutMarks = document.getElementById("forge-cut-marks").value;
  let type = document.getElementById("forge-type").value;

  sendMessage({ type: 'forge-cards', data: { cardsData: cardsData, type: type, cutMarks: cutMarks } });
}


function changeForgeType() {
  let text = document.getElementById("forge-explain-type")
  let value = document.getElementById("forge-type").value;
  if (value == "standard") {
    text.innerText = "It will generate a frame for each card, and an extra frame for the back.";
    document.getElementById("forge-cut-marks").disabled = false;
  } else if (value == "printplay") {
    text.innerText = "A4 pages with the cards. Cards with the front and the back joined, to cut them together and fold them by the joint.";
    document.getElementById("forge-cut-marks").disabled = false;
  } else {
    text.innerHTML = "It will generate a frame with a <a href='https://kb.tabletopsimulator.com/custom-content/custom-deck/' target='_blank'>card set for Tabletop Simulator</a>.";
    document.getElementById("forge-cut-marks").value = "false";
    document.getElementById("forge-cut-marks").disabled = true;
  }
  changeCutMarks();
}


function changeCutMarks() {
  let text = document.getElementById("forge-explain-marks");
  if (document.getElementById("forge-cut-marks").value == "true") {
    text.innerText = "Cut marks will be printed to indicate how to cut the cards.";
  } else {
    text.innerText = "Cut marks wont't be printed.";
  }
}

function initCards() {
  sendMessage({ type: 'load-card-fields', data: "" });
  document.getElementById("add-card")?.addEventListener("click", () => { addEmptyCard() });
  document.getElementById("forge-cards")?.addEventListener("click", () => { showForgeCards(true) });

  document.getElementById("box-forge-cancel")?.addEventListener("click", () => { showForgeCards(false) });
  document.getElementById("box-forge-ok")?.addEventListener("click", () => { forgeCards() });
  document.getElementById("forge-type")?.addEventListener("change", () => { changeForgeType() });
  document.getElementById("forge-cut-marks")?.addEventListener("change", () => { changeCutMarks() });
}


//////////////////////////// HELP

let helpPage = 0;
let helpTexts = document.querySelectorAll(".help-text");

function advanceHelp(num: number) {
  helpPage = (helpPage + num + 6) % 6;

  for (const element of helpTexts) {
    element.classList.add("hidden");
  }
  document.getElementById("help-text-" + helpPage)?.classList.remove("hidden");


  document.getElementById("help-num").innerText = (helpPage + 1) + "/6";

}

function initHelp() {
  helpPage = 0;
  advanceHelp(0);
  document.getElementById("box-help-prev")?.addEventListener("click", () => { advanceHelp(-1) });
  document.getElementById("box-help-next")?.addEventListener("click", () => { advanceHelp(1) });
}




//////////////////////////// ONLOAD

window.onload = (event) => {
  initMessageListener();
  initTabSelectors();
  initCreateDeck();
  initCards();
  initHelp();

  sendMessage({ type: 'is-page-empty', data: "" });
};