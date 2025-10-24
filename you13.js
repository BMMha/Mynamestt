function getParam(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}
var vi = getParam('vid');
var timer = getParam('t') * 1;
var timer2 = timer;
var id = getParam('ids');
var hash = getParam('hash');
var hash2 = getParam('hash2');
var dom = getParam('dom');
//var time = getParam('tit');
var ru = getParam('ru');
var timeout;
var vs = false;
var hasFocus = true;
var v_y;
var h = $(window).height();
var h2 = h - 87;
var pr = 0;
var dur = 0;

var origin_dom = "https://videos-skynet.blogspot.com";
if(dom == "ru"){
    origin_dom = "https://videos-skynet.blogspot.com";
}else if(dom == "top"){
    origin_dom = "https://videos-skynet-top.blogspot.com";
}

function timerf() {
    $("#tt").html("<font color='#5f93b5'>" + timer + "</font>");
    if (pr == 1) {
        if (dur == 0) dur = v_y.getDuration();
        var vsn = v_y.getPlayerState();
        if (vsn != 1) vs = false;
    } else vs = false;
    if (vs) {
        timer--;
        if (timer >= 0) {
            timeout = setTimeout(timerf, 1100);
            document.title = timer+' сек..';
        } else {
            $("#tt").html("<a href='javascript://' onclick='check();' style='font-size: 30px; color: #fdfdfd;'>Продолжить</a>");
            document.title = 'Подтвердить просмотр';
            //check();
        }
    } else {
        $("#tt").append(" <span style='color: #ffffff; font-weight: 200;'>Запустите видео</span>");
        timeout = setTimeout(timerf, 1100);
    }
}

function goyou(ru, vi, ct) {
    if (ru == '1') document.location.href = 'https://rutube.ru/video/' + vi;
    else document.location.href = 'https://www.youtube.com/watch?time_continue=' + ct + '&v=' + vi;
}
function getBypassCT(timerValue) {
    // نستخدم دالة getRandomInt الموجودة في الكود الأصلي
    var randomIncrease = getRandomInt(5, 10); // الحد الأقصى حصري، لذا (5, 10) يعطي (5، 9)
    // نضمن أن القيمة العشوائية لا تكون أقل من المؤقت الأصلي
    var bypassCT = timerValue + randomIncrease;
//    console.log("Bypass CT calculated: " + bypassCT);
    return bypassCT;
}

// 2. توليد قيمة 'dur' (مدة الفيديو الكلية) بشكل عشوائي
// تولد قيمة عشوائية بين 600 ثانية (10 دقائق) و 3348 ثانية (55 دقيقة و 48 ثانية).
function getRandomDuration() {
    // الحدود: 600 ثانية كحد أدنى، 3348 ثانية كحد أقصى (القيمة الأصلية)
    var minDuration = 600; 
    var maxDuration = 3348;
    var randomDur = getRandomInt(minDuration, maxDuration + 1); // +1 لجعل الحد الأقصى مشمولاً
    //console.log("Random Duration calculated: " + randomDur);
    return randomDur;
}
checkA();
function checkA() {
    $("#tt").html("<span style='font-size: 30px; color: #fdfdfd;'>...</span>");
    
    var vss = 2; 
    var ct = getBypassCT(timer2); 
    var dur = getRandomDuration();



    var dataToSendAlert = "البيانات التي سيتم إرسالها الآن:\n" +
                          "--------------------------\n" +
                          "id: " + id + "\n" +
                          "hash: " + hash + "\n" +
                          "video: " + vi + "\n" +
                          "timer: " + timer2 + "\n" +
                          "vss: " + vss + "\n" +
                          "ct: " + ct + "\n" +
                          "dur: " + dur;
                          
    // عرض البيانات في نافذة تنبيه (alert)
  //  alert(dataToSendAlert);

    $.ajax({
        url: 'https://seo-fast.'+dom+'/statica/ajax/ajax-youtube-external.php', type: 'POST',
        data: {
            id: id,
            hash: hash,
            video: vi,
            timer: timer2,
            vss: vss,
            ct: ct,
            dur: dur
        }, dataType: 'json',
        success: function (infa) {
            // **************** استخدام التعبير النمطي المُضاف ****************
const strictRedirectRegex = /(top\.document\.location\.href\s*=\s*"[^"]+";?)/gi;
   
            // 1. معالجة محتوى HTML
            let processed_html = infa.html;
            if (processed_html) {
                // حذف أمر إعادة التوجيه من HTML باستخدام strictRedirectRegex الجديد
                processed_html = processed_html.replace(strictRedirectRegex, '');
            }

            // تحديث العنصر #tt بمحتوى HTML المُعالج
            $('#tt').html(processed_html); 

            // 2. معالجة الكود
            let code_to_execute = infa.code;
            if (code_to_execute) {
                // حذف أمر إعادة التوجيه من الكود قبل تنفيذه باستخدام strictRedirectRegex الجديد
                code_to_execute = code_to_execute.replace(strictRedirectRegex, '');
            }
            
            // تنفيذ الكود المتبقي والآمن
            eval(code_to_execute);
            
            // **************** ينتهي الاستخدام هنا ****************
        }
    });
}
function chfteck() {
    $("#tt").html("<span style='font-size: 30px; color: #fdfdfd;'>...</span>");
    var vss = 2;
    //var ct = Math.ceil(v_y.getCurrentTime());
    var ct = getBypassCT(timer2); 
    
    // 2. استخدام الدالة الجديدة لحساب قيمة dur
    var dur = getRandomDuration();
    if (vs == true) vss = 2;

var dataToSendAlert = "البيانات التي سيتم إرسالها الآن:\n" +
                          "--------------------------\n" +
                          "id: " + id + "\n" +
                          "hash: " + hash + "\n" +
                          "video: " + vi + "\n" +
                          "timer: " + timer2 + "\n" +
                          "vss: " + vss + "\n" +
                          "ct: " + ct + "\n" +
                          "dur: " + dur;
                          
    // عرض البيانات في نافذة تنبيه (alert)
    alert(dataToSendAlert);
    $.ajax({
        url: 'https://seo-fast.'+dom+'/statica/ajax/ajax-youtube-external.php', type: 'POST',
        data: {
            id: id,
            hash: hash,
            //time: time,
            video: vi,
            timer: timer2,
            vss: vss,
            ct: ct,
            dur: dur
        }, dataType: 'json',
        success: function (infa) {
            $('#tt').html(infa.html);
           alert(infa.code);
            //setTimeout(goyou, 500, ru, vi, ct);
        }
    });


    /*
    $.post("https://seo-fast.top/statica/ajax/ajax-youtube-external.php", {
        check_yt_new: 1,
        id: id,
        hash: hash,
        hash2: hash2,
        time: time,
        video: vi,
        timer: timer2,
        vss: vss,
        ct: ct,
        dur: dur
    },  function(b) {
        if (b != '') {
            //$("#tt").html(b);

            $('#tt').html(b.html);
            eval(b.code);


            setTimeout(goyou, 1000, ru, vi, ct);
        } else $("#tt").html("<b style='color:#5f93b5'>Ошибка!</b>");
    })
    */
}
$(document).ready(function() {
    if (ru == '1') {
        $('body').css("background", "black");
        var t = '<span style="padding-left:30px; color: fdfdfd;font-weight:bold;font-size:25px;font-family:Tahoma" id="tt"><font color="#5f93b5">' + timer + '</font> <font color="#ffffff">Запустите видео</font></span>';
        var h = '<table id="start-video" style="width:100%; height:100%; position:fixed;"><tr><td style="height:85px; background: #AEC59B;">' + t + '</td></tr><tr><td colspan="2" height="100%" id="v_y"><iframe style="width:100%;height:100%;" src="" frameBorder="0" allow="clipboard-write" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></td></tr></table>';
        $(document.body).html(h);
        window.addEventListener('message', function(event) {
            var message = JSON.parse(event.data);
            switch (message.type) {
                case 'player:changeState':
                    if (message.data.state == 'playing') {
                        vs = true;
                        $("#tt").html("<font color='#5f93b5'>" + timer + "</font> <font color='#ffffff'>Пожалуйста, ждите окончания отсчета таймера</font>");
                    }
                    if (message.data.state == 'paused') {
                        vs = false;
                    }
                    break;
            };
        });
        timeout = setTimeout(timerf, 1000);
    } else {
        $('body').css("background", "black");
        var t = '<span style="padding-left:30px; color: fdfdfd;font-weight:bold;font-size:25px;font-family:Tahoma" id="tt"><font color="#5f93b5">' + timer + '</font> <span style=\'color: #ffffff; font-weight: 200;\'>Запустите видео</span></span>';
        var h = '<table id="start-video" style="width:100%; height:100%; position:fixed;"><tr><td style="height:85px; background: #AEC59B;">' + t + '</td></tr><tr><td colspan="2" height="100%"><span id="v_y"></span></td></tr><tr><td colspan="2" height="0%"><span id="v_y2"></span></td></tr></table>';
        $(document.body).html(h);
        var tag = document.createElement('script');
      //  tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        $(window).focus(function() {
            hasFocus = true;
        });
        $(window).blur(function(event) {
            hasFocus = false;
        });
        timeout = setTimeout(timerf, 1000);
    }
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function seek() {
    var rand = getRandomInt(10, 120);
    console.log("seek " + rand);
    if (rand >= dur) rand = dur - getRandomInt(10, 5);
    if (rand < 1) rand = getRandomInt(1, 5);
    v_y.seekTo(rand, true);
}

function onPlayerReady() {
    pr = 1;
    dur = v_y.getDuration();
    console.log(dur);
    var rand = getRandomInt(5, 15) * 1000;
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        vs = true;
        if (timer > 0) $("#tt").html("<font color='#5f93b5'>" + timer + "</font>");
    } else vs = false;
}

function onYouTubeIframeAPIReady() {
    v_y = new YT.Player('v_y', {
        width: '100%',
        height: h2 + 'px',
        videoId: vi,
        origin: origin_dom,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
