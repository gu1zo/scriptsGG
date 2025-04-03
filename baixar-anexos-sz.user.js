// ==UserScript==
// @name         Baixar Imagens SZ.CHAT
// @version      2025-04-03
// @description  Baixa todas as imagens das conversas no SZ.Chat em um arquivo ZIP
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/baixar-anexos-sz.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/baixar-anexos-sz.user.js
// @match        *://*.ggnet.sz.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=156.194
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    async function downloadImage(url) {
        const response = await fetch(url);
        return response.blob();
    }

    async function collectImages() {
        let images = document.querySelectorAll("#list_mensagens ul li img");
        if (images.length === 0) {
            alert("Não há imagens para baixar.");
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder("imagens");
        let count = 0;

        for (let img of images) {
            try {
                const blob = await downloadImage(img.src);
                folder.file(`imagem_${count}.jpg`, blob);
                count++;
            } catch (error) {
                console.error("Erro ao baixar imagem:", img.src, error);
            }
        }

        if (count > 0) {
            zip.generateAsync({ type: "blob" }).then((content) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "imagens.zip";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        } else {
            alert("Não foi possível baixar nenhuma imagem.");
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
