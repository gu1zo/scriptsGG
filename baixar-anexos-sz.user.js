// ==UserScript==
// @name         Baixar Imagens SZ.CHAT
// @version      2025-04-03
// @description  Baixa todas as imagens das conversas no SZ.Chat em um arquivo ZIP
// @author       Vogel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/baixar-anexos-sz.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/baixar-anexos-sz.user.js
// @match        *://*.ggnet.sz.chat/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        let container = document.querySelector(".tags-sessions");
        if (!container) return;

        let menu = container.querySelector(".menu.tags.ft-scroll");
        if (!menu) return;

        let button = document.createElement("a");
        button.setAttribute("data-v-5cbb963e", "");
        button.className = "item text-ellipsis";
        button.innerHTML = '<i data-v-5cbb963e class="icon tag"></i> Baixar Imagens';
        button.style.cursor = "pointer";
        button.addEventListener("click", processImages);

        menu.insertBefore(button, null); // Adiciona o botão no menu
    }

    function processImages() {
        let imageUrls = [];

        let listItems = document.querySelectorAll('#list_mensagens > ul > li');
        if (listItems.length === 0) {
            alert("Nenhuma mensagem encontrada.");
            return;
        }

        listItems.forEach((li) => {
            let imgElement = li.querySelector('span div div div div:nth-child(2) div div span a img');
            if (imgElement) {
                let imageUrl = imgElement.src;
                imageUrls.push(imageUrl);
            }
        });

        console.log("Imagens encontradas:", imageUrls);

        if (imageUrls.length > 0) {
            downloadImagesAndZip(imageUrls);
        } else {
            alert("Nenhuma imagem para baixar.");
        }
    }

    async function downloadImagesAndZip(imageUrls) {
        let zip = new JSZip();
        let count = 0;

        for (let imageUrl of imageUrls) {
            try {
                let response = await fetch(imageUrl);
                let blob = await response.blob();
                let filename = `imagem_${count + 1}.jpg`;

                zip.file(filename, blob);
                console.log(`Baixado ${count + 1}/${imageUrls.length}: ${imageUrl}`);
                count++;
            } catch (error) {
                console.error("Erro ao baixar a imagem:", imageUrl, error);
            }
        }

        zip.generateAsync({ type: "blob" }).then(content => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = "imagens.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Aguarda o carregamento da página e adiciona o botão
    setTimeout(addDownloadButton, 3000);
})();
