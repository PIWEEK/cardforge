
import "./style.css";

import type {
  PluginUIEvent,
} from './model';


const tabSelectors = document.querySelectorAll('.tab-selector');
const tabs = document.querySelectorAll('.tab');


/*
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <p>CardForge</p>
    <button id="b01"></button>
  </div>
`;
*/







function createDeck(this: HTMLElement, ev: Event) {
  ev.preventDefault();
  let name = document.getElementById("create-deck-name")?.value;
  let size = document.getElementById("create-deck-size")?.value;
  let orientation = document.getElementById("create-deck-orientation")?.value;

  sendMessage({ type: 'create-deck', name: name, size: size, orientation: orientation })

}



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



function listenerFunction(this: HTMLElement, ev: Event) {
  ev.preventDefault();
  sendMessage({ type: 'duplicate' })
}


function sendMessage(message: PluginUIEvent) {
  parent.postMessage(message, '*');
}



function initMessageListener() {
  window.addEventListener("message", (event) => {
    console.log("received:");
    console.log(event);
    if (event.data == "ERROR_DECK_CREATE_PAGE_NOT_EMPTY") {


      createDeckShowError(true);
    }
  });
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

function initTabSelectors() {


  for (const element of tabSelectors) {
    element.addEventListener('click', () => {
      changeTab(element.dataset.tab)
    });
  }
  changeTab("create");
}


window.onload = (event) => {
  initMessageListener();
  initTabSelectors();
  initCreateDeck();
  console.log("page is fully loaded");
};