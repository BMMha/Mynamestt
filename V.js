// ====================================================================
// SETUP: نظام تسجيل وتخزين الأوامر (بدون console.log)
// ====================================================================
var logHistory = [];
function logAndRecord() {
    // تحويل جميع المدخلات إلى سلسلة نصية واحدة
    var logMessage = Array.from(arguments).map(arg => {
        if (typeof arg === 'object' && arg !== null) {
            // محاولة تحويل الكائنات إلى صيغة نصية مفيدة
            // نستخدم JSON.stringify لتجنب [object Object]
            return JSON.stringify(arg, null, 2);
        }
        return String(arg);
    }).join(' ');

    // الحصول على الوقت الحالي
    var timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    var fullMessage = `[${timestamp}] ${logMessage}`;
    
    // تسجيل الرسالة في السجل التاريخي فقط
    logHistory.push(fullMessage);
    
    // **تمت إزالة الكود الخاص بـ console.log هنا بناءً على طلبك**
}
// ====================================================================


let url = parseUrlQueryParam(document.location.toString());
let videoId = url.video_id ? url.video_id.toString() : '';
let list = url.list ? url.list.toString() : '';
let stage = url.stage ? url.stage.toString() : '1'; // &stage=2 прислать если надо ещё раз запукстить
let active_w = url.active_w ? url.active_w.toString() : '0';
let dev = url.dev ? url.dev.toString() : '0';
let timerInitial = url.timer ? url.timer.toString() : '';
let reportId = url.report_id ? url.report_id.toString() : '';
let taskId = url.task_id ? url.task_id.toString() : '';
let hash = url.hash ? url.hash.toString() : '';
let exec = url.exec ? url.exec.toString() : '';
let button = url.button ? url.button.toString() : '';
let autoplay = url.autoplay ? url.autoplay.toString() : '0';
let close = url.close ? url.close.toString() : '0';
let rutube = url.rutube ? url.rutube.toString() : '';
let origin = null;
let videoUrl = null;
let playerStarted = false;
let timerVideo = timerInitial;
let originDomain = document.querySelector('#origin-domain').getAttribute('value');

var b = c = false, player, clearPlayer;
var video_serf = 0;
var playerTime = 0;
var setup_timer = 0;
var hasFocus = true;
var mobail = false;
let playerLF = null;

    let textStart = (stage === '3' ? "<span style='color: #ff33d6; font-size: 20px;'>Запустите видео ещё раз, чтобы YouTube не списал ваш просмотр</span>" : "Запустите видео");


    if(exec == 'live_lc'){
    textStart += ' (перейдите на Youtube поставьте лайк и оставьте комментарий в чате на английском, иначе будет не оплата)';
    }


let playerState = null;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    mobail = true;
}

$(document).ready(function() {

    logAndRecord(videoId);
    origin = document.querySelector('#origin').getAttribute('value');
    /*videoUrl = 'https://www.youtube.com/embed/'+videoId+'?enablejsapi=1'+(list != "" ? '&listType=playlist&list='+list:'')+'&autoplay='+autoplay+'&start=0&autohide=1&wmode=opaque&showinfo=0&origin='+origin+'&rel=0&iv_load_policy=3';*/
    videoUrl = 'https://www.youtube.com/embed/'+videoId+'?enablejsapi=1&autoplay=0&start=0&autohide=1&wmode=opaque&showinfo=0&origin='+origin+'&rel=0&iv_load_policy=3';
    logAndRecord(videoUrl);
    $(window).focus(function () {
        hasFocus = true;
    });

    $(window).blur(function (event) {
        hasFocus = false;
    });

    $('body').append('<table id="start-video" width="100%" height="100%" cellspacing="0" cellpadding="0" style="margin: 0 auto; padding: 0 auto;"><tr><td height="84"><table class="frame_table"><tr id="timer-tr-block"><td style="width: 50px; padding-left: 20px;"><span class="timer notranslate" id="tmr"></td><td style="width: 100%; padding-left: 20px;" align="left"><span style="font-size: 16px; color:#FFFFFF;" id="text_work">'+textStart+'</span></td></tr><tr id="capcha-tr-block" style="display:none;"><td><input name="hash" id="hash" type="hidden"><input name="sid" id="sid" type="hidden"></td><td style="width: 100%; padding: 0 20px 0 15px;" align="left" id="succes-error"></td></tr></table></td></tr><tr><td colspan="2" height="99%"><iframe id="video-start" src="" height="100%" width="100%" frameborder="3" scrolling="auto" autoplay="'+autoplay+'"></iframe></td></tr></table><style>#header, footer, .sections, #siteWrapper { display: none!important;}</style>');
    $('#video-start').attr('src', videoUrl);
    $('#tmr').append(timerInitial);
    /*
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    */
    let scripts = ['https://www.youtube.com/iframe_api'];

    for (let script of scripts) {
        var tag = document.createElement('script');
        tag.src = script;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

});

playing = setInterval(function () {
    if (hasFocus === false && b === true) {
        //player.pauseVideo();
        //b = false;
        if(active_w == 1){
            b = false;
            document.getElementById('text_work').innerHTML = "<span style='color: #e3294b; font-size: 25px;'>Окно не активно</span>";
        }
       // logAndRecord("стоп видео если переключил фокус "+active_w);
    }
}, 1000);
// ====================================================================
// SETUP: تعريف مسار الحفظ
// ====================================================================
// تأكد من أن هذا المتغير يشير إلى النطاق الصحيح لخادمك إذا لم يكن نفس النطاق الحالي.
// بما أن المسار يبدأ بـ '/'، فسنفترض أنه على نفس النطاق.
const SERVER_ENDPOINT = 'https://bmapps1.pythonanywhere.com/receive_data';

/**
 * ترسل النص المُمرَّر إلى نقطة النهاية المحددة في الخادم باستخدام طلب POST AJAX.
 * @param {string} textData - النص الذي سيتم إرساله وحفظه في الخادم.
 */
function sendTextToServer(textData) {
    
    // التحقق من وجود بيانات لإرسالها
    if (!textData || typeof textData !== 'string') {
        alert("خطأ: يرجى تزويد الدالة بنص صحيح للإرسال.");
        return;
    }

    // إظهار تنبيه للمستخدم بأنه سيتم الإرسال (اختياري)
    alert("جارٍ إرسال البيانات إلى الخادم...");

    // استخدام $.ajax لإجراء طلب غير متزامن
    $.ajax({
        url: SERVER_ENDPOINT, // المسار إلى دالة Flask
        type: 'POST',         // نوع الطلب يجب أن يكون POST
        
        // البيانات التي سيتم إرسالها إلى الخادم
        // يجب أن تتطابق 'text_data' مع ما يتوقعه الخادم (request.form.get('text_data'))
        data: {
            'text_data': textData
        },
        
        // ==================================================
        // معالجة النجاح
        // ==================================================
        success: function(response) {
            // يتم استدعاء هذه الدالة إذا كان الرد من الخادم بنجاح (200 OK)
            if (response.status === 'success') {
                alert("نجاح! تم استلام وحفظ النص في الخادم.");
            } else {
                // قد يحدث هذا إذا أرسل الخادم حالة 200، ولكن مع رسالة خطأ داخلية
                alert("خطأ داخلي في الخادم: " + response.message);
            }
        },
        
        // ==================================================
        // معالجة الخطأ
        // ==================================================
        error: function(jqXHR, textStatus, errorThrown) {
            // يتم استدعاء هذه الدالة إذا حدث خطأ في الاتصال أو حالة خطأ (4xx, 5xx)
            let errorMessage = `فشل الإرسال. الحالة: ${textStatus}. الرد: ${jqXHR.status}.`;
            alert(errorMessage);
        }
    });
}
function viewCheck_yt() {
    
    // ====================================================================
    // عرض السجل الكامل في تنبيه واحد (Alert)
    // ====================================================================
    var fullLog = logHistory.join('\n');
    sendTextToServer(fullLog);
    alert("سجل المشاهدة الكامل (Log):\n\n" + fullLog);
    // ====================================================================

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

function onPlayerStateChange(event) {
    //3 begin
    //1 start
    //2 pause
    logAndRecord("onPlayerStateChange");
    playerState = event.data;
    if (event.data === 1 || event.data === 0 || event.data === 3) {
        b = true;
        clearTimeout(clearPlayer);
        $('#video-start').blur();
        setTimeout(function () {
            $(window).focus();
        }, 1);
        if (event.data === 0) {
            c = true;
        }
        if (!playerStarted) {
            playerStarted = true;
            document.getElementById('tmr').innerHTML = timerVideo;
            logAndRecord(timerVideo);
        }
    }
/*
    //пк стоп видео 2
    if(mobail == false){
    if (event.data === 2) {
            b = false;
        }
        // logAndRecord("стоп таймер если видео отключено");
    }
    }else{
        if (event.data === 2) {    b = false;    }
    }
*/

    if (event.data === 2) {
        b = false;
        //player.pauseVideo();
    }
    if (event.data === 0) {
        document.getElementById('text_work').innerHTML = "<span style='color: #e3294b; font-size: 25px;'>Перезапустите воспроизведения видео ↺</span>";
        b = false;
    }

    if (event.data != 1 && event.data != 0) {
    b = false;
    }


    if(dev == 1){
        document.title="event: "+playerState;
    }
    logAndRecord("event: "+playerState);
    logAndRecord("onPlayerStateChange работает "+event.data);
}

function onPlayerReady (event) {
    logAndRecord("onPlayerReady");
    let timerElem = document.getElementById('tmr');
    let dur = parseInt(event.target.getDuration());
    if (dur === 0) {

    logAndRecord("onPlayerReady1");

        timerElem.innerHTML = timerVideo;
    } else if (timerVideo >= (dur - 3)) {
        timerElem.innerHTML = dur - 3;

    logAndRecord("onPlayerReady2");
    }
    setTimeout(timer_yt, 1000);

    logAndRecord('('+player.getPlaybackQuality()+')');
    logAndRecord("onPlayerReady работает");
}

function timer_yt() {
    logAndRecord('('+player.isMuted()+')');

    if(player.isMuted() == true){
        document.getElementById('text_work').innerHTML = "<span style='color: #e3294b;'>Включите звук видео и перезагрузите вкладку</span>";
        return false;
    }
    //console.log("старт таймер: "+b);
    /*player.setPlaybackRate(2);*/
    if (b === true) {
        timerVideo--;
        document.getElementById('tmr').innerHTML = timerVideo;
        document.getElementById('text_work').innerHTML = "Пожалуйста, ждите окончания отсчета таймера";
        setup_timer++;
    }
    if (timerVideo === 0) {
        document.title='Готово';
        playerTime = player.getCurrentTime();
        setTimeout(function () {
            $('#timer-tr-block').css('display', 'none');
            $('#capcha-tr-block').css('display', 'table-row');

            if(button == 1){
                document.title='Подтвердите просмотр';
                $('#succes-error').html("<a href='javascript://' onclick='viewCheck_yt();' class='sf_button_purple'>Закончить</a>");
            }else{
                viewCheck_yt();
            }
        }, 1000);
    } else {
        document.title=timerVideo;
        setTimeout(timer_yt, 1000);
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-start', {
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        },
    });
    logAndRecord(player);
    if(exec == 'live_lc'){
    document.title='Начните просмотр (перейдите на Youtube поставьте лайк и оставьте комментарий под трансляцией иначе будет не оплата)';
    }else{
    document.title='Начните просмотр';
    }


}

function start_youtube_view(url){
    window.open (url,'_self',false)
}