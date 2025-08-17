define("zagorodNPC",
  [],  
  function () {   
    if (typeof(FireUI) !== 'object') {
        throw new Error('FireUI: cannot initialize "zagorodNPC" addon, aborting.');
      } else {
        FireUI.addons.zagorodNPCButton = {
          init: function() {
            $('html').ajaxSuccess(function() {
              if (C.PR.intf == 'worldMap') {
                if (!$('.zagorodNPCContainer').length) {
                  $('#midsep').append('<div class="zagorodNPCContainer"><div class="zagorodNPCButtonContainer"><div id='+FireUI.ZagorodNPCState+' onclick="FireUI.addons.zagorodNPCButton.enableItemsStop()" class="zagorodNPCButton">ОСТАНОВКА ПРИ NPC 🕵️</div></div></div>');
                  if (FireUI.ZagorodNPCState == 0) {
                      document.getElementsByClassName('zagorodNPCButton')[0].innerText = 'ОСТАНОВКА ПРИ NPC 🗶';
                      //document.getElementsByClassName('zagorodNPCContainer')[0].style.borderStyle = 'outset';
                      document.getElementsByClassName('zagorodNPCContainer')[0].style.color = '#989898ff';                      
                      clearInterval(zagorodNPC);
                  } else {
                      document.getElementsByClassName('zagorodNPCButton')[0].innerText = 'ОСТАНОВКА ПРИ NPC 🕵️';   
                      //document.getElementsByClassName('zagorodNPCContainer')[0].style.borderStyle = 'inset';  
                      document.getElementsByClassName('zagorodNPCContainer')[0].style.color = '#ffffffff';  
                      setInterval(zagorodNPC, 500);       
                  }
                }
              }
            })
          },
          enableItemsStop: function() {
            if (FireUI.ZagorodNPCState == 1) {
                FireUI.ZagorodNPCState = 0;
                document.getElementsByClassName('zagorodNPCButton')[0].innerText = 'ОСТАНОВКА ПРИ NPC 🗶';
                //document.getElementsByClassName('zagorodNPCContainer')[0].style.borderStyle = 'outset';
                document.getElementsByClassName('zagorodNPCContainer')[0].style.color = '#989898ff';
                clearInterval(zagorodNPC);
            } else {
                FireUI.ZagorodNPCState = 1;
                document.getElementsByClassName('zagorodNPCButton')[0].innerText = 'ОСТАНОВКА ПРИ NPC 🕵️';   
                //document.getElementsByClassName('zagorodNPCContainer')[0].style.borderStyle = 'inset';  
                document.getElementsByClassName('zagorodNPCContainer')[0].style.color = '#ffffffff';                 
                setInterval(zagorodNPC, 500);       
            }
            localStorage.setItem('zagorodNPCButton', FireUI.ZagorodNPCState);
          }
        }
  
        FireUI.addons.zagorodNPCButton.init();
      }

      //AUTOATTACK NPC
    var autoattakNPC = function() {
      /**/  
      if (C.PR.intf == 'worldMap' && FireUI.ZagorodNPCState == 1) {
        let currentOjectNPC = document.getElementById('rcnvs_all_obj').innerText;
        if (FireUI.autoAttack == 1) {
            if (currentOjectNPC.indexOf('Напасть') > 0) {
              document.getElementsByClassName('map_cnv_act hover l2brown f90')[0].click();
              return;
            }            
          }
      }
    }

    var zagorodNPC = function () {
      if (C.PR.intf == 'worldMap' && FireUI.ZagorodNPCState == 1) {        
        const itnNPC = ["Отряд духов", "Отряд разбойников", "Чернокнижник Рейн", "Копьеносец Мил", "Привал торговцев", "Святилище Чарги", "Сандор", "Юсуф ибн Омар", "Несокрушимый Горт", "Пьяные горожане", "Потерянный горожанин", "Отряд витов"];        
        const regexNPC = new RegExp(`(${itnNPC.join('|')})`, 'gi');

        if (document.getElementById('sp_wrldmp_glbl_coord') == null) {return};

        currentCoord = document.getElementById('sp_wrldmp_glbl_coord').innerText;
        let currentOject = document.getElementById('rcnvs_all_obj').innerText;
        
        if (currentOject == 'В пределах вашей видимости нет ни одного объекта.') {
          document.getElementsByClassName('rcnvs_all_obj').bis_skin_checked = "1";
        }

        if (document.getElementsByClassName('rcnvs_all_obj').bis_skin_checked == "0") {
          return;
        }          

        found = currentOject.match(regexNPC);
        
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

    //setInterval(autoattakNPC, 1000);//AUTOATTACK NPC  
  }
);
