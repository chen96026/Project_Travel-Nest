$(() => {
    const today = new Date().toISOString().split('T')[0];

    // 設定出發日的最大值為今天
    $('#forum_startDate').attr('max', today);

    // 設定出發日後，更新回程日的最小值
     $('#forum_startDate').on('change', function() {
        $('#forum_endDate').attr('min', $(this).val());
     });

})