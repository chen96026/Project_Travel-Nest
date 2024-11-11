import { auth } from "./initialAuth.js";
const logout = document.getElementById("logout");
// 登出
logout.addEventListener("click", () => {
	auth.signOut().then(() => {
		localStorage.removeItem('uid');

		// logout登出
		document.getElementById('logout').addEventListener('click', () => {
			localStorage.removeItem('uid');

			fetch('/user/logout', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(response => {
			}).catch(error => {
				console.error('Logout failed:', error);
			});
		})

		window.location.href = "/homepage";
	}).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log("signout問題\n" + errorCode + ": " + errorMessage);
	});
})