// ==UserScript==
// @name         Documentar ONU INT6
// @version      2025-07-01
// @description  Coleta informações da ONU automaticamente em segundo plano
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/ALT-documentar-onu.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/ALT-documentar-onu.user.js
// @match        https://autoisp.acessoline.net.br/contracted_services/*
// @match        https://autoisp.acessoline.net.br/gpon_clients/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(xpath, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const el = result.singleNodeValue;
            if (el) return el;
            await delay(100);
        }
        return null;
    }

    async function getNome() {
        const el = await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[1]/div/div/table[2]/tbody/tr[6]/td/div/div/span/div/div');
        return `Cliente sobe em OLT: ${el?.innerText.trim() || "Não encontrado"}\n`;
    }

    async function getOLT() {
        const olt = (await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[1]/div/div/table[2]/tbody/tr[1]/td/a'))?.innerText.trim() || "Não encontrado";
        const pon = (await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[1]/div/div/table[2]/tbody/tr[2]/td/div'))?.innerText.trim() || "Não encontrado";
        const id = (await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[1]/div/div/table[2]/tbody/tr[3]/td/div'))?.innerText.trim() || "Não encontrado";
        return `ONU está localizada em: ${olt} ${pon} ONU ${id}\n`;
    }

    async function getModelo() {
        const modelo = (await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/table[1]/tbody/tr[7]/td/div/text()'))?.textContent.trim() || "Não encontrado";
        const fw = (await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/table[1]/tbody/tr[8]/td/div'))?.innerText.trim() || "Não encontrado";
        return `Modelo da ONU: ${modelo} Firmware: ${fw}\n`;
    }

    async function getSinal() {
        let el = await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/table[1]/tbody/tr[4]/td/div');
        const sa = el?.innerText.trim();
        el = await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/table[1]/tbody/tr[5]/td/div/text()');
        const sr = el?.textContent.trim();
        return `SA: ${sa || "Não encontrado"}\nSR: ${sr || "Não encontrado"}\n`;
    }
    async function getNegociacao() {
        const el = await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/p/table/tr/td[3]');
        return `Negociação em: ${el?.innerText.trim() || "Não encontrado"} Mbps\n`;
    }

    async function getUptime() {
        const el = await waitForElement('/html/body/div[5]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div[2]/div/div/div/div/div/table[1]/tbody/tr[9]/td/div');
        return `Uptime: ${el?.innerText.trim() || "Não encontrado"}\n`;
    }

    async function getOnu() {
        let mensagem = "[Configurações da ONU]\n";
        mensagem += await getNome();
        mensagem += await getOLT();
        mensagem += await getModelo();
        mensagem += await getSinal();
        mensagem += await getNegociacao();
        mensagem += await getUptime();

        try {
            await navigator.clipboard.writeText(mensagem);
            alert("Relatório copiado para a área de transferência!");
        } catch (err) {
            alert("Erro ao copiar para a área de transferência: " + err);
        }
    }

    async function addCustomButton() {
        await delay(2000); // tempo para carregar o DOM

        const targetDiv = document.querySelector('.general-buttons-wrapper.card-body');
        if (!targetDiv) {
            console.error("Div de botões não encontrada.");
            return;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<i class="fa fa-copy icon-with-text"></i>Copiar ONU';
        button.className = 'button-from-general btn btn-primary';

        button.addEventListener('click', () => {
            getOnu();
        });

        targetDiv.appendChild(button);
    }

    window.addEventListener('load', addCustomButton);
})();
