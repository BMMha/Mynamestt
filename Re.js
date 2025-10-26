/**
 * ==============================================================================
 * إعادة بناء وتوضيح ملف tasks-video-ExtYT.js.txt
 * ==============================================================================
 * ملاحظة: هذا الكود هو محاولة لإعادة بناء منطقية للكود الأصلي المصغَّر/المشوش.
 * تم تغيير أسماء المتغيرات والدوال غير الواضحة إلى أسماء وصفية.
 * تم استخدام أسماء عناصر HTML ثابتة بدلاً من الأسماء العشوائية المولَّدة.
 * ==============================================================================
 */

// افتراض وجود المكتبات الخارجية: jQuery ($), SweetAlert (swal), وكائن مساعد (utils)
// والبيانات العالمية (refreshTask, r, event_time).

// تعريف المتغيرات العامة الأساسية
let isTaskAvailable = false; // t -> isTaskAvailable
const runTaskButton = $(".card_run"); // e -> runTaskButton
const loaderButton = $("#loader_btn"); // n -> loaderButton
let currentTaskData; // r -> currentTaskData (بيانات المهمة الحالية)
let taskStartTime = 0; // s -> taskStartTime (وقت بدء المهمة بالثواني)
let orientationData = { alpha: 0, beta: 0, gamma: 0, isTrusted: 0 }; // l -> orientationData
let visibilityState = 0; // c -> visibilityState (حالة رؤية الصفحة)

// توليد سلاسل نصية عشوائية (تم تبسيطها لأسماء ثابتة لسهولة القراءة)
// const CAPTCHA_MODAL_CLASS = y(v(6, 12)); // a -> CAPTCHA_MODAL_CLASS
// const CAPTCHA_CHECK_CLASS = y(v(6, 12)); // i -> CAPTCHA_CHECK_CLASS
const CAPTCHA_MODAL_CLASS = "captcha-modal-overlay";
const CAPTCHA_CHECK_CLASS = "captcha-is-active";

// كائن الترجمات (o -> translations)
const translations = {
    en: {
        "Ошибка сервера попробуйте ещё раз!": "Server error, please try again!",
        "Закрыть": "Close",
        "Задание не выполнено!": "Task not completed!",
        "Задание выполнено!": "Task completed!",
        "Смотреть": "View",
        "Проверено": "Verified",
        "видео": "video",
        "Сейчас заданий нет, зайдите позже": "There are no tasks at the moment, come back later",
        "Заявка отправлена": "Application sent",
        "В ближайшие 5 дней мы произведем повторную проверку, если уведомление пропадет, значит все хорошо": "In the next 5 days we will re-check, if it disappears, then everything is fine",
        "Вы вернулись слишком быстро, задание будет пропущено": "You returned too quickly, the task will be missed.",
        "Запустите видео и дождитесь окончания таймера": "Start the video and wait when the timer is over",
        "Пропустить видео": "Skip video",
        "Пожалуйста, подождите...": "Please wait...",
        "Пройдите проверку:": "Verify you are human:",
        "Просмотр видео завершён": "Video viewing completed",
        "Просмотр засчитан!": "Your view has been counted! You've got <span>%s USD</span> to your account balance",
        "Неизвестная ошибка": "Unknown error",
        "Время проверки истекло": "Verification timeout",
        "Видео будет пропущено, начните новый просмотр": "The video will be skipped, start viewing a new video",
        "Вернитесь на страницу": "Return to page",
        "Видео воспроизводится": "Video is playing",
        "Просмотр завершен": "View completed",
        "Видео недоступно, начните новый просмотр": "Video is not available, start viewing a new video",
        "Задания закончились, попробуйте позже": "The tasks are over, look later",
        "Ошибка, попробуйте еще раз": "Error, try again",
        "Следующее видео": "Next video",
        "Видео": "Video",
        "Похоже ютуб не доступен": "It looks like you can't access the YouTube site or your internet is bad, the tasks are not available to you, fix the problem and try again",
        "Похоже что вы смотрели видео": "It looks like you watched a video on our other project, videos on this one will be available in about an hour, your youtube account needs a break",
        "Ошибка перезагрузите страницу": "Error reload page",
        "Просмотр видео доступен только с мобильного устройства": "Video viewing is only available on mobile devices",
        "Просмотр видео доступен только с Android устройств": "Video viewing is only available on Android devices"
    },
    // ... الترجمات الروسية هنا (تم حذفها للاختصار)
    ru: {
        "Ошибка сервера попробуйте ещё раз!": "Ошибка сервера попробуйте ещё раз!",
        "Закрыть": "Закрыть",
        "Задание не выполнено!": "Задание не выполнено!",
        "Задание выполнено!": "Задание выполнено!",
        "Смотреть": "Смотреть",
        "Проверено": "Проверено",
        "видео": "видео",
        "Сейчас заданий нет, зайдите позже": "Сейчас заданий нет, зайдите позже",
        "Заявка отправлена": "Заявка отправлена",
        "В ближайшие 5 дней мы произведем повторную проверку, если уведомление пропадет, значит все хорошо": "В ближайшие 5 дней мы произведем повторную проверку, если уведомление пропадет, значит все хорошо",
        "Просмотр засчитан": "Просмотр засчитан",
        "Вы вернулись слишком быстро, задание будет пропущено": "Вы вернулись слишком быстро, задание будет пропущено",
        "Пожалуйста, подождите...": "Пожалуйста, подождите...",
        "Пройдите проверку:": "Пройдите проверку:",
        "Просмотр видео завершён": "Просмотр видео завершён",
        "Просмотр засчитан!": "Просмотр засчитан! Вам начислено <span>%s USD</span> на баланс аккаунта.",
        "Неизвестная ошибка": "Неизвестная ошибка",
        "Время проверки истекло": "Время проверки истекло",
        "Видео будет пропущено, начните новый просмотр": "Видео будет пропущено, начните новый просмотр",
        "Ошибка, попробуйте еще раз": "Ошибка, попробуйте еще раз",
        "Следующее видео": "Следующее видео",
        "Похоже ютуб не доступен": "Похоже вам не доступен сайт YouTube или у вас плохой интернет, задания для вас не доступны, исправьте проблему и попробуйте снова",
        "Похоже что вы смотрели видео": "Похоже что вы смотрели видео на другом проекте, видео на этом проекте будут доступны примерно через час, ваш аккаунт youtube должен отдохнуть",
        "Ошибка перезагрузите страницу": "Ошибка перезагрузите страницу",
        "Просмотр видео доступен только с мобильного устройства": "Просмотр видео доступен только с мобильного устройства",
        "Просмотр видео доступен только с Android устройств": "Просмотр видео доступен только с Android устройств"
    }
};
// تحديد اللغة (افتراضياً 'en' ما لم يتم تحديد 'language' عالمياً)
const language = typeof window.language !== 'undefined' ? window.language : 'en';

// ==============================================================================
// 1. إدارة آلية بدء المهام (Task Initialization Mechanism - MAC)
// ==============================================================================

// MAC (Mechanism Anti-Cheat)
const macManager = (function() { // d -> macManager
    const mac2View = $("#mac2View"); // t -> mac2View
    let isWaiting = false; // e -> isWaiting (هل يتم انتظار الحصول على مهمة؟)
    let macType = 0; // n -> macType (نوع الآلية المضادة للغش: 0, 1, 3, 4, 5)

    /**
     * يحدد أو يسترجع نوع آلية مكافحة الغش (MAC type).
     * @param {number} newMacType - النوع الجديد لآلية MAC (1, 3, 4, 5).
     * @returns {number} نوع MAC الحالي.
     */
    function setMacType(newMacType) { // a -> setMacType
        // تحديث نوع MAC إلى 5 إذا كان refreshTask = 1
        if (typeof window.refreshTask !== 'undefined' && refreshTask == 1) {
            macType = 5;
        }
        // إذا كان 0، فقم بالتعيين.
        else if (macType === 0) {
            macType = newMacType;
        }
        return macType;
    }

    mac2View.on("click", function(event) {
        if (!isWaiting) {
            // التحقق من أن النقر موثوق به (ليس آلياً)
            if (!event.originalEvent || !event.originalEvent.isTrusted) return;
            // إعداد MAC = 1، ثم إطلاق نقر محاكاة على زر التشغيل
            setMacType(1);
            runTaskButton.trigger("click", { mac: macType });
        }
    });

    return {
        /**
         * تعيين حالة الانتظار (منع النقرات المتعددة).
         * @param {boolean} state - true أو false.
         */
        setWait: function(state) {
            isWaiting = state;
        },
        /**
         * استرجاع نوع MAC الحالي.
         * @returns {number}
         */
        getMac: function() {
            return macType;
        },
        /**
         * تعيين نوع MAC جديد.
         * @param {number} type - نوع MAC (1, 3, 4, 5).
         * @returns {number}
         */
        setMac: setMacType
    };
})();

// معالجات أحداث زر الإبلاغ عن مشكلة
function sendComplaint(taskId, cause) { // u -> sendComplaint
    $.ajax({
        url: "/tasks/control/complaint.php",
        type: "post",
        data: { tid: taskId, cause: cause, type: 1 },
        dataType: "json",
        success: function(response) {
            // قد تتم إضافة منطق معالجة النجاح هنا
        },
        error: function() {
            // قد تتم إضافة منطق معالجة الخطأ هنا
        }
    });
}

// ==============================================================================
// 2. فحص البيئة والتحقق من YouTube (Environment Check & YouTube Availability)
// ==============================================================================

/**
 * يتحقق من توافر المهام والبيئة (الجهاز المحمول/YouTube).
 * @param {boolean} showLoading - ما إذا كان سيتم عرض زر التحميل (افتراضياً true).
 */
function checkEnvironment(showLoading = true) { // p -> checkEnvironment
    if (showLoading) {
        isTaskAvailable = false;
        runTaskButton.attr("disabled", true);
        loaderButton.removeClass("d-none");
    }

    // 1. التحقق من الجهاز (يجب أن يكون جهازًا محمولًا وليس iOS)
    if (!utils.isMobile() || utils.isIos()) {
        runTaskButton.prop("disabled", true);
        loaderButton.addClass("d-none");
        let errorMessage = utils.isIos() ?
            translations[language]["Просмотр видео доступен только с Android устройств"] :
            translations[language]["Просмотр видео доступен только с мобильного устройства"];
        return swal.fire({
            text: errorMessage,
            icon: "error",
            confirmButtonText: translations[language]["Закрыть"],
            customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
        });
    }

    // 2. محاولة تحميل YouTube iframe API (للتأكد من الوصول إلى YouTube)
    const script = document.createElement("script");
    const startTime = +new Date;
    // إضافة وقت UNIX لـ cache busting
    const scriptUrl = "https://www.youtube.com/iframe_api?unixtime=" + startTime;
    script.src = scriptUrl;

    // معالج عند تحميل السكربت بنجاح
    script.onload = () => {
        // إذا كان وقت التحميل سريعاً جداً (< 2800ms) - قد يشير إلى التخزين المؤقت أو تجاوز الفحص
        if (+new Date - startTime < 2800) {
            if (showLoading) {
                // فحص إضافي عبر طرف ثالث (uchecker.top)
                new Promise((resolve) => {
                    $.ajax({
                        url: "https://uchecker.top/check/",
                        method: "GET",
                        xhrFields: { withCredentials: true },
                        dataType: "json",
                        crossDomain: true
                    }).then(resolve).catch((error) => {
                        resolve({ status: "noReq" });
                    });
                }).then((response) => {
                    loaderButton.addClass("d-none");
                    // إذا كان الفحص موافقاً (ok) ولا توجد بيانات أو "noReq" (فشل الطلب)،
                    // فاعتبر أنه متاح.
                    if ("ok" == response.status && !response.data || "noReq" == response.status) {
                        isTaskAvailable = true;
                        runTaskButton.attr("disabled", false);
                    } else {
                        // إذا كانت هناك بيانات، فافترض أن المستخدم شاهد الفيديو بالفعل على مشروع آخر
                        isTaskAvailable = false;
                        runTaskButton.attr("disabled", true);
                        swal.fire({
                            text: translations[language]["Похоже что вы смотрели видео"],
                            icon: "error",
                            confirmButtonText: translations[language]["Закрыть"],
                            customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
                        });
                    }
                });
            } else {
                // إذا لم يُطلب عرض التحميل، قم فقط بتفعيل المهمة
                isTaskAvailable = true;
                runTaskButton.attr("disabled", false);
                loaderButton.addClass("d-none");
            }
        } else {
            // وقت تحميل طويل (أكثر من 2800ms) - يشير إلى مشكلة في الوصول
            removeYoutubeScript();
            isTaskAvailable = false;
            runTaskButton.attr("disabled", true);
            loaderButton.addClass("d-none");
            swal.fire({
                text: translations[language]["Похоже ютуб не доступен"],
                icon: "error",
                confirmButtonText: translations[language]["Закрыть"],
                customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
            });
        }
    };

    // معالج عند فشل تحميل السكربت
    script.onerror = () => {
        isTaskAvailable = false;
        runTaskButton.attr("disabled", true);
        swal.fire({
            text: translations[language]["Похоже ютуб не доступен"],
            icon: "error",
            confirmButtonText: translations[language]["Закрыть"],
            customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
        });
        removeYoutubeScript();
    };

    document.head.append(script);
}

/**
 * إزالة أي سكريبتات لـ YouTube iframe API من الرأس.
 */
function removeYoutubeScript() { // m -> removeYoutubeScript
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
        const script = scripts[i];
        if (script.src.indexOf("www.youtube.com") !== -1) {
            script.parentNode.removeChild(script);
        }
    }
}

// ==============================================================================
// 3. معالج حالة رؤية الصفحة (Page Visibility Handler)
// ==============================================================================

document.addEventListener("visibilitychange", function(event) {
    const currentTime = new Date / 1000 | 0; // الوقت الحالي بالثواني
    
    // إذا أصبحت الصفحة مخفية وكانت حالة الرؤية 1 (بدء المشاهدة)
    if (document.hidden && visibilityState === 1) {
        visibilityState = 2; // تعيين الحالة إلى "خارج الرؤية"
    } 
    // إذا أصبحت الصفحة مرئية وكانت حالة الرؤية 0 (ما قبل البدء)، قم بتشغيل فحص البيئة
    else if ("visible" === document.visibilityState && visibilityState === 0) {
        checkEnvironment();
    } 
    // إذا عادت الصفحة للرؤية وكانت في حالة "خارج الرؤية" ولم تكن المهمة قيد التحديث
    else if (visibilityState === 2 && currentTime - taskStartTime > 2 && "visible" === document.visibilityState && refreshTask === 0) {
        visibilityState = 0; // إعادة تعيين الحالة
        
        // التحقق من أن المستخدم لم يعد بسرعة كبيرة جداً (أقل من مدة الفيديو - 2 ثانية)
        if (taskStartTime + (currentTaskData.duration - 2) > currentTime) {
            sendComplaint(currentTaskData.id, 1); // إرسال شكوى لعودة سريعة
            captchaModule.showAlert(translations[language]["Вы вернулись слишком быстро, задание будет пропущено"]);
            $("#mac2View").text("mac3Start"); // إعادة الحالة لزر المشاهدة
            return;
        }
        
        // إذا كان كل شيء على ما يرام، ابدأ الكابتشا
        captchaModule.start();
    }
});

// ==============================================================================
// 4. جمع بصمة الجهاز (Device Fingerprinting)
// ==============================================================================

/**
 * استرجاع معلومات WebGL (للكشف عن البوتات).
 * @returns {object|object} معلومات عن كارت الشاشة أو خطأ.
 */
function getWebGLInfo() { // f -> getWebGLInfo
    const canvas = document.createElement("canvas").getContext("webgl");
    if (!canvas) return { error: "no webgl" };
    const extension = canvas.getExtension("WEBGL_debug_renderer_info");
    return extension ? {
        vendor: canvas.getParameter(extension.UNMASKED_VENDOR_WEBGL),
        renderer: canvas.getParameter(extension.UNMASKED_RENDERER_WEBGL)
    } : { error: "no WEBGL_debug_renderer_info" };
}

/**
 * التحقق مما إذا كان المتصفح يعمل في وضع WebDriver (البوتات).
 * @returns {boolean}
 */
function isWebDriver() { // g -> isWebDriver
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "webdriver");
    return !!descriptor && (!!descriptor.get && descriptor.get.toString());
}

/**
 * تجميع بصمة الجهاز وإرسالها إلى الخادم لبدء المهمة.
 * @param {object} clickEventData - بيانات النقر (الإحداثيات ونوع MAC).
 */
function collectFingerprintAndStart(clickEventData = {}) { // h -> collectFingerprintAndStart
    const taskId = currentTaskData.id;
    let fingerprint = {
        videoCard: getWebGLInfo(),
        viewPort: { // معلومات النافذة والشاشة
            h: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            w: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            hM: window.screen.height,
            wM: window.screen.width
        },
        platform: navigator.platform,
        dpr: window.devicePixelRatio,
        multi: { speakers: 0, micros: 0, webcams: 0, devices: 1 }, // معلومات الأجهزة المتعددة
        ori: orientationData, // بيانات مستشعر التوجيه
        v: "2.6", // إصدار البصمة
        cl: { x: clickEventData.x, y: clickEventData.y }, // إحداثيات النقر
        webDef: isWebDriver(), // فحص وضع WebDriver
        navName: navigator.constructor.name, // اسم منشئ المتصفح
        touch: "ontouchstart" in window, // فحص اللمس
        c: () => { // استرجاع إصدار Chromium
            if (navigator.userAgentData) {
                let uaData = navigator.userAgentData;
                for (let brand in uaData.brands) {
                    if (uaData.brands.hasOwnProperty(brand) && "Chromium" == uaData.brands[brand].brand) {
                        return uaData.brands[brand].version;
                    }
                }
            }
        },
        memory: navigator.deviceMemory, // ذاكرة الجهاز
        concur: navigator.hardwareConcurrency // التزامن
    };

    if (clickEventData.mac) {
        fingerprint.mac = clickEventData.mac;
    }

    let promises = [];
    // جمع قيم Entropy العالية
    if (navigator.userAgentData && "function" == typeof navigator.userAgentData.getHighEntropyValues) {
        promises.push(navigator.userAgentData.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"]));
    }
    // جمع معلومات البطارية
    if ("function" == typeof navigator.getBattery) {
        promises.push(navigator.getBattery());
    }

    Promise.all(promises).then((results) => {
        fingerprint.en = { noF: 1 };
        fingerprint.bat = { noF: 1 };

        for (const result of results) {
            // معلومات Entropy العالية
            if ("string" == typeof result.architecture) {
                fingerprint.en = {
                    ar: result.architecture,
                    b: () => {
                        for (let brand in result.brands) {
                            if (result.brands.hasOwnProperty(brand) && "Chromium" == result.brands[brand].brand) {
                                return result.brands[brand].version;
                            }
                        }
                    },
                    m: result.model,
                    p: result.platform,
                    pv: result.platformVersion
                };
            } 
            // معلومات البطارية
            else if ("BatteryManager" == result.constructor.name) {
                fingerprint.bat = {
                    charging: result.charging ? 1 : 0,
                    lvl: result.level
                };
            }
        }

        // 5. تجميع معلومات الأجهزة المتعددة وإرسال البيانات
        collectMediaDevicesAndSend(taskId, fingerprint);
    });
}

/**
 * تجميع معلومات أجهزة الميديا (كاميرات/مايكروفونات) وإرسال البصمة النهائية.
 * @param {string} taskId - معرف المهمة.
 * @param {object} fingerprint - كائن البصمة.
 */
function collectMediaDevicesAndSend(taskId, fingerprint) {
    if (navigator.mediaDevices && "function" == typeof navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
            if (devices) {
                devices.forEach(function(device) {
                    switch (device.kind) {
                        case "audioinput":
                            fingerprint.multi.micros++;
                            break;
                        case "videoinput":
                            fingerprint.multi.webcams++;
                            break;
                        case "audiooutput":
                            fingerprint.multi.speakers++;
                            break;
                    }
                });
            }
            sendStartRequest(taskId, fingerprint);
        }).catch(function(error) {
            // في حالة الرفض، أرسل البصمة بدون معلومات الأجهزة
            sendStartRequest(taskId, fingerprint);
        });
    } else {
        // إذا لم تتوفر enumerateDevices
        fingerprint.multi.devices = 0;
        sendStartRequest(taskId, fingerprint);
    }
}

/**
 * إرسال طلب بدء المهمة النهائي إلى الخادم.
 * @param {string} taskId - معرف المهمة.
 * @param {object} fingerprint - كائن البصمة.
 */
function sendStartRequest(taskId, fingerprint) {
    $.ajax({
        url: "/tasks/control/start.php",
        type: "post",
        data: { TaskId: taskId, fin: fingerprint },
        dataType: "json",
        success: function(response) {
            // معالجة نجاح بدء المهمة (نادراً ما يكون هناك شيء هنا)
        },
        error: function() {
            // معالجة خطأ بدء المهمة
        }
    });
}

// ==============================================================================
// 5. دوال مساعدة عامة
// ==============================================================================

/**
 * تحويل الثواني إلى تنسيق H:MM:SS أو D:H:MM:SS.
 * @param {number} totalSeconds - إجمالي عدد الثواني.
 * @returns {string} الوقت المنسق.
 */
function formatTime(totalSeconds) { // b -> formatTime
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds % 86400 / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = Math.floor(totalSeconds % 3600 % 60);

    let result = "";
    if (days > 0) {
        result += (days < 10 ? "0" + days : days) + ":";
    }
    result += (hours < 10 ? "0" + hours : hours) + ":";
    result += (minutes < 10 ? "0" + minutes : minutes) + ":";
    result += (seconds < 10 ? "0" + seconds : seconds);
    return result;
}

/**
 * توليد عدد صحيح عشوائي ضمن مجال محدد.
 * @param {number} min - القيمة الدنيا (شاملة).
 * @param {number} max - القيمة القصوى (غير شاملة).
 * @returns {number} العدد العشوائي.
 */
function getRandomInt(min, max) { // v -> getRandomInt
    return Math.floor(Math.random() * (max - min)) + +min;
}

/**
 * توليد سلسلة نصية عشوائية بطول محدد.
 * @param {number} length - طول السلسلة (افتراضياً 1).
 * @returns {string} السلسلة العشوائية.
 */
function getRandomString(length = 1) { // y -> getRandomString
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters[getRandomInt(0, characters.length)];
    }
    return result;
}

// معالج أحداث مستشعر توجيه الجهاز
window.addEventListener("deviceorientation", function(event) {
    orientationData.isTrusted = event.isTrusted ? "1" : "0";
    orientationData.alpha = event.alpha ? event.alpha : 0;
    orientationData.beta = event.beta ? event.beta : 0;
    orientationData.gamma = event.gamma ? event.gamma : 0;
}, true);

// ==============================================================================
// 6. وحدة CAPTCHA (Captcha Module)
// ==============================================================================

const captchaModule = (function() { // k -> captchaModule
    // العناصر التي يتم تهيئتها في init
    let modalOverlay; // p -> modalOverlay (الغطاء الرئيسي للكابتشا)
    let captchaImage; // t -> captchaImage (صورة الكابتشا)
    let clickMarker; // e -> clickMarker (مؤشر النقر)
    let textWrapper; // f -> textWrapper
    let imageWrapper; // m -> imageWrapper
    let alertContainer; // n -> alertContainer (تنبيه النجاح/الخطأ)
    let reloadButton; // s -> reloadButton (زر إعادة التحميل)
    let alertTitle; // l -> alertTitle (عنوان التنبيه)
    let timerDisplay; // c -> timerDisplay (عرض المؤقت)

    let reloadCount = 0; // h -> reloadCount (عدد مرات إعادة التحميل)
    let isClickable = true; // b -> isClickable (هل الكابتشا قابلة للنقر؟)
    let timerDuration = 30; // x -> timerDuration (مدة المؤقت)
    let timerInterval; // g -> timerInterval
    let eventHandlers = {}; // w -> eventHandlers (معالجات الأحداث المخصصة)

    // تعيين أسماء عناصر ثابتة (بدلاً من الأسماء العشوائية في الكود الأصلي)
    const CAPTCHA_RELOAD_ID = "reloadButtonId"; 
    const CAPTCHA_NEXT_BTN_ID = "nextVideoButtonId"; 

    // خريطة استبدال الحروف للكابتشا الروسية (R -> cyrillicToLatinMap)
    const cyrillicToLatinMap = { "а": "a", "с": "c" };

    /**
     * إيقاف تشغيل المؤقت.
     */
    function stopTimer() { // L -> stopTimer
        clearInterval(timerInterval);
    }

    /**
     * زيادة عداد إعادة التحميل وإخفاء زر إعادة التحميل بعد 4 مرات.
     */
    function incrementReloadCount() { // _ -> incrementReloadCount
        reloadCount++;
        if (reloadCount >= 4) {
            reloadButton.hide();
        }
    }

    /**
     * إرسال بيانات الكابتشا للتحقق من الخادم.
     * @param {object} data - بيانات التحقق (مثل x, y, refreshTask).
     */
    function sendCaptchaCheck(data) { // I -> sendCaptchaCheck
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/captcha/control/checkExtYT.php",
            data: data,
            success: function(response) {
                isClickable = true;
                clickMarker.hide();

                if ("ok" == response.status) {
                    // تحقق ناجح
                    stopTimer();
                    captchaModule.showAlert(translations[language]["Просмотр засчитан!"].replace("%s", response.data.reward), "success");
                    $("#mac2View").text("mac3Start");
                    // تمرير خفيف للصفحة للأعلى
                    $("body,html").animate({ scrollTop: 2 }, 100).animate({ scrollTop: 0 }, 200);
                } else if ("data" == response.status) {
                    // فشل التحقق، عرض كابتشا جديدة (يحدث نادراً)
                    textWrapper.addClass("hide");
                    imageWrapper.removeClass("hide");
                    modalOverlay.addClass(CAPTCHA_CHECK_CLASS); // i -> CAPTCHA_CHECK_CLASS

                    // فك تشفير صورة الكابتشا المشفرة بالـ Base64
                    const imageKeys = Object.keys(cyrillicToLatinMap);
                    const regex = new RegExp(imageKeys.join("|"), "g");
                    const decodedImage = response.data.replace(regex, (match) => cyrillicToLatinMap[match]);

                    captchaImage.css("height", (response.height ? response.height : 90) + "px");
                    captchaImage.css("width", (response.width ? response.width : 240) + "px");
                    captchaImage.css("background", "url(data:image/png;base64," + decodedImage + ")");
                    
                    $("#mac2View").text("mac2Captcha");
                    $("body,html").animate({ scrollTop: 2 }, 100).animate({ scrollTop: 0 }, 200);
                } else {
                    // فشل التحقق، عرض رسالة خطأ وإعادة تعيين
                    textWrapper.addClass("hide");
                    imageWrapper.removeClass("hide");
                    displayAlert(response.message);
                    stopTimer();
                    $("#mac2View").text("mac3Start");
                }

                if (typeof eventHandlers.eventClick === "function") {
                    eventHandlers.eventClick(response.status);
                }
            },
            error: function(xhr, status, error) {
                isClickable = true;
                clickMarker.hide();
                textWrapper.addClass("hide");
                imageWrapper.removeClass("hide");
                displayAlert(translations[language]["Неизвестная ошибка"]);
                stopTimer();
                if (typeof eventHandlers.error === "function") {
                    eventHandlers.error();
                }
                $("#mac2View").text("mac3Start");
            }
        });
    }

    /**
     * عرض تنبيه في نافذة الكابتشا.
     * @param {string} message - رسالة التنبيه.
     * @param {string} type - نوع التنبيه ("error" أو "success"، افتراضياً "error").
     */
    function displayAlert(message, type = "error") { // P -> displayAlert
        modalOverlay.addClass(CAPTCHA_CHECK_CLASS); // i -> CAPTCHA_CHECK_CLASS
        alertContainer.addClass(type);
        alertTitle.html(message);
        textWrapper.html(message);
        $("#" + CAPTCHA_NEXT_BTN_ID).attr("disabled", false);
    }

    /**
     * جلب الكابتشا من الخادم.
     * @param {number} [isRefresh=0] - 1 إذا كانت عملية إعادة تحميل.
     */
    function getCaptcha(isRefresh = 0) { // S -> getCaptcha
        clearAlert();
        captchaImage.css("background", "white");
        sendCaptchaCheck({ refreshTask: isRefresh });
    }

    /**
     * مسح تنبيهات الكابتشا.
     */
    function clearAlert() { // A -> clearAlert
        alertContainer.removeClass("error").removeClass("success");
    }

    return {
        getCaptcha: getCaptcha,
        /**
         * توليد كود HTML لـ Captcha (تم تبسيط الأسماء العشوائية لأسماء ثابتة).
         * @returns {string} كود HTML.
         */
        getHtmlCaptcha: function() {
            // أسماء العناصر التي تم تبسيطها
            const MODAL_ID = "captchaModalOverlay";
            const NEXT_BUTTON_ID = CAPTCHA_NEXT_BTN_ID;
            const CAPTCHA_IMAGE_CONTAINER_CLASS = "captcha-image-container";
            const CAPTCHA_INNER_WRAPPER_CLASS = "captcha-inner-wrapper";
            const CAPTCHA_CHECK_AREA_CLASS = "captcha-check-area";
            const CAPTCHA_CLICK_MARKER_ID = "captchaClickMarker";
            const CAPTCHA_TIMER_WRAPPER_CLASS = "captcha-timer-wrapper";

            return `
            <div class="${CAPTCHA_MODAL_CLASS}" id="${MODAL_ID}" style="">
                <div class="wrapper">
                    <div class="${CAPTCHA_INNER_WRAPPER_CLASS}" id="captcha_image_wrapper">
                        <div style="color: #fff;margin-bottom: 12px;">${translations[language]["Пройдите проверку:"]}</div>
                        <div class="${CAPTCHA_CHECK_AREA_CLASS}">
                            <div class="${CAPTCHA_IMAGE_CONTAINER_CLASS}" id="captchaImageContainer"></div>
                            <div class="${CAPTCHA_TIMER_WRAPPER_CLASS}">
                                <button class="c-reload" id="${CAPTCHA_RELOAD_ID}">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <rect x="0" y="0" width="24" height="24"></rect>
                                            <path d="M8.43296491,7.17429118 L9.40782327,7.85689436 C9.49616631,7.91875282 9.56214077,8.00751728 9.5959027,8.10994332 C9.68235021,8.37220548 9.53982427,8.65489052 9.27756211,8.74133803 L5.89079566,9.85769242 C5.84469033,9.87288977 5.79661753,9.8812917 5.74809064,9.88263369 C5.4720538,9.8902674 5.24209339,9.67268366 5.23445968,9.39664682 L5.13610134,5.83998177 C5.13313425,5.73269078 5.16477113,5.62729274 5.22633424,5.53937151 C5.384723,5.31316892 5.69649589,5.25819495 5.92269848,5.4165837 L6.72910242,5.98123382 C8.16546398,4.72182424 10.0239806,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 L6,12 C6,15.3137085 8.6862915,18 12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 C10.6885336,6 9.44767246,6.42282109 8.43296491,7.17429118 Z" fill="#000000" fill-rule="nonzero"></path>
                                        </g>
                                    </svg>
                                </button>
                                <div class="captcha-timer notranslate" id="captcha-timer">30</div>
                            </div>
                            <div class="captcha-alert notranslate" id="captcha-alert">
                                <div class="captcha-alert-title" id="captcha-alert-title"></div>
                            </div>
                            <div id="${CAPTCHA_CLICK_MARKER_ID}" class="captcha-click-marker"></div>
                        </div>
                    </div>
                    <div class="tex-wrapper-area">
                        <div class="${CAPTCHA_INNER_WRAPPER_CLASS} hide" id="wrapper_text" style="color: #FFF;"></div>
                    </div>
                    <button id="${NEXT_BUTTON_ID}" disabled="disabled">${translations[language]["Следующее видео"]}</button>
                    <button class="btn btn-secondary" id="btnClose">${translations[language]["Закрыть"]}</button>
                </div>
            </div>

            <style>
                /* تم تبسيط كود CSS الأصلي المشوش (حذف معظم الكود للاختصار) */
                .${CAPTCHA_MODAL_CLASS} { /* overlay */
                    background: rgba(43, 43, 51, 0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    width: 100%; height: 100%; z-index: 1000000; display: none; align-items: flex-end; justify-content: center;
                }
                .${CAPTCHA_MODAL_CLASS}.${CAPTCHA_CHECK_CLASS} { display: flex; }
                .wrapper { background: #111; padding: 20px; border-radius: 12px 12px 0 0; }
                #${NEXT_BUTTON_ID} {
                    background: #3445E5; padding: 0.85rem 1.2rem; border-radius: 0.86rem; cursor: pointer; border: none; color: #fff; width: 100%; transition: .3s ease background;
                }
                #${NEXT_BUTTON_ID}:disabled { opacity: 0.5; background: #555555; cursor: no-drop; }
                #captchaImageContainer {
                    width: 240px; height: 90px; flex: none; position: relative; background-position: center center; background-repeat: no-repeat;
                }
                #${CAPTCHA_CLICK_MARKER_ID} {
                    position: absolute; top: 20px; left: 46px; width: 32px; height: 32px; border-radius: 50%; display: none; background: rgba(42, 193, 147, 0.5);
                }
                #captcha-alert { /* Alert styling */
                    position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%; color: #fff; font-size: 13px;
                    flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 10; display: none;
                }
                #captcha-alert.success { background: #1bc5bd; display: flex; }
                #captcha-alert.error { background: #f64e60; display: flex; }
                /* ... بقية تنسيقات CSS ذات الصلة (المؤقت، زر إعادة التحميل، إلخ) */
            </style>
            `;
        },
        /**
         * تهيئة وحدة Captcha.
         * @param {string} modalSelector - محدد CSS لغطاء الكابتشا.
         * @param {object} options - خيارات التهيئة (مثل معالجات الأحداث).
         */
        init: function(modalSelector, options) {
            // تعيين العناصر وفقاً لمحددات HTML الثابتة
            modalOverlay = $(modalSelector);
            captchaImage = modalOverlay.find("#captchaImageContainer"); // t
            clickMarker = modalOverlay.find("#captchaClickMarker"); // e
            textWrapper = modalOverlay.find("#wrapper_text"); // f
            imageWrapper = modalOverlay.find(".captcha-inner-wrapper"); // m
            alertContainer = modalOverlay.find("#captcha-alert"); // n
            reloadButton = modalOverlay.find("#" + CAPTCHA_RELOAD_ID); // s
            alertTitle = modalOverlay.find("#captcha-alert-title"); // l
            timerDisplay = modalOverlay.find("#captcha-timer"); // c

            // معالجات الأحداث
            reloadButton.on("click", function(event) {
                getCaptcha();
                incrementReloadCount();
            });

            modalOverlay.find("#btnClose").on("click", function(event) {
                captchaModule.hide();
            });

            captchaImage.on("click", function(event) {
                if (isClickable) {
                    isClickable = false;
                    clearAlert();
                    incrementReloadCount();

                    // عرض مؤشر النقر
                    clickMarker.css("left", event.offsetX - 16);
                    clickMarker.css("top", event.offsetY - 16);
                    clickMarker.show();

                    // إرسال الإحداثيات (بشكل زوجي)
                    sendCaptchaCheck({
                        x: event.offsetX % 2 ? event.offsetX - 1 : event.offsetX,
                        y: event.offsetY % 2 ? event.offsetY - 1 : event.offsetY
                    });
                }
            });

            modalOverlay.find("#" + CAPTCHA_NEXT_BTN_ID).on("click", function(event) {
                if (event.originalEvent && event.originalEvent.isTrusted) {
                    $(this).attr("disabled", true);
                    runTaskButton.trigger("click", { mac: macManager.getMac() });
                }
            });

            // تعيين معالجات الأحداث المخصصة
            if (options.hasOwnProperty("event")) {
                if (options.event.hasOwnProperty("eventClick")) {
                    eventHandlers.eventClick = options.event.eventClick;
                }
                if (options.event.hasOwnProperty("timeout")) {
                    eventHandlers.timeout = options.event.timeout;
                }
                if (options.event.hasOwnProperty("error")) {
                    eventHandlers.error = options.event.error;
                }
            }
        },
        /**
         * بدء الكابتشا والمؤقت.
         * @param {number} [isRefresh=0] - 1 إذا كانت عملية تحديث مهمة.
         */
        start: function(isRefresh = 0) {
            reloadCount = 0;
            timerDuration = 30;
            stopTimer(); // التأكد من إيقاف أي مؤقت سابق

            timerInterval = setInterval(function() {
                timerDisplay.text(timerDuration);
                timerDuration--;

                if (timerDuration < 0) {
                    displayAlert(translations[language]["Время проверки истекло"]);
                    $("#mac2View").text("mac3Start");
                    $("body,html").animate({ scrollTop: 2 }, 100).animate({ scrollTop: 0 }, 200);
                    
                    if (typeof eventHandlers.timeout === "function") {
                        eventHandlers.timeout();
                    }
                    sendComplaint(currentTaskData.id, 1);
                    stopTimer();
                }
            }, 1000);

            getCaptcha(isRefresh); // جلب الكابتشا
        },
        /**
         * إخفاء نافذة الكابتشا.
         */
        hide: function() {
            modalOverlay.removeClass(CAPTCHA_CHECK_CLASS);
            alertTitle.text("");
            textWrapper.addClass("hide");
            imageWrapper.removeClass("hide");
            stopTimer();
            clearAlert();
        },
        /**
         * عرض تنبيه باستخدام لوحة الكابتشا (بدلاً من SweetAlert).
         * @param {string} message - رسالة التنبيه.
         * @param {string} type - نوع التنبيه ("error" أو "success"، افتراضياً "error").
         */
        showAlert: displayAlert
    };
})();

// ==============================================================================
// 7. الوظيفة الرئيسية (tasksVisitsPage)
// ==============================================================================

const tasksVisitsPage = function() {
    let eventTimerInterval; // x -> eventTimerInterval
    let limitTimerInterval; // w -> limitTimerInterval

    /**
     * إرسال طلب للحصول على مهمة فيديو جديدة.
     * @param {object} taskParams - بيانات المهمة (مثل نوع MAC).
     * @param {function} successCallback - دالة تُنفذ عند النجاح.
     */
    function getNewVideoTask(taskParams, successCallback) { // function(t, n)
        macManager.setWait(true);
        let ajaxData = { type: "video" };
        ajaxData.mac = macManager.getMac();
        if (taskParams && taskParams.mac) {
            ajaxData.mac = taskParams.mac;
        }

        $.ajax({
            url: "/tasks/control/getExtYT.php",
            type: "post",
            data: ajaxData,
            dataType: "json",
            success: function(response) {
                if ("ok" === response.status) {
                    // تحديث واجهة المستخدم
                    $("#viewCurDay").text(response.data.viewCurDay);
                    if (response.data.ip) utils.getInfo(response.data.ip);
                    if (response.data.balance) {
                        $(".balance-numeric").text(response.data.balance.toString().match(/\d+\.\d{0,5}/)[0]);
                    }
                    // معالجة إعادة التوجيه
                    if (response.data.rdr) {
                        response.data.href = response.data.rdr + response.data.href;
                    }

                    currentTaskData = response.data; // r
                    taskStartTime = new Date / 1000 | 0; // s

                    // فحص بيئة YouTube كل 15 مهمة
                    if (response.data.curDay && +response.data.curDay % 15 == 0) {
                        checkEnvironment(false);
                    }

                    successCallback(response.data);
                    macManager.setWait(false);
                } else {
                    // تسجيل خطأ
                    $.ajax({
                        url: "/tasks/control/log.php",
                        type: "post",
                        data: { data: { error: "yes", message: response.message, protocol: location.protocol } },
                        dataType: "json",
                        success: function() {},
                        error: function() {}
                    });
                    // عرض خطأ للمستخدم
                    swal.fire({
                        text: response.message ? response.message : translations[language]["Ошибка сервера попробуйте ещё раз!"],
                        icon: "error",
                        confirmButtonText: translations[language]["Закрыть"],
                        customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
                    });
                    runTaskButton.attr("disabled", false);
                }
            },
            error: function(xhr, status, error) {
                runTaskButton.attr("disabled", false);
                // تسجيل خطأ
                $.ajax({
                    url: "/tasks/control/log.php",
                    type: "post",
                    data: { data: { status: xhr.status, protocol: location.protocol } },
                    dataType: "json",
                    success: function() {},
                    error: function() {}
                });
                // عرض خطأ للمستخدم
                swal.fire({
                    text: translations[language]["Ошибка сервера попробуйте ещё раз!"],
                    icon: "error",
                    confirmButtonText: translations[language]["Закрыть"],
                    customClass: { confirmButton: "btn font-weight-bold btn-light-primary" }
                });
            }
        });
    }

    /**
     * تحديث مؤقت الحدث (Contest Timer).
     * @param {number} endTime - الوقت بالثواني لانتهاء الحدث.
     */
    function updateEventTimer(endTime) { // function(t)
        clearInterval(eventTimerInterval);
        let currentTime = Date.now() / 1000 | 0;
        let remainingTime = endTime - currentTime;
        $("#event_timer").text(formatTime(remainingTime));

        eventTimerInterval = setInterval(() => {
            let currentTime = Date.now() / 1000 | 0;
            remainingTime = endTime - currentTime;
            $("#event_timer").text(formatTime(remainingTime));

            if (remainingTime < 0) {
                $("#event_timer").text("00:00:00");
                clearInterval(eventTimerInterval);
                // بدء فحص الفوز بالمسابقة
                let checkCount = 0;
                let checkInterval = setInterval(function() {
                    checkCount++;
                    if (document.hasFocus()) {
                        $.ajax({
                            url: "/contests/control/api.php",
                            type: "post",
                            data: { type: "checkContestWin" },
                            dataType: "json",
                            success: function(response) {
                                if (false !== response.data.sum && response.data.sum.balance) {
                                    utils.swalContestWin(utils.validatorSum(response.data.sum.balance, 2));
                                }
                            },
                            error: function(xhr, status, error) {}
                        });
                    }
                    if (checkCount > 10) {
                        clearInterval(checkInterval);
                    }
                }, 15000);
            }
        }, 1000);
    }

    /**
     * تحديث مؤقت الحد الأقصى اليومي (Limit Timer).
     */
    function updateLimitTimer() { // function()
        let timerElement = $("#timerLimit");
        if (timerElement.data("time") <= 0) {
            timerElement.text("00:00:00");
            if (timerElement.data("issend") == "0") {
                $("#sendReqLimit").attr("disabled", false);
            }
            return;
        }

        if (timerElement.length > 0) {
            clearInterval(limitTimerInterval);
            let startTime = Date.now() / 1000 | 0;
            timerElement.text(formatTime(timerElement.data("time")));

            limitTimerInterval = setInterval(() => {
                let currentTime = Date.now() / 1000 | 0;
                let remainingTime = timerElement.data("time") - (currentTime - startTime);
                timerElement.text(formatTime(remainingTime));

                if (remainingTime < 0) {
                    timerElement.text("00:00:00");
                    $("#sendReqLimit").attr("disabled", false);
                }
            }, 1000);
        }
    }

    return {
        /**
         * تهيئة التطبيق بالكامل.
         */
        init: function() {
            // 1. إضافة وتجهيز كود HTML لـ Captcha
            $("body").append(captchaModule.getHtmlCaptcha());
            captchaModule.init("." + CAPTCHA_MODAL_CLASS, { event: {} });

            // 2. إذا كان جهازاً محمولاً، تصغير منطقة النقر على زر mac2View
            if (utils.isMobile()) {
                $("#mac2View").css({
                    position: "fixed",
                    height: "100%",
                    width: "2%",
                    left: "0",
                    top: "0",
                    zIndex: "9000000"
                });
            }

            // 3. التحقق الأولي من البيئة (YouTube/الجهاز المحمول)
            checkEnvironment();

            // 4. تشغيل المؤقتات
            updateEventTimer(window.event_time);
            updateLimitTimer();
            
            // 5. معالج حدث النقر على زر تشغيل المهمة (runTaskButton)
            runTaskButton.on("click", function(event, data) {
                // التحقق مما إذا كانت المهمة متاحة
                if (!isTaskAvailable) return;
                
                // إخفاء الكابتشا إذا كانت معروضة
                captchaModule.hide();
                
                let params = {};
                // إدراج نوع MAC إذا تم تمريره من macManager
                if (data && null != data.mac) {
                    params.mac = data.mac;
                }
                
                // التحقق من أن النقر موثوق به أو أن نوع MAC موجود (أي تم تحريكه عبر macManager)
                if ((event.originalEvent && event.originalEvent.isTrusted) || typeof params.mac !== 'undefined') {
                    $(this).attr("disabled", true);
                    
                    getNewVideoTask(params, (taskData) => {
                        // التحقق من حدود المهام
                        if (Math.min(taskData.limitHour, taskData.limitDay, taskData.cnt) <= 0) {
                            captchaModule.showAlert(translations[language]["Сейчас заданий нет, зайдите позже"]);
                            $("#mac2View").text("mac3Starts");
                            return;
                        }

                        // تجميع بصمة الجهاز وبدء المهمة
                        collectFingerprintAndStart({
                            mac: params.mac || 0,
                            x: event.offsetX,
                            y: event.offsetY
                        });
                        visibilityState = 1; // تعيين حالة الرؤية إلى "بدء المشاهدة"
                        
                        // إرسال طلب تحقق إضافي عبر طرف ثالث
                        $.ajax({
                            url: "https://uchecker.top/check/?set=1",
                            method: "GET",
                            xhrFields: { withCredentials: true },
                            dataType: "json",
                            crossDomain: true
                        });
                        
                        // فتح رابط الفيديو في نافذة جديدة
                        window.open(taskData.href, "_blank").focus();
                    });
                }
            });

            // 6. بدء الكابتشا مباشرة إذا كان refreshTask = 1 (حالة تحديث المهمة) وعلى جهاز محمول
            if (window.refreshTask == 1 && utils.isMobile()) {
                captchaModule.start(1);
            }
        }
    };
}();

// تشغيل الوظيفة الرئيسية عند تحميل الصفحة بالكامل
jQuery(document).ready(function() {
    tasksVisitsPage.init();
});