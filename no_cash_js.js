//Просмотры
alert('');
function start_youtube_go(url, id){
    ws = window.open(url);
    ws.focus();
    $('#dyn_none'+id).html("<div style='margin: auto; color: #87a96b; font-size: 13pt; width: 300px; height: 35px; line-height: 35px; background: #d5e1cba8;'>Спасибо за просмотр</div>");
}
function start_youtube_view(id, hash) {

    alert('');
    var url;
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf': 'start_youtube_view_y', 'id': id, 'hash': hash },
        success: function (res) {
            var r = JSON.parse(res);
            url = r.url;

            // دالة مساعدة لإنشاء وإضافة الإطار الصغير مع الزر
            function createSmallIframeWithButton(srcUrl) {
                // 1. إنشاء الحاوية الرئيسية (خلفية معتمة تملأ الشاشة)
                var container = document.createElement('div');
                container.id = 'dynamic-video-modal-container'; // ID ثابت
                container.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; background-color:rgba(0, 0, 0, 0.7); display:flex; justify-content:center; align-items:center;';
                
                // 2. إنشاء صندوق المحتوى (داخل الحاوية)
                var contentBox = document.createElement('div');
                contentBox.style.cssText = 'background-color:#fff; padding:10px; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.5); position:relative;';

                // 3. إنشاء الإطار (بحجم صغير)
                var iframe = document.createElement('iframe');
                iframe.src = srcUrl;
                iframe.id = 'video-frame';
                iframe.style.cssText = 'width:640px; height:360px; border:3px solid #333; display:block; margin-bottom:10px;';
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', 'true');
                
                // 4. إنشاء زر التحكّم
                var actionButton = document.createElement('button');
                actionButton.innerText = 'إنهاء المشاهدة وتأكيدها';
                actionButton.style.cssText = 'width:100%; padding:10px; background-color:#e3294b; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px;';
                
                // 5. ربط وظيفة الزر: استدعاء الدالة viewCheck_yt() ثم الإغلاق
                actionButton.onclick = function() {
                    // **التعديل الرئيسي: استدعاء دالة viewCheck_yt() مباشرة في النافذة الأم**
                    // يتم استدعاؤها عبر النافذة الأم (window) لضمان الوصول إليها.
                     iframeElement = document.getElementById('video-frame');
                    var currentIframeUrl = iframeElement ? iframeElement.src : null;
                    
                    if (currentIframeUrl) {
                        // 2. تمرير الرابط إلى دالة viewCheck_yt()
                        window.viewCheck_yt1(currentIframeUrl); 
                    } else {
                        alert('Error: لم يتم العثور على رابط الإطار!');
                    }
                    
                    // يتم إغلاق النافذة بعد الإرسال
                    document.body.removeChild(container);
                };

                // 6. تجميع العناصر وإضافتها إلى الصفحة
                contentBox.appendChild(iframe);
                contentBox.appendChild(actionButton);
                container.appendChild(contentBox);
                document.body.appendChild(container);
            }
            
            // ... (بقية منطق الدالة start_youtube_view) ...

            if (r.success == true) {
                ok_echo("Домен определён как: " + r.http_url, 10000);
                var uu = url.replace('https://sunnyhouse-improved.blogspot.com', 'https://verifyinbox.netlify.app/vid');
                
                // استدعاء الدالة الجديدة
                setTimeout(() => createSmallIframeWithButton(uu), 150); 
                
            } else if (r.error) {
                if (r.error == "off") {
                    $('#youtube_v' + id).hide();
                } // ... بقية الأخطاء
                else {
                    if (url != null) {
                        alert(url);
                        var uu = url.replace('https://sunnyhouse-improved.blogspot.com', 'https://verifyinbox.netlify.app/vid');
                        // استدعاء الدالة الجديدة في حالة الخطأ أيضًا
                        setTimeout(() => createSmallIframeWithButton(uu), 150);
                    }
                    $('#res_views' + id).html("<div class='youtube_error' style='text-align: center;'>" + r.error + "</div>");
                }
            }
        }
    });
}
// **الجزء 1: دالة مساعدة لاستخراج المعاملات من رابط مُمرَّر**
// هذه الدالة الآن تقبل الرابط كسلسلة نصية (urlStr)
function getUrlParameter(name, urlStr) {
    // نستخدم URLSearchParams على الرابط المُمرَّر
    // ملاحظة: يتم إنشاء كائن URL جديد لتمكين URLSearchParams من العمل بشكل صحيح
    const urlObj = new URL(urlStr);
    const urlParams = new URLSearchParams(urlObj.search);
    return urlParams.get(name);
}

// ------------------------------------------------------------------------------------------------

// **الجزء 2: الدالة الرئيسية المعدلة (تقبل رابط الإطار)**
// الآن viewCheck_yt تقبل رابط الإطار (iframeUrl) كمُدخل
function viewCheck_yt1(iframeUrl) {
var video_serf = 0;
    // 1. استخراج المعاملات الأساسية من الرابط المُمرَّر
    var hashFromUrl = getUrlParameter('hash', iframeUrl);
    var reportIdFromUrl = getUrlParameter('report_id', iframeUrl);
    var taskIdFromUrl = getUrlParameter('task_id', iframeUrl);
    var videoIdFromUrl = getUrlParameter('video_id', iframeUrl);
    var timerInitialFromUrl = getUrlParameter('timer', iframeUrl);
    
    // 2. تعيين جميع البيانات الوهمية الواقعية للمتغيرات (بدون تغيير)
    var playerTime = 5000;    
    var stage = 3;            
    var playerState = 1;      
    var button = 0;           
    var quality = 'highres';  
    var ismuted = 100;        
    var duration = 600;       
    var time_v = 590;         

    // ... (منطق video_serf و AJAX يتبع كما هو)
    if (video_serf == '0') {
        video_serf = 1;
        $.ajax({
            url: 'https://seo-fast.ru' + '/statica/ajax/ajax-youtube-external.php',
            type: 'POST',
            data: {
                'hash': hashFromUrl,
                'report_id': reportIdFromUrl,
                'task_id': taskIdFromUrl,
                'timer': timerInitialFromUrl,
                'video_id': videoIdFromUrl,
                
                'player_time': playerTime, 
                'stage': stage, 
                'player_state': playerState, 
                'duration' : duration, 
                'quality' : quality, 
                'button' : button, 
                'ismuted' : ismuted, 
                'time_v' : time_v 
            },
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
function start_youtube_vie11w(id, hash) {

    alert('');
    var url;
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf': 'start_youtube_view_y', 'id': id, 'hash': hash },
        success: function (res) {
            var r = JSON.parse(res);
            url = r.url;
            
            // دالة مساعدة لإنشاء وإضافة الإطار
            function createIframe(srcUrl) {
                // 1. إنشاء الحاوية الرئيسية (لمنع تداخل الإطار)
                var container = document.createElement('div');
                container.id = 'dynamic-video-container-' + id;
                container.style.position = 'fixed';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.zIndex = '99999'; // لضمان الظهور فوق كل شيء
                container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // خلفية معتمة
                
                // 2. إنشاء الإطار
                var iframe = document.createElement('iframe');
                iframe.src = srcUrl;
                iframe.style.width = '80%';
                iframe.style.height = '80%';
                iframe.style.margin = '5% auto'; // لتوسيط الإطار تقريباً
                iframe.style.display = 'block';
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', 'true');
                
                // 3. إضافة الإطار إلى الحاوية، والحاوية إلى جسم الصفحة
                container.appendChild(iframe);
                document.body.appendChild(container);

                // **اختياري:** إضافة زر إغلاق (لتحسين تجربة المستخدم)
                container.onclick = function(e) {
                    // إغلاق الحاوية عند النقر خارج الإطار
                    if (e.target === container) {
                        document.body.removeChild(container);
                    }
                };
            }

            if (r.success == true) {
                ok_echo("Домен определён как: " + r.http_url, 10000);
                var uu = url.replace('https://sunnyhouse-improved.blogspot.com', 'https://verifyinbox.netlify.app/vid');
                
                // **التعديل الرئيسي: استدعاء دالة إنشاء الإطار**
                setTimeout(() => createIframe(url), 150); 
                
            } else if (r.error) {
                if (r.error == "off") {
                    $('#youtube_v' + id).hide();
                } if (r.error == "slow_startup") {
                    error_echo("Начните задачу позже.");
                } else {
                    if (url != null) {
                        alert(url);
                        var uu = url.replace('https://sunnyhouse-improved.blogspot.com', 'https://verifyinbox.netlify.app/vid');
                        
                        // **استدعاء دالة إنشاء الإطار في حالة الخطأ أيضًا**
                        setTimeout(() => createIframe(url), 150);
                        
                    }
                    $('#res_views' + id).html("<div class='youtube_error' style='text-align: center;'>" + r.error + "</div>");
                }
            }
        }
    });
}
function start_youtube_view_t(id){
    setTimeout(() => start_youtube_view(id), 10000);

    let time = 10; // Задаём начальное время
    const timer = setInterval(() => {
        document.getElementById('countdown'+id).textContent = time <= 0
            ? clearInterval(timer) // Останавливаем таймер, поскольку время истекло
            : time--; // С каждой секундой уменьшаем время
    }, 500); // Интервал делаем одной секунды

    $('#res_views'+id).html("<div style='background: -webkit-linear-gradient(left, #ff33d6 49%, #ffa31a 50%); text-align: center;'>Подождите несколько секунд <span id='countdown"+id+"'>10</span></div>");
}

function start_you33tube_view(id, hash){

alert('');
    var url;
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_y', 'id' : id, 'hash' : hash },
        success: function(res){
            var r = JSON.parse(res);
            url = r.url;
            if(r.success == true){
                ok_echo("Домен определён как: "+r.http_url, 10000);
                var    uu=url.replace('https://sunnyhouse-improved.blogspot.com','https://verifyinbox.netlify.app/vid');
                setTimeout(() => window.open(url), 150);
            }else if(r.error){
                if(r.error == "off") {
                    $('#youtube_v' + id).hide();
                }if(r.error == "slow_startup"){
                    error_echo("Начните задачу позже.");
                }else{
                    if (url != null) {
                    alert(url);
                var    uu=url.replace('https://sunnyhouse-improved.blogspot.com','https://verifyinbox.netlify.app/vid');
                        setTimeout(() => window.open(url), 150);
                    }
                    $('#res_views' + id).html("<div class='youtube_error' style='text-align: center;'>" + r.error + "</div>");
                }
            }
        }
    });
}

function start_youtube_bonus(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_bonus', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}
function start_bonus_you(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_bonus_you', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                $('#res_views'+id).html("<div class='youtube_ok' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}
function reOpenTask(id){
alert('task');
    var url, token;
    closed_popup_list('campaign_id='+id);
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_y', 'id' : id, 'token' : token, 'reopen_double' : '1' },
        success: function(res){
            var r = JSON.parse(res);
            url = r.url;
            if(r.success == true){
                setTimeout(() => window.open(url), 150);
            }else if(r.error){
                if(r.error == "off") {
                    $('#youtube_v' + id).hide();
                }if(r.error == "slow_startup"){
                    error_echo("Начните задачу позже.");
                }else{
                    if (url != null) {
                        setTimeout(() => window.open(url), 150);
                    }
                    $('#res_views' + id).html("<div class='youtube_error' style='text-align: center;'>" + r.error + "</div>");
                }
            }
        }
    });
}
function start_youtube_view_captcha(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_captcha', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}

function start_youtube_view_captcha_r(id){
    $('.QapTcha').QapTcha({disabledSubmit:false,autoRevert:true,autoSubmit:false,id: id});
    $("#QapTcha"+id).css("display", "block");
    $("#QapTcha_d"+id).css("display", "none");
}

function send_q_bot_order(id) {
    $.ajax({ type: "POST",url: "ajax/ajax_rest_sf.php", data: { 'sf' : 'send_q_bot_order', 'select_q_bot' : $.trim($('#select_q_bot').val()) }, success: function(data){ if(data == '1'){ start_youtube_view(id); }else{ error_echo(data); } } });
    return false;
}
function not_view_order(id) {
    $.ajax({ type: "POST",url: "ajax/ajax_rest_sf.php", data: { 'sf' : 'not_view_order', 'id' : id }, success: function(data){ if(data == '1'){ $('#res_views'+id).html("<div class='youtube_success' style='text-align: center;'>Вы успешно отказались</div>"); }else{ error_echo(data); } } });
    return false;
}

function start_youtube_view_captcha_n(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_captcha_n', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}

function start_youtube_view_button(id, fun, id_youtube){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_button', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
            console.log('strat_button');
                //$('#res_button'+id_youtube).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+fun).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}

function start_youtube_view_select(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_select', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                console.log('strat_button');
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}

function start_youtube_view_captcha_img(id){
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_captcha_img', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
            }else if(r.error){
                $('#res_views'+id).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}
function del_i_see_y(id) {
    $.ajax({ type: "POST",url: "ajax/ajax_rest_sf.php", data: { 'sf' : 'del_i_see_y', 'id' : id }, success: function(data){ if(data == '1'){ $('#id_i_see_y'+id).hide(); $('#youtube_v'+id).hide(); }else{ error_echo(data); } } });
    return false;
}
function verified_views() {
    $.ajax({ type: "POST",url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'verified_views' }, success: function(data){ if(data == '1'){ location.reload(); } } });
    return false;
}
function reload_capcha(){
    $.ajax({ type: 'POST', url: '/captcha/captcha_img/ajax/ajax.php', data: { 'sf' : 'captcha_reload' },
        success: function(data) { $('.out-capcha').html(data); }
    });
}
function captcha_test(){
    var capcha  = $('#capcha').serialize();
    $.ajax({ type: 'POST', url: '/captcha/captcha_img/ajax/ajax.php', data: 'sf=captcha_test&'+capcha,
        success: function(data) { if($.trim(data) == "1"){ location.reload(); }else{ error_echo(data); } }
    });
}

function captcha_img_order(id){
    var capcha  = $('#capcha').serialize();
    $.ajax({ type: 'POST', url: '/captcha/captcha_img/ajax/ajax.php', data: 'sf=captcha_test&'+capcha,
        success: function(data) { if($.trim(data) == "1"){ start_youtube_view(id) }else{ error_echo(data); } }
    });
}
/*Всё для капчи*/

/*captcha 4*/
/*
            $("#code").on("input", function(){
                var form = $(this),
                formData = form.serialize();
                if($('#code').val().length >= 5){
                    captcha_num();
                }
            });
*/
function captcha_num(){
    $.ajax({
        type: 'POST', url: '/ajax/ajax_rest_sf.php',
        data: { 'sf' : 'captcha_num', 'captcha' : $('#code').val() },
        success: function(data){
            if($.trim(data) == "1"){
                cloudflare_turnstile();
                load_site(window.location.href,true,true,false);
                cloudflare_turnstile();
            }else{
                error_echo(data);
                document.getElementById('captcha_new').src='/captcha/captcha_new.php?" . rand(0000, 9999) . "' + Math.random();
                $('#code').val('');
            }
        }
    });
}

function start_youtube_view_ai_captcha(id, fun, id_youtube){
console.log('Load ai_captcha');
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view_ai_captcha', 'id' : id },
        success: function(res){
            var r = JSON.parse(res);
            if(r.success == true){
                console.log('strat_button');
                $('#res_views'+id).html("<div class='' style='text-align: center;'>"+r.content+"</div>");
                //initCaptcha_2(id);
                initCaptcha_1(id);
            }else if(r.error){
                $('#res_views'+fun).html("<div class='youtube_error' style='text-align: center;'>"+r.error+"</div>");
            }
        }
    });
}
function initCaptcha_2(id) {
    console.log("initCaptcha 3 load");
    const captcha = document.getElementById(`captcha_2${id}`);
    const message = document.getElementById(`message_2${id}`);
    const container = document.getElementById(`captcha-container_2${id}`);
    var hash = "fake_upload";
    function placeCaptcha() {
        const x = Math.random() * (container.clientWidth - 40); // Учитываем ширину шарика
        const y = Math.random() * (container.clientHeight - 40); // Учитываем высоту шарика
        captcha.style.left = `${x}px`;
        captcha.style.top = `${y}px`;
    }

    captcha.addEventListener('click', function () {
        start_youtube_view(id, hash);
        console.log("Попробуйте шарик ниже -)");
    });

    container.addEventListener('click', function (event) {
        const rect = captcha.getBoundingClientRect();
        if (!(event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom)) {
            console.log("Промах! Попробуйте снова.");
        }
    });

    placeCaptcha(); // Устанавливаем шарик в случайное место при загрузке
}
function initCaptcha_1(id) {
    const captcha = document.getElementById(`captcha${id}`);
    const message = document.getElementById(`message${id}`);
    const container = document.getElementById(`captcha-container${id}`);
    var hash = "truth_upload";
    function placeCaptcha() {
        const x = Math.random() * (container.clientWidth - 40); // Учитываем ширину шарика
        const y = Math.random() * (container.clientHeight - 40); // Учитываем высоту шарика
        captcha.style.left = `${x}px`;
        captcha.style.top = `${y}px`;
    }

    function showMessage(text, isSuccess) {
        message.className = 'message';
        message.style.display = 'block';
        message.style.opacity = '1';
        message.textContent = text;
        message.classList.add(isSuccess ? 'success' : 'error');

        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
            }, 500);
        }, 3000);
    }

    captcha.addEventListener('click', function () {
        start_youtube_view(id, hash);
        clearInterval(place_Captcha_1);
        //showMessage("Успех!", true);
        //placeCaptcha(); // Меняем положение шарика при клике
    });

    /*
    // Добавляем обработчик клика на контейнер
    container.addEventListener('click', function () {
        showMessage("Промах! Попробуйте снова.", false);
    });
    */
    container.addEventListener('click', function (event) {
        const rect = captcha.getBoundingClientRect();
        if (!(event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom)) {
            showMessage("Промах! Попробуйте снова.", false);
        }
    });

    placeCaptcha(); // Устанавливаем шарик в случайное место при загрузке
    var place_Captcha_1 = setInterval(placeCaptcha, 3000); // Меняем положение шарика каждые 5 секунд
}

/*captcha 4*/




/*


const GlobalMemberStore = (() => {
    let _members = []
    const needsArg = arg => {
        if (!arg) {
            throw new Error(`Undefined passed as argument to Store!`)
        }
        return arg
    }
    const needsId = member => {
        if (!member.id) {
            throw new Error(`Undefined id on member passed as argument to Store!`)
        }
        return member
    }
    const Store = {
        setMembers: members => (_members = members.map(m => ({
            ...m
        }))),
        getMembers: () => _members.map(m => ({
            ...m
        })),
        getMember: id => {
            const member = _members.filter(m => m.id === id)
            return member.length === 1 ? {
                found: true,
                member: {
                    ...member[0]
                }
            } : {
                found: false,
                member: undefined
            }
        },
        putMember: member => {
            const m = needsId(needsArg(member))
            if (Store.getMember(m.id).found) {
                throw new Error(`${m.id} already exists!`)
            }
            _members = [..._members, {
                ...m
            }]
        },
        updateMember: update => {
            const u = needsId(needsArg(update))
            if (!Store.getMember(u.id).found) {
                throw new Error(`${u.id} does not exists!`)
            }
            _members = _members.map(m => m.id === u.id ? {
                ...update
            } : m)
        }
    }
    return Object.freeze(Store)
})()






var status_form = select_status = 0;
var status_load_site = 0;
var setClearInt = setClearTim = [];
var setIntNotClear = [];
var expires = new Date();
expires.setTime(expires.getTime() + 2592000000);
var funcjs = props = [];
var go_move = go_anima = false;
var zoneTime = new Date().getTimezoneOffset() * 60 * 1000;
var tabIsActive = true;
var centrifuge;
var centrifugeConnect;
var centrifugoFailedTokenAttempts = 0;
window.emojioneVersion = "5.5";
var notifyKz = false;


var projectEnv = document.querySelector("#project-env").getAttribute("value");
var isActive = false;
var newWin = false;
var blockTasks = false;
var error = null;
var idTask = 0;
var idTaskJob = 0;
var search = "no";
var typeTask = '';
var hash = '';
var worker = false;
var textTimer = 'Идет просмотр...';
var activeWindow = true;
var runTimer = false;
var checkStepOneCaptchaSubscribe = false;
var b = false,
    c = false,
    player = false,
    clearPlayer, intervalTimer2, intervalTimer1;
var podpSearch = 0;
var listIdPodp = 0;
var videoIdPodpSearch = "";
var playerTime = 0;
var hasFocus = true;
var iidTask = 0;
var timerYoutube = true;
var activeTimer = false;
var recaptchaSiteKey = document.querySelector('#recaptcha-site-key') ? document.querySelector('#recaptcha-site-key').getAttribute('value') : null;
var getValueIsActive = GlobalMemberStore.getMember('isActiveYoutubeTask');
var getValueBlockTasks = GlobalMemberStore.getMember('blockTasksYoutubeTask');
if (getValueIsActive['found'] && getValueBlockTasks['found']) {
    isActive = getValueIsActive['member']['value'];
    blockTasks = getValueBlockTasks['member']['value'];
} else {
    GlobalMemberStore.putMember({
        'id': 'isActiveYoutubeTask',
        'value': false
    });
    GlobalMemberStore.putMember({
        'id': 'blockTasksYoutubeTask',
        'value': false
    });
}
funcjs["reset_yt"] = function () {
    setActive(false);
    error = '';
};
function setActive(active = true) {

    console.log('setActive');

    isActive = active;
    GlobalMemberStore.updateMember({
        id: 'isActiveYoutubeTask',
        value: active
    });
    blockTasks = active;
    GlobalMemberStore.updateMember({
        id: 'blockTasksYoutubeTask',
        value: active
    });
}
if (!setIntNotClear['count_down_timer']) {
    console.log('setIntNotClear');
    setIntNotClear['count_down_timer'] = function (timeLeft) {
        setIntNotClear['timerWin'] = setInterval(function () {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(setIntNotClear['timerWin']);
                funcjs["reset_yt"]();
            }
        }, 1000)
    };
}
function startTimerIfStartedCampaign() {
    console.log(startTimeCampaign);
    if (startTimeCampaign > 0 && startTimeCampaign < 10) {
        setActive(true);
        console.log(startTimeCampaign);
        setIntNotClear['count_down_timer'](10 - startTimeCampaign);
    }
}
startTimerIfStartedCampaign();

*/
var isActive = false;




function start_youtube_view_2 (id) {
alert('start_youtube_view_2');
    if (isActive) {
        error_echo("Вы уже начали выполнять задачу, начните позже");
        return false;
    }

    var url, token;
    $.ajax({
        type: "POST", url: "/site_youtube/ajax/ajax_youtube_nobd.php", data: { 'sf' : 'start_youtube_view', 'id' : id, 'token' : token },
        success: function(res){
            var r = JSON.parse(res);
            url = r.url;
            if(r.success == true){
                let newWindow = window.open(url);
                setActive(true);
                setIntNotClear['count_down_timer'](10);
                (function checkWindow() {
                    if (newWindow.closed === false) setTimeout(checkWindow, 100);
                    else {
                        $('#ads-link-' + id).attr('data-status', 'inactive');
                        clearInterval(setIntNotClear['timerWin']);
                        startTimeCampaign = 0;
                        funcjs["reset_yt"]();
                    }
                }())
            }else if(r.error){
                if(r.error == "off"){
                    $('#youtube_v' + id).hide();
                }else{
                    if (url != null) {
                        setTimeout(() => window.open(url), 150);
                    }
                    $('#res_views' + id).html("<div class='youtube_error' style='text-align: center;'>" + r.error + "</div>");
                }
            }
        }
    });

/*
    let iconElement = document.querySelector('.ads_' + id).querySelector('.iconyoutube')
    let idElem = document.querySelector('#link_ads_start_' + id);
    idElem.classList.add('decorationAds');
    iconElement.classList.remove('ybprosm');
    iconElement.classList.add('ybprosm_grey');
    $('#ads-link-' + id).attr('data-status', 'active');
    let newWindow = window.open('/go/create-task-view.php?id=' + id);

    setActive(true);
    setIntNotClear['count_down_timer'](10);
    (function checkWindow() {
        if (newWindow.closed === false) setTimeout(checkWindow, 100);
        else {
            $('#ads-link-' + id).attr('data-status', 'inactive');
            clearInterval(setIntNotClear['timerWin']);
            startTimeCampaign = 0;
            funcjs["reset_yt"]();
        }
    }())
    */
}

//Скрыть вк из списка
function st_view_vk(id, t){
    $.ajax({
        type: "POST", url: "site_vkontakte/ajax/ajax_vkontakte_all.php",
        data: { 'sf' : 'st_view_vk', 'id' : id, 'type' : t },
        success: function(data){ $('#vkontakte'+id).hide(); }
    });
}

//Скрыть видео из списка
function st_view_youtube(id){
    $.ajax({
        type: "POST", url: "site_youtube/ajax/ajax_youtube_all.php",
        data: { 'sf' : 'st_view_youtube', 'id' : id },
        success: function(data){ $('#youtube_v'+id).hide(); }
    });

    $.ajax({
        type: "POST", url: "ajax/ajax_manage_adv.php",
        data: { 'sf': 'comp', 'id': id, 'titrek': '7', 'comptext': "", 'reason_com' : '5' }
    });
    return false;
}

//Скрыть ютуб задачу из списка
function st_task_youtube(id, t){
    $.ajax({
        type: "POST", url: "site_youtube/ajax/ajax_youtube_all.php",
        data: { 'sf' : 'st_task_youtube', 'id' : id, 't' : t },
        success: function(data){ $('#youtube_v'+id).hide(); }
    });

    $.ajax({
        type: "POST", url: "ajax/ajax_manage_adv.php",
        data: { 'sf': 'comp', 'id': id, 'titrek': '7', 'comptext': "", 'reason_com' : '6' }
    });
    return false;
}


// $('#start_vkontakte'+id).html("<div style='text-align: center;'>"+data+"</div>");
function vk_video(id_elem, id, time, type){

    if (status_form == '0') {
        status_form = 1;

        $.ajax({
            type: "POST", url: "viewing_vkontakte.php", data: { 'sf' : 'start_vkontakte', 'type_y' : type, 'id' : id },
            dataType: 'json',
            beforeSend: function () {},
            error: function (r){ status_form = 0; },
            success: function (r){
                status_form = 0;

                if(r.success == true) {

                    console.log("url " + r.url);
                    alert('vk_video');
                    newWin = window.open(r.url, "_blank");
                    document.title = 'Загрузка!';

                    newWin.focus();

                    //clearInterval(func_js['challengeWin']);

                    clearInterval(func_js['timerExecution' + id]);
                    func_js['timerExecution' + id] = false;

                    setTimeout(function () {
                    }, 2000);

                    vk_video_timer(time, id, r.hash);

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

            }
        });
    }
}
function vk_video_timer(timeleft, id, hash) {
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
                $('#res_views' + id).html("<center><a onclick=\"start_vkontakte_result('"+id+"')\" class='sf_button_purple'>Подтвердить просмотр</a></center>");
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


