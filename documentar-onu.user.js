// ==UserScript==
// @name         Documentar ONT HUAWEI
// @version      2025-04-02
// @description  Coleta informações do roteador automaticamente em segundo plano
// @author       Vogel
// @downloadURL  https://github.com/gu1zo/scriptsGG/blob/main/documentar-onu.user.js
// @updateURL    https://github.com/gu1zo/scriptsGG/blob/main/documentar-onu.user.js
// @match        *://*/index.asp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @grant        GM_setClipboard
// ==/UserScript==
(function() {
    'use strict';

    async function getRouter() {
        let mensagem = 
`[Configurações do Roteador]
Modelo: ONT HUAWEI  
Firmware:
DNS WAN:
DNS LAN:
Priorizar 5G:
UPNP:
IPv6 Habilitado:
Rede 2.4G - Largura: MHz | Canal:
Rede 5G - Largura: MHz | Canal:
Uptime: `;

        GM_setClipboard(mensagem);
        alert("Relatório copiado para a área de transferência!");
    }

    getRouter()
})();