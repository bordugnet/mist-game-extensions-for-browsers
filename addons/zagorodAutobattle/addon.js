define("zagorodAutobattle",
  [],
  function () {
    if (typeof (FireUI) !== 'object') {
      throw new Error('FireUI: cannot initialize "zagorodAutobattle" addon, aborting.');
    } else {
      FireUI.addons.zagorodAutobattleButton = {
        init: function () {
          $('html').ajaxSuccess(function () {
            /*if ((C.PR.intf != 'worldMap') || (C.PR.intf != 'battle')) {
              FireUI.zagorodAutobattleState = 0;
            }*/
            if ((C.PR.intf == 'worldMap') || (C.PR.intf == 'battle')) {
              if (!$('.zagorodAutobattleContainer').length) {
                $('#midsep').append('<div class="zagorodAutobattleContainer"><div class="zagorodAutobattleButtonContainer"><div id=' + FireUI.zagorodAutobattleState + ' onclick="FireUI.addons.zagorodAutobattleButton.enableAutobattle()" class="zagorodAutobattleButton">АВТОМАТИЧЕСКИЙ БОЙ ВКЛЮЧЕН ⚔️</div></div></div>');
                if (FireUI.zagorodAutobattleState == 1) {
                  document.getElementsByClassName('zagorodAutobattleButton')[0].innerText = 'АВТОМАТИЧЕСКИЙ БОЙ ВКЛЮЧЕН ⚔️';
                  //document.getElementsByClassName('zagorodAutobattleContainer')[0].style.borderStyle = 'inset';
                  document.getElementsByClassName('zagorodAutobattleContainer')[0].style.color = '#ffffffff';
                  //setInterval(findNapadenie, 2000);
                  //setInterval(upClockBattle_, 2000);
                } else {
                  document.getElementsByClassName('zagorodAutobattleButton')[0].innerText = 'АВТОМАТИЧЕСКИЙ БОЙ ВЫКЛЮЧЕН 🗶';
                  //document.getElementsByClassName('zagorodAutobattleContainer')[0].style.borderStyle = 'outset';
                  document.getElementsByClassName('zagorodAutobattleContainer')[0].style.color = '#989898ff';
                  //clearInterval(findNapadenie);
                  //clearInterval(upClockBattle_);
                }
              }
            }
          })
        },
        enableAutobattle: function () {
          if (FireUI.zagorodAutobattleState == 0) {
            FireUI.zagorodAutobattleState = 1;
            document.getElementsByClassName('zagorodAutobattleButton')[0].innerText = 'АВТОМАТИЧЕСКИЙ БОЙ ВКЛЮЧЕН ⚔️';
            //document.getElementsByClassName('zagorodAutobattleContainer')[0].style.borderStyle = 'inset';
            document.getElementsByClassName('zagorodAutobattleContainer')[0].style.color = '#ffffffff';
            //setInterval(findNapadenie, 2000);
            //setInterval(upClockBattle_, 2000);
          } else {
            FireUI.zagorodAutobattleState = 0;
            document.getElementsByClassName('zagorodAutobattleButton')[0].innerText = 'АВТОМАТИЧЕСКИЙ БОЙ ВЫКЛЮЧЕН 🗶';
            //document.getElementsByClassName('zagorodAutobattleContainer')[0].style.borderStyle = 'outset';
            document.getElementsByClassName('zagorodAutobattleContainer')[0].style.color = '#989898ff';
            //clearInterval(findNapadenie);
            //clearInterval(upClockBattle_);
          }
          localStorage.setItem('zagorodAutobattleButton', FireUI.zagorodAutobattleState);
        }
      }

      FireUI.addons.zagorodAutobattleButton.init();
    }

    //Обновление во время боя
    function upClockBattle_() {
      if ((C.PR.intf == 'battle') && (FireUI.zagorodAutobattleState == 1)) {
        document.getElementsByClassName('bm_refresh')[0].click();
      }
    }

    var findNapadenie = function () {
      if ((FireUI.zagorodAutobattleState == 1) && (C.PR.intf == 'worldMap')) {
        let currentOject = document.getElementById('rcnvs_all_obj').innerText;

        if (document.getElementById('slf_dmn_time_start') != null) {
          let coord1 = C.PR.data.coord[0];
          let coord2 = C.PR.data.coord[1];
          let xcoord = coord1 + ':' + coord2;
          //FireUI.lastRanCoord.push(xcoord);
          msg = 'Начат авто-бой по координатам: ' + xcoord;
          C.cmd("systemMessage", { message: msg, timestamp: C.time.timestamp / 1000 })
          $("[class*=dashed]").click();
        }
        //если у ворот отключим автобой
        /*if (currentOject.includes('Ворота') == true) {
          FireUI.zagorodAutobattleState = 0;
          document.getElementsByClassName('zagorodAutobattleButton')[0].innerText = 'АВТОМАТИЧЕСКИЙ БОЙ ВЫКЛЮЧЕН 🗶';
          document.getElementsByClassName('zagorodAutobattleContainer')[0].style.borderStyle = 'outset';
          document.getElementsByClassName('zagorodAutobattleContainer')[0].style.color = '#989898ff';
          clearInterval(findNapadenie);
          clearInterval(startBattle); 
          localStorage.setItem('zagorodAutobattleButton', FireUI.zagorodAutobattleState); 
        }*/
      }
    }

    //*********************************************************************** */
    function startBattle() {
      //move bot
      var Move_MY = function (x_, y_) {
        //console.log('move:x-'+_x+' y-'+_y);    
        C.PR.post({ x: x_, y: y_, fk_target: "fill", node: "empty", fk_member: self, action: "move" });
      }
      //attack bot          
      var AtackBot = function (_x, _y, _target) {
        if (document.getElementById('battle_sb') != null) {
          let hodSdelan = document.getElementById('battle_sb').innerText;
          if (hodSdelan.includes('Ход сделан') == true) {
            INTF.CANV.set('location');
            return;
          };
        }
        C.PR.target = _target;
        C.PR.selected = _target;
        C.PR.cNode = 'enemy';
        C.PR.x = _x;
        C.PR.y = _y;
        C.PR.cAction = 'axe_attack'; //ТОПОР    
        INTF.CANV.set('strike', 'autostrike');
        //console.log('attak:x-'+_x+' y-'+_y+' tar-'+_target);
      }
      //mob attacked
      var MobAttcked = function (MY_X, MY_Y, my_id_, data) {
        count_mob = data.size / 7; //количество на карте персонажей
        isAttaked = false;
        //{ - }
        mattak_x = MY_X - 1;
        mattak_y = MY_Y;
        for (var i = 0; i < count_mob; i++) {
          info_id = data.get('info_id' + i);
          info_x = data.get('info_x' + i);
          info_y = data.get('info_y' + i);
          if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
            id_bot = data.get('info_id' + i);
            //console.log(1);
            AtackBot(mattak_x, mattak_y, id_bot);
            isAttaked = true;
            return;
          }
        }

        //{ \ }
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X;
          mattak_y = MY_Y - 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(2);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        } else {
          mattak_x = MY_X - 1;
          mattak_y = MY_Y - 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(3);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        }

        //{ / }
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X + 1;
          mattak_y = MY_Y - 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(4);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        } else {
          mattak_x = MY_X;
          mattak_y = MY_Y - 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(5);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        }

        //{ - }
        mattak_x = MY_X + 1;
        mattak_y = MY_Y;
        for (var i = 0; i < count_mob; i++) {
          info_id = data.get('info_id' + i);
          info_x = data.get('info_x' + i);
          info_y = data.get('info_y' + i);
          if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
            id_bot = data.get('info_id' + i);
            //console.log(6);
            AtackBot(mattak_x, mattak_y, id_bot);
            isAttaked = true;
            return;
          }
        }

        //{ \ }
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X + 1;
          mattak_y = MY_Y + 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(7);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        } else {
          mattak_x = MY_X;
          mattak_y = MY_Y + 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(8);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        }

        //{ / }
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X;
          mattak_y = MY_Y + 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(9);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        } else {
          mattak_x = MY_X - 1;
          mattak_y = MY_Y + 1;
          for (var i = 0; i < count_mob; i++) {
            info_id = data.get('info_id' + i);
            info_x = data.get('info_x' + i);
            info_y = data.get('info_y' + i);
            if ((info_id != my_id_) && (info_x == mattak_x) && (info_y == mattak_y)) {
              id_bot = data.get('info_id' + i);
              //console.log(10);
              AtackBot(mattak_x, mattak_y, id_bot);
              isAttaked = true;
              return;
            }
          }
        }
        return isAttaked;
      }

      //START
      if ((C.PR.intf != 'battle') || (FireUI.zagorodAutobattleState == 0)) {
        return;
      }


      let MYID;
      var i = 0;
      var data = new Map(); //база данных всех участников боя          
      var MY_X, MY_Y, MY_HOD;
      var GOHOD;

      if (C.PR.map.self != null) {
        MYID = C.PR.map.self;
      } else { return }

      if (document.getElementById('lbpanel') != null) {
        game_hod = document.getElementById('lbpanel').innerText;
      } else { game_hod = '' }

      if (game_hod == 'ожидание хода') { //можно ходить
        return;
      }

      //DB
      $("#battleMap .mapobj").each(function () {
        if (this.id.search(/m\d*$/i) != -1) {
          info_x = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][0];
          info_y = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][1];
          info_id = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][2];
          hp_max = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][4];
          hp_real = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][5];
          info_hod = C.PR.lastmap.obj[this.id.match(/m\d*$/i)][6];
          //заполнение базы данных
          data.set('info_id' + i, info_id);
          data.set('my_id' + i, MYID);
          data.set('info_hod' + i, info_hod);
          data.set('info_x' + i, info_x);
          data.set('info_y' + i, info_y);
          data.set('hp_max' + i, hp_max);
          data.set('hp_real' + i, hp_real);
          i++;
        }
      });

      count_mob = data.size / 7; //количество на карте персонажей          
      //определим свои данные и возможность хода
      GOHOD = false;
      for (var i = 0; i < count_mob; i++) {
        g = data.get('info_hod' + i);
        if (g == 1) {
          GOHOD = true;
        }
        id = data.get('info_id' + i);
        if (id == MYID) {
          MY_X = data.get('info_x' + i);
          MY_Y = data.get('info_y' + i);
          MY_HOD = data.get('info_hod' + i);
        }
      }
      if (GOHOD == false) { return; }

      INTF.CANV.set('location');
      //проверяем возможноси атаки
      isAttaked = MobAttcked(MY_X, MY_Y, MY_HOD, data);
      if (isAttaked = false) { return; }

      //проверяем не добитых мобов
      mobyes = false;
      for (var i = 0; i < count_mob; i++) {
        info_x = data.get('info_x' + i);
        info_y = data.get('info_y' + i);
        info_id = data.get('info_id' + i);
        if ((info_id != MYID) && (info_x != MY_X) && (info_y != MY_Y)) {
          mobyes = true;
          break;
        }
      }
      if (mobyes = false) { return; }

      //если недобитые далеко, ходим к ним
      //{ \| }
      if ((info_x < MY_X) && (info_y < MY_Y)) {
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X;
        } else {
          mattak_x = MY_X - 1;
        }
        mattak_y = MY_Y - 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m1');
        return;
      }

      //{ |/ }
      if ((info_x > MY_X) && (info_y < MY_Y)) {
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X + 1;
        } else {
          mattak_x = MY_X;
        }
        mattak_y = MY_Y - 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m2');
        return;
      }

      //{ |\ }
      if ((info_x > MY_X) && (info_y > MY_Y)) {
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) { //*
          mattak_x = MY_X + 1;
        } else {
          mattak_x = MY_X;
        }
        mattak_y = MY_Y + 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m3');
        return;
      }

      //{ /| }
      if ((info_x < MY_X) && (info_y > MY_Y)) {
        if (MY_Y == 1 || MY_Y == 3 || MY_Y == 5 || MY_Y == 7) {
          mattak_x = MY_X;
        } else {
          mattak_x = MY_X - 1;
        }
        mattak_y = MY_Y + 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m4');
        return;
      }

      //{ -left }
      if ((info_y = MY_Y) && (info_x < MY_X)) {
        mattak_x = MY_X - 1;
        mattak_y = MY_Y;
        Move_MY(mattak_x, mattak_y);
        //console.log('m5');
        return;
      }

      //{ -right }
      if ((info_y = MY_Y) && (info_x > MY_X)) {
        mattak_x = MY_X + 1;
        mattak_y = MY_Y;
        Move_MY(mattak_x, mattak_y);
        //console.log('m6');
        return;
      }

      //{top}
      if ((info_y > MY_Y) && (info_x = MY_X)) {
        mattak_x = MY_X;
        mattak_y = MY_Y + 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m7');
        return;
      }

      //{bottom}
      if ((info_y < MY_Y) && (info_x = MY_X)) {
        mattak_x = MY_X;
        mattak_y = MY_Y - 1;
        Move_MY(mattak_x, mattak_y);
        //console.log('m8');
        return;
      }
    }


    setInterval(upClockBattle_, 10000);
    setInterval(startBattle, 2000);
    //window.eval("$ ( 'html' ).ajaxComplete (" + startBattle.toString() + ");");
    window.eval("$ ( 'html' ).ajaxComplete (" + findNapadenie.toString() + ");");
  }
);