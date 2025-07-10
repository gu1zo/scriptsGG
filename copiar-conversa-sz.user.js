// ==UserScript==
// @name         Copiar as conversas SZ.CHAT
// @version      2025-04-03
// @description  Copia as conversas do SZ.Chat
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user.js
// @match        *://*.clusterscpr.sz.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
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

        GM_setClipboard(resultString.trim());
        alert("Conversas copiadas para a área de transferência!");
    }

    function addCopyButton() {
        let container = document.querySelector(".tags-sessions");
        if (!container) return;

        let menu = container.querySelector(".menu.tags.ft-scroll");
        if (!menu) return;

        let button = document.createElement("a");
        button.setAttribute("data-v-5cbb963e", "");
        button.className = "item text-ellipsis";
        button.innerHTML = '<i data-v-5cbb963e class="icon tag"></i> Copiar Conversa';
        button.style.cursor = "pointer";
        button.addEventListener("click", processListItems);

        menu.insertBefore(button, null); // Adiciona o botão como último filho da div
    }

    addCopyButton();
})();
