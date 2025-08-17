define("effectsExtendedInfo",
    [],
    function() {
		if (typeof(FireUI) !== 'object') {
			throw new Error('FireUI: cannot initialize "Effects Extended Info" addon, aborting.');
		} else {
			FireUI.addons.effectsExtendedInfo = {
				init: function() {
					$('#ti_3').attr('onClick','setTimeout(FireUI.addons.effectsExtendedInfo.show, 10)')
				},
				show: function() {
					//если есть активные воздействия выведем срок и название воздействия рядом wrapAll('<div class="new">')
					if ($('#cnv_updatesinfo').length) {
						$('#cnv_updatesinfo').children('.smallitem.elixir').each(function() {
							let eventText = $(this).context.title;
							$(this).wrap('<div class="cnv_advanced_container">');
							$(this).after('<div class="cnv_dop_info">' + eventText + '</div>');
						})
					} else {
						return;
					}
					//обновит скролл
					$('#canvas').updatescrolling();
				}
			}
			FireUI.addons.effectsExtendedInfo.init();
		}
	}
);
