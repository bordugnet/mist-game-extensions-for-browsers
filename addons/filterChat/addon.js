define("filterChat",
    [],
    function() {
		if (typeof(FireUI) !== 'object') {
			throw new Error('FireUI: cannot initialize "Filter Chat" addon, aborting.');
		} else {
		    FireUI.addons.filterChat = {
		        observer: '',
		        chatContainer: document.querySelector("#messages"),
		        observerOptions: {
		            childList: true, // наблюдать за непосредственными детьми
		            subtree: false, // и более глубокими потомками
		            attributes: true,
		        },
		        chatOptions: {
		            hideAllianceChat: false,
		            hideClanChat: false,
		            clickableCoordinates: true
		        },
		        chatObserverCallback: function (data) {
		            //if any option is in enabled statement
		            if (FireUI.addons.filterChat.chatOptions.hideAllianceChat || FireUI.addons.filterChat.chatOptions.hideClanChat || FireUI.addons.filterChat.chatOptions.clickableCoordinates) {
		                //if mutation was a creation of new node and this node classname was ch_message, that means that new message has been appeared in chat window
						if (data[0].addedNodes[0].className == null) {return}
		                if (data[0].type == "childList" && data[0].addedNodes[0].className == 'ch_message') {
		                    let ch_message = data[0].addedNodes[0];
		                    //if message is in Clan channel and clan filter is enabled
		                    if (ch_message.children[1].className == 'ch_clan' && FireUI.addons.filterChat.chatOptions.hideClanChat) {
		                        $('span.ch_clan').parent('div.ch_message').addClass('hidden');
		                    }
		                    //if message is in Alliance channel and alliance filter is enabled
		                    if (ch_message.children[1].className == 'ch_alliance' && FireUI.addons.filterChat.chatOptions.hideAllianceChat) {
		                        $('span.ch_alliance').parent('div.ch_message').addClass('hidden');
		                    }
		                    //if clickable coordinates option is enabled
		                    if (FireUI.addons.filterChat.chatOptions.clickableCoordinates) {
		                        $('div.ch_message span:contains("Местоположение"), div.ch_message span:contains("] ")').each(function() {
		                            if (!$(this).hasClass('with-location-link')) {
		                                var regEx = /Местоположение (\d{1,2}):(\d{2})*$/
		                                var regEx2 = /] (\d{1,2}):(\d{2})*$/
		                                var string = $(this).text();
		                                if (string.match(regEx)) {
		                                    let coord1 = string.match(regEx)[1];
		                                    let coord2 = string.match(regEx)[2];
		                                    $(this).append(' (<span class="chat-clickable-coordinate" onclick="FireUI.addons.filterChat.goTo(' + coord1 + ', ' + coord2 + ')">проложить путь</span>)');
		                                    $(this).addClass('with-location-link');
		                                }
		                                if (string.match(regEx2)) {
		                                    let coord1 = string.match(regEx2)[1];
		                                    let coord2 = string.match(regEx2)[2];
		                                    $(this).append(' (<span class="chat-clickable-coordinate" onclick="FireUI.addons.filterChat.goTo(' + coord1 + ', ' + coord2 + ')">проложить путь</span>)');
		                                    $(this).addClass('with-location-link');
		                                }
		                            }
		                        });
		                    }
		                }
		            }
		        },
		        switchAllianceChatFilter: function () {
		            if ($('div.filter-alliance-chat').attr('data-filter') == 'disabled') {
		                FireUI.addons.filterChat.chatOptions.hideAllianceChat = true;
		                $('span.ch_alliance').parent('div.ch_message').addClass('hidden');
		                $('div.filter-alliance-chat').attr('data-filter', 'enabled');
		                $('div.filter-alliance-chat').addClass('pressed');
		            } else {
		                FireUI.addons.filterChat.chatOptions.hideAllianceChat = false;
		                $('span.ch_alliance').parent('div.ch_message').removeClass('hidden');
		                $('div.filter-alliance-chat').attr('data-filter', 'disabled');
		                $('div.filter-alliance-chat').removeClass('pressed');
		            }
		        },
		        switchClanChatFilter: function () {
		            if ($('div.filter-clan-chat').attr('data-filter') == 'disabled') {
		                FireUI.addons.filterChat.chatOptions.hideClanChat = true;
		                $('span.ch_clan').parent('div.ch_message').addClass('hidden');
		                $('div.filter-clan-chat').attr('data-filter', 'enabled');
		                $('div.filter-clan-chat').addClass('pressed');
		            } else {
		                FireUI.addons.filterChat.chatOptions.hideClanChat = false;
		                $('span.ch_clan').parent('div.ch_message').removeClass('hidden');
		                $('div.filter-clan-chat').attr('data-filter', 'disabled');
		                $('div.filter-clan-chat').removeClass('pressed');
		            }
		        },
		        goTo: function (coord1, coord2) {
		            if (C.PR.intf == 'worldMap') {
		                let coord1_integer = parseInt(coord1, 10);
		                let coord2_integer = parseInt(coord2, 10);
		                if (!Number.isNaN(coord1_integer) && !Number.isNaN(coord2_integer)) {
		                    window.worldMap.show_way = false;
		                    C.post('find_way',{ coord: [coord1_integer,coord2_integer] });
		                } else {
		                    return;
		                }
		            } else {
		                return;
		            }
		        }
		    }

		    //add filter buttons to chat panel
		    $('#leftbtns').after('<td id="dopleftbtns"><div class="cbtn-dop filter-clan-chat" data-filter="disabled" title="Отключить клан чат" onclick="FireUI.addons.filterChat.switchClanChatFilter()"></div><div class="cbtn-dop filter-alliance-chat" data-filter="disabled" title="Отключить альянс чат" onclick="FireUI.addons.filterChat.switchAllianceChatFilter()"></div>');
		    //start observing
		    FireUI.addons.filterChat.observer = new MutationObserver(FireUI.addons.filterChat.chatObserverCallback);
		    FireUI.addons.filterChat.observer.observe(FireUI.addons.filterChat.chatContainer, FireUI.addons.filterChat.observerOptions);
		}
	}
);
