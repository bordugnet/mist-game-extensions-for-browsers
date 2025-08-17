define("sysFunctions",
  [],
  function () {
    var pingserver = function () {
      var im = new Image();
      im.src = 'https://pic.mist-game.ru//interface_v4/i/interface/compile/refresh.gif?' + Math.random();
      im.file_size = 69800;
      im.ping = ping;
      im.time_start = new Date();
      im.onload = function () {
        im.time_end = new Date();
        im.time_diff = im.time_end - im.time_start;
        im.time_diff_sec = im.time_diff / 1000;
        im.speed = im.file_size / im.time_diff_sec;
        im.speed = Math.round(im.speed / 1024);


        if (document.getElementById('server_ping_') == null) {
          var t = document.createElement('div');
          t.setAttribute("id", "server_ping_");
          var parent = document.getElementById('num');
          parent.appendChild(t);
        }

        document.getElementById('server_ping_').innerHTML = ('┋Ping ' + im.ping + ' ms.');
        if (im.ping > 180) {
          document.getElementById('server_ping_').style.color = "red";
        }

        if (im.ping < 180) {
          document.getElementById('server_ping_').style.color = "#096578";
        }
        document.getElementById('server_ping_').style.cssFloat = "right";

      }

    }

    //Сортировка чата
    function sortchat() {
      var n_sort = document.getElementsByClassName("cbtn bsort white nb")[0];
      n_sort.click();
      var n_sort = document.getElementsByClassName("sorte")[4];
      n_sort.click();
      //n_sort.click();
      var n_sort = document.getElementsByClassName("cbtn bprivate")[0];
      //n_sort.click();
    }

    //Выделение ника цветом
    var myNikColor = function () {
      var my_idgame = document.getElementsByClassName("i bi")[0].id;
      var my_id = my_idgame.replace("m", "");
      var x = document.getElementsByClassName("name_" + my_id);
      for (let i = 1; i < x.length; i++) {
        x[i].style.color = "#ffffffff";
        x[i].style.backgroundColor = "#096578ff";
        x[i].style.fontSize = "pt12";
      }
    }

    //Фиксация боевого меню
    function contentEval(source) {
      source = '(' + source + ')();'
      var script = document.createElement('script');
      script.setAttribute("type", "application/javascript");
      script.textContent = source;
      document.body.appendChild(script);
      document.body.removeChild(script);
    }
    contentEval(function () {
      function addStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
        return document.styleSheets[document.styleSheets.length - 1];
      }
      function addStyle(ss, sel, rule) {
        if (ss.addRule) { ss.addRule(sel, rule); }
        else { if (ss.insertRule) { ss.insertRule(sel + ' {' + rule + '}', ss.cssRules.length); } }
      }
      var s = addStyleSheet();
      addStyle(s, '#battleMenu', 'margin-top: -8px;margin-left: -10px;');
    });

    //Обновление во время боя
    function upClockBattle() {
      if (C.PR.intf == 'battle') {
        document.getElementsByClassName('bm_refresh')[0].click();
      }
    }

    //Обновление списка людей в локе
    function upLocationUser() {
      document.getElementsByClassName("cbtn brefresh nb")[0].click();
    }

    //активация клан чата
    function activateKlanChat() {
      if (document.getElementsByClassName('chat_tab')[1] == null) { return };
      if (document.getElementsByClassName('chat_tab')[1].title == 'Клан') {
        document.getElementsByClassName('chat_tab')[1].click();
      }
    }

    function SetFavIcon() {
      var list = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      list.forEach(function (element) {
        element.setAttribute('href', FireUI.addonsBaseUrl + '../images/icon.png');
      });
    }

    var getCaptchaImg = function () {
      const gameTitle = 'MMORPG Mist: ролевая бесплатная онлайн игра';
      if (C.PR.intf == 'mine_location') {
        if (document.getElementsByClassName('refresh_captcha center pointer f80').length > 0) {
          document.title = gameTitle + '-captcha';
        } else { document.title = gameTitle; }
      }
      if (C.PR.intf == 'charMine') {
        st = document.title;
        if (st.indexOf('captcha') > 0) {
          document.title = gameTitle;
        }
      }
    }

    var correcttooltip = function () {
      if (document.getElementById('tooltip') == null) { return };
      var tt = document.getElementById('tooltip');
      tt.style.fontSize = "150%";
      tt.style.border = '5px solid #ad915e';
      tt.style.marginLeft = '+5px';      
    }


    SetFavIcon();

    // Инициализация функции при загрузке страницы
    setInterval(correcttooltip, 500);
    setInterval(getCaptchaImg, 1000);
    //setInterval(upClockBattle, 10000);  
    setInterval(upLocationUser, 60000);
    sortchat();
    activateKlanChat();
    window.eval("$ ( 'html' ).ajaxSuccess (" + pingserver.toString() + ");");
    window.eval("$ ( 'html' ).ajaxSuccess (" + myNikColor.toString() + ");");
    upLocationUser();
    C.post('refresh');
    //window.eval("$ ( 'html' ).ajaxSuccess (" + getCaptchaImg.toString() + ");");    

  }
);
