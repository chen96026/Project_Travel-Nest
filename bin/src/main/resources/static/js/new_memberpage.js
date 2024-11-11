const account = document.getElementById('account');
const password = document.getElementById('password');

fetch('/member/info')
	.then(response => { return response.json(); })
	.then(member => {
		if (member.icon != null) {
			let base64Image = member.icon;
			if (!base64Image.startsWith('data:image/')) {
				base64Image = 'data:image/jpeg;base64,' + base64Image;
			}
			document.getElementById('member_info_icon2').src = base64Image;
		}
		if (member.thirdPartyId) password.style.display = 'none';
	})
	.catch(error => {
		console.error('Error:', error);
	});

function toggleDropdown(dropdownId) {
	const dropdowns = document.querySelectorAll('.dropdown');

	dropdowns.forEach(dropdown => {
		if (dropdown.id !== dropdownId) {
			dropdown.classList.remove('show');
			dropdown.style.maxHeight = '0';
			dropdown.style.opacity = '0';
			dropdown.style.visibility = 'hidden';
		}
	});

	const currentDropdown = document.getElementById(dropdownId);

	if (currentDropdown.classList.contains('show')) {
		currentDropdown.classList.remove('show');
		currentDropdown.style.maxHeight = '0';
		currentDropdown.style.opacity = '0';
		currentDropdown.style.visibility = 'hidden';
	} else {
		currentDropdown.classList.add('show');
		currentDropdown.style.maxHeight = '200px';
		currentDropdown.style.opacity = '1';
		currentDropdown.style.visibility = 'visible';
	}
}

const mainContent = document.getElementById('main-content');
//以下有修改
// 個人資料

account.addEventListener('click', loadMemberInfoPage);
password.addEventListener('click', loadPasswordPage);

document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('member_logout').addEventListener('click', () => {
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
	});

	if (account) {
		toggleDropdown('accountDropdown')
		account.click();
	}
});

//更改齒輪功能拉出來變成一個function，新增點擊齒輪後標題也會變黑色
function gearuse() {
	// 處理齒輪圖標的邏輯
	document.querySelectorAll('.gear-icon').forEach(icon => {
		icon.addEventListener('click', function(event) {
			event.stopPropagation();

			const inputId = this.getAttribute('data-input');
			const inputField = document.getElementById(inputId);

			// 獲取當前齒輪對應的表單組，找到對應的標籤
			const formGroup = this.closest('.member_Info_form-group') || this.closest('.member_Password_form-group');
			const label = formGroup ? formGroup.querySelector('label') : null;

			// 先禁用所有輸入框和重設所有標籤顏色為灰色
			document.querySelectorAll('.member_Info_form input, .member_Password_form input').forEach(input => {
				input.disabled = true;
				const group = input.closest('.member_Info_form-group') || input.closest('.member_Password_form-group');
				const inputLabel = group ? group.querySelector('label') : null;
				if (inputLabel) {
					inputLabel.style.color = "gray"; // 重設標籤顏色為灰色
				}
			});

			// 如果當前欄位被禁用，啟用它，並將標籤顏色設為黑色
			if (inputField.disabled) {
				inputField.disabled = false;
				inputField.focus();
				inputField.style.backgroundColor = "#fff";
				if (label) {
					label.style.color = "#000"; // 將標籤顏色設為黑色
				}
			}
		});
	});

	// 點擊空白處時禁用所有輸入欄位並恢復標籤顏色
	document.addEventListener('click', function() {
		document.querySelectorAll('.member_Info_form input, .member_Password_form input').forEach(input => {
			input.disabled = true;
			input.style.backgroundColor = "#fff";

			const formGroup = input.closest('.member_Info_form-group') || input.closest('.member_Password_form-group');
			const label = formGroup ? formGroup.querySelector('label') : null;
			if (label) {
				label.style.color = "gray"; // 將標籤顏色變回灰色
			}
		});
	});

	// 防止點擊輸入框時觸發全局事件
	document.querySelectorAll('.member_Info_form input, .member_Password_form input').forEach(input => {
		input.addEventListener('click', function(event) {
			event.stopPropagation();
		});

		// 當按下 Enter 鍵時，自動禁用輸入框並恢復標籤顏色
		input.addEventListener('keydown', function(event) {
			if (event.key === "Enter") {
				event.preventDefault();
				input.disabled = true;
				input.style.backgroundColor = "#fff";

				const formGroup = input.closest('.member_Info_form-group') || input.closest('.member_Password_form-group');
				const label = formGroup ? formGroup.querySelector('label') : null;
				if (label) {
					label.style.color = "gray"; // 將標籤顏色變回灰色
				}
			}
		});
	});
}

//更改密碼欄位剃除
const memberInfoHTML = `
<div class="member_Info_container">
    <h2>個人資料</h2>
    <div id="member_Info_User">
        <div class="member_Info_Avatar">
            <img id="member_info_icon" src="./assets/member.png" />
        </div>

        <div id="member_Info_Upload_group">
            <input type="file" id="member_Info_upload_Image" accept="image/*" style="display: none;" />
            <button id="member_customUploadButton">選擇檔案</button>
            <div class="member_Info_Remind">檔案大小:最大1MB</div>
            <div class="member_Info_Remind">檔案限制:.JPEG、.PNG</div>
        </div>
        <button id="member_Info_upload_button">上傳頭像</button>
    </div>

    <input type="hidden" id="member_info_uid" value="uid">

    <div class="member_Info_form">
        <div class="member_Info_form-group">
            <label for="member_info_name">用戶名</label>
            <div class="input-with-icon">
                <input type="text" id="member_info_name" name="member_info_name" placeholder="請輸入用戶名" disabled> <i class="fas fa-cog gear-icon" data-input="member_info_name"></i>
            </div>
        </div>

        <div class="member_Info_form-group">
            <label for="member_info_email">E-mail</label>
            <div class="input-with-icon">
                <input type="email" id="member_info_email" name="member_info_email" disabled> <i class="fas fa-cog gear-icon" data-input="member_info_email"></i>
            </div>
        </div>
      
        <div class="member_Info_form-group">
            <label for="member_info_phone_number">手機</label>
            <div class="input-with-icon">
                <input type="text" id="member_info_phone_number" name="member_info_phone_number" placeholder="請輸入手機號碼"> <i class="fas fa-cog gear-icon" data-input="member_info_phone_number"></i>
            </div>
        </div>

        <div class="member_Info_form-group">
            <label for="member_info_birth">出生日期</label>
            <div class="input-with-icon">
                <input type="date" id="member_info_birth" name="member_info_birth">
                <i class="fas fa-cog gear-icon" data-input="member_info_birth"></i>
            </div>
        </div>

        <div id="member_info_group-btn">
            <button type="submit" class="member_Info_submit-btn" id="member_Info_revisebtn">確認修改</button>
            <button type="submit" class="member_Info_submit-btn" id="member_Info_deletebtn">刪除帳號</button>
        </div>

        <div id="member_deleteAccountModal" class="modal">
            <div id="member_info_modal-content">
                <span id="member_info_close">&times;</span>
                <h3>確認刪除帳號嗎?</h3>
                <br>
                <p>請輸入您的 Email 確認刪除</p>
                <input type="email" id="member_confirmEmail" placeholder="請輸入您的Email"> <br> <br>
                <div id="member_delete_group">
                    <button id="member_confirmDeleteBtn">確認</button>
                    <button id="member_cancelDeleteBtn">取消</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

//更改密碼單獨拉出(新增舊密碼欄位)
const memberPasswordHTML = `
<div class="member_Password_container">
    <h2>更改密碼</h2>
    <div id="member_Info_User">

    <input type="hidden" id="member_info_uid" value="uid">

    <div class="member_Password_form">

	  <div class="member_Password_form-group">
            <label for="member_info_old_password">舊密碼</label>
            <div class="input-with-icon">
                <input type="password" id="member_info_old_password" name="member_info_old_password"> <i class="fas fa-cog gear-icon" data-input="member_info_old_password"></i>
            </div>
        </div>
       
        <div class="member_Password_form-group">
            <label for="member_info_password">新密碼</label>
            <div class="input-with-icon">
                <input type="password" id="member_info_password" name="member_info_password"> <i class="fas fa-cog gear-icon" data-input="member_info_password"></i>
            </div>
        </div>

        <div class="member_Password_form-group">
            <label for="member_info_confirm_password">確認新密碼</label>
            <div class="input-with-icon">
                <input type="password" id="member_info_confirm_password" name="member_info_confirm_password"> <span id="member_info_passwordMatchIcon"></span> <i class="fas fa-cog gear-icon" data-input="member_info_confirm_password"></i>
            </div>
        </div>

        <div id="member_info_group-btn">
            <button type="submit" class="member_Info_submit-btn" id="member_Info_revisebtn">確認修改</button>
        </div>

    </div>
</div>
`;

//更改帳號資料頁面(把跟密碼相關的拉掉)
function loadMemberInfoPage() {
	mainContent.innerHTML = memberInfoHTML;
	gearuse();

	let initialMemberData = {};
	fetch('/member/info')
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to load member info');
			}
		})
		.then(member => {
			initialMemberData = {
				uid: member.uid,
				name: member.name,
				email: member.email,
				phone: member.phone,
				birthday: member.birthday,
				icon: member.icon
			};

			// 將會員訊息顯示在頁面上
			document.getElementById('member_info_uid').value = member.uid;
			document.getElementById('member_info_name').value = member.name;
			document.getElementById('member_info_email').value = member.email;
			document.getElementById('member_info_phone_number').value = member.phone;
			document.getElementById('member_info_birth').value = member.birthday;

			if (member.icon != null) {
				let base64Image = member.icon;
				if (!base64Image.startsWith('data:image/')) {
					base64Image = 'data:image/jpeg;base64,' + base64Image;
				}
				document.getElementById('member_info_icon').src = base64Image;
				document.getElementById('member_info_icon2').src = base64Image;
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});


	document.getElementById("member_Info_revisebtn").addEventListener("click", function() {
		let updatedMember = {
			uid: document.getElementById('member_info_uid').value
		};

		const name = document.getElementById('member_info_name').value;
		if (name && name !== initialMemberData.name) {
			updatedMember.name = name;
		}
		const email = document.getElementById('member_info_email').value;
		if (email && email !== initialMemberData.email) {
			updatedMember.email = email;
		}
		const phone = document.getElementById('member_info_phone_number').value;
		if (phone && phone !== initialMemberData.phone) {
			updatedMember.phone = phone;
		}
		const birthday = document.getElementById('member_info_birth').value;
		if (birthday !== initialMemberData.birthday) {
			updatedMember.birthday = birthday !== "" ? birthday : null;  // 確保不傳空字符串
		}

		fetch('/member/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedMember)
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('更新失敗');
				}
			})
			.then(updatedData => {
				swal("更新成功!", "會員資料已更新!", "success", { button: "確認" });
				fetch('/member/info')
					.then(response => { return response.json(); })
					.then(member => {
						if (member.icon != null) {
							let base64Image = member.icon;
							if (!base64Image.startsWith('data:image/')) {
								base64Image = 'data:image/jpeg;base64,' + base64Image;
							}
							document.getElementById('member_info_icon').src = base64Image;
							document.getElementById('member_info_icon2').src = base64Image;
						}
					})
					.catch(error => {
						console.error('Error:', error);
					});
			})
			.catch(error => {
				console.error('Error:', error);
			});
	});

	//上傳頭像
	document.getElementById('member_Info_upload_button').addEventListener('click', function() {
		const fileInput = document.getElementById('member_Info_upload_Image');
		const file = fileInput.files[0];
		const uid = document.getElementById('member_info_uid').value;

		console.log("Selected file:", file);
		console.log("UID:", uid);

		if (file && file.size <= 1 * 1024 * 1024) {
			const formData = new FormData();
			formData.append('avatar', file);
			formData.append('uid', uid);

			fetch('/member/uploadicon', {
				method: 'POST',
				body: formData
			})
				.then(response => {
					if (response.ok) {
						return response.text();
					} else {
						throw new Error('頭像上傳失敗');
					}
				})
				.then(data => {
					console.log("後端響應：", data);
					swal("上傳成功!", "頭像已上傳！", "success", { button: "確認" });
					fetch('/member/info')
						.then(response => { return response.json(); })
						.then(member => {
							if (member.icon != null) {
								let base64Image = member.icon;
								if (!base64Image.startsWith('data:image/')) {
									base64Image = 'data:image/jpeg;base64,' + base64Image;
								}
								document.getElementById('member_info_icon').src = base64Image;
								document.getElementById('member_info_icon2').src = base64Image;
							}
						})
						.catch(error => {
							console.error('Error:', error);
						});
				})
				.catch(error => {
					console.error('Error:', error);
				});
		} else {
			swal("上傳失敗!", "檔案大小需小於1MB!", "error", { button: "確認" });
		}
	});

	//刪除帳號
	const deleteBtn = document.getElementById("member_Info_deletebtn");

	deleteBtn.addEventListener("click", function() {
		swal({
			title: "確定刪除帳號?",
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
				const data = { uid: JSON.parse(localStorage.getItem('uid')).uid };
				fetch(`/member/delete`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				})
					.then(response => {
						if (response.ok) {
							swal("帳號刪除成功!", "即將跳轉至首頁!", "success").then(() => {
								localStorage.removeItem('uid');
								window.location.href = '/homepage';
							});
						} else {
							swal("刪除帳號失敗!", "請再試一次!", "error")
						}
					})
					.catch(error => {
						console.error('Error:', error);
					});
			}
		});

	});

	document.getElementById('member_customUploadButton').addEventListener('click', function() {
		document.getElementById('member_Info_upload_Image').click();
	});

	const fileInput = document.getElementById('member_Info_upload_Image');
	const imagePreview = document.getElementById('member_info_icon');
	fileInput.addEventListener('change', function() {
		const file = fileInput.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function(e) {
				imagePreview.src = e.target.result;
				imagePreview.style.display = 'block';
			}
			reader.readAsDataURL(file);
		} else {
			swal("頭像顯示失敗!", "請選擇 JPEG 或 PNG 格式的檔案!", "error", { button: "確定" });
		}
	});
}

//更改密碼頁面(只留下跟密碼相關的)
function loadPasswordPage() {
	mainContent.innerHTML = memberPasswordHTML;

	let initialMemberData = {};
	gearuse();

	document.getElementById("member_Info_revisebtn").addEventListener("click", function() {

		const old_password = document.getElementById("member_info_old_password").value;
		const new_password = document.getElementById("member_info_password").value;
		const confirm_password = document.getElementById("member_info_confirm_password").value;

		// 獲取localStorage中的uid
		let storedData = localStorage.getItem("uid");

		// 將其解析為JS對象
		let parsedData = JSON.parse(storedData);

		// 提取真正的uid
		let uid = parsedData.uid;

		let checkPassword = {
			uid: uid,
			old_password: old_password,
			password: confirm_password
		};

		console.log(checkPassword)

		fetch('/member/updatepassword', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(checkPassword)
		}).then(response => {
			return response.text();
		}).then(data => {
			if (new_password !== confirm_password) {
				swal("新密碼與確認新密碼不符!", "請重新填寫!", "error", { button: "確定" });
			} else if (data == "") {
				swal("密碼更新成功!", "密碼已更新!", "success", { button: "確定" });
			} else if (data === "舊密碼不符") {
				swal("舊密碼不符!", "請重新填寫!", "error", { button: "確定" });
			}
		})
			.catch(error => {
				console.error('Error:', error);
			});
	});

	document.getElementById('member_info_confirm_password').addEventListener('input', function() {
		const password = document.getElementById('member_info_password').value;
		const confirmPassword = this.value;
		const passwordMatchIcon = document.getElementById('member_info_passwordMatchIcon');

		if (confirmPassword === password && confirmPassword !== "") {
			passwordMatchIcon.innerHTML = '<i class="fas fa-check-circle" style="color: green;"></i>';
		} else if (confirmPassword !== password && confirmPassword !== "") {
			passwordMatchIcon.innerHTML = '<i class="fas fa-times-circle" style="color: red;"></i>';
		} else {
			passwordMatchIcon.innerHTML = '';
		}
	});
}

//當前訂單
const order_now = document.getElementById('order_now');
order_now.addEventListener('click', () => {
	const uid = JSON.parse(localStorage.getItem('uid'));
	fetch(`/member/findOrders?uid=${uid.uid}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => { return response.json(); })
		.then(data => {
			let tickets = "";
			const promises = data.map(orderNumber => {
				return fetch(`/plane/orderForMember?orderNumber=${orderNumber}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						if (data.orderStatus == '尚未付款' || data.orderStatus == '已付款完成') tickets += ticket(data);
					})
					.catch(error => {
						console.error('Error:', error);
					});
			});

			Promise.all(promises).then(() => {
				mainContent.style.gap = "10px";
				mainContent.innerHTML = tickets;
			});

		})
		.catch(error => {
			console.error('Error:', error);
		});
})

// 歷史訂單
const order_before = document.getElementById('order_before');
order_before.addEventListener('click', () => {
	const uid = JSON.parse(localStorage.getItem('uid'));
	fetch(`/member/findOrders?uid=${uid.uid}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			let tickets = "";
			const promises = data.map(orderNumber => {
				return fetch(`/plane/orderForMember?orderNumber=${orderNumber}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						if (data.orderStatus == '已完成飛行') tickets += ticket(data);
					})
					.catch(error => {
						console.error('Error:', error);
					});
			});

			Promise.all(promises).then(() => {
				// 等待所有 fetch 完成後再更新 DOM
				mainContent.style.gap = "10px";
				mainContent.innerHTML = tickets; // 在所有請求完成後更新內部 HTML
			});
		})
		.catch(error => {
			console.error('Error:', error);
		});
})

function date_transform(flight_date) {
	const weekday = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
	let date = new Date(flight_date);
	return flight_date.slice(0, 4) + '年' + flight_date.slice(5, 7) + '月' + flight_date.slice(8, 10) + '日(' + weekday[date.getDay()] + ')';
}

function duration(duration) {
	return Math.floor(duration / 60) + '時' + (duration % 60) + '分';
}

function status(orderStatus) {
	if (orderStatus == '尚未付款') return '待付款';
	else if (orderStatus == '已付款完成') return '待出發';
	else if (orderStatus == '已完成飛行') return '已完成';
}

function ticket(data) {
	let start_date = date_transform(JSON.parse(data.start_data).plane.date_start);
	let end_date = date_transform(JSON.parse(data.end_data).plane.date_start);
	let status_color = '';
	let pay = 'block';
	let icon_color = '#008000';
	if (data.orderStatus == '尚未付款') {
		status_color = 'red';
		icon_color = 'red';
	}
	else if (data.orderStatus == '已付款完成') {
		status_color = '#008000';
		pay = 'none';
	} else {
		status_color = 'gray';
		icon_color = 'gray';
		pay = 'none';
	}

	return `    
        <section id="member_Order_Ticket">
          <section id="member_Order_TopSchedule">
              <div id="member_Order_TotalSchedule">
                <i class="fas fa-plane icon" id="member_Order_planeIcon" style="color:${icon_color}"></i>
                <span id="member_Order_Form">訂單編號</span>
                <span style="font-size: 1vw">:&nbsp;</span>
                <span id="member_Order_Number">${data.orderNumber}</span>
                <span style="font-size: 1vw">｜&nbsp;</span>
                <span id="member_Order_GoCity">${JSON.parse(data.start_data).plane.des_start}</span>
                <img style="width: 1.1vw" src="/assets/arrow-come_back.png" alt="" />
                &nbsp;
                <span id="member_Order_BackCity">${JSON.parse(data.start_data).plane.des_end}</span>
              </div>
              <div id="member_Order_State" style="color:${status_color};"> 
                  <div>狀態</div>
                  <span>&nbsp;:&nbsp;</span>
                  <span>${status(data.orderStatus)}</span>
                 </div>
            </section>

            <section id="member_Order_WholeTicket">
              <div id="member_Order_GoPlane">
                <div id="member_Order_Go_side">
                  <span id="member_Order_Go">去程</span>
                  <span>&nbsp;:&nbsp;</span>
                  <span id="member_Order_GoTime">${start_date}</span>
                </div>

                <div id="member_Order_Plane_side">
                  <span id="member_Order_Plane">${JSON.parse(data.start_data).plane.airline}</span>
                  <span>&nbsp;&nbsp;</span>
                  <span id="member_Order_airline">${JSON.parse(data.start_data).plane.type}</span>
                  <span>&nbsp;:&nbsp;</span>
                  <span id="member_Order_Class">${JSON.parse(data.start_data).seat}</span>
                </div>

              </div>
              <div id="member_Order_BigMiddle">
                
                <div id="member_Order_Schedule">
                  <div id="member_Order_DepartTime">
                    <div>
                      <span id="member_Order_DepartSmallTime">${JSON.parse(data.start_data).plane.time_start.slice(0, 5)}</span>
                    </div>
                    <div>
                      <span id="member_Order_DepartCity">${JSON.parse(data.start_data).plane.des_start}</span>
                    </div>
                  </div>
                  <div id="member_Order_WholeTime">
                      <div>
                        ${duration(JSON.parse(data.start_data).duration)}
                      </div>
                      <div class="arrow-container"></div>
                      <div>
                        直飛
                      </div>
                  </div>
                  <div id="member_Order_LandTime">
                    <div>
                      <span id="member_Order_LandSmallTime">${JSON.parse(data.start_data).plane.time_end.slice(0, 5)}</span>
                    </div>
                    <div>
                      <span id="member_Order_LandCity">${JSON.parse(data.start_data).plane.des_end}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="member_Order_WholeTicket">
              <div id="member_Order_GoPlane">
                <div id="member_Order_Go_side">
                  <span id="member_Order_Go">回程</span>
                  <div style="font-size: 1vw">&nbsp;:&nbsp;</div>
                  <span id="member_Order_GoTime">${end_date}</span>
                </div>

                <div id="member_Order_Plane_side">
                  <span id="member_Order_Plane">${JSON.parse(data.end_data).plane.airline}</span>
                   <span>&nbsp;&nbsp;</span>
                  <span id="member_Order_airline">${JSON.parse(data.end_data).plane.type}</span>
                  <span>&nbsp;:&nbsp;</span>
                  <span id="member_Order_Class">${JSON.parse(data.end_data).seat}</span>
                </div>

              </div>
              <div id="member_Order_BigMiddle">
                
                <div id="member_Order_Schedule">
                  <div id="member_Order_DepartTime">
                    <div>
                      <span id="member_Order_DepartSmallTime">${JSON.parse(data.end_data).plane.time_start.slice(0, 5)}</span>
                    </div>
                    <div>
                      <span id="member_Order_DepartCity">${JSON.parse(data.end_data).plane.des_start}</span>
                    </div>
                  </div>
                  <div id="member_Order_WholeTime">
                   
                      <div>
                        ${duration(JSON.parse(data.end_data).duration)}
                      </div>
                      <div class="arrow-container"></div>
                      <div>
                        直飛
                      </div>
               
                  </div>
                  <div id="member_Order_LandTime">
                    <div>
                      <span id="member_Order_LandSmallTime">${JSON.parse(data.end_data).plane.time_end.slice(0, 5)}</span>
                    </div>
                    <div>
                      <span id="member_Order_LandCity">${JSON.parse(data.end_data).plane.des_end}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="member_Order_BottomPrice">
              <div id="member_Order_PeoplePrice">
                <div id="member_Order_People">
                  <span>張數&nbsp;:&nbsp</span>
                  <span>${Number(JSON.parse(data.start_data).adults) + Number(JSON.parse(data.start_data).child)}</span>
                </div>
                <div id="member_Order_TotalPrice">
                  <span>總價&nbsp;:&nbspNT$</span>
                  <span>${data.finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                </div>
              </div>
              <div>
                <button id="member_Order_Cancel" style="display:${pay}" onclick="window.location.href='/orders/Complete/${data.oid}'">付款</button>
              </div>
            </section>
      </section>`;
}

// 歷史評論
const forumByMe = document.getElementById('forumByMe');

forumByMe.addEventListener('click', () => {
	// 從localStorage中拿到uid，解析為js
	let storedData = localStorage.getItem('uid');
	let parsedData = JSON.parse(storedData);
	let uid = parsedData.uid;

	fetch(`/member/myposts?uid=${uid}`)
		.then(response => response.json())
		.then(myposts => {
			console.log("Received posts:", myposts);
			let forumContent = "<div id='member_Forum_MiddleSide'>";

			myposts.forEach(postViewDTO => {
				forumContent += member_forum_generateHTML(
					postViewDTO.post.id || "",
					postViewDTO.coverImgURL || "",
					postViewDTO.post.mainTitle || "未命名標題",
					postViewDTO.post.content || "無內容",
					postViewDTO.userNameIconDTO.iconURL || '',
					postViewDTO.userNameIconDTO.username || "匿名",
					postViewDTO.createdDate || "未知日期"
				);
			});

			forumContent += "</div>";

			mainContent.innerHTML = forumContent;
		})
		.catch(error => {
			console.error('Error fetching posts:', error);
			mainContent.innerHTML = "<p>無法加載貼文，請稍後再試。</p>";
		});
});

function member_forum_generateHTML(member_forum_postId, member_forum_imageUrl, member_forum_title, member_forum_content, member_forum_authorImage, member_forum_author, member_forum_date) {
	const dateOnly = member_forum_date.split('T')[0]; //分割日期部分

	return `
		<div class="member_forum_card">
     	 <a href="/forum/detail/${member_forum_postId}">
       	 <article>
          	<img class="member_forum_articleImg" src="${member_forum_imageUrl}" alt="${member_forum_title}">
          	<h3>${member_forum_title}</h3>
          	<p class="member_forum_articleMore">${member_forum_content}</p>
        	</article>
        	<div>
          	<img class="member_forum_authorImg" src="${member_forum_authorImage}" alt="">
          	<p class="member_forum_author">${member_forum_author}</p>
          	<p class="member_forum_postDate">${dateOnly}</p>
        	</div>
      	 </a>
	  	</div>
    `;
}


//收藏的評論
const favoritePostsBtn = document.getElementById('favoritePosts');

favoritePostsBtn.addEventListener('click', () => {
	let storedData = localStorage.getItem('uid');
	let parsedData = JSON.parse(storedData);
	let uid = parsedData.uid;

	fetch(`/member/myfavorites?uid=${uid}`)
		.then(response => response.json())
		.then(favorites => {
			let forumContent = "<div id='member_Forum_MiddleSide'>";

			favorites.forEach(postViewDTO => {
				forumContent += member_forum_generateHTML(
					postViewDTO.post.id || "",
					postViewDTO.coverImgURL || "",
					postViewDTO.post.mainTitle || "未命名標題",
					postViewDTO.post.content || "無內容",
					postViewDTO.userNameIconDTO.iconURL || '',
					postViewDTO.userNameIconDTO.username || "匿名",
					postViewDTO.createdDate || "未知日期"
				);
			});

			forumContent += "</div>";

			mainContent.innerHTML = forumContent;
		})
		.catch(error => {
			console.error('Error fetching favorites:', error);
			mainContent.innerHTML = "<p>無法加載收藏的文章，請稍後再試。</p>";
		});
});

function favorite_post_generateHTML(favorite_forum_postId, favorite_post_imageUrl, favorite_post_title, favorite_post_content, favorite_post_authorImage, favorite_post_author, favorite_post_date) {
	const dateOnly = favorite_post_date.split('T')[0];

	return `
        <div class="favorite_post_card">
            <a href="/forum/detail/${favorite_forum_postId}">
                <article>
                    <img class="favorite_post_articleImg" src="${favorite_post_imageUrl}" alt="${favorite_post_title}">
                    <h3>${favorite_post_title}</h3>
                    <p class="favorite_post_articleMore">${favorite_post_content}</p>
                </article>
                <div class="favorite_post_info">
                    <img class="favorite_post_authorImg" src="${favorite_post_authorImage}" alt="">
                    <p class="favorite_post_author">${favorite_post_author}</p>
                    <p class="favorite_post_date">${dateOnly}</p>
                </div>
            </a>
        </div>
    `;
}