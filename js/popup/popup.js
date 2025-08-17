var FireUI = {
    version: "2.1"
}

$(document).ready(function() {
    $('.version_number').text(FireUI.version);

    function checkVersion() {

        chrome.storage.sync.get(['FireUI_lastversion'], function(result) {
            if (result.FireUI_lastversion !== FireUI.version) {
                $('#changelog').show();
            }
        });
    }

    function checkWarning() {

        chrome.storage.sync.get(['FireUI_warning_was_closed'], function(result) {
            if (result.FireUI_warning_was_closed !== true) {
                $('#main_warning').show();
            } else {
                //do nothing
            }
        });
    }

    function getOptions() {
        /////////////////////////////
        // STANDART CHECKBOX options
        ////////////////////////////
        //Huge CSS mod
		chrome.storage.sync.get('FireUI', function(result) {

			var options = result;
            //Huge CSS Mod
			if (options.FireUI.hugeCssMod == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hugeCssMod" checked></input><label>Исправления и небольшие модификации (тени, обводка кнопок и полей, объемный флаг и т.д.)</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hugeCssMod"></input><label>Исправления и небольшие модификации (тени, обводка кнопок и полей, объемный флаг и т.д.)</label></div>')
            }
			//Effects Extended Info
			if (options.FireUI.effectsExtendedInfo == 'enabled') {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="effectsExtendedInfo" checked></input><label>Расширенная информация в меню "Воздействия"</label></div>')
			} else {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="effectsExtendedInfo"></input><label>Расширенная информация в меню "Воздействия"</label></div>')
			}
			//Extended Shedule
			if (options.FireUI.extendedShedule == 'enabled') {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="extendedShedule" checked></input><label>Показывать вкладку с расписанием на левой панели</label></div>')
			} else {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="extendedShedule"></input><label>Показывать вкладку с расписанием на левой панели</label></div>')
			}            
			//Hide Left Panel
			if (options.FireUI.hideLeftPanel == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hideLeftPanel" checked></input><label>Возможность скрывать левую панель</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hideLeftPanel"></input><label>Возможность скрывать левую панель</label></div>')
            }
            //Custom background
			if (options.FireUI.customBackground == 'enabled') {
                $('#images_section').append(`<div class="option"><input type="checkbox" id="customBackground" checked></input><label>Заменить фон интерфейса</label></div>`)
            } else {
                $('#images_section').append('<div class="option"><input type="checkbox" id="customBackground"></input><label>Заменить фон интерфейса</label></div>')
            }
			//New Player Icons
			if (options.FireUI.newPlayerIcons == 'enabled') {
                $('#images_section').append('<div class="option"><input type="checkbox" id="newPlayerIcons" checked></input><label>Новые иконки персонажей</label></div>')
            } else {
                $('#images_section').append('<div class="option"><input type="checkbox" id="newPlayerIcons"></input><label>Новые иконки персонажей</label></div>')
            }
			//Show OT Analyzer link
			if (options.FireUI.showOtAnalyzerLink == 'enabled') {
                $('#analyzer_section').append('<div class="option"><input type="checkbox" id="showOtAnalyzerLink" checked></input><label>Показывать ссылку на анализатор боя на сайте ОТ</label></div>')
            } else {
                $('#analyzer_section').append('<div class="option"><input type="checkbox" id="showOtAnalyzerLink"></input><label>Показывать ссылку на анализатор боя на сайте ОТ</label></div>')
            }
            $('#showOtAnalyzerLink').parent().after('<div class="option_warning">Данная опция добавляет ссылку на внешний ресурс (сайт клана Орден Тумана) в логе текущего боя персонажа для удобного доступа к сервису "Анализатор боя" (откроется в новой вкладке), автоматической вставке лога текущего поединка персонажа в поле для анализа боя и автоматическому запуску анализатора.</div>');
			//Show Skill Progress
			if (options.FireUI.showSkillProgress == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="showSkillProgress" checked></input><label>Показывать прогресс навыков в ресурсных локациях</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="showSkillProgress"></input><label>Показывать прогресс навыков в ресурсных локациях</label></div>')
            }
			//Stash Scroll to Top Button
			if (options.FireUI.stashScrollToTopButton == 'enabled') {
                $('#inventory_section').append('<div class="option"><input type="checkbox" id="stashScrollToTopButton" checked></input><label>Показывать кнопку "вверх" в рюкзаке для прокрутки содержимого к верху экрана</label></div>')
            } else {
                $('#inventory_section').append('<div class="option"><input type="checkbox" id="stashScrollToTopButton"></input><label>Показывать кнопку "вверх" в рюкзаке для прокрутки содержимого к верху экрана</label></div>')
            }
			//Top Menu Achievements Link
			if (options.FireUI.topMenuAchievementsLink == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="topMenuAchievementsLink" checked></input><label>Показывать ссылку на прогресс достижений в шарике с книгой</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="topMenuAchievementsLink"></input><label>Показывать ссылку на прогресс достижений в шарике с книгой</label></div>')
            }
            //hpBar
			if (options.FireUI.hpBar == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hpBar" checked></input><label>Отображает полоску здоровья под участниками боя</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="hpBar"></input><label>Отображает полоску здоровья под участниками боя</label></div>')
            }
            //Filter chat
			if (options.FireUI.filterChat == 'enabled') {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="filterChat" checked></input><label>Дополнительные возможности для чата</label></div>')
			} else {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="filterChat"></input><label>Дополнительные возможности для чата</label></div>')
			}
            //Chat history
			if (options.FireUI.chatHistory == 'enabled') {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="chatHistory" checked></input><label>История чата</label></div>')
			} else {
				$('#interface_section').append('<div class="option"><input type="checkbox" id="chatHistory"></input><label>История чата</label></div>')
			}
            //sysFunctions
			/*if (options.FireUI.sysFunctions == 'enabled') {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="sysFunctions" checked></input><label>Системные функции (фиксация боевого меню, сортировка чата, загород, меню и тд.)!!!</label></div>')
            } else {
                $('#interface_section').append('<div class="option"><input type="checkbox" id="sysFunctions"></input><label>Системные функции (фиксация боевого меню, сортировка чата, загород, меню и тд.)!!!</label></div>')
            }*/
            //zagorodItems
			if (options.FireUI.zagorodItems == 'enabled') {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodItems" checked></input><label>Останавливать поход при нахождении находок</label></div>')
            } else {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodItems"></input><label>Останавливать поход при нахождении находок</label></div>')
            }
            //zagorodNPC
			if (options.FireUI.zagorodNPC == 'enabled') {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodNPC" checked></input><label>Останавливать поход при нахождении NPC</label></div>')
            } else {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodNPC"></input><label>Останавливать поход при нахождении NPC</label></div>')
            }
            //zagorodRandom
			if (options.FireUI.zagorodRandom == 'enabled') {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodRandom" checked></input><label>Автопоход по координатам (без остановки после боя или обыска)</label></div>')
            } else {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodRandom"></input><label>Автопоход по координатам (без остановки после боя или обыска)</label></div>')
            }
            //zagorodSound
			if (options.FireUI.zagorodSound == 'enabled') {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodSound" checked></input><label>Звуковые оповищения (находки, нападение)</label></div>')
            } else {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodSound"></input><label>Звуковые оповищения (находки, нападение)</label></div>')
            }
            //zagorodAutobattle
			if (options.FireUI.zagorodAutobattle == 'enabled') {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodAutobattle" checked></input><label>Автоматический бой с отрядами (Автоудар должен быть включен!)</label></div>')
            } else {
                $('#zagorod_section').append('<div class="option"><input type="checkbox" id="zagorodAutobattle"></input><label>Автоматический бой с отрядами (Автоудар должен быть включен!)</label></div>')
            }

			chrome.storage.sync.set({'FireUI': options.FireUI });
		});
    }

    //Получение опций
    //checkVersion();
    //checkWarning();
    getOptions();


    $('.capabilities').on('click', function() {
        if ($('.capabilities_text').css('display') !== 'none') {
            $('.capabilities_text').slideUp('fast');
        } else $('.capabilities_text').slideDown('fast');
    });

    $('#options').on('click', 'input', function() {
        let optionName = $(this).attr('id');
        if ($(this).is(":checked")) {
			chrome.storage.sync.get('FireUI', function(result){
				let options = result;
				options.FireUI[optionName] = 'enabled';
				chrome.storage.sync.set({'FireUI': options.FireUI });
			})
        } else {
			chrome.storage.sync.get('FireUI', function(result){
				let options = result;
				options.FireUI[optionName] = 'disabled';
				chrome.storage.sync.set({'FireUI': options.FireUI });
			})
        }
        $('.danger').show('fast');
    })

    $('.section_heading').on('click', function() {
        if ($(this).next().css('display') !== 'none') {
            $(this).next().slideUp('fast');
            $('.options_arrow', this).html('&#8658;');
        } else {
            $(this).next().slideDown('fast');
            $('.options_arrow', this).html('&#8659;');
        }
    })

    $('#main_alert').on('click', function() {
        $('#main_warning').show('fast');
    })
    $('#main_warning_close_btn').on('click', function() {
        chrome.storage.sync.set({
            'FireUI_warning_was_closed': true
        });
        $('#main_warning').hide('fast');
    })

    $('#version_info').on('click', function() {
        $('#changelog').show('fast');
    })
    $('#changelog_close_btn').on('click', function() {
        chrome.storage.sync.set({
            'FireUI_lastversion': FireUI.version
        });
        if (typeof(chrome.action) !== 'undefined') {
            chrome.action.setBadgeText({text: ''});
        }
        $('#changelog').hide('fast');
    })
})
