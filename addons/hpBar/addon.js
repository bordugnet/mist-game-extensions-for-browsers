define("hpBar",
    [],
    function() {
      var hpbar = function () {
        if (C && C.PR && (C.PR.intf == 'battle' || C.PR.intf == 'adventure') && C.PR.map && C.PR.map.obj) {
          var realMapObjects = C.PR.map.obj;

          ////////////////////////////////////////////////////////////////////////////////////////////////////
          // костыль специально для временных лунок. раз админы не сделали, придётся чинить самому...
          //
          // показ хп лунок определяется булем showFishingHoleLife
          //   устанавливается в первом раунде, если на карте есть вода, но нет ни одной лунки
          //   сбрасывается во втором раунде, если вода есть, но лунок по-прежнему нет (фирт или рыбалка с колодцами)
          //   также сброс произойдёт при ошибке в логике обновления речной карты
          //
          // перезагрузка страницы приведёт к тому, что в текущем бою время жизни лунок показываться не будет.
          // хз как после первого раунда достоверно определить тип боя, поэтому лучше ну его нахер.
          //
          // FIXME: логика сломается, если новая лунка появится на том же месте сразу после исчезновения (или отлова) предыдущей.
          // как в такой ситуации узнать, когда исчезла предыдущая? могла и сама "дотикать", а могли и выловить пару раундов назад.
          // почему игрок не выловил её сразу же - не имеет значения.
          // неудачный заброс, например.  да, 5 раз подряд.  невезучий рыбак попался.
          //
          ////////////////////////////////////////////////////////////////////////////////////////////////////
          /* Арантола               o140 */
          /* Салтера                o141 */
          /* Клихут                 o142 */
          /* Варх                   o143 */
          /* Азора                  o144 */
          /* Рантас                 o145 */
          /* Кжурпа                 o146 */
          /* Ламура                 o147 */
          /* Нерзун                 o148 */
          /* Пиптер                 o149 */
          /* Тирмона                o150 */
          /* Хориун                 o151 */
          /* Таккра                 o136 */
          /* Золотой орбис          o137 */
          /* Гулаваха               o138 */
          /* Тигз                   o139 */
          /* Сапера                 o127 */
          /* Малая аступпа          o126 */
          /* Пятнистый дарилан      o125 */
          /* Имбония                o124 */
          /* Варион-обманщик        o123 */
          /* Алеар                  o122 */
          /* Мелководная портения   o121 */
          /* Солнечный лимбус       o120 */
          /* Аргус                  o55  */
          /* Опаха                  o56  */
          /* Барбусия               o  ? */
          /* Туннус                 o  ? */
          var fishIds = ('o140,o141,o142,o143,o144,o145,o146,o147,o148,o149,o150,o151,o136,o137,o138,o139,o127,o126,o125,o124,o123,o122,o121,o120,o55,o56').split(',');
          var waterIds = ('o1,o101').split(',');

          /* оповещение о событии, требующем внимания разработчика скрипта */
          var DEBUG_EVENT = function (msg) {
            window.showFishingHoleLife = false;
            setTimeout(alert('DEBUG EVENT\n' + msg), 1);
            return;
          };

          /* проверяем есть ли объект на поле боя */
          var isObjectPresent = function (objectId) {
            return typeof C.PR.map.cl[objectId] == 'object';
          };

          /* проверяем есть ли вода на поле боя */
          var isWaterPresent = function () {
            for (var id of waterIds) {
              if (isObjectPresent(id)) return true;
            }
            return false;
          };

          /* проверяем есть ли лунки на поле боя */
          var isFishPresent = function () {
            for (var id of fishIds) {
              if (isObjectPresent(id)) return true;
            }
            return false;
          };

          /* ищем идентификатор в списке "водных" */
          var isWater = function (checkId) {
            for (var id of waterIds) {
              if (id == checkId) return true;
            }
            return false;
          };

          /* ищем идентификатор в списке "рыбных" */
          var isFish = function (checkId) {
            for (var id of fishIds) {
              if (id == checkId) return true;
            }
            return false;
          };

          /* ищем объект с указанными координатами */
          var getObjectByCoords = function (x, y) {
            for (var i in realMapObjects) {
              var obj = realMapObjects[i];
              if (obj[0] == x && obj[1] == y) return obj;
            }
            return null;
          };

          /* составляем карту "речных" гексов, вместо которых могут появляться лунки */
          var createRiverMap = function () {
            window.riverMap = [];

            for (var i in realMapObjects) {
              var obj = realMapObjects[i];
              if (isWater(obj[2])) {
                window.riverMap.push({
                  posX: obj[0],
                  posY: obj[1],
                  lifeMax: obj[4],
                  lifeNow: obj[5],
                  isWater: true,
                  updated: C.PR.round
                });
              }
            }
          };

          /* функция для прохода по ячейкам речной карты */
          var updateRiverMap = function (storedObj) {
            /* обработка должна происходить один раз за раунд, ибо нехуй */
            if (storedObj.updated == C.PR.round) return;
            storedObj.updated = C.PR.round;


            var realObj = getObjectByCoords(storedObj.posX, storedObj.posY);

            if (!realObj) {
              DEBUG_EVENT('Херь какая-то невнятная. Вроде ж не стелс-ресы, а вода куда-то проебалась...\nЗацени чё тут такое: x' + storedObj.posX + ', y' + storedObj.posY);
              return;
            }


            var isWaterNow = isWater(realObj[2]);
            var isFishNow = isFish(realObj[2]);

            if (isWaterNow && isFishNow) /*  0_о  */ {
              DEBUG_EVENT('Ну и чё ты натворил бля? Сломал всю логику к хуям.\nПроверяй списки идентификаторов - гекс не может быть и водой, и лункой одновременно!');
              return;
            } else if (isWaterNow) {
              storedObj.isWater = isWaterNow;
            } else if (isFishNow) {
              if (storedObj.isWater) {
                realObj[4] = 5; // lifeMax
                realObj[5] = 5; // lifeNow
                storedObj.isWater = isWaterNow;
                storedObj.lifeMax = realObj[4];
                storedObj.lifeNow = realObj[5];
              } else /* если лунка уже была на карте */ {
                if (storedObj.lifeNow < 1) {
                  storedObj.lifeNow = 1;
                  DEBUG_EVENT('Чёт живучая лунка попалась\nНе хочет, сцука, исчезать\nВот коры, надо бы разобраться: x' + storedObj.posX + ', y' + storedObj.posY);
                }

                storedObj.lifeNow--;
                realObj[4] = storedObj.lifeMax;
                realObj[5] = storedObj.lifeNow;
              }
            } else /* если на месте водного гекса возникло хуйпайми что (новую рыбу добавили? мобы научились плавать?) */ {
              DEBUG_EVENT('Хуясе, лохнесское чудовище детектед!\nГлянь сюда: x' + storedObj.posX + ', y' + storedObj.posY + '\nОткликается на имя ' + realObj[2]);
              return;
            }
          };


          /* ФУНКЦИИ КОНЧИЛИСЬ, ЛОГИКА НИЖЕ */

          if (isWaterPresent()) {
            if (C.PR.round == 1 && !window.showFishingHoleLife) {
              window.showFishingHoleLife = false;

              /* при временных лунках, рыбы в первом раунде нет на карте */
              if (isFishPresent() == false) {
                window.showFishingHoleLife = true;
                createRiverMap();
              }
            } else
              if (C.PR.round == 2 && window.showFishingHoleLife) {
                /* если во втором раунде рыба так и не появилась - продолжать бессмысленно */
                if (isFishPresent() == false) {
                  window.showFishingHoleLife = false;
                  delete window.riverMap;
                }
              }

            if (C.PR.round > 1 && window.showFishingHoleLife) {
              /* проходим по сохранённым ячейкам и ищем соответствия на реальной карте */
              window.riverMap.forEach(updateRiverMap);
            }
          }


          /* ================================================== */
          /*   КОНЕЦ РЫБНОГО КОСТЫЛЯ, ДАЛЬШЕ КОД ИНДИКАТОРА ХП  */
          /* ================================================== */


          /* Синий кристалл (Колесо фортуны)     'o268' */
          /* Зеленый кристалл (Колесо фортуны)   'o269' */
          /* Оранжевый кристалл (Колесо фортуны) 'o270' */
          /* Тотем (Колесо фортуны)              'o271' */
          /* Неактивированный рычаг (Подвалы)    'o205' */
          /* Колодец (Подвалы)                   'o226' */
          /* Колодец (Пещера)                    'o458' */
          /* Камень стихий (Пещера)              'o478' */
          /* Живой куст (Ресурсный бой)          'o602' */
          var otherIds = ('o268,o269,o270,o271,o205,o226,o458,o478,o602').split(',');

          var showLifeAnyway = function (checkId) {
            for (var id of otherIds) {
              if (id == checkId) return true;
            }
            return false;
          };


          $('#battleMap .mapobj').each(function (idx, obj) {
            var objId = obj.id.match(/(m|o)\-?\d+$/i);
            if (objId && objId.length == 2) {
              var realObj = realMapObjects[objId[0]];

              var isLiving = objId[1] == 'm';
              var objName = realObj[2];

              /* лайфбар игрока всегда будет отображаться корректно, даже если он сам под невидом */
              var isSelf = C.PR.map.self && C.PR.map.self == objId[0];
              var lifeMax = parseInt(isSelf ? C.PL.health_max : realObj[4]);
              var lifeNow = parseInt(isSelf ? C.PL.health : realObj[5]);

              /* фикс чтобы у невидов не было пустого лайфбара. лучше другим цветом его раскрасить */
              var isInvis = isNaN(lifeMax) || isNaN(lifeNow);
              var lifePerc = isInvis ? 100.00 : (lifeNow / lifeMax * 100).toFixed(2);
              var lifeText = isInvis ? '&infin;' : (Math.round(lifePerc) + ' %');

              if (isLiving || showLifeAnyway(objName) || (isFish(objName) && lifeMax > 1)) {
                var r, g, b;
                if (!isLiving) {
                  r = 0;
                  g = 191;
                  b = 255;
                } /* #00BFFF, deepskyblue */
                else if (isInvis) {
                  r = 0;
                  g = 255;
                  b = 255;
                } /* #00FFFF, aqua */
                else if (lifePerc >= 100) {
                  r = 0;
                  g = 128;
                  b = 0;
                  lifePerc = 100.00;
                } /* #008000, green  (?..100) */
                else if (lifePerc >= 70) {
                  r = 0;
                  g = 255;
                  b = 0;
                  if (lifePerc < 87) {
                    r += Math.round(255 / 17 * (87 - lifePerc));
                  }
                } /*  #00FF00, lime        (99..87);  transition lime->yellow        grow red   0-255    (86..70)  */
                else if (lifePerc >= 41) {
                  r = 255;
                  g = 255;
                  b = 0;
                  if (lifePerc < 58) {
                    g -= Math.round((255 - 140) / 17 * (58 - lifePerc));
                  }
                } /*  #FFFF00, yellow      (69..58);  transition yellow->darkorange  fade green 255-140  (57..41)  */
                else if (lifePerc >= 12) {
                  r = 255;
                  g = 140;
                  b = 0;
                  if (lifePerc < 29) {
                    g -= Math.round(140 / 17 * (29 - lifePerc));
                  }
                } /*  #FF8C00, darkorange  (40..29);  transition darkorange->red     fade green 140-0    (28..12)  */
                else if (lifePerc >= 0) {
                  r = 255;
                  g = 0;
                  b = 0;
                } /* #FF0000, red  (12..0) */
                else {
                  r = 0;
                  g = 0;
                  b = 0;
                  lifePerc = 0.00;
                } /* #000000, black */

                obj.innerHTML = '<center><div title="' + lifeText + '" style="position:relative; top:5px; height:4px; width:25px; background-color:black; z-index:100"><div title="' + lifePerc + ' %" style="float:left; height:4px; width:' + lifePerc + '%; background-color:rgb(' + r + ',' + g + ',' + b + ');"></div></div></center>';
              }
            }
          });
        } else /* подчищаем мусор после окончания ресбоя */
          if (window.showFishingHoleLife) {
            window.showFishingHoleLife = false;
            delete window.riverMap;
          }
      }; 
      
      window.eval("$ ( 'html' ).ajaxSuccess (" + hpbar.toString() + ");");
    }
);
