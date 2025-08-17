define("zagorodSound",
  [],
  function () {

    var playSound = function () { 
      if ((FireUI.enabledModules.includes('zagorodSound') == true) && (C.PR.intf == 'worldMap') && (FireUI.catchMyNickState == 1)) {
        if (document.getElementById('slf_dmn_time_start') != null) {
          if (document.getElementById('slf_dmn_time_start').innerText == '00:25') {
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', FireUI.addonsBaseUrl + FireUI.paths.zagorodSound.sound);//'https://i.mist-game.ru/sound/notification.mp3');
            audioElement.play();
          }
        }
      }
    }
    window.eval("$ ( 'html' ).ajaxComplete (" + playSound.toString() + ");");
  }
);
