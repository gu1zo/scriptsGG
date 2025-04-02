// ==UserScript==
// @name         Documentar ONT HUAWEI
// @version      2025-04-02
// @description  Coleta informações do roteador automaticamente em segundo plano
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/documentar-onu.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/documentar-onu.user.js
// @match        *://*/index.asp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=156.194
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            let el = document.querySelector(selector);
            if (el) return el;
            await delay(100);
        }
        return null;
    }

    async function click(selector) {
        let el = await waitForElement(selector);
        if (el) {
            el.click();
            await delay(500);
        }
    }

    async function getDNS() {
        await click('#landhcp');
        let dns1 = (await waitForElement('#dnsMainPri'))?.value || "Não encontrado";
        let dns2 = (await waitForElement('##dnsMainSec'))?.value || "Não encontrado";
        return `DNS WAN: ${dns1}, ${dns2}\nDNS LAN: ${dns1}, ${dns2}\n`;
    }
    async function getUPNP() {
        await click('#upnp');
        let upnp = await waitForElement('#Enable').checked ? 'Habilitado' : 'Desabilitado';
        return `UPNP: ${upnp}`;
    }

    async function getIPV6() {
        await click('#name_wanconfig');
        await click('#ipv6_menuId');
        let ipv6 = await waitForElement('#wanInstTable_0_3');

        return ipv6 +" Habilitado";
    }

    async function getWifi() {
        await click('#wlan2adv');
        let larg2_4 = (await waitForElement('#X_HW_HT20 option:checked'))?.innerText || "Não encontrado";
        let canal2_4 = (await waitForElement('#Channel option:checked'))?.innerText || "Não encontrado";
            
        await click('#wlan5adv');

        let larg5g = (await waitForElement('#X_HW_HT20 option:checked'))?.innerText || "Não encontrado";
        let canal5g = (await waitForElement('#Channel option:checked'))?.innerText || "Não encontrado";
        return `Rede 2.4G - Largura: ${larg2_4} | Canal: ${canal2_4}\nRede 5G - Largura: ${larg5g} | Canal: ${canal5g}`;
    }

    async function getRouterFirmware() {
        await click('#icon_Systeminfo');
        await click('#name_deviceinfo');
        let name = (await waitForElement('#td1_2'))?.innerText || "Não encontrado";
        let firmware = (await waitForElement('#td5_2'))?.innerText || "Não encontrado";
        return `Modelo: ${name}\nFirmware: ${firmware}\n`;
    }
    async function getRouter() {
        let mensagem = "[Configurações do Roteador]\n";
        mensagem += await getRouterFirmware();
        mensagem += await getDNS();
        mensagem += "Priorizar 5G Desabilitado \n";
        mensagem += await getUPNP() + "\n";
        mensagem += await getIPV6() + "\n";
        mensagem += await getWifi() + "\n";

        GM_setClipboard(mensagem);
        alert("Relatório copiado para a área de transferência!");
    }

    function watchForChanges() {
        const observer = new MutationObserver(async (mutations, obs) => {
            if (document.querySelector("#internet > div")) {
                console.log("Página carregada, coletando dados...");
                obs.disconnect(); // Para evitar execução repetida
                await getRouter();
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    // Iniciar monitoramento do DOM para carregar automaticamente quando a página estiver pronta
    watchForChanges();
})();