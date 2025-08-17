define("stashScrollToTopButton",
    [],
    function() {
      if (typeof(FireUI) !== 'object') {
        throw new Error('FireUI: cannot initialize "Stash scroll to top" addon, aborting.');
      } else {        
        //up button
        FireUI.addons.stashScrollToTopButton = {
          init: function() {
            $('html').ajaxComplete(function() {
              const scrTop = ['eventSchedule', 'caravan', 'quests', 'battlesHistory', 'stored', 'univerbuy', 'shop', 'shopBattle', 'auction', 'auctionSetLot', 'auctionMyLots', 'auctionMyBids', 'resExchange', 'resExchangePlace', 'resExchangeMyLots', 'marketStall', 'changerRecipes'];
              const regexItm = new RegExp(`(${scrTop.join('|')})`, 'gi'); 
              let currentOject = C.PR.intf;
              found = currentOject.match(regexItm);
              if (found != null) {
                if ($('.stashScrollToTopContainer').length == 0) {
                  if (scrolltext.scrollHeight > document.getElementById('midmain').scrollHeight) { 
                    $('#midmain').append('<div class="stashScrollToTopContainer"><div class="stashScrollToTopButtonContainer"><div onclick="FireUI.addons.stashScrollToTopButton.scrollUp()" class="stashScrollToTopButton">вверх</div></div></div>');                  
                  }
                }
              }
            })
          },
          scrollUp: function() {
            $("#scrollcut").animate({scrollTop:0}, 100, 'swing');
          }
        }
  
        FireUI.addons.stashScrollToTopButton.init();

        //close button
        FireUI.addons.stashstashToCloseButton = {
          init: function() {
            $('html').ajaxComplete(function() {
              let itxcloseButton = document.getElementsByClassName("ui_ctrl_button");              
              for (var i = 0; i < itxcloseButton.length; i++) {
                if (itxcloseButton[i].innerText == 'Закрыть\n\Закрыть') {
                  if ($('.stashToCloseContainer').length == 0) {  
                    if (scrolltext.scrollHeight > document.getElementById('midmain').scrollHeight) {                
                      $('#midmain').append('<div class="stashToCloseContainer"><div class="stashToCloseButtonContainer"><div onclick="document.getElementsByClassName(\'ui_ctrl_button \')['+i+'].click()" class="stashToCloseButton">закрыть</div></div></div>');                    
                    }
                  }
                  break; 
                }
              }              
            }
          )
          },          
        }
  
        FireUI.addons.stashstashToCloseButton.init();

      }
    }
);