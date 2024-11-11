import { auth } from "./initialAuth.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const btnGoogle = document.getElementById("member_login_google_button");
// Google登入
btnGoogle.addEventListener("click", (e) => {
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		prompt: "consent", // 強制要求用戶每次都需要授權
	});
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			console.log(credential);

			// The signed-in user info.
			const user = result.user;
			const iconUrl = user.photoURL; // 獲取用戶的照片 URL
			console.log(user);
			// IdP data available using getAdditionalUserInfo(result)
			// ...
			// 獲取圖像數據
			fetch(iconUrl)
				.then(response => response.blob())
				.then(blob => {
					const reader = new FileReader();
					reader.onloadend = () => {
						// 將 Blob 轉換為 Base64 字符串
						const base64data = reader.result;
						// 將 Base64 字符串轉換為 byte array
						const byteCharacters = atob(base64data.split(',')[1]);
						const byteNumbers = new Array(byteCharacters.length);
						for (let i = 0; i < byteCharacters.length; i++) {
							byteNumbers[i] = byteCharacters.charCodeAt(i);
						}
						const byteArray = new Uint8Array(byteNumbers);
						// 將第三方登入的數據發送給後端進行處理
						const thirdPartyData = {
							thirdPartyId: user.uid, // Google 的 user ID 作為第三方 ID
							provider: "google",     // 提供商，這裡是 Google
							name: user.displayName, // 使用者名稱
							email: user.email,      // 使用者的 email
							icon: Array.from(byteArray) // 將 byte array 轉換為可序列化的數組
						};

						fetch('/member/thirdparty/login', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(thirdPartyData)  // 將第三方資料轉換為 JSON 發送
						})
							.then(response => response.json())
							.then(data => {
								const now = new Date().getTime();
								let uidData = {
									date: now,
									uid: data.member.uid
								}
								localStorage.setItem('uid', JSON.stringify(uidData));
								window.location.href = localStorage.getItem('lastUrl');
								// 根據後端返回的結果，處理登入後的行為，例如跳轉到首頁
							})
							.catch(error => {
								console.error('Error:', error);
							});
					};
					reader.readAsDataURL(blob); // 這將觸發 onloadend 事件
				})
				.catch(error => {
					console.error("獲取圖像時出錯:", error);
				});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("Google 登入失敗\n" + errorCode + ": " + errorMessage);
		});
});