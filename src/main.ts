
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
      //TODO Load image from card data
      img.src = "images/add_image.png"
      div.appendChild(img);

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

function initFields() {
  cardFields = [{ "name": "Nombre", "type": "text" }, { "name": "Fuerza", "type": "text" }];


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
      div.classList.add("card-img");
    } else {
      div.classList.add("card-text");
    }
    div.innerText = field.name;
    cardHeader?.insertBefore(div, cardsHeaderActions)
  }

}

function reloadCardEntries() {
  document.querySelectorAll('.card-entry').forEach(e => e.remove());

  for (let i = 0; i < cardsData.length; i++) {
    let entry = createCardEntry(i + 1, cardsData[i]);
    cardList?.appendChild(entry);
  }
}


function initCards() {
  initFields();
  sendMessage({ type: 'load-cards-data', data: "" });
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