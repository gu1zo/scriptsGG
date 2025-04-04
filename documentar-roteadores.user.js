// ==UserScript==
// @name         Documentar Roteadores HUAWEI
// @version      2025-04-02
// @description  Coleta informações do roteador automaticamente em segundo plano
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/documentar-roteadores.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/documentar-roteadores.user.js
// @match        *://*/html/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
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
        await click('#internet > div');
        let dns1 = (await waitForElement('#wan_internet_dnsserverce_ctrl'))?.value || "Não encontrado";
        let dns2 = (await waitForElement('#wan_internet_bkdnsserverce_ctrl'))?.value || "Não encontrado";
        return `DNS WAN: ${dns1}, ${dns2}\nDNS LAN: ${dns1}, ${dns2}\n`;
    }

    async function get5G() {
        await click('#wifi > div');
        let wifi5G = await waitForElement('#dbhoOn_btnId') ? 'Habilitado' : 'Desabilitado';
        return `Priorizar 5G: ${wifi5G}`;
    }

    async function getUPNP() {
        await click('#more > div');
        await click('#upnp_menuId');
        let upnp = await waitForElement('#UpnpOn_btnId') ? 'Habilitado' : 'Desabilitado';
        return `UPNP: ${upnp}`;
    }

    async function getIPV6() {
        await click('#more > div');
        await click('#ipv6_menuId');
        let ipv6 = await waitForElement('#ipv6_on');
        if (ipv6) {
            let tipo = (await waitForElement('#ipv6_AddrType_ctrl_selectlist_parenselect'))?.innerText || "Desconhecido";
            return `IPv6 Habilitado: ${tipo}`;
        }
        return "IPv6: Desabilitado";
    }

    async function getWifi() {
        await click('#more > div');
        await click('#wifisettingsparent_menuId');
        let larg2_4 = (await waitForElement('#wifi_bind_set_ctrl_selectlist_parenselect'))?.innerText || "Não encontrado";
        let larg5g = (await waitForElement('#wifi_5gbind_set_ctrl_selectlist_parenselect'))?.innerText || "Não encontrado";
        let canal2_4 = (await waitForElement('#wifi_channel24g_ctrl_selectlist_parenselect'))?.innerText || "Não encontrado";
        let canal5g = (await waitForElement('#wifi_channel5g_ctrl_selectlist_parenselect'))?.innerText || "Não encontrado";
        return `Rede 2.4G - Largura: ${larg2_4} | Canal: ${canal2_4}\nRede 5G - Largura: ${larg5g} | Canal: ${canal5g}`;
    }

    async function getRouterFirmware() {
        await click('#more > div');
        await click('#deviceinfoparent_menuId');
        await delay(200);
        let name = (await waitForElement('#deviceinfo_view_data_edit_deviceinfo_product_name_label_ctrl'))?.innerText || "Não encontrado";
        let firmware = (await waitForElement('#deviceinfo_view_data_edit_deviceinfo_software_label_ctrl'))?.innerText || "Não encontrado";
        return `Modelo: ${name}\nFirmware: ${firmware}\n`;
    }

    async function getUptime() {
        await click('#home > div');
        await delay(500);
        let uptime = (await waitForElement('#index > div.home > div > div.hone_connect > div > div.system.fl.border_1px_right > p.content'))?.innerText || "Não encontrado";
        return `Uptime: ${uptime}`;
    }

    async function getRouter() {
        let mensagem = "[Configurações do Roteador]\n";
        mensagem += await getRouterFirmware();
        mensagem += await getDNS();
        mensagem += await get5G() + "\n";
        mensagem += await getUPNP() + "\n";
        mensagem += await getIPV6() + "\n";
        mensagem += await getWifi() + "\n";
        mensagem += await getUptime() + "\n";

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