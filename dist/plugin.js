const w=[["Dixit (80 x 120 mm)",945,1417],["Tarot (70 x 120 mm)",827,1417],["French tarot (61 x 112 mm)",720,1323],["Wonder (65 x 100 mm)",768,1181],["Volcano (70 x 110 mm)",827,1299],["Euro (59 x 92 mm)",697,1086],["Asia (57,5 x 89 mm)",679,1051],["Standard (Poker) (63,5 x 88 mm)",750,1039],["USA (56 x 87 mm)",661,1027],["Square L (80x80 mm)",945,945],["Desert (50 x 75 mm)",590,886],["Square S (70 x 70 mm)",827,827],["Mini EURO (45 x 68 mm)",531,803],["Mini Asia (43 x 65 mm)",508,768],["Mini USA (41 x 63 mm)",484,744]];let u,I;penpot.ui.open("CardForge","",{width:1200,height:650});function W(){var i;let t=(i=penpot.currentPage)==null?void 0:i.getPluginData("cardsData");console.log("loaded cards data:",t),t&&penpot.ui.sendMessage({type:"CARDS_DATA",data:JSON.parse(t)})}function b(t){var i,n;return((i=t.name)==null?void 0:i.startsWith("#"))&&(t.type=="text"||t.type=="rectangle"&&((n=t.fills)==null?void 0:n.length)==1&&t.fills[0].fillImage)}function U(t,i){for(let n=0;n<t.children.length;n++){let e=t.children[n];if(b(e)){let a=e.type=="text"?"text":"image";i.push({name:e.name,type:a,id:e.id})}e.hasOwnProperty("children")&&U(e,i)}return i}function G(){var a;const t=(a=penpot.currentPage)==null?void 0:a.getShapeById("00000000-0000-0000-0000-000000000000"),i=E(t,"Front"),n=U(i,[]);penpot.ui.sendMessage({type:"CARD_FIELDS",data:{fields:n,assetsUrl:"https://design.penpot.app/assets/by-file-media-id/"}})}function E(t,i){var n;for(let e=0;e<t.children.length;e++){let a=t.children[e];if(a.hasOwnProperty("name")&&a.name===i)return a;if(((n=a.children)==null?void 0:n.length)>0){let l=E(a,i);if(l)return l}}}function V(t){if(penpot.currentPage){penpot.currentPage.name=t.name;const i=penpot.createBoard();i.name="_Images",i.y=-1e3,i.hidden=!0,u=penpot.createBoard(),u.name="Front";const n=penpot.createBoard();n.name="inside",n.borderRadius=50,n.strokes=[{strokeColor:"#000000",strokeStyle:"solid",strokeWidth:12,strokeAlignment:"inner"}];let e=parseInt(t.size),a=w[e][1],l=w[e][2];t.orientation=="landscape"&&(a=w[e][2],l=w[e][1]),u.resize(a,l),n.resize(a-48,l-48),n.x=24,n.y=24,u.appendChild(n),I=u.clone(),I.name="Back",I.x+=u.width+100,penpot.closePlugin()}}function j(t){var n;((n=penpot.currentPage)==null?void 0:n.getShapeById("00000000-0000-0000-0000-000000000000")).children.length==0?V(t):penpot.ui.sendMessage({type:"ERROR_DECK_CREATE_PAGE_NOT_EMPTY"})}function q(){var i;const t=(i=penpot.currentPage)==null?void 0:i.getShapeById("00000000-0000-0000-0000-000000000000");penpot.ui.sendMessage({type:"PAGE_EMPTY",data:t.children.length==0})}function H(t,i,n,e){penpot.uploadMediaData("image",t,i).then(a=>{var r,o;const l=penpot.createRectangle();l.resize(a.width,a.height),l.fills=[{fillOpacity:1,fillImage:a}],l.x=0,l.y=0,((r=penpot.currentPage)==null?void 0:r.findShapes({name:"_Images"})[0]).appendChild(l),penpot.ui.sendMessage({type:"IMAGE_CREATED",data:{num:n,name:e,id:(o=l.fills[0].fillImage)==null?void 0:o.id,imageId:l.id}})}).catch(a=>console.error(a))}function T(t,i,n){var a;const e=t.clone();e.name="card"+n.padStart(2,"0");for(const l in i)if(Object.prototype.hasOwnProperty.call(i,l)){const p=E(e,l);if(p)if(p.type==="text")p.characters=i[l];else{const r=i[l].split("|")[0],o=(a=penpot.currentPage)==null?void 0:a.getShapeById(r);o&&(p.fills=o.fills)}}return e}function v(t,i,n,e){return i.x=n,i.y=e,t.appendChild(i),n+=i.width,n+i.width>t.width&&(n=t.x,e+=i.height),[n,e]}function B(t,i=!0){let n=penpot.createBoard();n.name="cutMBoard",n.resize(t.width+200,t.height+200);let e=penpot.createRectangle();return e.resize(200,2),e.x=0,e.y=98,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=n.width-200,e.y=98,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=0,e.y=n.height-100,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=n.width-200,e.y=n.height-100,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=98,e.y=0,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=n.width-100,e.y=0,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=98,e.y=n.height-200,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=n.width-100,e.y=n.height-200,n.appendChild(e),i&&(t=t.clone()),t.x=100,t.y=100,n.appendChild(t),n}function L(t,i){const n=Math.floor(t.width/i.width),e=Math.floor(t.height/i.height);return n*e}function J(t,i,n){var k,A,O;console.log("start forgecards",i,n);let e=(k=penpot.currentPage)==null?void 0:k.findShapes({name:"Output"});e&&e.length>0&&e[0].remove();let a=(A=penpot.currentPage)==null?void 0:A.findShapes({name:"Front"})[0],l=(O=penpot.currentPage)==null?void 0:O.findShapes({name:"Back"})[0],p,r,o=null,m=null,c=a.x,s=a.y+a.height+400;if(r=penpot.createBoard(),r.name="Output",r.x=c,r.y=s,i=="standard"?(n&&(o=B(a),m=B(l),a=o,l=m),r.resize(a.width*(t.length+1),a.height)):i=="tabletop"&&r.resize(a.width*10,a.height*7),i=="tabletop"||i=="standard"){for(let h=0;h<t.length;h++)p=T(a,t[h],String(h+1)),[c,s]=v(r,p,c,s);p=l.clone(),p.x=r.width-p.width,p.y=r.y+r.height-p.height,r.appendChild(p)}else if(i=="printplay"){o=penpot.createBoard(),o.name="tmpFront",o.resize(a.width,a.height*2);let h=l.clone();h.rotate(180),o.appendChild(h),h.x=0,h.y=0;let y=a.clone();o.appendChild(y),y.x=0,y.y=y.height,n&&(o=B(o,!1)),a=o;let d,x,f,g,S=L({width:2480,height:3508},{width:a.width,height:a.height}),M=L({width:3508,height:2480},{width:a.width,height:a.height});console.log("fitPortrait ",S),console.log("fitLandscape ",M),S>=M?(f=2480,g=3508,x=S):(f=3508,g=2480,x=M);let F=Math.ceil(t.length/x),P=0;r.resize(f,(g+100)*F);let z=Math.floor(f/a.width),_=Math.floor(g/a.height),D=Math.floor((f-z*a.width)/(z+1)),N=Math.floor((g-_*a.height)/(_+1));for(let C=0;C<F;C++){d=penpot.createBoard(),d.name="Page "+String(C+1).padStart(2,"0"),d.resize(f,g),d.x=r.x,d.y=r.y+C*(g+100),c=d.x+D,s=d.y;for(let R=0;R<x&&(R%z==0&&(s+=N),p=T(a,t[P],String(P+1)),[c,s]=v(d,p,c,s),c+=D,P++,!(P>=t.length));R++);r.appendChild(d),console.log("page y "+d.y)}}o==null||o.remove(),m==null||m.remove(),penpot.closePlugin()}penpot.ui.onMessage(t=>{var i;if(console.log("[plugin] message: "),console.log(t),t.type==="create-deck")j(t);else if(t.type==="save-cards-data")(i=penpot.currentPage)==null||i.setPluginData("cardsData",JSON.stringify(t.data));else if(t.type==="load-cards-data")W();else if(t.type==="load-card-fields")G();else if(t.type==="create-image-data"){const{data:n,mimeType:e,num:a,name:l}=t.data;H(n,e,a,l)}else t.type==="forge-cards"?J(t.data.cardsData,t.data.type,t.data.cutMarks=="true"):t.type==="is-page-empty"&&q()});
