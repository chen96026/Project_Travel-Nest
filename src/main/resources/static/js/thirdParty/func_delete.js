import { auth } from "./initialAuth.js";
import { deleteUser } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
const btnDelete = document.getElementById("member_confirmDeleteBtn");
// 刪除
btnDelete.addEventListener("click", (e) => {
		
	const thirdPartyId = auth.currentUser.uid; // 獲取當前用戶的第三方ID
	const email = emailInput.value; // 獲取電子郵件
	
    deleteUser(auth.currentUser).then(() => {
        window.location.href = "/home";
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("delete問題\n" + errorCode + ": " + errorMessage);
    });
})