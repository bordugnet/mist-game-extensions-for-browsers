define("chatHistory",
  [],
  function () {
    if (typeof (FireUI) !== 'object') {
      throw new Error('FireUI: cannot initialize "chatHistory" addon, aborting.');
    } else {
      FireUI.addons.chatHistoryButton = {
        init: function () {
          $('html').ajaxSuccess(function () {
            if ($('.chatHistoryContainer').length == 0) {
              $('.cbott').append('<div class="chatHistoryContainer"><div class="chatHistoryButtonContainer"><div onclick="FireUI.addons.chatHistoryButton.chatHistoryBtn()" class="chatHistoryButton">открыть историю чата</div></div></div>');
            }
          })
        },
        chatHistoryBtn: function () {
          let AllLog = '';
          for (let i = 0; i <= FireUI.chatLog.length - 1; i++) {
            var chMsg = FireUI.chatLog[i];
            //chMsg = chMsg.replaceAll('id="i', '<a class="i" href="https://www.mist-game.ru/iteminfo_');
            //chMsg = chMsg.replaceAll('" class="i"', '.html" target="_blank"</a>');
            AllLog = AllLog + chMsg + '<br>';
          }
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>История чата mist-game</title>
              <link rel="stylesheet" href="https://i.mist-game.ru/css_v4/compile/style.min.v1.css">
            <style>
            html, body {
              background: #F3ECD4;
              color: #0E0000; 
              overflow: visible;             
            }
            </style>
            </head>
            <body>              
            `+
            AllLog;
          +`                                  
            </body> 
            </html>
          `;
          const newTab = window.open();
          newTab.document.write(htmlContent);
          newTab.scrollTo({ top: newTab.document.documentElement.scrollHeight, behavior: 'smooth' });
          newTab.document.close();
        }
      }
      FireUI.addons.chatHistoryButton.init();

      //btn clear chat log
      FireUI.addons.logClearButton = {
        init: function () {
          $('html').ajaxSuccess(function () {
            if ($('.logClearContainer').length == 0) {
              $('.cbott').append('<div class="logClearContainer"><div class="logClearButtonContainer"><div onclick="FireUI.addons.logClearButton.logClearBtn()" title="Очистить историю чата" class="logClearButton">⨯</div></div></div>');
            }
          })
        },
        logClearBtn: function () {
          localStorage.removeItem('chatHistory');
          FireUI.chatLog = [];
        }
      }
      FireUI.addons.logClearButton.init();

      //catchMyNick
      FireUI.addons.catchMyNick = {
        init: function () {
          $('html').ajaxSuccess(function () {
            if ($('.catchMyNickContainer').length == 0) {
              $('.cbott').append('<div class="catchMyNickContainer"><div class="catchMyNickButtonContainer"><div onclick="FireUI.addons.catchMyNick.enabledcatchMyNick()" title="Звук загорода и чата" class="catchMyNickButton">📢</div></div></div>');
              if (FireUI.catchMyNickState == 0) {
                document.getElementsByClassName('catchMyNickButton')[0].innerText = '📢 🗶';
                document.getElementsByClassName('chatHistoryContainer')[0].style.right = '42px';
                document.getElementsByClassName('chatHistoryContainer')[0].style.width = '164px';
              } else {
                document.getElementsByClassName('catchMyNickButton')[0].innerText = '📢';
                document.getElementsByClassName('chatHistoryContainer')[0].style.right = '30px';
                document.getElementsByClassName('chatHistoryContainer')[0].style.width = '176px';
                
              }
            }
          })
        },
        enabledcatchMyNick: function () {
          if (FireUI.catchMyNickState == 1) {
            FireUI.catchMyNickState = 0;
            document.getElementsByClassName('catchMyNickButton')[0].innerText = '📢 🗶';
            document.getElementsByClassName('chatHistoryContainer')[0].style.right = '42px';
            document.getElementsByClassName('chatHistoryContainer')[0].style.width = '164px';
          } else {
            FireUI.catchMyNickState = 1;
            document.getElementsByClassName('catchMyNickButton')[0].innerText = '📢';
            document.getElementsByClassName('chatHistoryContainer')[0].style.right = '30px';
            document.getElementsByClassName('chatHistoryContainer')[0].style.width = '176px';
          }
          //localStorage.setItem('catchMyNickButton', FireUI.catchMyNickState);
        }
      }

      FireUI.addons.catchMyNick.init();
    }

    var addToChatLog = function () {
      for (let i = 0; i <= document.getElementsByClassName('ch_message').length - 1; i++) {
        var messagesElements = document.getElementsByClassName('ch_message')[i].innerHTML;
        messagesElements = messagesElements.replaceAll('<div', '<span');
        messagesElements = messagesElements.replaceAll('</div>', '</span>');
        messagesElements = messagesElements.replaceAll(' bis_skin_checked="1"', '');
        messagesElements = messagesElements.replaceAll('//pic.mist-game.ru', 'http://pic.mist-game.ru');
        messagesElements = messagesElements.replaceAll('//i.mist-game.ru', 'http://pic.mist-game.ru');
        messagesElements = messagesElements.replaceAll('http://pic.mist-game.ru/interface_v4//i/interface/compile/empty.gif', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png');        

        if (messagesElements.indexOf('Объявление') > 0) {
          continue;
        }

        if (FireUI.chatLog.includes(messagesElements) == false) {
          //удалим первое сообщение если их больше 5000
          if (FireUI.chatLog.length > 5000) {
            FireUI.chatLog.shift();
          }
          FireUI.chatLog.push(messagesElements); //добавляем и сохраняем сообщение
          localStorage.setItem('chatHistory', FireUI.chatLog);

          //свой логин
          if (FireUI.catchMyNickState == 1) {
            let my_nick = C.PL.login;
            if (messagesElements.indexOf(my_nick) > 0) {
              var audioElement = document.createElement('audio');
              audioElement.setAttribute('src', FireUI.addonsBaseUrl + FireUI.paths.zagorodSound.sound2);//'https://i.mist-game.ru/sound/notification.mp3');
              audioElement.play();
            }
            //добыча
            if (messagesElements.indexOf('Вы добыли') > 0) {
              var audioElement = document.createElement('audio');
              audioElement.setAttribute('src', FireUI.addonsBaseUrl + FireUI.paths.zagorodSound.sound2);//'https://i.mist-game.ru/sound/notification.mp3');
              audioElement.play();
            }
          }
        }
      }
    }

    window.eval("$ ( 'html' ).ajaxComplete (" + addToChatLog.toString() + ");");
  }
);