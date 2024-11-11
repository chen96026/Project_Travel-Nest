import { auth } from "./initialAuth.js";
import { signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const btnLine = document.getElementById("member_login_line_button");
const provider = new OAuthProvider('oidc.line_login');
// Line登入
btnLine.addEventListener("click", (e) => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// User is signed in.
			// IdP data available using getAdditionalUserInfo(result)

			// Get the OAuth access token and ID Token
			console.log(result);
			const credential = OAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			console.log(credential);

			const user = result.user;
			const iconUrl = user.photoURL; // 獲取用戶的照片 URL
			console.log(user);

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
							thirdPartyId: user.uid, // Line 的 user ID 作為第三方 ID
							provider: "line",        // 提供商，這裡是 Line
							name: user.displayName,  // 使用者名稱
							email: user.email,       // 使用者的 email（如果有的話）
							icon: Array.from(byteArray)      // 使用者的頭像（可選）
						};

						// 發送請求到後端
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
			console.log("line問題\n" + errorCode + ": " + errorMessage);
		});
});