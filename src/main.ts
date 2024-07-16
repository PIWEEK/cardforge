
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
    console.log("received:");
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
      updateImageInfo(event.data.data.num, event.data.data.name, event.data.data.id);
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

}

function initTabSelectors() {
  for (const element of tabSelectors) {
    element.addEventListener('click', () => {
      changeTab(element.dataset.tab)
    });
  }
  changeTab("cards");
}


///////////////////////////// CREATE DECK

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

function initCreateDeck() {
  document.getElementById("create-deck-frm")?.addEventListener("submit", createDeck);
  document.getElementById("box-create-error-close")?.addEventListener("click", () => { createDeckShowError(false) });
}



////////////////////////////// CARDS

const cardList = document.getElementById("card-list");
let cardFields: CardField[] = [];
let cardsData: any[] = [];


function saveCardsData() {
  sendMessage({ type: 'save-cards-data', data: JSON.stringify(cardsData) });
}

function updateImageInfo(num: number, name: string, id: string) {
  cardsData[num - 1][name] = id;
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
        img.src = assetsUrl + cardData[cardFields[i].name];
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
  console.log(cardsData);
  cardsData.push(cardData);
  let entry = createCardEntry(cardsData.length, cardData);
  cardList?.appendChild(entry);
  saveCardsData();
  cardList.scrollTop = cardList?.scrollHeight;
}

function deleteCard(num: number) {
  cardsData.splice((num - 1), 1);
  reloadCardEntries();
}

function copyCard(num: number) {
  let card = structuredClone(cardsData[num - 1]);
  cardsData.splice(num - 1, 0, card);

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

      sendMessage({ type: 'create-image-data', data: { data, mimeType, num, name } });
      fileInput.value = '';
    }
  }
}




function loadCardFields() {
  //cardFields = [{ "name": "Nombre", "type": "text" }, { "name": "Fuerza", "type": "text" }];
  const cardHeader = document.getElementById("cards-header");
  const cardsHeaderActions = document.getElementById("cards-header-actions");

  console.log("cardHeader", cardHeader);
  console.log("cardsHeaderActions", cardsHeaderActions);

  document.querySelectorAll('.card-header').forEach(e => e.remove());
  for (let i = 0; i < cardFields.length; i++) {
    let field = cardFields[i];
    console.log(field);
    let div = document.createElement("div");
    div.classList.add("card-header");
    if (field.type == "image") {
      div.classList.add("card-image");
    } else {
      div.classList.add("card-text");
    }
    div.innerText = field.name;
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


function initCards() {
  sendMessage({ type: 'load-card-fields', data: "" });
  document.getElementById("add-card")?.addEventListener("click", () => { addEmptyCard() });
}



//////////////////////////// ONLOAD

window.onload = (event) => {
  initMessageListener();
  initTabSelectors();
  initCreateDeck();
  initCards();
  console.log("page is fully loaded");
};