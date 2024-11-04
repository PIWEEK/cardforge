const w=[["Dixit (80 x 120 mm)",945,1417],["Tarot (70 x 120 mm)",827,1417],["French tarot (61 x 112 mm)",720,1323],["Wonder (65 x 100 mm)",768,1181],["Volcano (70 x 110 mm)",827,1299],["Euro (59 x 92 mm)",697,1086],["Asia (57,5 x 89 mm)",679,1051],["Standard (Poker) (63,5 x 88 mm)",750,1039],["USA (56 x 87 mm)",661,1027],["Square L (80x80 mm)",945,945],["Desert (50 x 75 mm)",590,886],["Square S (70 x 70 mm)",827,827],["Mini EURO (45 x 68 mm)",531,803],["Mini Asia (43 x 65 mm)",508,768],["Mini USA (41 x 63 mm)",484,744]];let m,R;penpot.ui.open("CardForge","",{width:1200,height:650});function B(){let t=penpot.currentPage.getPluginData("cardsData");console.log("loaded cards data:",t);let a=JSON.parse(t);penpot.ui.sendMessage({type:"CARDS_DATA",data:a})}function L(t){var a,n;return((a=t.name)==null?void 0:a.startsWith("#"))&&(t.type=="text"||t.type=="rect"&&((n=t.fills)==null?void 0:n.length)==1&&t.fills[0].fillImage)}function T(t,a){for(let n=0;n<t.children.length;n++){let e=t.children[n];if(L(e)){let i=e.type=="text"?"text":"image";a.push({name:e.name,type:i,id:e.id})}e.hasOwnProperty("children")&&T(e,a)}return a}function U(){const t=penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000"),a=E(t,"Front"),n=T(a,[]);penpot.ui.sendMessage({type:"CARD_FIELDS",data:{fields:n,assetsUrl:"https://early.penpot.dev/assets/by-file-media-id/"}})}function E(t,a){var n;for(let e=0;e<t.children.length;e++){let i=t.children[e];if(i.hasOwnProperty("name")&&i.name===a)return i;if(((n=i.children)==null?void 0:n.length)>0){let l=E(i,a);if(l)return l}}}function N(t){penpot.currentPage.name=t.name;const a=penpot.createFrame();a.name="_Images",a.y=-1e3,a.hidden=!0,m=penpot.createFrame(),m.name="Front";const n=penpot.createFrame();n.name="inside",n.borderRadius=50,n.strokes=[{strokeColor:"#000000",strokeStyle:"solid",strokeWidth:12,strokeAlignment:"inner"}];let e=parseInt(t.size),i=w[e][1],l=w[e][2];t.orientation=="landscape"&&(i=w[e][2],l=w[e][1]),m.resize(i,l),n.resize(i-48,l-48),n.x=24,n.y=24,m.appendChild(n),R=m.clone(),R.name="Back",R.x+=m.width+100,penpot.closePlugin()}function W(t){penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000").children.length==0?N(t):penpot.ui.sendMessage({type:"ERROR_DECK_CREATE_PAGE_NOT_EMPTY"})}function G(){const t=penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000");penpot.ui.sendMessage({type:"PAGE_EMPTY",data:t.children.length==0})}function V(t,a,n,e){penpot.uploadMediaData("image",t,a).then(i=>{var r;const l=penpot.createRectangle();l.resize(i.width,i.height),l.fills=[{fillOpacity:1,fillImage:i}],l.x=0,l.y=0,penpot.currentPage.findShapes({name:"_Images"})[0].appendChild(l),penpot.ui.sendMessage({type:"IMAGE_CREATED",data:{num:n,name:e,id:(r=l.fills[0].fillImage)==null?void 0:r.id,imageId:l.id}})}).catch(i=>console.error(i))}function _(t,a,n){let e=t.clone();e.name="card"+n.padStart(2,"0");for(var i in a)if(a.hasOwnProperty(i)){let l=E(e,i);if(l.type=="text")l.characters=a[i];else{let o=a[i].split("|")[0],r=penpot.currentPage.getShapeById(o);l.fills=r.fills}}return e}function D(t,a,n,e){return a.x=n,a.y=e,t.appendChild(a),n+=a.width,n+a.width>t.width&&(n=t.x,e+=a.height),[n,e]}function I(t,a=!0){let n=penpot.createFrame();n.name="cutMFrame",n.resize(t.width+200,t.height+200);let e=penpot.createRectangle();return e.resize(200,2),e.x=0,e.y=98,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=n.width-200,e.y=98,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=0,e.y=n.height-100,n.appendChild(e),e=penpot.createRectangle(),e.resize(200,2),e.x=n.width-200,e.y=n.height-100,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=98,e.y=0,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=n.width-100,e.y=0,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=98,e.y=n.height-200,n.appendChild(e),e=penpot.createRectangle(),e.resize(2,200),e.x=n.width-100,e.y=n.height-200,n.appendChild(e),a&&(t=t.clone()),t.x=100,t.y=100,n.appendChild(t),n}function b(t,a){const n=Math.floor(t.width/a.width),e=Math.floor(t.height/a.height);return n*e}function q(t,a,n){console.log("start forgecards",a,n);let e=penpot.currentPage.findShapes({name:"Output"});e.length>0&&e[0].remove();let i=penpot.currentPage.findShapes({name:"Front"})[0],l=penpot.currentPage.findShapes({name:"Back"})[0],o,r,d,u,c=i.x,s=i.y+i.height+400;if(r=penpot.createFrame(),r.name="Output",r.x=c,r.y=s,a=="standard"?(n&&(d=I(i),u=I(l),i=d,l=u),r.resize(i.width*(t.length+1),i.height)):a=="tabletop"&&r.resize(i.width*10,i.height*7),a=="tabletop"||a=="standard"){for(let h=0;h<t.length;h++)o=_(i,t[h],String(h+1)),[c,s]=D(r,o,c,s);o=l.clone(),o.x=r.width-o.width,o.y=r.y+r.height-o.height,r.appendChild(o)}else if(a=="printplay"){d=penpot.createFrame(),d.name="tmpFront",d.resize(i.width,i.height*2);let h=l.clone();h.rotate(180),d.appendChild(h),h.x=0,h.y=0;let y=i.clone();d.appendChild(y),y.x=0,y.y=y.height,n&&(d=I(d,!1)),i=d;let p,x,f,g,S=b({width:2480,height:3508},{width:i.width,height:i.height}),M=b({width:3508,height:2480},{width:i.width,height:i.height});console.log("fitPortrait ",S),console.log("fitLandscape ",M),S>=M?(f=2480,g=3508,x=S):(f=3508,g=2480,x=M);let k=Math.ceil(t.length/x),C=0;r.resize(f,(g+100)*k);let z=Math.floor(f/i.width),A=Math.floor(g/i.height),O=Math.floor((f-z*i.width)/(z+1)),v=Math.floor((g-A*i.height)/(A+1));for(let P=0;P<k;P++){p=penpot.createFrame(),p.name="Page "+String(P+1).padStart(2,"0"),p.resize(f,g),p.x=r.x,p.y=r.y+P*(g+100),c=p.x+O,s=p.y;for(let F=0;F<x&&(F%z==0&&(s+=v),o=_(i,t[C],String(C+1)),[c,s]=D(p,o,c,s),c+=O,C++,!(C>=t.length));F++);r.appendChild(p),console.log("page y "+p.y)}}d==null||d.remove(),u==null||u.remove(),penpot.closePlugin()}penpot.ui.onMessage(t=>{if(console.log("[plugin] message: "),console.log(t),t.type==="create-deck")W(t);else if(t.type==="save-cards-data")penpot.currentPage.setPluginData("cardsData",JSON.stringify(t.data));else if(t.type==="load-cards-data")B();else if(t.type==="load-card-fields")U();else if(t.type==="create-image-data"){const{data:a,mimeType:n,num:e,name:i}=t.data;V(a,n,e,i)}else t.type==="forge-cards"?q(t.data.cardsData,t.data.type,t.data.cutMarks=="true"):t.type==="is-page-empty"&&G()});
