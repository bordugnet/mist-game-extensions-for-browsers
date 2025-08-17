define("extendedShedule",
    [],
    function() {
        if (typeof(FireUI) !== 'object') {
            throw new Error('FireUI: cannot initialize "Extended Shedule" addon, aborting.');
        } else {
            FireUI.addons.extendedShedule = {
                errorMessages: {
                    battle: [
                        'Вы хотели посмотреть сводку по последним событиям, но едва не пропустили удар в челюсть. Вы решили дочитать после боя.',
                        'Неодобрительный взгляд соратников по оружию навел вас на мысль о том, что, возможно, читать газету в разгар битвы - не самая лучшая затея.',
                        '"Не самое лучшее время для чтения сводки событий" - решили вы, пропуская очередной удар щитом в лоб.'
                    ],
                    mine: [
                        'Вы заняты тяжелым трудом, вам некогда читать новости. Вы решили сперва закончить работу.',
                        'Прораб отобрал ваши заметки, вручил инструмент и уходя бросил фразу "Либо читай свои газеты в перерыв, либо проваливай отсюда, нам бездельников не надо!"',
                        'В прошлом году одного хайлвла лишили лицензии на рубанок на целых полчаса из-за того что отвлекался в рабочее время, вы решили не рисковать.',
                    ],
                },
                randomErrorMessage: function (location) {
                    return this.errorMessages[location][Math.floor(Math.random() * this.errorMessages.mine.length)]
                },
                show: function() {
                    if (!$('#extended_events_shedule').length) return;

                    //закрыть при повторном нажатии
                    if ($('#extendedSheduleSuccess').length || $('#ch_group_unsuccess').length) {
                        this.close();
                        return;
                    }

                    INTF.CANV.change(); //эта штука сбросит текущую активную вкладку
                    $('#canvastd').find('.can_cont').html('<div id="chars_canvas" class="chars"></div>');

                    if (C.PR.intf == 'battle') {
                        let message = this.randomErrorMessage('battle');
                        $('#chars_canvas').append('<div id="ch_group_unsuccess" class="ch_group white"></div>');
                        $('#ch_group_unsuccess').append('<div class="extendedSheduleItem"><div class="ch_gt" title="">' + message + '</div></div>');
                        $('#chars_canvas').append('<div class="center pt5"><button type="button" class="ctrl_button ctrl_close " onclick="FireUI.addons.extendedShedule.close()" value="&nbsp;"></button></div>');
                    } else if (C.PR.intf == 'charMine') {
                        let message = this.randomErrorMessage('mine');
                        $('#chars_canvas').append('<div id="ch_group_unsuccess" class="ch_group white"></div>');
                        $('#ch_group_unsuccess').append('<div class="extendedSheduleItem"><div class="ch_gt" title="">' + message + '</div></div>');
                        $('#chars_canvas').append('<div class="center pt5"><button type="button" class="ctrl_button ctrl_close " onclick="FireUI.addons.extendedShedule.close()" value="&nbsp;"></button></div>');
                    } else {
                        $('#chars_canvas').append('<div id="extendedSheduleSuccess"></div>'); //succeess container
                        C.post("event_schedule", null, false, true, this.fetch);
                    }
                },
                close: function() {
                    if (C.PR.intf == 'battle' || C.PR.intf == 'adventure' || C.PR.intf == 'charMine') {
                        INTF.CANV.set('pic');
                    } else {
                        INTF.CANV.set('location');
                    }
                },
                fetch: function(rawData) {
                    if (!rawData.length) {
                        console.log('nope');
                    }
                    var data = JSON.parse(rawData);
                    var events = data.process.data.config;
                    events.info.forEach(function(item, i, data) {
                        //уберем ненужную инфу
                        if (item.title == 'Война Гордыни' || item.title == 'Артефакт' || item.title == 'Ледяной чертог' || item.title == 'Забытый тоннель' || item.title == 'Замок поединков' || item.title == 'Клановые соревнования') {
                            //do nothing
                        }
                        //Дальше нужно немножко переформатировать вывод данных, так как оно в таком объеме не надо, да и не помещается
                        //Храм
                        else if (item.title == 'Заброшенный храм') {
                            $('#extendedSheduleSuccess').append('<div id="ch_group_' + i + '" class="ch_group white"></div>');
                            $('#ch_group_' + i).append('<div class="extendedSheduleItem" id="extendedSheduleItem_' + i + '"><div class="ch_gt" title="">&nbsp;' + item.title + '</div><div id="ch_gcont_' + i + '" class="ch_gcont l2brown f90 lh100"></div></div>');
                            item.params.forEach(function(param, num, data) {
                                if (param[0] == 'Расписание') {
                                    //do nothing
                                } else {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + param[1].string + '</span></div>');
                                }
                            });
                        }
                        //Подвал
                        else if (item.title == 'Подвалы Замка поединков') {
                            $('#extendedSheduleSuccess').append('<div id="ch_group_' + i + '" class="ch_group white"></div>');
                            $('#ch_group_' + i).append('<div class="extendedSheduleItem" id="extendedSheduleItem_' + i + '"><div class="ch_gt" title="">Подвалы</div><div id="ch_gcont_' + i + '" class="ch_gcont l2brown f90 lh100"></div></div>');
                            item.params.forEach(function(param, num, data) {
                                if (param[0] == 'Ближайший поход') {
                                    let nextPohod = param[1].string;
                                    if (nextPohod == 'Создать,demand_dungeon') {
                                        nextPohod = 'Сегодня';
                                    }
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + nextPohod + '</span></div>');
                                } else if (param[0] == 'Разрешение на повторный поход') {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">Повторка</div><div class="fr">' + param[1].string + '</span></div>');
                                } else {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + param[1].string + '</span></div>');
                                }
                            });
                        }
                        //Загород
                        else if (item.title == 'Загородное путешествие') {
                            $('#extendedSheduleSuccess').append('<div id="ch_group_' + i + '" class="ch_group white"></div>');
                            $('#ch_group_' + i).append('<div class="extendedSheduleItem" id="extendedSheduleItem_' + i + '"><div class="ch_gt" title="">' + item.title + '</div><div id="ch_gcont_' + i + '" class="ch_gcont l2brown f90 lh100"></div></div>');
                            item.params.forEach(function(param, num, data) {
                                if (param[0] == 'Ближайшее создание символа') {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">Создание символа</div><div class="fr">' + param[1].string + '</span></div>');
                                } else if (param[0] == 'Загородные стражи') {
                                    let strazhTime = param[1].string;
                                    /*if (strazhTime.includes('время появления')){
                                    	console.log('yo');
                                    	//var strazhTime = strazhTime.replace('время появления ','');
                                    }*/
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + strazhTime + '</span></div>');
                                } else {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + param[1].string + '</span></div>');
                                }
                            });
                        }
                        //Папоротник
                        else if (item.title == 'Цветок папоротника') {
                            $('#extendedSheduleSuccess').append('<div id="ch_group_' + i + '" class="ch_group white"></div>');
                            $('#ch_group_' + i).append('<div class="extendedSheduleItem" id="extendedSheduleItem_' + i + '"><div class="ch_gt" title="">' + item.title + '</div><div id="ch_gcont_' + i + '" class="ch_gcont l2brown f90 lh100"></div></div>');
                            item.params.forEach(function(param, num, data) {
                                if (param[1].string == 'Да') {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr bold">' + param[1].string + '</span></div>');
                                } else {
                                    $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + param[1].string + '</span></div>');
                                }
                            });
                        } else {
                            $('#extendedSheduleSuccess').append('<div id="ch_group_' + i + '" class="ch_group white"></div>');
                            $('#ch_group_' + i).append('<div class="extendedSheduleItem" id="extendedSheduleItem_' + i + '"><div class="ch_gt" title="">&nbsp;' + item.title + '</div><div id="ch_gcont_' + i + '" class="ch_gcont l2brown f90 lh100"></div></div>');
                            item.params.forEach(function(param, num, data) {
                                $('#ch_gcont_' + i).append('<div style="height:13px;" class="ch_val"><div class="fl">' + param[0] + '</div><div class="fr">' + param[1].string + '</span></div>');
                            });
                        }
                    });
                    //кнопка закрыть
                    $('#chars_canvas').append('<div class="center pt5"><button type="button" class="ctrl_button ctrl_close " onclick="FireUI.addons.extendedShedule.close()" value="&nbsp;"></button></div>')
                    $('#canvas').updatescrolling(); //обновить скролл у тряпки
                }
            }

            $('#ti_7').after('<button class="tube_icon ti_8 events_shedule" id="extended_events_shedule" title="Расписание" onclick="FireUI.addons.extendedShedule.show()">&nbsp;</button>');
        }
    }
);
