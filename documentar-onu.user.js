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
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function getElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return result ? result.textContent : null;
    }
    
    async function click(selector){
        await document.querySelector(selector).click();
        await delay(1000);
    }
    function getDNS(){
        return "DNS WAN: \nDNS LAN: \n";
    }

    async function getRouterFirmware(){
        await click('#name_deviceinfo');

        let name = await getElementByXPath('/html/body/form/div/table/tbody/tr[2]/td[2]');
        let fw = await getElementByXPath('/html/body/form/div/table/tbody/tr[7]/td[2]');

        return `Modelo: ${name}\nFirmware: ${fw}\n`;
    }
getRouterFirmware();