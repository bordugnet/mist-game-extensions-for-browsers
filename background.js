//notify that browser reached service worker
console.log('FireUI: Background service worker loaded');
//declare FireUI object
var FireUI = {
    version: "1.1.1.1",
    enabledModules: [],
    enabledModulesPathsCSS: [],
    reuireModules: {
        paths: {},
        modules: [],
    },
    ZagorodRandomState: 0, 
    ZagorodItemsState: 1,
    ZagorodNPCState: 0,
    zagorodAutobattleState: 0, 
    catchMyNickState: 1, 
    chatLog: [], 
    coordWayRan: '00:00',
    addonsBaseUrl: chrome.runtime.getURL('addons/'),
    paths: {
        hugeCssMod: {
            js: '',
            css: 'hugeCssMod/addon.css'
        },
        customBackground: {
            js: '',
            css: 'customBackground/addon.css'
        },
        effectsExtendedInfo: {
            js: 'effectsExtendedInfo/addon',
            css: 'effectsExtendedInfo/addon.css'
        },
        extendedShedule: {
            js: 'extendedShedule/addon',
            css: 'extendedShedule/addon.css'
        },
        filterChat: {
            js: 'filterChat/addon',
            css: 'filterChat/addon.css'
        },
        hideLeftPanel: {
            js: 'hideLeftPanel/addon',
            css: 'hideLeftPanel/addon.css'
        },
        newPlayerIcons: {
            js: '',
            css: 'newPlayerIcons/addon.css'
        },
        showOtAnalyzerLink: {
            js: 'showOtAnalyzerLink/addon',
            css: ''
        },
        showSkillProgress: {
            js: 'showSkillProgress/addon',
            css: 'showSkillProgress/addon.css'
        },
        stashScrollToTopButton: {
            js: 'stashScrollToTopButton/addon',
            css: 'stashScrollToTopButton/addon.css'
        },
        topMenuAchievementsLink: {
            js: 'topMenuAchievementsLink/addon',
            css: 'topMenuAchievementsLink/addon.css'
        },
        hpBar: {
            js: 'hpBar/addon',
            css: 'hpBar/addon.css'
        },
        sysFunctions: {
            js: 'sysFunctions/addon',
            css: 'sysFunctions/addon.css'
        },
        zagorodItems: {
            js: 'zagorodItems/addon',
            css: 'zagorodItems/addon.css'
        },
        zagorodNPC: {
            js: 'zagorodNPC/addon', 
            css: 'zagorodNPC/addon.css'
        },
        zagorodRandom: {
            js: 'zagorodRandom/addon',
            css: 'zagorodRandom/addon.css'                       
        },
        zagorodSound: {
            js: 'zagorodSound/addon',
            css: 'zagorodSound/addon.css',
            sound: 'zagorodSound/sound.mp3',
            sound2: 'zagorodSound/sound2.mp3'            
        },
        chatHistory: {
            js: 'chatHistory/addon',
            css: 'chatHistory/addon.css'
        },
        zagorodAutobattle: {
            js: 'zagorodAutobattle/addon',
            css: 'zagorodAutobattle/addon.css'
        }             
    },
    addons: {

    }
};

//check if options set in local storage
chrome.storage.sync.get('FireUI', function(result){
    if ('FireUI' in result) {
        //if they are check for new options
        if (!('filterChat' in result.FireUI)) {
            result.FireUI.filterChat = 'enabled';
            console.log('not found');
        }
        if (!('customBackground' in result.FireUI)) {
            result.FireUI.customBackground = 'disabled';
            console.log('not found');
        }
        //set options to local storage
        chrome.storage.sync.set({'FireUI': result.FireUI });

        console.log('FireUI: Options found in local storage');
    } else {
        //if there is no FireUI object in local storage, set default options
        clearStorage(); //clear All data from local sotrage
        //decalre options
        var options = {
            FireUI: {
                customBackground: 'enabled',
                newPlayerIcons: 'disabled',
                effectsExtendedInfo: 'enabled',
                extendedShedule: 'enabled',
                hideLeftPanel: 'enabled',
                hugeCssMod: 'enabled',                
                showOtAnalyzerLink: 'enabled',
                showSkillProgress: 'enabled',
                topMenuAchievementsLink: 'enabled',
                stashScrollToTopButton: 'enabled',
                hpBar: 'enabled',
                sysFunctions: 'enabled',
                zagorodItems: 'enabled',
                zagorodNPC: 'enabled',
                zagorodRandom: 'enabled',
                filterChat: 'enabled',
                zagorodSound: 'enabled',
                chatHistory: 'enabled',
                zagorodAutobattle: 'enabled'
            }
        };
        //set options to local storage
        chrome.storage.sync.set({'FireUI': options.FireUI });
        //notify that default options was set
        console.log('FireUI: No local options found, default options was set');
    }
})

chrome.storage.sync.get(['FireUI_lastversion'], function(result) {
    if (result.FireUI_lastversion !== FireUI.version) {
        chrome.action.setBadgeText({text: '!'});
    }
});

//collect options from local storage and set them to FireUI object
function collectUserExtensionOptions() {
    return new Promise (function(resolve, reject) {
        //clear enabled modules array before check
        FireUI.enabledModules = [];
        //get data from chrome local storage
        chrome.storage.sync.get('FireUI', function(result) {
            //check each option from storage if it is enabled
            Object.keys(result.FireUI).forEach(key => {
                if (result.FireUI[key] == 'enabled') {
                    //push enabled module to FireUI objects enabled modules array
                    //array with modules names
                    FireUI.enabledModules.push(key);
                    //array with paths to js files (for require.js)
                    if (FireUI.paths[key].js.length > 0) {
                        FireUI.reuireModules.paths[key] = FireUI.paths[key].js;
                        FireUI.reuireModules.modules.push(key);
                    }
                    //array with paths to css files
                    if (FireUI.paths[key].css.length > 0) {
                        FireUI.enabledModulesPathsCSS.push(
                            FireUI.addonsBaseUrl + FireUI.paths[key].css
                        );
                    }
                }
            });
            //resolve promise
            resolve(FireUI);
        });
    });
}

//clear all data from storage
function clearStorage() {
    chrome.storage.sync.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else console.log('FireUI: Local storage was cleared');
    });
}

//add listener for content-script messages
chrome.runtime.onMessageExternal.addListener(externalMessageCallback);

//callback function for content-script message listener
function externalMessageCallback(request, sender, sendResponse) {
    if (request.request == 'FireUI') {
        collectUserExtensionOptions().then(function(FireUI){
            sendResponse({success: FireUI})
        });
    }
}
