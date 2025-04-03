// ==UserScript==
// @name         Copiar as conversas SZ.CHAT
// @version      2025-04-03
// @description  Copia as conversas do SZ.Chat
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/copiar-conversa-sz.user.js
// @match        *://*.ggnet.sz.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=156.194
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// ==/UserScript==

(function() {
    'use strict';

    async function collectImages() {
        let images = document.querySelectorAll("#list_mensagens img");
        if (images.length === 0) {
            alert("Não há imagens para baixar.");
            return;
        }

        let zip = new JSZip();
        let count = 0;

        for (let img of images) {
            try {
                let response = await fetch(img.src);
                let blob = await response.blob();
                zip.file(`imagem_${count + 1}.jpg`, blob);
                count++;
            } catch (error) {
                console.error("Erro ao baixar a imagem:", img.src, error);
            }
        }

        if (count > 0) {
            let zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "imagens_sz_chat.zip");
        } else {
            alert("Erro ao gerar o ZIP das imagens.");
        }
    }

    function addDownloadButton() {
        let container = document.querySelector(".tags-sessions");
        if (!container) return;

        let menu = container.querySelector(".menu.tags.ft-scroll");
        if (!menu) return;

        let button = document.createElement("a");
        button.setAttribute("data-v-5cbb963e", "");
        button.className = "item text-ellipsis";
        button.innerHTML = '<i class="bi bi-download"></i> Baixar Imagens';
        button.style.cursor = "pointer";
        button.addEventListener("click", collectImages);

        menu.appendChild(button);
    }

    addDownloadButton();
})();
