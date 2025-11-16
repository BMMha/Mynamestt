// Полифил для BroadcastChannel
if (!window.BroadcastChannel) {
    window.BroadcastChannel = class {
        constructor(channelName) {
            if (!channelName) {
                throw new Error('Channel name is required');
            }
            this.channelName = channelName;
            this.onmessage = null;

            this._onStorageEvent = (event) => {
                if (!event || event.key !== this.channelName) {
                    return;
                }

                if (event.newValue === null) {
                    return;
                }

                try {
                    const data = JSON.parse(event.newValue);
                    if (this.onmessage && typeof this.onmessage === 'function') {
                        this.onmessage({
                            data,
                            origin: window.location.origin,
                            lastEventId: '',
                            source: null,
                            ports: []
                        });
                    }
                } catch (e) {
                    //console.warn('Ошибка при обработке сообщения для канала ' + this.channelName + ':', e);
                }
            };

            window.addEventListener('storage', this._onStorageEvent);
        }

        postMessage(message) {
            try {
                if (message === undefined) {
                    throw new Error('Message is required');
                }
                const messageStr = JSON.stringify(message);
                localStorage.setItem(this.channelName, messageStr);

                if (this.onmessage && typeof this.onmessage === 'function') {
                    setTimeout(() => {
                        this.onmessage({
                            data: message,
                            origin: window.location.origin,
                            lastEventId: '',
                            source: null,
                            ports: []
                        });
                    }, 0);
                }

                setTimeout(() => {
                    localStorage.removeItem(this.channelName);
                }, 100);
            } catch (e) {
                //console.warn('Ошибка при отправке сообщения через канал ' + this.channelName + ':', e);
            }
        }

        close() {
            window.removeEventListener('storage', this._onStorageEvent);
            this.onmessage = null;
        }
    };
}


var startTask = false;
var avisoAdsVideoViewCheckUser = '';
var channelDirectCampaign = new BroadcastChannel('channel_send_direct');
var channelYoutubeView = new BroadcastChannel('yt_newWinBroadcast');
var lastFocusTime = Date.now();
var isWindowFocused = true;
var isTabVisible = true;

function clearAllTimers() {
    timersAdsDirect.forEach(timer => {
        workerAdsDirect.postMessage({action: 'stop', timer: timer.id});
    });

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('timer_tab_')) {
            const campaignId = key.replace('timer_tab_', '');
            localStorage.removeItem(key);
            localStorage.removeItem(`timer_state_${campaignId}`);
        }
    }

    if (window.checkTimersInterval) {
        clearInterval(window.checkTimersInterval);
        window.checkTimersInterval = null;
    }
    if (window.updateTimersInterval) {
        clearInterval(window.updateTimersInterval);
        window.updateTimersInterval = null;
    }

    timersAdsDirect = [];
}

clearAllTimers();

channelDirectCampaign.onmessage = (event) => {
    let data = event.data;
    if(data.reportId && data.taskId) {
        $("#url-wait-for-redirect-video-" + data.taskId).attr('href', data.query);
        $("#ads_report_id_" + data.taskId).val(data.reportId);
        $("#ads_hash_" + data.taskId).val(data.hash);
        $("#ads_video_id_" + data.taskId).val(data.videoId);
        $("#ads_timer_" + data.taskId).val(data.timer);
        addTimer(data.taskId, Number(data.timer), data.tabId);
    }

    if(data.startTimeTask){
        startTask = data.startTimeTask;
    }
};

channelYoutubeView.onmessage = (event) => {
    let data = event.data;
    if(data.message !== ''){
        $(data.id).html(data.message);
    }
    eval(data.code)
};

function updateTitle() {
    try {
        const currentTabTimers = timersAdsDirect.filter(timer => {
            const timerTabId = localStorage.getItem(`timer_tab_${timer.idCampaign}`);
            return timerTabId === timer.tabId;
        });

        if (currentTabTimers.length > 0) {
            const sortedTimers = [...currentTabTimers].sort((a, b) => {
                return (b.addedTime || 0) - (a.addedTime || 0);
            });

            document.title = sortedTimers.map(timer => {
                if (timer.isLoading) {
                    return 'Загрузка...';
                }
                if (timer.isPaused) {
                    return `⏸ ${timer.startTimer} сек`;
                }
                return timer.startTimer <= 0 ? 'Подтвердить просмотр' : `${timer.startTimer} сек`;
            }).join(' • ');
        } else {
            document.title = 'Youtube заработок';
        }
    } catch (error) {
        console.error('Ошибка при обновлении заголовка:', error);
    }
}
function addTimer(id, seconds = 0, tabId = null) {

    if (!tabId || tabId !== tabUniqueId) {
        return;
    }

    let newTimer = {
        id: `ads_${id}`,
        idCampaign: id,
        startTimer: seconds,
        totalSeconds: seconds,
        tabId: tabUniqueId,
        isLoading: true,
        addedTime: Date.now()
    };

    const existingTabId = localStorage.getItem(`timer_tab_${id}`);
    if (existingTabId) {
        const existingTimerIndex = timersAdsDirect.findIndex(t => t.idCampaign === id);
        if (existingTimerIndex !== -1 && timersAdsDirect[existingTimerIndex].startTimer > 0) {
            timersAdsDirect[existingTimerIndex].isLoading = true;
            updateTitle();

            (() => {
                let blob = new Blob([
                    `self.onmessage = function(e) {
                        setTimeout(function() {
                            self.postMessage('timeout');
                        }, e.data);
                    }`
                ], {
                    type: 'application/javascript'
                });
                let workerStartAndUpdateTimer = new Worker(URL.createObjectURL(blob));
                workerStartAndUpdateTimer.onmessage = function() {
                    if (timersAdsDirect[existingTimerIndex]) {
                        timersAdsDirect[existingTimerIndex].isLoading = false;
                        updateTitle();
                    }
                    workerStartAndUpdateTimer.terminate();
                };
                workerStartAndUpdateTimer.postMessage(5000);
                return workerStartAndUpdateTimer;
            })();
            return;
        }
        localStorage.removeItem(`timer_tab_${id}`);
        localStorage.removeItem(`timer_state_${id}`);
    }

    localStorage.setItem(`timer_tab_${id}`, tabId);

    const timerState = {
        startTime: Date.now(),
        duration: seconds
    };
    localStorage.setItem(`timer_state_${id}`, JSON.stringify(timerState));

    addOrUpdateTimer(newTimer);

    // --- بداية التعديل التلقائي ---

    // 1. نجعل المؤقت يعتقد أن وقته قد انتهى فورًا بتعيين قيمته إلى صفر
    newTimer.startTimer = 0;
    newTimer.needConfirm = true; // نُخبر النظام أن المهمة تحتاج إلى تأكيد

    // 2. نخفي واجهة البدء والعداد، ونظهر زر التأكيد مباشرةً
    $("#start-ads-" + id).css({ "display": "none" });
    $("#started-ads-" + id).css({ "display": "none" });
    $("#ads_checking_btn_" + id).css({ "display": "" });
    
    funcjs['viewCheckDirect'](id);
    $("#ads_btn_confirm_" + timer.idCampaign)[0].click();
    // 3. نحدّث عنوان الصفحة ليعكس أن المهمة جاهزة للتأكيد
    updateTitle();

    // 4. تم تعطيل الكود الأصلي الذي كان يبدأ المؤقت، لذلك لن يتم تشغيله
    /*
    newTimer.loadTimerWorker = (() => {
        let blob1 = new Blob([
            `self.onmessage = function(e) {
                setTimeout(function() {
                    self.postMessage('timeout');
                }, e.data);
            }`
        ], {type: 'application/javascript'});
        let workerStartTimer = new Worker(URL.createObjectURL(blob1));
        workerStartTimer.onmessage = function () {
            let timerIndex = timersAdsDirect.findIndex(t => t.id === `ads_${id}`);
            if (timerIndex !== -1) {
                timersAdsDirect[timerIndex].isLoading = false;
                if (workerAdsDirect) {
                    timersAdsDirect[timerIndex].currentTime = Date.now();
                    workerAdsDirect.postMessage({action: 'start', timer: timersAdsDirect[timerIndex]});
                } else {
                    console.error('worker_timer_direct не инициализирован');
                }
                updateTitle();
            }
            workerStartTimer.terminate();
        };
        workerStartTimer.postMessage(5000);
        return worker;
    })();
    */

    // --- نهاية التعديل التلقائي ---
}
function addTimergyoj(id, seconds = 0, tabId = null) {

    if(!tabId || tabId !== tabUniqueId){
        return;
    }

    let newTimer = {
        id: `ads_${id}`,
        idCampaign: id,
        startTimer: seconds,
        totalSeconds: seconds,
        tabId: tabUniqueId,
        isLoading: true,
        addedTime: Date.now()
    };

    const existingTabId = localStorage.getItem(`timer_tab_${id}`);
    if (existingTabId) {
        const existingTimerIndex = timersAdsDirect.findIndex(t => t.idCampaign === id);
        if (existingTimerIndex !== -1 && timersAdsDirect[existingTimerIndex].startTimer > 0) {
            timersAdsDirect[existingTimerIndex].isLoading = true;
            updateTitle();

            (() => {
                let blob = new Blob([
                    `self.onmessage = function(e) {
                        setTimeout(function() {
                            self.postMessage('timeout');
                        }, e.data);
                    }`
                ], { type: 'application/javascript' });
                let workerStartAndUpdateTimer = new Worker(URL.createObjectURL(blob));
                workerStartAndUpdateTimer.onmessage = function() {
                    if (timersAdsDirect[existingTimerIndex]) {
                        timersAdsDirect[existingTimerIndex].isLoading = false;
                        updateTitle();
                    }
                    workerStartAndUpdateTimer.terminate();
                };
                workerStartAndUpdateTimer.postMessage(5000);
                return workerStartAndUpdateTimer;
            })();
            return;
        }
        localStorage.removeItem(`timer_tab_${id}`);
        localStorage.removeItem(`timer_state_${id}`);
    }

    localStorage.setItem(`timer_tab_${id}`, tabId);

    const timerState = {
        startTime: Date.now(),
        duration: seconds
    };
    localStorage.setItem(`timer_state_${id}`, JSON.stringify(timerState));

    addOrUpdateTimer(newTimer);
    updateTitle();
    $("#start-ads-" + id).css({"display": "none"});
    $("#timer_ads_" + id).html(seconds);
    $("#started-ads-" + id).css({"display": "block"});

    newTimer.loadTimerWorker = (() => {
        let blob1 = new Blob([
            `self.onmessage = function(e) {
                setTimeout(function() {
                    self.postMessage('timeout');
                }, e.data);
            }`
        ], {type: 'application/javascript'});
        let workerStartTimer = new Worker(URL.createObjectURL(blob1));
        workerStartTimer.onmessage = function () {
            let timerIndex = timersAdsDirect.findIndex(t => t.id === `ads_${id}`);
            if (timerIndex !== -1) {
                timersAdsDirect[timerIndex].isLoading = false;
                if (workerAdsDirect) {
                    timersAdsDirect[timerIndex].currentTime = Date.now();
                    workerAdsDirect.postMessage({action: 'start', timer: timersAdsDirect[timerIndex]});
                } else {
                    console.error('worker_timer_direct не инициализирован');
                }
                updateTitle();
            }
            workerStartTimer.terminate();
        };
        workerStartTimer.postMessage(5000);
        return worker;
    })();

    //newTimer.loadTimerId = loadTimerId.id;
}

function addOrUpdateTimer(newTimer) {
    const index = timersAdsDirect.findIndex(timer => timer.idCampaign === newTimer.idCampaign);
    if (index !== -1) {
        timersAdsDirect[index] = newTimer;
    } else {
        timersAdsDirect.push(newTimer);
    }
}

function updateTimerElement(timerId) {
    if (timersAdsDirect.length > 0) {
        timersAdsDirect.map((timer) => {
            if(timer.isPaused){
                showWaitTimer(timer.idCampaign)
            }else{
                //hideWaitTimer(timer.idCampaign)
            }
            $(`#timer_ads_${timer.idCampaign}`).html(timer.startTimer);
        })
    }
}

function showWaitTimer(id) {
    const el = document.getElementById(`container-wait-timer-${id}`);
    el.classList.add('visible');
}

function hideWaitTimer(id) {
    const el = document.getElementById(`container-wait-timer-${id}`);
    el.classList.remove('visible');
}

function removeTimer(timerId) {
    const timer = timersAdsDirect.find(timer => timer.id === timerId);
    if (timer) {
        localStorage.removeItem(`timer_tab_${timer.idCampaign}`);
        localStorage.removeItem(`timer_state_${timer.idCampaign}`);

        if (timer.startTimer > 0) {
            workerAdsDirect.postMessage({action: 'stop', timer: timerId});
        }
    }

    timersAdsDirect = timersAdsDirect.filter(timer => timer.id !== timerId);
    updateTitle();
}

workerAdsDirect = new Worker('/statica/js/worker_timer_direct.js?v=' + Math.random());
workerAds.push(workerAdsDirect);
workerAdsDirect.onmessage = function (event) {
    const {id, remainingTime, timerCompleted, isPaused} = event.data;

    let timer = timersAdsDirect.find(timer => timer.id === id);
    if (timer) {
        timer.startTimer = remainingTime;
        timer.isPaused = isPaused;

        if (timerCompleted || remainingTime <= 0) {
            timer.startTimer = 0;
            timer.needConfirm = true;

            $("#ads_checking_btn_" + timer.idCampaign).css({"display": ""});
            $(`#started-ads-${timer.idCampaign}`).css({"display": "none"});
        }
        updateTitle();
        updateTimerElement();
    }
};

funcjs['viewCheckDirect'] = function (taskId) {
    if (!sendConfirmBtn) {
        removeTimer('ads_' + taskId);
        sendConfirmBtn = true;
        let reportId = $("#ads_report_id_" + taskId).val();
        let hash = $("#ads_hash_" + taskId).val();
        let videoId = $("#ads_video_id_" + taskId).val();
        let timer = $("#ads_timer_" + taskId).val();
        let errorElem = $("#ads_error_text_" + taskId);
        let errorBtnView = $("#btn_error_view_" + taskId);
        let successText = $("#start-ads-" + taskId);
        let btnCheckingBlock = $("#ads_checking_btn_" + taskId);
        let loaderForSendBtn = $("#ads_loader_" + taskId);
        $.ajax({
            url: originalDomain + '/ajax/earnings/ajax-youtube-external.php', type: 'POST',
            data: {hash: hash, sid: sid, task_id: taskId, report_id: reportId, video_id: videoId, timer: timer, sid: decodeURIComponent(sid)},
            dataType: 'json',
            beforeSend: function () {
                loaderForSendBtn.css({'display': ''});
                $("#ads_btn_confirm_" + taskId).css({"display": "none"});
                $("#ads_error_text_" + taskId).css({"display": "none"});
            },

            error: function (data) {
                errorElem.html(data.html);
                sendConfirmBtn = false;
                btnCheckingBlock.css({"display": ""});
                loaderForSendBtn.css({'display': 'none'});
                setTimeout(function(){
                    $("#ads_error_text_" + taskId).css({"display": ""});
                    $("#ads_btn_confirm_" + taskId).css({"display": ""});
                }, 7000);
            },
            success: function (data) {
                loaderForSendBtn.css({'display': 'none'});
                if (data.error) {
                    errorBtnView.css({"display": ""});
                    $("#ads_btn_confirm_" + taskId).css({"display": "none"});
                    sendConfirmBtn = false;
                    eval(data.code)
                } else {
                    sendConfirmBtn = false;
                    btnCheckingBlock.css({"display": "none"});
                    successText.css({"display": ""});
                    successText.html(`<div style="text-align:center; padding-top:3px; color:green;">${data.html}</div>`);
                    $('#ads-link-' + taskId).attr('data-status', 'inactive');
                    changeIconAndStyleAds(taskId);
                }
            }
        });
    }

};

funcjs['refuse_to_execute'] = function (taskId) {
    let reportId = $("#ads_report_id_" + taskId).val();
    $.ajax({
        url: '/ajax/earnings/ajax-youtube.php', type: 'POST',
        data: {func: "refuse_to_execute", report_id: reportId, task_id: taskId},
        dataType: 'json',
        error: function (data) {
        },
        success: function (data) {
            $("#ads-link-" + taskId).css({"display": "none"});
            removeTimer('ads_' + taskId);
            eval(data.code)
        }
    });
}

function openModalInstructionForDirect(idCampaigns, timer) {
    popup_w('Инструкция', false, 550, 'func=instruction_for_direct&campaign_id=' + idCampaigns + '&timer=' + timer, 'ajax/earnings/pop-up-earnings.php', 'ajax/earnings/pop-up-earnings.php');
}

function dontShowWindowForSourceTrafficDirect(id, timer, checkCookie, checkbox) {
    if (checkbox) {
        document.cookie = "show_modal_for_source_traffic_direct=yes;max-age=31556926;path=/";
    }
    funcjs['start_youtube_new'](id, timer, '', checkCookie);
    closed_popup();
}


funcjs['start_youtube_new'] = function (id = '', timer = 0, url = '', checkCookie = true) {
    window.startBDScan.init();
    clearInterval(stop_tit);

    if (url === "&aviso-ads"){
        avisoAdsVideoViewCheckUser = '&aviso-ads=true';
    }

    idTaskYoutube = id;
    let timeReloadPage = 1000 * 60 * 45;
    let reloadPage = ((new Date().getTime() - startDateLoadPage) > timeReloadPage)
    const urlTabId = "&tabId=" + tabUniqueId;
    if (reloadPage) {
        error_start('<span class=\"msg-error\">Задачи устарели, обновите страницу.</span>', '#error-footer', 3000);
        $("#start-ads-" + id).html('<div class="youtube-button"><span class="status-link-youtube" onclick="window.location.reload(); return false;">Обновить страницу </span></div>');
        return false;
    }
startTask = false;
    if (startTask && (new Date().getTime() - startTask) < 14000) {
        error_start('<span class="msg-error">Вы уже выполняете задачу. Подождите 10 секунд, прежде чем открыть следующую.</span>', '#error-footer', 3000);
        return false;
    }

    let iconElement = document.querySelector('.ads_' + id).querySelector('.iconyoutube')
    let idElem = document.querySelector('#link_ads_start_' + id);
    idElem.classList.add('decorationAds');
    iconElement.classList.remove('ybprosm');
    iconElement.classList.add('ybprosm_grey');

    $('#ads-link-' + id).attr('data-status', 'active');
    let checkCookieForShowPopUp = (checkCookie) ? '&show_popup_for_cookie=yes' : '';

    let targetUrl = '/go/create-task-view.php?id=' + id + url + checkCookieForShowPopUp + urlTabId + avisoAdsVideoViewCheckUser
    let newWindow = window.open(targetUrl);
    setIntNotClear['count_down_timer'](10);

    (function checkWindow() {
        if (newWindow.closed === false) setTimeout(checkWindow, 100);
        else {
            $('#ads-link-' + id).attr('data-status', 'inactive');
            clearInterval(setIntNotClear['timerWin']);
            startTimeCampaign = 0;
            funcjs["reset_yt"]();
        }
    })();
}

function changeIconAndStyleAds(id) {
    let iconElement = document.querySelector('.ads_' + id).querySelector('.iconyoutube');
    iconElement.classList.remove('ybprosm_grey');
    iconElement.classList.add('ybprosm');
}


function changeIconAndStyleAdsClosePopUp() {
    changeIconAndStyleAds(idTaskYoutube);
    let idElem = document.querySelector('#link_ads_start_' + idTaskYoutube);
    idElem.classList.remove('decorationAds');
}

document.addEventListener('closePopUp', function () {
    changeIconAndStyleAdsClosePopUp();
});

function openModalForDoubleView(idCampaigns, timer) {
    popup_w('Вы уже выполняете задачу', false, 550, 'func=alert_double_views_youtube&campaign_id=' + idCampaigns + '&timer=' + timer, 'ajax/earnings/pop-up-earnings.php');
}

function openModalForLimitOpeningViews(idCampaigns, timer) {
    popup_w('Вы уже выполняете задачу', false, 550, 'func=alert_limit_opening_views_youtube&campaign_id=' + idCampaigns + '&timer=' + timer, 'ajax/earnings/pop-up-earnings.php');
}

function reOpenTask(idCampaigns, timer) {
    $('#load,#popup').css('display', 'none');
    $('.modal-wrapper').remove();
    $('body').removeClass('no-scroll');
    funcjs['start_youtube_new'](idCampaigns, timer, '&reopen_double=1');
}

function startTimerIfStartedCampaign() {
    if (startTimeCampaign > 0 && startTimeCampaign < 10) {
        setActive(true);
        setIntNotClear['count_down_timer'](10 - startTimeCampaign);
    }
}

window.addEventListener('focus', function() {
    isWindowFocused = true;
    lastFocusTime = Date.now();
    checkTimerState();
});

window.addEventListener('blur', function() {
    isWindowFocused = false;
    checkTimerState();
});

document.addEventListener('visibilitychange', function() {
    isTabVisible = document.visibilityState === 'visible';
    checkTimerState();
});

function checkTimerState() {
    const shouldTimersRun = isTabVisible && isWindowFocused;
    let action = '';
    //const action = 'resume'

    updateTimersInStorage();

    timersAdsDirect.forEach(timer => {
        if (timer.startTimer > 0) {
            action = shouldTimersRun && timer.totalSeconds >= 30 ? 'pause' : 'resume';
            workerAdsDirect.postMessage({
                action: action,
                timer: timer.id
            });
        }
    });
}

function updateTimersInStorage() {
    try {
        timersAdsDirect.forEach(timer => {
            if (timer.startTimer <= 0) return;

            const timerState = {
                startTime: Date.now() - ((timer.totalSeconds || timer.startTimer) - timer.startTimer) * 1000,
                duration: timer.totalSeconds || timer.startTimer,
                currentTimer: timer.startTimer,
                needConfirm: timer.needConfirm || false,
                isPaused: !isTabVisible || !isWindowFocused,
                pausedAt: (!isTabVisible || !isWindowFocused) ? Date.now() : null,
                lastUpdateTime: Date.now(),
                tabId: timer.tabId
            };

            try {
                const existingState = localStorage.getItem(`timer_state_${timer.idCampaign}`);
                if (existingState) {
                    const oldState = JSON.parse(existingState);
                    if (oldState.lastUpdateTime > timerState.startTime) {
                        return;
                    }
                }

                localStorage.setItem(`timer_state_${timer.idCampaign}`, JSON.stringify(timerState));
            } catch (e) {
                console.error('Ошибка сохранения состояния таймера:', e);
            }
        });
    } catch (error) {
        console.error('Ошибка при обновлении таймеров:', error);
    }
}

if (window.updateTimersInterval) {
    clearInterval(window.updateTimersInterval);
}
window.updateTimersInterval = setInterval(updateTimersInStorage, 5000);

startTimerIfStartedCampaign();

// --- START: Added Modification ---
// دالة لتخطي المؤقت وجعل العداد يساوي صفرًا بشكل إجباري
funcjs['forceCompleteTimer'] = function(taskId) {
  if (!taskId) {
    alert("لم يتم تحديد رقم المهمة!");
    return;
  }

  // البحث عن المؤقت الخاص بالمهمة المستهدفة
  let targetTimer = timersAdsDirect.find(timer => timer.idCampaign === taskId);

  // التحقق من وجود المؤقت وأنه ما زال يعمل
  if (targetTimer && targetTimer.startTimer > 0) {
    
    // الخطوة الأساسية: تعيين قيمة الوقت المتبقي إلى صفر
    targetTimer.startTimer = 0;
    targetTimer.needConfirm = true; // تعيين علامة بأن المهمة تحتاج إلى تأكيد

    // إيقاف المؤقت في الـ worker لمنع أي تحديثات أخرى
    if (workerAdsDirect) {
        workerAdsDirect.postMessage({ action: 'stop', timer: targetTimer.id });
    }

    // إخفاء حاوية المؤقت يدويًا
    $(`#started-ads-${taskId}`).hide();
    
    // إظهار زر "تأكيد المشاهدة" يدويًا
    $("#ads_checking_btn_" + taskId).show();
    
    // تحديث عنوان الصفحة ليعكس اكتمال المؤقت
    updateTitle();
    
    alert('تم تصفير عداد المهمة رقم ' + taskId + ' بنجاح!');
  } else {
    alert('لم يتم العثور على مهمة نشطة بالرقم ' + taskId + ' أو أنها انتهت بالفعل.');
  }
};
// --- END: Added Modification ---
