var status_form = 0;
var isActive = false;
var newWin = false;
var func_js = [];
var timeright = [];

//console.log("work_jump_youtube");

func_js['go-jump'] = function(id_elem, id, time, hash){

    if (status_form == '0') {
        status_form = 1;

        $.ajax({
            url: '/site_youtube/ajax/ajax_youtube_nobd.php', type: 'POST',
            data: {'sf': 'start_youtube_view_y', 'id': id, 'hash': hash, 'go-jump' : true},
            dataType: 'json',
            beforeSend: function () {},
            error: function (r){ status_form = 0; },
            success: function (r){
                status_form = 0;

                if(r.success == true) {

                    alert("url " + r.url);
                    
                    newWin = window.open(r.url, "_blank");
                    document.title = 'Загрузка!';

                    newWin.focus();


                    //clearInterval(func_js['challengeWin']);


                    clearInterval(func_js['timerExecution' + id]);
                    func_js['timerExecution' + id] = false;

                    setTimeout(function () {
                    }, 2000);

                    func_js['count_down_timer_execution'](time, id, r.hash);
                    /*
                    if(deb == true) {
                        func_js['challengeWin'] = setInterval(function () {
                            console.log("challengeWin0");
                            if (newWin.closed) {
                                newWin = false;
                                focus = false;
                                error = '';
                                if (func_js['timerExecution'] !== false) {
                                    console.log("challengeWin1");
                                    clearInterval(func_js['timerExecution' + id]);
                                    error_echo("Просмотр не засчитан, необходимо быть на странице с видео некоторое время.");
                                    //error_start('<span class=\"msg-error\">Переход не засчитан, необходимо быть на странице ' + time + ' секунд</span>', '#error-footer', 3000);
                                }
                                clearInterval(func_js['timerExecution']);
                                func_js['timerExecution'] = false;
                                clearInterval(func_js['challengeWin']);
                                console.log("challengeWin2");
                                document.title = 'Seo-Fast';
                            }
                        }, 100);
                    }
                    */
                    $('#res_views' + id).html("" +
                     "<center>" +
                      "<div>" +
                       "<div style='display: grid; justify-items: center;justify-content: center;'>" +
                        "<span style='display: inline-flex; align-items: center; color: #444A5C;'>" +
                         "<a class='fa fa-clock-o' style='color: #D98AEAFF; font-size: 15px; top: -2px; margin-right: 5px; position: relative;' ></a>Осталось: <span id='timer_ads_"+id+"' style='font-weight: bold; padding: 0 3px;'>0</span>сек</span>" +
                          "<span class='serf-text' style='border-bottom: 1px dotted #ABB5B1; font-size: 12px; color: #ABB5B1; cursor: pointer; margin-top:1px;' onclick=\"del_i_see_y('"+id+"');\" >Отказаться от выполнения</span>" +
                           "</div>" +
                            "</div>" +
                             "</center>" +
                              "");

                } else if (r.error) {
                    if (r.error == "off") {
                        $('#youtube_v' + id).hide();
                    }
                    if (r.error == "slow_startup") {
                        error_echo("Начните задачу позже.");
                    } else {
                        if (r.url != null) {
                            setTimeout(() => window.open(r.url), 150);
                        }
                        console.log(r.error);
                        $('#res_views' + id).html("<center><div class='youtube_error' style='text-align: center;'>" + r.error + "</div></center>");
                    }
                }


                /*
                if (infa.error != '') {
                    $(id_elem).html(infa.error);
                } else {
                    console.log("url "+url);
                    newWin = window.open(infa.url, "_blank");
                    document.title = 'Загрузка!';

                    newWin.focus();

//                    clearInterval(func_js['challengeWin']);
                    clearInterval(func_js['timerExecution']);
                    func_js['timerExecution'] = false;

                    setTimeout(function(){}, 2000);

                    func_js['count_down_timer_execution'](time, id, hash);

//                    func_js['challengeWin'] = setInterval(function () {
//                        if (newWin.closed) {
//                            newWin = false;
//                            focus = false;
//                            error = '';
//                            if (func_js['timerExecution'] !== false) {
//                                error_start('<span class=\"msg-error\">Переход не засчитан, необходимо быть на странице '+time+' секунд</span>','#error-footer', 3000);
//                            }
//                            clearInterval(func_js['timerExecution']);
//                            func_js['timerExecution'] = false;
//                            clearInterval(func_js['challengeWin']);
//
//                            document.title = 'Seo-Fast';
//                        }
//                    }, 100);

                }
                */
            }
        });
    }

}

func_js['jump-mess'] = function(id, mess){
    $(id).html(mess);
}

func_js['count_down_timer_execution'] = function (timeleft, id, hash) {
    func_js['timerExecution'+id] = setInterval(function(){
        //if (!func_js["windowHasFocus"]()) {


        timeright['id_'+id] = 0;
        //console.log("timeright ("+id+"): "+timeright['id_'+id]);
        if(1==1){
            document.title = timeleft+' сек..';
            $('#timer_ads_' + id).html(timeleft);
            timeleft--;
            timeright['id_'+id] = timeright['id_'+id]+1;
            if (timeleft+1 <= 0) {
                document.title = 'Просмотр засчитан!';
                $('#res_views' + id).html("<center><a onclick=\"func_js['start_jump']('"+id+"', '"+hash+"')\" class='sf_button_purple'>Подтвердить просмотр</a></center>");
                clearInterval(func_js['timerExecution'+id]);
                func_js['timerExecution'+id] = false;
            }


            //if(deb == true) {
            if(1==2){
                if (timeright['id_'+id] < 4) {
                    func_js['challengeWin'] = setInterval(function () {
                        //console.log("challengeWin01");
                        window.addEventListener('focus', function () {
                            if (func_js['timerExecution'] !== false) {
                                //console.log("challengeWin1");
                                clearInterval(func_js['timerExecution' + id]);
                                del_i_see_y(id);
                                error_echo("Просмотр не засчитан, необходимо быть на странице с видео некоторое время.", 5000);
                                //error_start('<span class=\"msg-error\">Переход не засчитан, необходимо быть на странице ' + time + ' секунд</span>', '#error-footer', 3000);
                            }
                            clearInterval(func_js['timerExecution']);
                            func_js['timerExecution'] = false;
                            clearInterval(func_js['challengeWin']);
                            //console.log("challengeWin2");
                            document.title = 'Seo-Fast';
                        });
                        //}
                    }, 100);
                }
            }

        }
    }, 1000)
};

func_js["windowHasFocus"] = function () {
    if (document.hasFocus()) return true;
    let hasFocus = false;

    window.addEventListener('focus', function () {
        hasFocus = true;
        document.title = 'Seo-Fast';
    });
    //window.focus();

    return hasFocus;
}

func_js['start_jump'] = function(id, hash){
    if (status_form == '0') {
        status_form = 1;
        $.ajax({
            url: '/statica/ajax/ajax-youtube-external.php', type: 'POST',
            data: {'hash': hash, },
            dataType: 'json',
            beforeSend: function () {},
            error: function (infa){ status_form = 0; },
            success: function (infa){
                if(infa.result == 'success') {
                    verified_views();
                }
                status_form = 0;
                $('#res_views' + id).html(infa.html);
                eval(infa.code);

                delete timeright['id_'+id];
            }
        });
    }
};

/*
function viewCheck_yt() {

    var quality = player.getPlaybackQuality()
    var ismuted = player.getVolume()
    var duration = player.getDuration()
    var time_v = Math.ceil(player.getCurrentTime());

    if (video_serf == '0') {
        video_serf = 1;
        $.ajax({
            url: originDomain + '/statica/ajax/ajax-youtube-external.php', type: 'POST',
            data: {'hash': hash, 'report_id': reportId, 'task_id': taskId, 'timer': timerInitial, 'player_time': playerTime, 'video_id': videoId, 'stage': stage, 'player_state': playerState, 'duration' : duration, 'quality' : quality, 'button' : button, 'ismuted' : ismuted, 'time_v' : time_v },
            dataType: 'json',
            error: function (infa) {
                video_serf = 0;
            },
            success: function (infa) {
                video_serf = 0;

                $('#succes-error').html(infa.html);
                eval(infa.code);
                if(close == 1){
                    window.close();
                }
            }
        });
    }
}
*/