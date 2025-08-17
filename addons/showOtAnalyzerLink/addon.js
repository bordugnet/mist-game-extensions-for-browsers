define("showOtAnalyzerLink",
    [],
    function() {
		if (typeof(FireUI) !== 'object') {
			throw new Error('FireUI: cannot initialize "OT Analyzer Link" addon, aborting.');
		} else {
			FireUI.addons.showOtAnalyzerLink = {
				init: function() {
					$('html').ajaxSuccess(function() {
						FireUI.addons.showOtAnalyzerLink.handleLink();
					});
				},
				handleLink: function() {
					if (C.PR.intf == 'battle') {
						if(!$('#otAnalyzerHref').length && $('#showFullLog').length) {
							let battleHref = $('#showFullLog').children('a').attr('href').replace('/history.php?b=','');
							$('#showFullLog').after('<div id="otAnalyzerHref" class="pl10"><a class="s3brown" href="https://mist-orden.ru/analis/v2/?log=' + battleHref + '" target="_blank">Открыть лог в анализаторе (переход на сайт Ордена Тумана в новой вкладке)</a></div>');
						}
					}
				}
			}

			FireUI.addons.showOtAnalyzerLink.init();
		}
	}
);
