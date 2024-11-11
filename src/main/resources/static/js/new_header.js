if (!localStorage.getItem('uid')) {
	document.getElementById('member_page').style.display = 'none';
	document.getElementById('login_page').innerHTML = `<a href="/login" style="font-size:16px;">登入</a>`;
} else {
	fetch('/member/info', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => {
		return response.json();
	}).then(data => {
		if (data.id == '1') {
			document.getElementById('member_page').innerHTML = `<a href="/admin" style="font-size:16px;">後臺管理</a>`
			document.getElementById('login_page').innerHTML = `<a href='javascript:void(0);' id='logout' style="font-size:16px;">登出</a>`
		} else {
			document.getElementById('member_page').innerHTML = `<a href="/memberpage" style="font-size:16px;">會員專區</a>`
			document.getElementById('login_page').innerHTML = `<a href='javascript:void(0);' id='logout' style="font-size:16px;">登出</a>`
		}
	}).catch(error => {
		console.error('Logout failed:', error);
	});
}

window.onpageshow = function(event) {
	if (event.persisted) {
		window.location.reload(); // 強制頁面重新加載
	}
};

const nowTime = new Date().getTime();
const uidData = JSON.parse(localStorage.getItem('uid'));
if (uidData) {
	// 沒登出超過一定時間會自動登出
	if (Number(uidData.date) + 9000000 <= nowTime) localStorage.removeItem('uid');

	// logout登出
	document.getElementById('logout').addEventListener('click', (event) => {
		event.preventDefault();
		swal({
			title: "確定登出?",
			icon: "warning",
			buttons: {
				cancel: {
					text: "取消",
					value: null,
					visible: true,
					className: "btn-cancel",
					closeModal: true,
				},
				confirm: {
					text: "確定",
					value: true,
					visible: true,
					className: "btn-confirm",
					closeModal: true
				}
			},
			dangerMode: false
		}).then((value) => {
			if (value) {
				localStorage.removeItem('uid');
				fetch('/member/logout', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(response => {
				}).catch(error => {
					console.error('Logout failed:', error);
				});
				window.location.href = '/homepage';
			}
		});
	})
}

localStorage.setItem('lastUrl', window.location.href);