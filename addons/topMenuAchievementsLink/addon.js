define("topMenuAchievementsLink",
    [],
    function() {
        function initAchievementsLink() {
          if ($('#sub_menu_achievements').length) return;
          $.each($('.submgr'),function(key,val){
            if ($(val).children('#sub_menu_elem_3_0').length) {
              $(val).append('<div class="sub_menu_elem" id="sub_menu_achievements"><div class="razd"></div><a href="https://www.mist-game.ru/userprogress.html" target="blank"><div class="subel" id="subel_achievements" style="cursor: pointer;">Прогресс достижений</div></a></div>')
              $('#subel_achievements').hover(
                     function(){ $(this).addClass('subel_sel') },
                     function(){ $(this).removeClass('subel_sel') }
              )
            }
          })
        }
        initAchievementsLink();
    }
);
