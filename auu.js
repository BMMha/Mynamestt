// 1. تعريف قيمة الـ ID الابتدائية
let currentId = 4247400;

// 2. تحديد الفاصل الزمني (3 ثواني = 3000 مللي ثانية)
const intervalTime = 3000;

/**
 * @function runSequentialCommand
 * @description تنفذ الأمر المطلوب مع زيادة قيمة الـ ID في كل مرة.
 */
function runSequentialCommand() {
    // بناء الأمر بالـ ID الحالي
    // سنقوم فقط بتنفيذ الدالة المطلوبة، لأن الأجزاء الأخرى (this.style)
    // لا تنطبق على هذا السياق الزمني.
    const command = `start_youtube_view('${currentId}');`;
    
    // تنفيذ الأمر. (سنفترض وجود الدالة start_youtube_view في بيئتك)
   // console.log(`[${new Date().toLocaleTimeString()}] تنفيذ: ${command}`);

    // *******************************************************************
    // ⚠️ انتبه: إذا كانت الدالة `start_youtube_view` موجودة، فسيتم استدعاؤها هنا.
    // إذا لم تكن موجودة، فسيظهر خطأ.
    // *******************************************************************

    // هنا نقوم بتنفيذ جزء الدالة: start_youtube_view(currentId)
    if (typeof start_youtube_view === 'function') {
        start_youtube_view(currentId);
    } else {
        // إذا لم تكن الدالة موجودة، سنطبع تنبيهًا للمستخدم.
        alert(`الدالة start_youtube_view() غير معرفة في هذا النطاق.`);
    }


    // 3. زيادة الـ ID للاستخدام في التكرار التالي
    currentId++;
    
    // يمكنك طباعة القيمة الجديدة للتأكد من الزيادة
    //console.log(`قيمة الـ ID التالية ستكون: ${currentId}`);
}

// 4. تشغيل الدالة runSequentialCommand() كل 3 ثوانٍ
//console.log(`بدء تشغيل المؤقت. سيتم تشغيل الأمر كل ${intervalTime / 1000} ثوانٍ بدءاً من الـ ID: ${currentId}`);
const intervalId = setInterval(runSequentialCommand, intervalTime);

// *************************************************************************
// توثيق إضافي: لإيقاف التشغيل لاحقًا، يمكنك استخدام الأمر التالي:
// clearInterval(intervalId);
// *************************************************************************