$(() => {
    let check = false;	// 檢查所有必填欄位皆符合要求
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 輸入驗證
    // 符合條件(沒填值)的元素加上紅框
    function checkValue(selector, condition) {
        if (condition) {
            $(selector).addClass('contact_emptyInput');
            check = false;
        } else {
            $(selector).removeClass('contact_emptyInput');
        }
    }

    $('#contact_name, #contact_content').blur(function () {
        checkValue(this, !this.checkValidity());
    });

    $('#contact_email').blur(function () {
        checkValue(this, !emailPattern.test(this.value));
    });

    $('#contact_category').blur(function () {
        checkValue(this, this.value === `請選擇問題分類`);
    });

    $('#contact_submit').click(() => {
        check = true;
        checkValue('#contact_name', !$('#contact_name')[0].checkValidity());
        checkValue('#contact_content', !$('#contact_content')[0].checkValidity());
        checkValue('#contact_email', !emailPattern.test($('#contact_email').val()));
        checkValue('#contact_category', $('#contact_category').val() === `請選擇問題分類`);
    });

    // 傳送表單
    $('#contact_form').on('submit', function (e) {
        // 讓表單無法送出，讓前端功能能正常展示
        e.preventDefault();
        console.log("submit");

        if (check) {
			$('main').append(`
				<div class="contact_bg"></div>
				<div class="contact_waiting">
					<p>
						正在將表單內容寄送給 Javel<br>
						請稍後片刻
					</p>
					<div class="spinner-box">
						<div class="three-quarter-spinner"></div>
					</div>
				</div>
			`);
			$('.contact_bg').fadeIn(300);
			$('.contact_waiting').hide().fadeIn(100);
			
            const data = new FormData(this);

            fetch(`/contact/api/submit`, {
                method: 'POST',
                body: data
            })
            .then(response => {
                if (response.ok) {
                    console.log('Success: ', response);
                    $('main').append(`
                        <div class="contact_send">
                            <img class="contact_mail" src="/img/icon/mail_175dp_BC002D_FILL1_wght400_GRAD0_opsz48.svg" alt="mail">
                            <h1>感謝您的信件</h1>
                            <p>我們已收到您的問題與回饋，我們將於近日內回信至您填寫的 E-MAIL</p>
                            <button id="contact_Close" class="contact_btnClose">關閉</button>
                        </div>
                    `);
					$('.contact_waiting').fadeOut(300);
					setTimeout(() => {
						$('.contact_waiting').remove();
	                    $('.contact_send').fadeIn(300);
					}, 300)
					$('#contact_form')[0].reset();
                    return response.json();

                } else {
                    console.log('Fail: ', response);
                }
            })
            .catch(error => {
                console.error('err', error);
            });
        }
    });

    // 關閉送出成功提示窗
    $('main').on('click', '#contact_Close', () => {
	    $('.contact_bg').fadeOut(300);
        $('.contact_send').fadeOut(300);
        setTimeout(() => {
	        $('.contact_bg').remove();
			$('.contact_send').remove();
		}, 300);
    });
});