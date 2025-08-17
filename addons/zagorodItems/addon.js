define("zagorodItems",
  [],
  function () {
    if (typeof (FireUI) !== 'object') {
      throw new Error('FireUI: cannot initialize "zagorodItems" addon, aborting.');
    } else {
      FireUI.addons.zagorodItemsButton = {
        init: function () {
          $('html').ajaxSuccess(function () {
            if (C.PR.intf == 'worldMap') {
              if (!$('.zagorodItemsContainer').length) {
                $('#midsep').append('<div class="zagorodItemsContainer"><div class="zagorodItemsButtonContainer"><div id=' + FireUI.ZagorodItemsState + ' onclick="FireUI.addons.zagorodItemsButton.enableItemsStop()" class="zagorodItemsButton">ОСТАНОВКА ПРИ НАХОДКЕ 🔎</div></div></div>');
                if (FireUI.ZagorodItemsState == 0) {
                  document.getElementsByClassName('zagorodItemsButton')[0].innerText = 'ОСТАНОВКА ПРИ НАХОДКЕ 🗶';
                  //document.getElementsByClassName('zagorodItemsContainer')[0].style.borderStyle = 'outset';
                  document.getElementsByClassName('zagorodItemsContainer')[0].style.color = '#989898ff';
                  clearInterval(SearchItemsZagorod);
                } else {
                  document.getElementsByClassName('zagorodItemsButton')[0].innerText = 'ОСТАНОВКА ПРИ НАХОДКЕ 🔎';
                  //document.getElementsByClassName('zagorodItemsContainer')[0].style.borderStyle = 'inset';  
                  document.getElementsByClassName('zagorodItemsContainer')[0].style.color = '#ffffffff';
                  setInterval(SearchItemsZagorod, 500);
                }
              }
            }
          })
        },
        enableItemsStop: function () {
          if (FireUI.ZagorodItemsState == 1) {
            FireUI.ZagorodItemsState = 0;
            document.getElementsByClassName('zagorodItemsButton')[0].innerText = 'ОСТАНОВКА ПРИ НАХОДКЕ 🗶';
            //document.getElementsByClassName('zagorodItemsContainer')[0].style.borderStyle = 'outset';
            document.getElementsByClassName('zagorodItemsContainer')[0].style.color = '#989898ff';
            clearInterval(SearchItemsZagorod);
          } else {
            FireUI.ZagorodItemsState = 1;
            document.getElementsByClassName('zagorodItemsButton')[0].innerText = 'ОСТАНОВКА ПРИ НАХОДКЕ 🔎';
            //document.getElementsByClassName('zagorodItemsContainer')[0].style.borderStyle = 'inset';  
            document.getElementsByClassName('zagorodItemsContainer')[0].style.color = '#ffffffff';
            setInterval(SearchItemsZagorod, 500);
          }
          localStorage.setItem('zagorodItemsButton', FireUI.ZagorodItemsState);
        }
      }

      FireUI.addons.zagorodItemsButton.init();
    }




    var SearchItemsZagorod = function () {
      if (C.PR.intf == 'worldMap' && FireUI.ZagorodItemsState == 1) {
        const itmItems = ["Большой схрон", "Схрон", "Куча листьев", "Звериная нора", "Сухое дерево", "Куча хвороста", "Гнездо"];
        const regexItm = new RegExp(`(${itmItems.join('|')})`, 'gi');

        if (document.getElementById('sp_wrldmp_glbl_coord') == null) { return };

        currentCoord = document.getElementById('sp_wrldmp_glbl_coord').innerText;
        let currentOject = document.getElementById('rcnvs_all_obj').innerText;

        if (currentOject == 'В пределах вашей видимости нет ни одного объекта.') {
          document.getElementsByClassName('rcnvs_all_obj').bis_skin_checked = "1";
        }

        if (document.getElementsByClassName('rcnvs_all_obj').bis_skin_checked == "0") {
          return;
        }

        //поиск обьектов
        found = currentOject.match(regexItm);

        if (found != null) {
          if ((FireUI.enabledModules.includes('zagorodSound') == true) && (C.PR.intf == 'worldMap') && (FireUI.catchMyNickState == 1)) {
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', FireUI.addonsBaseUrl + FireUI.paths.zagorodSound.sound);//'https://i.mist-game.ru/sound/notification.mp3');
            audioElement.play();
          }
          document.getElementsByClassName('rcnvs_all_obj').bis_skin_checked = "0";
          document.getElementsByClassName("tube_icon map_ti_up")[0].click();
          document.getElementById("wmp_coord_set").value = currentCoord;
          document.getElementsByClassName("dbtn dbtn_ok fl")[0].click();
        }
      }
    }
  }
);
