$(() => {
    // 輪播
    let slides = $('.forum_photoImg');  // 所有幻燈片圖片(大圖)
    let slideIndex = 0; // 圖片索引
    let smallPhotos = $('.forum_smallPhoto');   // 所有小圖
    let timer;  // 計時器

    // 切換圖片
    function showSlides(n) {

        // 確保索引在合理範圍內
        if (n >= slides.length) { slideIndex = 0; }  // 從最後一張再往後會回到第一張
        if (n < 0) { slideIndex = slides.length - 1; }  // 從第一張再往前會跳到最後一張

        // 隱藏所有幻燈片
        slides.hide();  

        // 移除所有小圖的活躍狀態
        smallPhotos.removeClass('forum_smallPhoto_active');

        // 顯示當前幻燈片
        slides.eq(slideIndex).show();  
        
        // 設置對應小圖為活躍狀態
        smallPhotos.eq(slideIndex).addClass('forum_smallPhoto_active');

        // 清空原本的計時器
        clearInterval(timer);
        // 重新設置計時器每隔 ~ 秒自動切換
        timer = setInterval(() => { showSlides(slideIndex += 1); }, 5000);
    }

    // 頁面載入即開始執行
    showSlides(slideIndex);
    
    // 點擊向左箭頭切換到前一張
    $('#forum_lastImg').on('click', function() {
        showSlides(slideIndex -= 1);
    });
    
    // 點擊向右箭頭切換到後一張
    $('#forum_nextImg').on('click', function() {
        showSlides(slideIndex += 1);
    });
    
    // 點擊底下小圖切換到指定圖片
    smallPhotos.on('click', function() {
        let index = $(this).index();
        showSlides(slideIndex = index);
    });

});