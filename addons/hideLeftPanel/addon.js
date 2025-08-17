define("hideLeftPanel",
    [],
    function() {
		if (typeof(FireUI) !== 'object') {
			throw new Error('FireUI: cannot initialize "Hide Left Panel" addon, aborting.');
		} else {
			FireUI.addons.hideLeftPanel = {
				init: function() {
					if ($('#hideLeftPanelButton').length) {
						return;
					} else {
						$("#canvastd").after('<div id="hideLeftPanelButton" onclick="FireUI.addons.hideLeftPanel.switchPanel();">&nbsp;</div>');
					}
				},
				switchPanel: function() {
					if ($('#battleFieldContainer').length) {
						var resizableDiv = '#battleFieldContainer';
					}
					else if ($('#Map').length) {
						var resizableDiv = '#Map';
					}

					if ($('#canvastd').css('display') !== 'none') {
						$('#canvastd').hide();
						$('#hideLeftPanelButton').addClass('isActive');
						let midsepWidth = $('#midsep').width();
						$(resizableDiv).css('width',midsepWidth);
					} else {
						$('#canvastd').show();
						$('#hideLeftPanelButton').removeClass('isActive');
						let midsepWidth = $('#midsep').width();
						let canvastdWidth = $('#canvastd').width();
						let MapWidth = midsepWidth - canvastdWidth - 8; //не знаю почему, откуда-то берутс¤ эти 8 пикселей
						$(resizableDiv).css('width',MapWidth);
					}
				}
			}

			﻿FireUI.addons.hideLeftPanel.init();
		}
	}
);
