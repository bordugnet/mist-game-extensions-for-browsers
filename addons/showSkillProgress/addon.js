define("showSkillProgress",
    [],
    function() {
		//навыки
		let skill_names = {
					'9' : 'Созидание',
					'10': 'Рыболовство',
		            '11': 'Кулинария',
		            '12': 'Разделка рыбы',
					'13': 'Сбор растений',
		            '14': 'Травничество',
					'15': 'Алхимия',
					'16': 'Охота',
		            '17': 'Разделка животных',
					'18': 'Ремесленничество',
		            '19': 'Призыв',
					'29': 'Добыча дерева',
					'30': 'Добыча железа',
		            '39': 'Магические свитки'
		        };
		//отображение информации о скиллах в интерфейсе
		function showSkills(skill, value, percentage) {
		    if ($('#skills_info').length) {
		        $('#skills_info').text(skill + ': ' + value);
		        $('#skills_percentage').text('Рост навыка: ' + percentage + '%')
		    } else {
		        $('.scr_razd').append('<p id="skills_info">' + skill + ': ' + value + '</p><p id="skills_percentage">Рост навыка: ' + percentage + '%');
		    }
		}
		//инфо о скилах в меню рецептов
		function getSkillsRecipies(arr = null, skill_names = null) {
			if (!arr || !skill_names) return;
			let skills = [];
			arr.forEach(function(item, i, arr) {
				skill = skill_names[item.id_skill];
				if (!skill) console.log('Не найдено - id = ' + item.id_skill + ' / value = ' + item.props[0].value);
				else {
					if (item.props[1].id_prop == 98) itemProgress = item.props[1].value; // 98 - id значения прогресса навыка
					else if (item.props[2].id_prop == 98) itemProgress = item.props[2].value;
					else itemProgress = 'unknown';
					skills[skill] =
						{
							'value': item.props[0].value,
							'progress': itemProgress
						}
				}
			});
			//инфа о текущем навыке
			let currentDisplaySkill = $('.scr_top').children('.ml5.bold').text();
			let currentSkill = currentDisplaySkill.split(' - ')[0];
			if (skills[currentSkill]) {
				if ($('#skillProgress').length !== 0) {
					$('#skillProgress').text('Прогресс - ' + skills[currentSkill].progress + '%');
				} else {
					$('.scr_top').children('.ml5.bold').after(' | <span id=skillProgress style="font-weight:bold;">Прогресс - ' + skills[currentSkill].progress + '%</span>');
				}

			} else return;
		}
		//получение информации о скиллах
		function getSkillsLocation(location_name, arr = null) {
			if (!arr) return;
		    //Локации, в которых показывать навыки
		    let locations = ['Городской выкос', 'Большой луг', 'Беличья роща', 'Тенистая дубрава', 'Устье Белой реки', 'Приморье', 'Заповедное поле', 'Сумрачный бор', 'Цинейское побережье', 'Питомник', 'Заповедник'];
			if (!locations.includes(location_name)) {
		        return;
		    }
		    //Список навыков
		    let user_skills = {};
			let skill_names = {
		            '10': 'Рыболовство',
		            '13': 'Сбор растений',
		            '16': 'Охота',
		            '30': 'Добыча железа',
		            '29': 'Добыча дерева',
		            '9': 'Созидание',
		            '12': 'Разделка рыбы',
		            '14': 'Травничество',
		            '17': 'Разделка животных',
		            '11': 'Кулинария',
		            '19': 'Призыв',
		            '39': 'Магические свитки'
		        };
		    arr.forEach(function(item, i, arr) {
		        skill = skill_names[item.id_skill];
		        value = item.props[0].value;
				itx = 2; //индекс прогресса навыка
		        if (skill == 'Рыболовство' || skill == 'Сбор растений' || skill == 'Охота') {					
		            percentage = item.props[itx].value;
		            user_skills[skill] = {};
		            user_skills[skill]['value'] = value;
		            user_skills[skill]['percentage'] = percentage;
		        }
		    });
		    //console.log(user_skills);
		    if (location_name == "Городской выкос" || location_name == "Большой луг" || location_name == "Заповедное поле") {
		        show_skill = user_skills['Сбор растений'];
		        showSkills('Сбор растений', show_skill['value'], show_skill['percentage']);
		    } else if (location_name == "Беличья роща" || location_name == "Тенистая дубрава" || location_name == "Сумрачный бор") {
		        show_skill = user_skills['Охота'];
		        showSkills('Охота', show_skill['value'], show_skill['percentage']);
		    } else if (location_name == "Устье Белой реки" || location_name == "Приморье" || location_name == "Цинейское побережье") {
		        show_skill = user_skills['Рыболовство'];
		        showSkills('Рыболовство', show_skill['value'], show_skill['percentage']);
		    } else if (location_name == "Заповедник" || location_name == "Питомник") {
				console.log('in progress');
			}
		}
		//При успешном аяксе
		$('html').ajaxSuccess(function() {
			let playerCurrentLocation = C.PR.intf;
			if (playerCurrentLocation == 'resource_location') {
				getSkillsLocation(C.PR.title, C.PL.skills);
			}
			if (playerCurrentLocation == 'recipes') {
				getSkillsRecipies(C.PL.skills, skill_names);
			}
		});
	}
);
