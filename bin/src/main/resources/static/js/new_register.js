const images = [
		'./img/登入頁_日本.jpg',
		'./img/登入頁_希臘.jpg',
		'./img/登入頁_洛杉磯.jpg',
		'./img/登入頁_瑞典.jpg',
		'./img/登入頁_加拿大.jpg'
];

let currentIndex = 0;
const intervalTime = 3000;

// 預加載所有圖片
function preloadImages(imageArray, callback) {
	let loadedImages = 0;
	const totalImages = imageArray.length;
	const preloadedImages = [];

	imageArray.forEach((src, index) => {
		const img = new Image();
		img.src = src;
		preloadedImages[index] = img;

		img.onload = () => {
			loadedImages++;
			if (loadedImages === totalImages) {
				callback(); // 所有圖片加載完成後執行回調
			}
		};
	});
}

// 切換圖片函數
function showNextImageSlide() {
	const currentImage = document.querySelector('.member_register_design-image.active');
	const nextImage = document.querySelector('.member_register_design-image:not(.active)');

	// 設置下一張圖片的 src
	currentIndex = (currentIndex + 1) % images.length;
	nextImage.src = images[currentIndex];

	// 讓當前圖片滑出並淡出
	currentImage.classList.remove('active');
	currentImage.classList.add('prev');

	// 讓下一張圖片從右側滑入
	nextImage.classList.add('active');
	nextImage.classList.remove('prev');

	// 重置當前圖片狀態
	setTimeout(() => {
		currentImage.classList.remove('prev');
	}, 1000); // 與 transition 的 left 時間保持一致
}

// 頁面加載時顯示第一張圖片（無過渡）
window.onload = () => {
	preloadImages(images, () => {
		// 當所有圖片預加載完成後，顯示第一張圖片並開始輪播
		const firstImage = document.querySelector('.member_register_design-image');
		firstImage.src = images[currentIndex]; // 設置第一張圖片
		firstImage.classList.add('initial'); // 避免初始圖片出現過渡

		setTimeout(() => {
			firstImage.classList.remove('initial'); // 移除初始化狀態
			firstImage.classList.add('active'); // 設置為 active，讓它成為顯示的圖片
		}, intervalTime); // 等待第一個圖片顯示的時間，然後開始過渡效果

		setInterval(showNextImageSlide, intervalTime); // 設置圖片輪播間隔
	});
};

// 切換顯示或隱藏密碼
const togglePassword1 = document.querySelector('#member_eyes_Password_first');
const password1 = document.querySelector('#member_register_Password');

togglePassword1.addEventListener('click', function() {
	// 切換 input 的類型
	const type = password1.getAttribute('type') === 'password' ? 'text' : 'password';
	password1.setAttribute('type', type);

	// 切換眼睛圖示
	if (this.classList.contains('fa-eye-slash')) {
		this.classList.remove('fa-eye-slash');
		this.classList.add('fa-eye');
	} else {
		this.classList.remove('fa-eye');
		this.classList.add('fa-eye-slash');
	}
});

const togglePassword2 = document.querySelector('#member_eyes_Password_second');
const password2 = document.querySelector('#member_register_confirmPassword');

togglePassword2.addEventListener('click', function() {
	// 切換 input 的類型
	const type = password2.getAttribute('type') === 'password' ? 'text' : 'password';
	password2.setAttribute('type', type);

	// 切換眼睛圖示
	if (this.classList.contains('fa-eye-slash')) {
		this.classList.remove('fa-eye-slash');
		this.classList.add('fa-eye');
	} else {
		this.classList.remove('fa-eye');
		this.classList.add('fa-eye-slash');
	}
});


function checkEmail() {
	let emailInput = document.getElementById("member_register_Email");

	// 首先清除之前的錯誤訊息
	emailInput.setCustomValidity("");

	// 檢查 email 是否符合正則表達式
	if (!emailInput.checkValidity()) {
		emailInput.setCustomValidity("請輸入符合的格式，例如：example@example.com");
		emailInput.reportValidity(); // 顯示錯誤提示
		return;
	}

	// 繼續處理
	let email = emailInput.value;
	fetch('/member/isexistEmail/' + encodeURIComponent(email))
		.then(response => {
			if (!response.ok) {
				throw new Error('Error');
			}
			return response.json();
		})
		.then(data => {
			document.getElementById("checkEmail").innerHTML = data.mesg;
			let emailStatusIcon = document.getElementById("emailStatusIcon");

			if (data.mesg === "信箱可以註冊") {
				document.getElementById("checkEmail").style.color = "green";
				emailStatusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
				emailStatusIcon.style.color = "green";
			} else if (data.mesg === "信箱已被註冊") {
				document.getElementById("checkEmail").style.color = "red";
				emailStatusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
				emailStatusIcon.style.color = "red";
			}
		})
		.catch(error => {
			console.error('Fetch error:', error);
		});
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
	register(event);
});

function register(event) {
	event.preventDefault();

	let emailInput = document.getElementById("member_register_Email");

	// 清除之前的錯誤訊息
	emailInput.setCustomValidity("");

	// 檢查表單是否通過 HTML5 的驗證
	const form = document.getElementById('registerForm');
	if (!form.checkValidity()) {
		form.reportValidity();  // 顯示錯誤提示
		return;
	}

	// 執行註冊邏輯
	let email = emailInput.value;
	let password = document.getElementById("member_register_Password").value;
	let confirmpassword = document.getElementById("member_register_confirmPassword").value;

	let data = {
		email: email,
		password: password,
		confirmpassword: confirmpassword
	};

	// 發送註冊請求
	fetch('/member/register', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error("註冊失敗");
			}
			return response.json();
		})
		.then(data => {
			if (data.memberStatus === 'ADD_SUCCESS') {
				const now = new Date().getTime();
				let uidData = {
					date: now,
					uid: data.member.uid
				}
				localStorage.setItem('uid',JSON.stringify(uidData));
				window.location.href = localStorage.getItem('lastUrl');
			} else {
				swal("註冊失敗", "信箱已被註冊，請輸入新的信箱", "error", { button: "確定" });
			}
		})
		.catch(error => {
			console.error('Fetch error:', error);
		});
}


//密碼確認勾勾
document.getElementById('member_register_confirmPassword').addEventListener('input', function() {
	const password = document.getElementById('member_register_Password').value;
	const confirmPassword = this.value;
	const passwordMatchIcon = document.getElementById('member_passwordMatchIcon');

	if (confirmPassword === password && confirmPassword !== "") {
		// 顯示綠色勾勾
		passwordMatchIcon.innerHTML = '<i class="fas fa-check-circle" style="color: green;"></i>';
	} else if (confirmPassword !== password && confirmPassword !== "") {
		// 顯示紅色叉叉
		passwordMatchIcon.innerHTML = '<i class="fas fa-times-circle" style="color: red;"></i>';
	} else {
		// 清空圖示
		passwordMatchIcon.innerHTML = '';
	}
});