// The ID of the extension we want to talk to.
FireUI = {
    init: function () {
        this.fireUIextensionId = "ibigfneolgnigobkpdfnjhboppgghlem";
        chrome.runtime.sendMessage( this.fireUIextensionId, {request: "FireUI"}, this.initFireUI );
    },
    initFireUI: function (data) {
        if ('success' in data) {
            let randomNumber = Math.floor(Math.random() * 50000);
            FireUI = data.success;
            console.log('FireUI: version = ' + FireUI.version);
            console.log('FireUI: enabled modules = ' + JSON.stringify(FireUI.enabledModules));
            FireUI.enabledModulesPathsCSS.forEach(function(item, i, arr) {
                $('head').append('<link rel="stylesheet" href="' + item + '?v=' + randomNumber + '" type="text/css" />');
            });

            //require addons
            require.config({
                baseUrl: FireUI.addonsBaseUrl,
                enforceDefine: true,
                paths: FireUI.reuireModules.paths,
                waitSeconds: 15
            });

            //загрузка настроек
            FireUI.ZagorodRandomState = localStorage.getItem('zagorodRandomButton');
            FireUI.ZagorodNPCState = localStorage.getItem('zagorodNPCButton');
            FireUI.ZagorodItemsState = localStorage.getItem('zagorodItemsButton');
            FireUI.zagorodAutobattleState = localStorage.getItem('zagorodAutobattleButton');

            let dataChatLog = localStorage.getItem('chatHistory');
            if (dataChatLog === null) {
                //FireUI.chatLog = FireUI.chatLog;   
            }   else {
                dataChatLog = dataChatLog.replaceAll('>,<', '>||<');
                dataChatLog = dataChatLog.split('||');
                for (let i = 0; i < dataChatLog.length; i++) {
                    FireUI.chatLog.push(dataChatLog[i]);
                }                   
            }
            //end load settings


            require(FireUI.reuireModules.modules, function () {
              console.log('FireUI: Enabled modules have been loaded using require.js')
            });

        }
    }
}

FireUI.init();
