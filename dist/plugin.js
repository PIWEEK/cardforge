console.log("Hello from the plugin!");penpot.ui.open("CardForge","",{width:1200,height:650});function n(e){penpot.currentPage.name=e.name}function o(e){penpot.currentPage.getShapeById("00000000-0000-0000-0000-000000000000").children.length==0?n(e):penpot.ui.sendMessage("ERROR_DECK_CREATE_PAGE_NOT_EMPTY")}penpot.ui.onMessage(e=>{console.log("message: ",e),e.type,e.type==="create-deck"&&o(e)});
