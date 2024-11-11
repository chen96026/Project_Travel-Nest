$('main').on('mouseenter', '#forum_chooseImg_label',() => {
    $('.forum_chooseImg_icon').addClass('forum_chooseImg_icon_hover');
    $('.forum_chooseImg_text').addClass('forum_chooseImg_text_hover');
});
$('main').on('mouseleave', '#forum_chooseImg_label',() => {
    $('.forum_chooseImg_icon').removeClass('forum_chooseImg_icon_hover');
    $('.forum_chooseImg_text').removeClass('forum_chooseImg_text_hover');
});