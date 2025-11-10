// 1. تعريف الجزء الثابت من الـ ID
const fixedPrefix = '424';

// 2. تحديد الفاصل الزمني (3 ثواني = 3000 مللي ثانية)
const intervalTime = 3000;

/**
 * @function generateRandomId
 * @description تنشئ رقمًا عشوائيًا وتضمه إلى البادئة الثابتة.
 * @returns {string} الـ ID الجديد الذي يبدأ بـ 424.
 */
function generateRandomId() {
    // نحتاج إلى 6 أرقام عشوائية لكي يصبح طول الـ ID الكلي 9 خانات (3 + 6) 
    // إذا كنت تريد الطول الأصلي (7 خانات) فالأفضل أن نجعل الجزء العشوائي بطول 4 خانات
    // ليكون المجموع (424 + 4 أرقام عشوائية) = 7 خانات.

    // توليد رقم عشوائي بين 1000 و 9999 (لضمان 4 خانات)
    const min = 1000;
    const max = 9999;
    
    // Math.floor(Math.random() * (max - min + 1)) + min
    const randomSuffix = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // ضم البادئة الثابتة مع الجزء العشوائي
    const newId = fixedPrefix + randomSuffix;
    
    return newId;
}


/**
 * @function runRandomCommand
 * @description تولد ID عشوائي وتنفذ الأمر المطلوب كل 3 ثوانٍ.
 */
function runRandomCommand() {
    // توليد الـ ID الجديد في كل تكرار
    const currentId = generateRandomId();
    
    // بناء الأمر بالـ ID العشوائي
    const command = `start_youtube_view('${currentId}');`;
    
    // تنفيذ الأمر. (سنفترض وجود الدالة start_youtube_view في بيئتك)
   // console.log(`[${new Date().toLocaleTimeString()}] تنفيذ الأمر بالـ ID العشوائي: ${currentId}`);

    // تنفيذ جزء الدالة: start_youtube_view(currentId)
    if (typeof start_youtube_view === 'function') {
        start_youtube_view(currentId);
    } else {
        // إذا لم تكن الدالة موجودة، سنطبع تنبيهًا للمستخدم.
      //  console.warn(`الدالة start_youtube_view() غير معرفة في هذا النطاق.`);
    }
}

// 3. تشغيل الدالة runRandomCommand() كل 3 ثوانٍ
//console.log(`بدء تشغيل المؤقت. سيتم تشغيل الأمر كل ${intervalTime / 1000} ثوانٍ بالـ ID يبدأ بـ ${fixedPrefix} + رقم عشوائي.`);
const intervalId = setInterval(runRandomCommand, intervalTime);

// *************************************************************************
// ملاحظة: لإيقاف هذا التكرار لاحقًا، يمكنك استخدام: clearInterval(intervalId);
// *************************************************************************