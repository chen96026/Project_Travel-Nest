$(() => {
	const url = window.location.pathname;
	const urlparts = url.split('/');
	const id = urlparts[urlparts.length - 1];

	let like = $('#forum_detail_like').data('like');
	let bookmark = $('#forum_detail_bookmark').data('bookmark');
	let report = $('#forum_detail_report').data('report');

	// 按讚
	// 未登入會觸發請求登入的視窗
	$('#forum_detail_login').click(() => {
		console.log("Not logging")
		$('main').append(`
			<div class="forum_bg"></div>  
			  	<div class="forum_detail_checkwindow">
				<p>您尚未登入，請先登入！</p>
				<a href="/login" id="forum_toLogin" class="forum_a_toLogin">
					<p>前往登入</p>
				</a>
				<button id="forum_closeWindow" class="forum_checkwindow_cancel">暫時不要</button>
			</div>
		`)
		$('.forum_bg').fadeIn(300);
		$('.forum_detail_checkwindow').hide().fadeIn(100);
	})

	$('#forum_detail_like').click(() => {
		fetch(`/forum/api/like/${id}`, {
			method: (like) ? 'DELETE' : 'POST'	// 判斷是否已點過讚
		})
			.then(response => {
				console.log(response);
				if (response.ok) {
					console.log('Success: ', response);

					like = !like;
					(like) ? $('#forum_detail_like').addClass('forum_d_like_checked').removeClass('forum_d_like_unchecked')
						: $('#forum_detail_like').removeClass('forum_d_like_checked').addClass('forum_d_like_unchecked');

					return response.json();

				} else {
					console.error('Failed to execute the like event on the post.');
				}
			})
			.catch(error => {
				console.error('err', error);
			})

		setTimeout(() => {
			fetch(`/forum/api/countLikes/${id}`)
				.then(response => response.json())
				.then(data => {
					console.log("data:");
					console.log(data);
					$('#forum_detail_countLike').html(`${data}`);
				})
				.catch(error => {
					console.error('Error loading posts:', error);
				})
		}, 200);

	})


	$('#forum_detail_bookmark').click(() => {

		fetch(`/forum/api/bookmark/${id}`, {
			method: (bookmark) ? 'DELETE' : 'POST',
		})
			.then(response => {
				if (response.ok) {
					console.log('Success: ', response);

					bookmark = !bookmark;
					(bookmark) ? $('#forum_detail_bookmark').addClass('forum_d_bookmark_checked').removeClass('forum_d_bookmark_unchecked')
						: $('#forum_detail_bookmark').removeClass('forum_d_bookmark_checked').addClass('forum_d_bookmark_unchecked');

				} else {
					console.error('Failed to bookmark the post');
				}
			})
			.catch(error => {
				console.error('err', error);
			})

	})


	$('#forum_detail_report').click(() => {
		if (!report) {
			$('main').append(`
					<div class="forum_bg"></div>  
					<div class="forum_detail_checkwindow">
						<p>確定要檢舉這篇文章嗎？</p>
						<button id="forum_reportPost" class="forum_checkwindow_OK">確定</button>
						<button id="forum_closeWindow" class="forum_checkwindow_cancel">取消</button>
					</div>
				`)
			$('.forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		} else {
			$('main').append(`
					<div class="forum_bg"></div>  
					<div class="forum_detail_checkwindow">
						<p>您已經檢舉過這篇文章</p>
						<button id="forum_closeWindow" class="forum_checkwindow_close">關閉</button>
					</div>
				`)
			$('.forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		}
	})


	$(document).on('click', '#forum_reportPost', () => {
		fetch(`/forum/api/report/${id}`, {
			method: 'POST',
		})
			.then(response => {
				if (response.ok) {
					console.log('Success: ', response);
					report = true;
					$('.forum_detail_checkwindow').fadeOut(100);
					setTimeout(() => {
						$('.forum_detail_checkwindow').remove();
						$('main').append(`
							<div class="forum_detail_checkwindow">
								<p>我們已收到您的檢舉</p>
								<button id="forum_closeWindow" class="forum_checkwindow_close">關閉</button>
							</div>
						`)						
					$('.forum_detail_checkwindow').hide().fadeIn();
					}, 100);
				} else {
					console.error('Failed to report the post');
				}
			})
			.catch(error => {
				console.error('err', error);
			})
	})


	$('#forum_detail_delete').click(() => {
		$('main').append(`
				<div class="forum_bg"></div>  
			  	<div class="forum_detail_checkwindow">
					<p>確定要刪除這篇文章嗎？</p>
					<button id="forum_deletePost" class="forum_checkwindow_OK">確定</button>
					<button id="forum_closeWindow" class="forum_checkwindow_cancel">取消</button>
				</div>
			`)
		$('.forum_bg').fadeIn(300);
		$('.forum_detail_checkwindow').hide().fadeIn(100);
	})


	$(document).on('click', '#forum_deletePost', () => {
		fetch(`/forum/api/deletePost/${id}`, {
			method: 'DELETE'
		})
			.then(response => {
				if (response.ok) {
					console.log('Success: ', response);
					setTimeout(() => {
						window.location.href = '/forum';
					}, 1000);
				} else {
					console.error('Failed to delete the post');
				}
			})
			.catch(error => {
				console.error('err', error);
			})
	})

	$(document).on('click', '#forum_closeWindow, .forum_bg', () => {
		$('.forum_bg').fadeOut(300)
		$('.forum_detail_checkwindow').fadeOut(300);			
		setTimeout(() => {
			$('.forum_bg').remove();
			$('.forum_detail_checkwindow').remove();			
		}, 300);
	})
})
