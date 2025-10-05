(function() {
    /**
     * ====================================================================
     * Auto Video Clicker for SEO-FAST
     * ====================================================================
     * الوصف: يقوم هذا السكربت بالبحث عن جميع فيديوهات يوتيوب وروتيوب
     * الموجودة في الصفحة والنقر عليها تلقائياً كل 8 ثوانٍ.
     * الإصدار: 1.0
     * ====================================================================
     */

    //console.log("%c🚀 Auto Clicker: Starting...", "color: #4CAF50; font-size: 16px; font-weight: bold;");

    // الخطوة 1: العثور على جميع صفوف الفيديوهات في الجدول
    // نحن نبحث عن عناصر `<tr>` التي يبدأ معرفها (id) بـ "youtube_v".
    // هذا هو النمط المشترك لكل فيديوهات العرض في صفحة HTML.
    const videoRows = document.querySelectorAll('tr[id^="youtube_v"]');
alert('auto_start');
    // الخطوة 2: استخلاص الروابط القابلة للنقر من كل صف
    // نقوم بإنشاء قائمة (array) لتخزين الروابط التي سنجدها.
    const videoLinks = [];
    videoRows.forEach(row => {
        // داخل كل صف، نبحث عن أول عنصر `<a>` يحتوي على دالة `start_youtube_view` في خاصية `onclick`.
        const clickableLink = row.querySelector('a[onclick*="start_youtube_view"]');
        if (clickableLink) {
            videoLinks.push(clickableLink);
        }
    });

    if (videoLinks.length === 0) {
        alert("Auto Clicker: No video links found on the page. Stopping.");
        return; // إيقاف السكربت إذا لم يتم العثور على أي فيديوهات
    }

    alert(`%c✅ Auto Clicker: Found ${videoLinks.length} videos to click.`, "color: #03A9F4; font-size: 14px;");

    // الخطوة 3: إعداد المؤقت للنقر التلقائي
    let currentIndex = 0; // متغير لتتبع الفيديو التالي الذي سيتم النقر عليه
    const intervalInSeconds = 8; // الفترة الزمنية بالثواني بين كل نقرة

    // دالة النقر التلقائي التي سيتم استدعاؤها بشكل متكرر
    const autoClicker = () => {
        // التحقق مما إذا كنا قد انتهينا من كل الروابط
        if (currentIndex >= videoLinks.length) {
            alert("%c🎉 Auto Clicker: Finished clicking all available videos. Stopping.", "color: #FFC107; font-size: 16px; font-weight: bold;");
            clearInterval(autoClickerInterval); // إيقاف المؤقت عند الانتهاء
            return;
        }

        // الحصول على الرابط الحالي للنقر عليه
        const linkToClick = videoLinks[currentIndex];
        
        // استخراج معرّف الفيديو من أقرب عنصر `<tr>` أب
        const parentRowId = linkToClick.closest('tr').id;
        const videoId = parentRowId.replace('youtube_v', '');

        // طباعة رسالة في الكونسول للمتابعة
        console.log(`[${currentIndex + 1}/${videoLinks.length}] Clicking video with ID: ${videoId}`);

        // محاكاة النقر على الرابط
        // هذا سيؤدي إلى تنفيذ دالة `start_youtube_view` الموجودة في ملف `no_cash_js.js`
        linkToClick.click();

        // الانتقال إلى الفيديو التالي في الدورة القادمة
        currentIndex++;
    };
//closeVideoModal();
    // الخطوة 4: بدء التنفيذ التلقائي
    // `setInterval` هي دالة جافاسكريبت تقوم بتكرار تنفيذ دالة أخرى كل فترة زمنية محددة.
    const autoClickerInterval = setInterval(autoClicker, intervalInSeconds * 1000); // نضرب في 1000 لتحويل الثواني إلى ميلي ثانية

})();
