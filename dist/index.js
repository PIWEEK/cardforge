(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function d(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=d(a);fetch(a.href,r)}})();let b="";function g(e){parent.postMessage(e,"*")}function A(){window.addEventListener("message",e=>{console.log("[main] received:"),console.log(e),e.data.type=="ERROR_DECK_CREATE_PAGE_NOT_EMPTY"?C(!0):e.data.type=="CARDS_DATA"?R(e.data.data):e.data.type=="CARD_FIELDS"?(b=e.data.data.assetsUrl,m=e.data.data.fields,H()):e.data.type=="IMAGE_CREATED"?_(e.data.data.num,e.data.data.name,e.data.data.id,e.data.data.imageId):e.data.type=="PAGE_EMPTY"&&(e.data.data?v("create"):v("cards"))})}const k=document.querySelectorAll(".tab-selector"),w=document.querySelectorAll(".tab");function v(e){var t,d;for(const n of k)n.classList.remove("current");(t=document.getElementById("ts-"+e))==null||t.classList.add("current");for(const n of w)n.classList.add("hidden");(d=document.getElementById("tab-"+e))==null||d.classList.remove("hidden"),L(!1)}function M(){for(const e of k)e.addEventListener("click",()=>{v(e.dataset.tab)})}const B=[["Dixit (80 x 120 mm)",945,1417],["Tarot (70 x 120 mm)",827,1417],["French tarot (61 x 112 mm)",720,1323],["Wonder (65 x 100 mm)",768,1181],["Volcano (70 x 110 mm)",827,1299],["Euro (59 x 92 mm)",697,1086],["Asia (57,5 x 89 mm)",679,1051],["Standard (Poker) (63,5 x 88 mm)",750,1039],["USA (56 x 87 mm)",661,1027],["Square L (80x80 mm)",945,945],["Desert (50 x 75 mm)",590,886],["Square S (70 x 70 mm)",827,827],["Mini EURO (45 x 68 mm)",531,803],["Mini Asia (43 x 65 mm)",508,768],["Mini USA (41 x 63 mm)",484,744]];function O(e){var a,r,c;e.preventDefault();let t=(a=document.getElementById("create-deck-name"))==null?void 0:a.value,d=(r=document.getElementById("create-deck-size"))==null?void 0:r.value,n=(c=document.getElementById("create-deck-orientation"))==null?void 0:c.value;g({type:"create-deck",name:t,size:d,orientation:n,data:null})}function C(e){var t,d,n,a;e?((t=document.getElementById("box-create-error"))==null||t.classList.remove("hidden"),(d=document.getElementById("box-create"))==null||d.classList.add("hidden")):((n=document.getElementById("box-create-error"))==null||n.classList.add("hidden"),(a=document.getElementById("box-create"))==null||a.classList.remove("hidden"))}function D(){let e=document.getElementById("create-deck-size");e.innerHTML="";let t;for(let d=0;d<B.length;d++)t=document.createElement("option"),t.value=""+d,t.innerText=B[d][0],e==null||e.appendChild(t);e.value=7}function P(){var e,t;(e=document.getElementById("create-deck-frm"))==null||e.addEventListener("submit",O),(t=document.getElementById("box-create-error-close"))==null||t.addEventListener("click",()=>{C(!1)}),D()}const u=document.getElementById("card-list");let m=[],i=[];function y(){g({type:"save-cards-data",data:JSON.stringify(i)})}function _(e,t,d,n){i[e-1][t]=n+"|"+d,y()}function R(e){e&&(i=JSON.parse(e),I())}function T(e,t){let d=document.createElement("div");d.classList.add("card-entry"),d.id="card-entry-"+e;let n=document.createElement("div");n.classList.add("card-actions");let a=document.createElement("div");a.classList.add("card-action-copy"),a.addEventListener("click",()=>{F(e)}),n.appendChild(a);let r=document.createElement("div");r.classList.add("card-action-delete"),r.addEventListener("click",()=>{q(e)}),n.appendChild(r);let c=document.createElement("div");c.classList.add("card-num"),c.innerText=String(e).padStart(2,"0"),d.appendChild(c);for(let s=0;s<m.length;s++)if(m[s].type=="text"){let o=document.createElement("div");o.classList.add("card-text");let l=document.createElement("input");t.hasOwnProperty(m[s].name)&&(l.value=t[m[s].name]),l.addEventListener("blur",()=>{N(e,m[s].name,l.value)}),o.appendChild(l),d.appendChild(o)}else{let o=document.createElement("div");o.classList.add("card-image");let l=document.createElement("img"),f=document.createElement("input");if(f.type="file",f.accept="image/*",o.appendChild(f),t.hasOwnProperty(m[s].name)){let E=t[m[s].name].split("|")[1];l.src=b+E,o.classList.add("card-image-full")}else l.src="images/add_image.png";o.appendChild(l),l.addEventListener("click",()=>{f.click()}),f.addEventListener("change",E=>{z(e,m[s].name,l,E)}),d.appendChild(o)}return d.appendChild(n),d}function U(){let e={};i.push(e);let t=T(i.length,e);u==null||u.appendChild(t),y(),u.scrollTop=u==null?void 0:u.scrollHeight}function q(e){i.splice(e-1,1),y(),I()}function F(e){let t=structuredClone(i[e-1]);i.splice(e-1,0,t),y(),I()}function N(e,t,d){i[e-1][t]=d,y()}async function z(e,t,d,n){var r;const a=n.target;if((r=a==null?void 0:a.files)!=null&&r.length){const c=a==null?void 0:a.files[0];if(c){const s=await c.arrayBuffer(),o=new Uint8Array(s),l=c.type,f=URL.createObjectURL(new Blob([o],{type:l}));d.src=f,d.parentNode.classList.add("card-image-full"),g({type:"create-image-data",data:{data:o,mimeType:l,num:e,name:t}}),a.value=""}}}function H(){const e=document.getElementById("cards-header"),t=document.getElementById("cards-header-actions");document.querySelectorAll(".card-header").forEach(d=>d.remove());for(let d=0;d<m.length;d++){let n=m[d],a=document.createElement("div");a.classList.add("card-header"),n.type=="image"?a.classList.add("card-image"):a.classList.add("card-text"),a.innerText=n.name.substring(1),e==null||e.insertBefore(a,t)}g({type:"load-cards-data",data:""})}function I(){document.querySelectorAll(".card-entry").forEach(e=>e.remove());for(let e=0;e<i.length;e++){let t=T(e+1,i[e]);u==null||u.appendChild(t)}}function L(e){var t,d,n,a;e?((t=document.getElementById("cards-container"))==null||t.classList.add("hidden"),(d=document.getElementById("box-forge"))==null||d.classList.remove("hidden"),document.getElementById("forge-type").value="standard",document.getElementById("forge-cut-marks").value="true",S(),x()):((n=document.getElementById("cards-container"))==null||n.classList.remove("hidden"),(a=document.getElementById("box-forge"))==null||a.classList.add("hidden"))}function j(){let e=document.getElementById("forge-cut-marks").value,t=document.getElementById("forge-type").value;g({type:"forge-cards",data:{cardsData:i,type:t,cutMarks:e}})}function S(){let e=document.getElementById("forge-explain-type"),t=document.getElementById("forge-type").value;t=="standard"?(e.innerText="It will generate a frame for each card, and an extra frame for the back.",document.getElementById("forge-cut-marks").disabled=!1):t=="printplay"?(e.innerText="A4 pages with the cards. Cards with the front and the back joined, to cut them together and fold them by the joint.",document.getElementById("forge-cut-marks").disabled=!1):(e.innerHTML="It will generate a frame with a <a href='https://kb.tabletopsimulator.com/custom-content/custom-deck/' target='_blank'>card set for Tabletop Simulator</a>.",document.getElementById("forge-cut-marks").value="false",document.getElementById("forge-cut-marks").disabled=!0),x()}function x(){let e=document.getElementById("forge-explain-marks");document.getElementById("forge-cut-marks").value=="true"?e.innerText="Cut marks will be printed to indicate how to cut the cards.":e.innerText="Cut marks wont't be printed."}function G(){var e,t,d,n,a,r;g({type:"load-card-fields",data:""}),(e=document.getElementById("add-card"))==null||e.addEventListener("click",()=>{U()}),(t=document.getElementById("forge-cards"))==null||t.addEventListener("click",()=>{L(!0)}),(d=document.getElementById("box-forge-cancel"))==null||d.addEventListener("click",()=>{L(!1)}),(n=document.getElementById("box-forge-ok"))==null||n.addEventListener("click",()=>{j()}),(a=document.getElementById("forge-type"))==null||a.addEventListener("change",()=>{S()}),(r=document.getElementById("forge-cut-marks"))==null||r.addEventListener("change",()=>{x()})}let p=0,J=document.querySelectorAll(".help-text");function h(e){var t;p=(p+e+6)%6;for(const d of J)d.classList.add("hidden");(t=document.getElementById("help-text-"+p))==null||t.classList.remove("hidden"),document.getElementById("help-num").innerText=p+1+"/6"}function K(){var e,t;p=0,h(0),(e=document.getElementById("box-help-prev"))==null||e.addEventListener("click",()=>{h(-1)}),(t=document.getElementById("box-help-next"))==null||t.addEventListener("click",()=>{h(1)})}window.onload=e=>{A(),M(),P(),G(),K(),g({type:"is-page-empty",data:""})};
