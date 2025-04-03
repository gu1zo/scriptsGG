// ==UserScript==
// @name         Copiar as conversas SZ.CHAT
// @version      2025-04-03
// @description  Copia as conversas do SZ.Chat
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user
// @match        https://ggnet.sz.chat/user/agent#
// @icon         https://www.google.com/s2/favicons?sz=64&domain=156.194
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    function getXPathValue(xpath) {
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (!result.singleNodeValue) return null;
        
        let img = result.singleNodeValue.querySelector("img");
        return img ? img.src : result.singleNodeValue.textContent.trim();
    }
    
    function expandFullText(liIndex) {
        return new Promise((resolve) => {
            let readMoreXPath = `/html/body/div[1]/main/div[3]/div/div/div/ul/li[${liIndex}]/span/div[1]/div/div[1]/div[2]/div/div[1]/a`;
            let readMoreElement = document.evaluate(readMoreXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (readMoreElement) {
                readMoreElement.click();
                setTimeout(() => resolve(), 500); // Aguarda 500ms para o conteúdo carregar
            } else {
                resolve();
            }
        });
    }
    
    async function processListItems() {
        let listItems = document.querySelectorAll("#list_mensagens > ul > li");
        console.log("Total de LIs:", listItems.length);
        
        let resultString = "";
        
        for (let index = 0; index < listItems.length; index++) {
            let liIndex = index + 1;
            await expandFullText(liIndex);
            
            let xpath1 = `/html/body/div[1]/main/div[3]/div/div/div/ul/li[${liIndex}]/span/div[1]/div/div[1]/div[1]/div[1]/div`;
            let xpath2 = `/html/body/div[1]/main/div[3]/div/div/div/ul/li[${liIndex}]/span/div[1]/div/div[1]/div[2]/div/div[1]/span`;
            
            let value1 = getXPathValue(xpath1) || "";
            let value2 = getXPathValue(xpath2) || "";
            
            resultString += `${value1}\n${value2}\n\n`;
        }
        
        console.log(resultString.trim());
    }
    
    let mensagem = processListItems();
    

        GM_setClipboard(mensagem);
})();