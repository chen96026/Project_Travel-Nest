import { auth } from "/js/thirdParty/initialAuth.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { uploadBytes } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { deleteObject } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

document.addEventListener("DOMContentLoaded", function() {
	const contentMap = {
		member: `
        <h1 class="Backstage_Title">會員管理</h1>
      <div class="container_all">
        <div id="Member_search-filter">
          <div id="Member_LeftSearch">
            <input type="text" id="Member_searchBar" placeholder="搜尋會員" />
          </div>
          <div id="Member_pagination">
            <span id="Member_prevPage" disabled>上一頁</span>
            <span><select id="Member_pageSelector"></select></span>
            <span id="Member_nextPage">下一頁</span>
          </div>
        </div>
        <table id="Member_Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用戶名</th>
              <th>Email</th>
              <th>手機</th>
              <th>出生日期</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      `,
		order: `
       <h1 class="Backstage_Title">訂單管理</h1>
			<div class="container_all">
				<h3>訂單列表</h3>
				<form id="orderSearchForm">
					<input type="text" id="orderNumberInput" placeholder="請輸入訂單編號..." />
					<button class="btn;" type="submit">搜尋</button>
				</form>

				<div class="d-flex mt-3">
					<div class="form-check mb-3">
						<input type="radio" class="form-check-input" name="orderStatus" id="statusAll" value="" checked>
						<label class="form-check-label" for="statusAll">全部訂單</label>
					</div>
					<div class="form-check" style="margin-left:20px;">
						<input type="radio" class="form-check-input" name="orderStatus" id="statusCreated" value="尚未付款">
						<label class="form-check-label" for="statusCreated">尚未付款</label>
					</div>
					<div class="form-check" style="margin-left:20px;">
						<input type="radio" class="form-check-input" name="orderStatus" id="statusCancelled"
							value="逾期付款已取消">
						<label class="form-check-label" for="statusCancelled">逾期付款已取消</label>
					</div>
					<div class="form-check" style="margin-left:20px;">
						<input type="radio" class="form-check-input" name="orderStatus" id="statusPaid" value="已付款完成">
						<label class="form-check-label" for="statusPaid">已付款完成</label>
					</div>

				</div>


				<div style="margin-left:20px">
					<label for="orderDateSort">訂單日期排序：</label>
					<select class="form-select" id="orderDateSort" style="width:10%;">
						<option value="newest">由新到舊</option>
						<option value="oldest">由舊到新</option>
					</select>
				</div>

				<table style="width:95% ;margin: 20px auto; text-align:center;">
					<thead>
						<tr>
							<th>訂單編號</th>
							<th style="width:100px;">聯絡人姓名</th>
							<th style="width:100px;">訂單金額(NT$)</th>
							<th style="width:120px;">訂單成立時間</th>
							<th style="width:120px;">訂單狀態</th>
						</tr>
					</thead>
					<tbody id="orderTableBody">
						<!-- JavaScript 會動態插入數據 -->
					</tbody>
				</table>
			</div>
      `,
		forum: `
        <h1 class="Backstage_Title">論壇管理</h1>
            <div class="container_all">
                <div>
                    <button id="Forum_queryShare" class="Forum_button_group Forum_button_checked">待審核首頁文章</button>
                    <button id="Forum_queryReport" class="Forum_button_group">被檢舉文章</button>
                </div>
                <div class="Forum_divTable">
                </div>
                <div class="Forum_page">
                </div>
            </div>
      `,
		news: `
		<h1 class="Backstage_Title">新聞管理</h1>
				<div class="container_all">
					<div class="newsTab">
						<button class="newsTabBtn newsTabActive">所有新聞</button>
						<button class="newsTabBtn">新增新聞</button>
						<button class="newsTabBtn">修改/刪除新聞</button>
					</div>
					<!-- 顯示頁面 -->
					<div id="newsFind" class="newsContent">
						<table>
							<thead>
								<tr>
									<th>編號</th>
									<th>標題</th>
									<th>內文</th>
									<th>連結</th>
									<th>圖片</th>
								</tr>
							</thead>
							<tbody id="newsTable">

							</tbody>
						</table>
					</div>
					<!-- 新增頁面 -->
					<div id="newsAdd" class="newsContent">
						<form id="addForm">
							新增新聞標題:<br> 
							<input id="addTitle"> <br><br> 
							新增新聞內文:<br>
							<textarea id="addText" rows="4" cols="40"></textarea><br><br> 
							新增新聞連結:<br>
							<input id="addNewsURL"> <br><br>
							新增新聞圖片:<br>
							<input type="file" accept="image/*" id="addFile" name="addFile"><br><br>
							<button>新增</button>
						</form>
					</div>
					<!-- 修改刪除頁面 -->
					<div id="newsUpdate" class="newsContent">

						<form id="updateForm">
							更新目標編號: <input id="updateNewsId" type="number"> <br>
							<br> 更新新聞標題: <input id="updateTitle"> <br> <br>
							更新新聞內文: <input id="updateText"> <br> <br>
							更新新聞連結: <input id="updateNewsURL"> <br> <br>
							更新新聞圖片: <input type="file" accept="image/*" id="updateFile"
								name="updateFile"> <br> <br>
							<button>更新</button>
						</form>
						<br>
						<hr>
						<br>
						<form id="deleteForm">
							刪除目標編號: <input id="deleteNewsId" type="number"> <br>
							<br>
							<button>刪除</button>
						</form>
					</div>
					<!-- 圖片正常顯示頁面 -->
					<div id="newsImgModal">
						<span id="newsImgCloseBtn">&times;</span> 
						<img id="newsImg">
					</div>
				</div>
      `
	};

	function loadBackstageLeftSide() {
		const backLeftSide = document.createElement("div");
		backLeftSide.id = "Backstage_LeftInSide";
		backLeftSide.innerHTML = `
        <div id="Backstage_LeftMember">會員管理</div>
        <div id="Backstage_LeftOrder">訂單管理</div>
        <div id="Backstage_LeftForum">論壇管理</div>
        <div id="Backstage_LeftNews">新聞管理</div>
      `;
		document.getElementById("Backstage_LeftSide").innerHTML = '';
		document.getElementById("Backstage_LeftSide").appendChild(backLeftSide);

		document.getElementById("Backstage_LeftMember").addEventListener("click", function() {
			switchContent('member');
		});
		document.getElementById("Backstage_LeftOrder").addEventListener("click", function() {
			switchContent('order');
		});
		document.getElementById("Backstage_LeftForum").addEventListener("click", function() {
			switchContent('forum');
		});
		document.getElementById("Backstage_LeftNews").addEventListener("click", function() {
			switchContent('news');
		});
	}

	//切換MiddleSide內容
	function switchContent(type) {
		document.querySelector(".Backstage_MiddleSide").innerHTML = contentMap[type];

		if (type === 'member') {
			MemberManagement();
		} else if (type === 'order') {
			OrderManagement();
		} else if (type === 'forum') {
			ForumManagement();
		} else if (type === 'news') {
			NewsManagement();
		}
	}

	//會員管理
	function MemberManagement() {
		let Members = [];
		let Member_filtered = [];
		const Member_perPage = 10;
		let Member_currentPage = 1;

		fetchMembers();

		function fetchMembers() {
			console.log('呼叫了 fetchMembers');
			fetch('/member/member_admin', { method: 'GET' })
				.then(response => {
					if (!response.ok) {
						throw new Error(`無法取得會員資料，狀態碼：${response.status}`);
					}
					return response.json();
				})
				.then(data => {
					console.log('取得的會員資料:', data);
					Members = data;
					Member_filtered = [...Members]; //複製陣列
					console.log('初始化的 Member_filtered:', Member_filtered);
					BackList();
				})
				.catch(error => {
					console.error('發生錯誤:', error);
				});
		}

		//生成會員清單
		function BackList() {
			console.log('執行 BackList()，目前的資料:', Member_filtered);
			console.log('目前的資料:', Member_filtered);
			const Member_TableBody = document.querySelector("#Member_Table tbody");
			Member_TableBody.innerHTML = "";

			//從0開始計算，所以減1，乘上10筆資料
			const startIndex = (Member_currentPage - 1) * Member_perPage;
			//到第11筆資料結束
			const endIndex = startIndex + Member_perPage;

			//切從0~9、10~19(這邊是陣列，所以是20筆，只是從0開始)
			const Member_Slice_Page = Member_filtered.slice(startIndex, endIndex);

			Member_Slice_Page.forEach((Member_Each) => {
				const Member_row = document.createElement("tr");
				Member_row.innerHTML = `
							 <td>${Member_Each.id}</td>
							 <td>${Member_Each.name || '未提供'}</td>
							 <td>${Member_Each.email}</td>
							 <td>${Member_Each.phone || '未提供'}</td>
							 <td>${Member_Each.birthday || '未提供'}</td>
			`;
				Member_TableBody.appendChild(Member_row);
			});
			Member_updateControls();
		}

		//分頁
		function Member_updateControls() {
			//Math.ceil()-確保如果只有少量資料也能顯示在最後一頁
			const totalPages = Math.ceil(Member_filtered.length / Member_perPage);
			const pageSelector = document.getElementById("Member_pageSelector");
			pageSelector.innerHTML = "";

			if (Member_currentPage > totalPages) {
				Member_currentPage = totalPages;
			}

			for (let i = 1; i <= totalPages; i++) {
				const option = document.createElement("option");
				option.value = i;
				option.textContent = `第 ${i} 頁`;
				if (i === Member_currentPage) {
					option.selected = true;
				}
				pageSelector.appendChild(option);
			}

			//disabled-禁用狀態，第1頁的話禁止按上一頁，最後一頁禁止按下一頁
			document.getElementById("Member_prevPage").disabled = Member_currentPage === 1;
			document.getElementById("Member_nextPage").disabled = Member_currentPage === totalPages || totalPages === 0;;
		}

		document.getElementById("Member_prevPage").addEventListener("click", () => {
			const totalPages = Math.ceil(Member_filtered.length / Member_perPage);
			if (Member_currentPage > 1) {
				Member_currentPage--;
				BackList();
			}
		});

		document.getElementById("Member_nextPage").addEventListener("click", () => {
			const totalPages = Math.ceil(Member_filtered.length / Member_perPage);
			if (Member_currentPage < totalPages) {
				Member_currentPage++;
				BackList();
			}
		});

		document.getElementById("Member_pageSelector").addEventListener("change", (event) => {
			Member_currentPage = parseInt(event.target.value, 10);
			BackList();
		});

		//搜尋
		document
			.getElementById("Member_searchBar")
			.addEventListener("input", function() {
				const searchValue = this.value.toLowerCase();

				Member_filtered = Members.filter((Member_Each) => {
					const name = Member_Each.name ? Member_Each.name.toLowerCase() : '';
					const email = Member_Each.email ? Member_Each.email.toLowerCase() : '';

					return (
						name.includes(searchValue) ||
						email.includes(searchValue)
					);
				});

				// 重置頁碼
				Member_currentPage = 1;
				BackList();
			});
	}

	//訂單管理
	function OrderManagement() {
		let ordersTable = document.querySelector('#orderTableBody');
		let searchForm = document.querySelector('#orderSearchForm');
		let orderNumberInput = document.querySelector('#orderNumberInput')
		let orders = [];

		function fetchOrders(orderNumber = '') {
			let url = '/orders/order_admin_json';
			if (orderNumber) {
				url += `?orderNumber=${orderNumber}`;
			}

			fetch(url)
				.then(response => {
					console.log('Response status:', response.status);
					if (!response.ok) {
						throw new Error('Network response was not ok ' + response.statusText);
					}
					return response.json();
				})
				.then(data => {
					console.log('Fetched data:', data);
					orders = data;
					renderOrders(orders);
				})
				.catch(error => console.error('Error fetching orders:', error));
		}

		function renderOrders(orderList) {
			ordersTable.innerHTML = '';
			console.log('Rendering orders:', orderList);

			if (orderList.length === 0) {
				ordersTable.innerHTML = '<tr><td colspan="5">沒有找到符合條件的訂單</td></tr>';
				return;
			}
			orderList.forEach(order => {
				let row = `<tr>
		                            <td>${order.orderNumber}</td>
		                            <td>${order.contactName}</td>
		                            <td>${order.finalPrice}</td>
		                            <td>${order.createDate}</td>
		                            <td>${order.orderStatus}</td>
		                       </tr>`;

				ordersTable.innerHTML += row;
			});
		}

		searchForm.addEventListener('submit', function(event) {
			event.preventDefault();
			console.log('Form submitted');

			if (orderNumberInput) {
				let orderNumber = orderNumberInput.value.trim();
				console.log('Searching for order number:', orderNumber);

				if (orderNumber) {

					searchOrder(orderNumber);
				} else {

					filterOrdersByStatus();
				}
			} else {
				console.error('The order number input element was not found.');
			}
		});

		document.querySelectorAll('input[name="orderStatus"]').forEach(statusInput => {
			statusInput.addEventListener('change', function() {

				filterOrdersByStatus();
			});
		});

		function searchOrder(orderNumber) {
			let filteredOrders = orders.filter(order => order.orderNumber.includes(orderNumber));
			const selectedStatus = document.querySelector('input[name="orderStatus"]:checked')?.value;
			if (selectedStatus) {
				filteredOrders = filteredOrders.filter(order => order.orderStatus === selectedStatus);
			}
			if (filteredOrders.length > 0) {
				renderOrders(filteredOrders);
			} else {
				console.log('No orders found for the given order number and status.');
				renderNoOrdersFound();
			}
		}

		function filterOrdersByStatus() {
			const selectedStatus = document.querySelector('input[name="orderStatus"]:checked')?.value;
			let filteredOrders = orders;
			if (selectedStatus) {
				filteredOrders = orders.filter(order => order.orderStatus === selectedStatus);
			}
			const orderNumber = orderNumberInput.value.trim();
			if (orderNumber) {
				filteredOrders = filteredOrders.filter(order => order.orderNumber.includes(orderNumber));
			}
			if (filteredOrders.length > 0) {
				renderOrders(filteredOrders);
			} else {
				renderNoOrdersFound();
			}
		}

		function renderNoOrdersFound() {
			ordersTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">沒有找到符合的訂單</td></tr>';
		}

		function fetchOrders() {
			fetch('/orders/order_admin_json')
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok ' + response.statusText);
					}
					return response.json();
				})
				.then(data => {
					console.log('Fetched all orders:', data);
					orders = data;
					renderOrders(data);
				})
				.catch(error => console.error('Error fetching all orders:', error));
		}

		function renderNoOrdersFound() {
			ordersTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">沒有找到符合的訂單</td></tr>';
		}

		function renderOrders(orderList) {
			ordersTable.innerHTML = '';

			orderList.forEach(order => {
				let row = `<tr>
	                        <td>${order.orderNumber}</td>
	                        <td style="text-align: right;">${order.contactName}</td>
	                        <td style="text-align: right;">${order.finalPrice}</td>
	                        <td style="text-align: center;">${order.createDate}</td>
	                        <td style="text-align: center;">${order.orderStatus}</td>
	                   </tr>`;
				ordersTable.innerHTML += row;
			});
		}

		fetchOrders();

		function sortOrders() {

			let sortedOrders = [...orders];

			const orderDateSort = document.getElementById('orderDateSort').value;

			const selectedStatus = document.querySelector('input[name="orderStatus"]:checked').value;
			if (selectedStatus) {
				sortedOrders = sortedOrders.filter(order => order.orderStatus === selectedStatus);
			}

			sortedOrders.sort((a, b) => {
				const dateA = new Date(a.createDate);
				const dateB = new Date(b.createDate);
				if (orderDateSort === 'newest') {
					return dateB - dateA;
				} else {
					return dateA - dateB;
				}
			});

			if (sortedOrders.length > 0) {
				renderOrders(sortedOrders);
			} else {
				renderNoOrdersFound(); // 顯示「沒有符合條件的訂單」
			}
		}

		document.querySelectorAll('input[name="orderStatus"]').forEach(statusInput => {
			statusInput.addEventListener('change', function() {
				sortOrders();
			});
		});

		document.getElementById('orderDateSort').addEventListener('change', sortOrders);
	}

	//論壇管理
	function ForumManagement() {

		$(document).off('.Forum');

		let id;
		let query = "share";
		let page = 0;
		let postListLength;

		function setText(query) {

			let setText = [];
			if (query === "report") {
				setText = ["保留", "刪除"];
			} else {
				setText = ["刊登", "下架"];
			}

			return setText;
		}

		function getPosts(query, page) {
			$('.Forum_page').empty();
			$('.Forum_divTable').empty();

			$('.Forum_divTable').append(`
            <table class="Forum_table">
                <thead>
                    <tr class="Forum_thead_tr">
                        <th class="Forum_table_id">編號</th>
                        <th class="Forum_th_textCenter">主標題</th>
                        <th class="Forum_table_content Forum_th_textCenter">內文</th>
                        <th class="Forum_table_reportCount">檢舉數</th>
                        <th class="Forum_table_keep">${setText(query)[0]}</th>
                        <th class="Forum_table_delete">${setText(query)[1]}</th>
                    </tr>
                </thead>
            </table>`)
			fetch(`/forum/api/adminGetPosts?query=${query}&page=${page}`)
				.then(response => response.json())
				.then(data => {
					postListLength = data.postViewDTOList.length;

					const tbody = $(`<tbody>`)
					if (postListLength > 0) {
						data.postViewDTOList.forEach(post => {
							const reportedPost =
								`<tr class="Forum_tbody_tr">
                                <td class="Forum_table_id">${post.post.id}</td>
                                <td class="Forum_table_title"><span>${post.post.mainTitle}</span></td>
                                <td class="Forum_table_content">
                                    <span>
                                        ${post.post.content}
                                    </span>
                                </td>
                                <td class="Forum_table_reportCount">${post.countReports}</td>
                                <td class="Forum_table_keep">
									<div>
                                    	<button class="Forum_btn Forum_keep"></button>
									</div>
                                </td>
                                <td class="Forum_table_delete">
									<div>
	                                    <button class="Forum_btn Forum_delete"></button>
									</div>
                                </td>
                            </tr>`
							tbody.append(reportedPost);
						})

						$('.Forum_table').append(tbody);

						for (let i = 1; i <= data.totalPage; i++) {
							$('.Forum_page').append(`<button class="Forum_pageBtn">${i}</button>`)
						}

						$('.Forum_pageBtn').eq(page).addClass('Forum_thisPage');

					} else {

						let noReportsText;
						if (query === "report") {
							noReportsText = "檢舉數 ≥ 5 或刊登首頁審核未通過的文章會暫時被下架並顯示在此"
						} else {
							noReportsText = "尚未經過審核的新文章會顯示在此，經過審核後才顯示在首頁上"
						}

						$('.Forum_divTable').append(`
						<p class="Forum_noReports">
							<span>目前沒有待處理的文章</span><br>
							<span>${noReportsText}</span>
						</p>
					`)
					}
				})
				.catch(error => {
					console.error('Error loading posts:', error);
				})
		}

		function changeLastPage() {
			if (postListLength === 1 && page > 0) {
				page -= 1;
			}
		}

		function getPostDetail(id) {
			fetch(`/forum/api/adminGetPostDetail/${id}`)
				.then(response => response.json())
				.then(data => {
					let images = `<div>`;
					data.imageURL.forEach(imgURL => {
						const setImg = `<img src="${imgURL}" class="Forum_detail_img">`;
						images += setImg;
					})
					images += `</div>`;
					const share = (data.post.share) ? "是" : "否"
					const post =
						`<div class="Forum_bg"></div> 
                    <div class="Forum_post">
                        <div class="Forum_post_detail">
                            <div id="Forum_closePost" class="Forum_closeDetail"></div>
                            <div class="Forum_detail_systemInformation">
                                <p>文章編號：${data.post.id}</p>
                                <p>檢舉數：${data.countReports}</p>
                                <p>投稿日期：${data.createdDate}</p>
                                <p>作者：${data.userNameIconDTO.username}</p>
                            </div>
                            <div class="Forum_detail_rateAndShare"><span>評分：${data.post.rate}</span><span>分享首頁：${share}</span></div>
                            <p>主標題：${data.post.mainTitle}</p>
                            <p>副標題：${data.post.subTitle}</p>
                            <p>出發日：${data.post.startDate}</p>
                            <p>回程日：${data.post.endDate}</p>
                            <p>Tags：${data.post.tags}</p>
                            <div class="Forum_detail_content">
                                <p>內文：</p>
                                <p>${data.post.content}</p>
                            </div>
                            <p>附圖：</p>
                            <div>
                                ${images}
                            </div>
                        </div>
                        <div class="Forum_post_btns">
                            <button id="Forum_post_keep" class="Forum_post_btn">${setText(query)[0]}</button>
                            <button id="Forum_post_delete" class="Forum_post_btn">${setText(query)[1]}</button>
                        </div>
                    </div>`
					$('main').append(post);
					$('.Forum_bg').fadeIn(300);
					$('.Forum_post').fadeIn(100);
				})
				.catch(error => {
					console.error('Error loading postDetail:', error);
				})
		}

		function keepPost(id) {
			fetch(`/forum/api/adminClearReports/${id}`, {
				method: 'DELETE'
			})
				.then(response => {
					if (response.ok) {
						console.log('Success: ', response);
						changeLastPage();
						getPosts(query, page)
						removeWidows();
					} else {
						console.error('Failed to delete the reports');
					}
				})
				.catch(error => {
					console.error('err', error);
				})
		}

		function deletePost(id) {
			fetch(`/forum/api/deletePost/${id}`, {
				method: 'DELETE'
			})
				.then(response => {
					if (response.ok) {
						console.log('Success: ', response);
						changeLastPage();
						getPosts(query, page)
						removeWidows();
					} else {
						console.error('Failed to delete the post');
					}
				})
				.catch(error => {
					console.error('err', error);
				})
		}

		function changePostStatus(id, status) {
			fetch(`/forum/api/adminUpdatePostStatus/${id}?status=${status}`, {
				method: 'PUT'
			})
				.then(response => {
					if (response.ok) {
						console.log('Success: ', response);
						changeLastPage();
						getPosts(query, page)
						removeWidows();
					} else {
						console.error('Failed to change the status of the post');
					}
				})
				.catch(error => {
					console.error('err', error);
				})
		}

		function removeWidows() {
			$('.Forum_bg').fadeOut(300);
			$('.Forum_post').fadeOut(300);
			$('.forum_detail_checkwindow').fadeOut(300);
			setTimeout(() => {
				$('.Forum_bg').remove();
				$('.Forum_post').remove();
				$('.forum_detail_checkwindow').remove();
			}, 300);
		}


		getPosts(query, page);

		$(document).on('click.Forum', '#Forum_queryShare', () => {
			$('#Forum_queryShare').addClass('Forum_button_checked');
			$('#Forum_queryReport').removeClass('Forum_button_checked');
			query = "share";
			page = 0;
			getPosts(query, page);
		})

		$(document).on('click.Forum', '#Forum_queryReport', () => {
			$('#Forum_queryReport').addClass('Forum_button_checked');
			$('#Forum_queryShare').removeClass('Forum_button_checked');
			query = "report";
			page = 0;
			getPosts(query, page);
		})

		$(document).on('click.Forum', '.Forum_tbody_tr', function() {
			id = $(this).find('.Forum_table_id').text();

			getPostDetail(id);
		})

		$(document).on('click.Forum', '.Forum_keep', function(e) {
			const tr = $(this).closest('.Forum_tbody_tr');
			id = tr.find('.Forum_table_id').text();

			e.stopPropagation();

			$('main').append(`
            <div class="Forum_bg"></div> 
            <div class="forum_detail_checkwindow">
                <p>確定要${setText(query)[0]}這篇文章嗎？</p>
                <button id="Forum_keepPost" class="forum_checkwindow_OK">確定</button>
                <button id="Forum_closeWindow" class="forum_checkwindow_cancel">取消</button>
            </div>
        `)
			$('.Forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		})

		$(document).on('click.Forum', '.Forum_delete', function(e) {
			const tr = $(this).closest('.Forum_tbody_tr');
			id = tr.find('.Forum_table_id').text();

			e.stopPropagation();

			$('main').append(`
            <div class="Forum_bg"></div> 
            <div class="forum_detail_checkwindow">
                <p>確定要${setText(query)[1]}這篇文章嗎？</p>
                <button id="Forum_deletePost" class="forum_checkwindow_OK">確定</button>
                <button id="Forum_closeWindow" class="forum_checkwindow_cancel">取消</button>
            </div>
        `)
			$('.Forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		})

		$(document).on('click.Forum', '#Forum_post_keep', () => {
			$('.Forum_bg').hide();
			$('.Forum_bg').addClass('Forum_bg_zIndex2');
			$('main').append(`
            <div class="forum_detail_checkwindow">
                <p>確定要${setText(query)[0]}這篇文章嗎？</p>
                <button id="Forum_keepPost" class="forum_checkwindow_OK">確定</button>
                <button id="Forum_post_closeWindow" class="forum_checkwindow_cancel">取消</button>
            </div>
        `)
			$('.Forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		})

		$(document).on('click.Forum', '#Forum_post_delete', () => {
			$('.Forum_bg').hide();
			$('.Forum_bg').addClass('Forum_bg_zIndex2');
			$('main').append(`
            <div class="forum_detail_checkwindow">
                <p>確定要${setText(query)[1]}這篇文章嗎？</p>
                <button id="Forum_deletePost" class="forum_checkwindow_OK">確定</button>
                <button id="Forum_post_closeWindow" class="forum_checkwindow_cancel">取消</button>
            </div>
        `)
			$('.Forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').hide().fadeIn(100);
		})

		$(document).on('click.Forum', '#Forum_keepPost', () => {
			if (query === "report") {
				keepPost(id);
			} else {
				changePostStatus(id, 2);
			}
		})

		$(document).on('click.Forum', '#Forum_deletePost', () => {
			if (query === "report") {
				deletePost(id);
			} else {
				changePostStatus(id, 0);
			}
		})

		$(document).on('click.Forum', '#Forum_closeWindow', () => {
			$('.Forum_bg').fadeOut(300);
			$('.forum_detail_checkwindow').fadeOut(300);
			setTimeout(() => {
				$('.Forum_bg').remove();
				$('.forum_detail_checkwindow').remove();
			}, 300);
		})

		$(document).on('click.Forum', '#Forum_closePost', () => {
			$('.Forum_bg').fadeOut(300);
			$('.Forum_post').fadeOut(300);
			setTimeout(() => {
				$('.Forum_bg').remove();
				$('.Forum_post').remove();
			}, 300);
		})

		$(document).on('click.Forum', '#Forum_post_closeWindow', () => {
			$('.Forum_bg').hide();
			$('.Forum_bg').removeClass('Forum_bg_zIndex2');
			$('.Forum_bg').fadeIn(300);
			$('.forum_detail_checkwindow').fadeOut(300);
			setTimeout(() => {
				$('.forum_detail_checkwindow').remove();
			}, 300);
		})

		$(document).on('click.Forum', '.Forum_pageBtn', function() {
			$('.Forum_pageBtn').removeClass('Forum_thisPage');
			$(this).addClass('Forum_thisPage');

			page = $(this).index();
			getPosts(query, page);
		})

		$(document).on('click.Forum', '.Forum_detail_img', function(e) {
			e.stopPropagation();
			$(this).toggleClass('Froum_Img');
		})
	}

	//新聞管理
	function NewsManagement() {

		// 載入全部新聞
		fetch('/news/getAll')
			.then(response => {
				if (!response.ok) {
					throw new Error('Error:get all News ->');
				}
				return response.json();
			})
			.then(data => {
				let news = document.getElementById("newsTable");
				for (let i = 0; i < data.length; i++) {
					news.innerHTML += "<tr>"
						+ "<td>" + data[i].id + "</td>"
						+ "<td class='newsClip' data-fulltext='" + data[i].title + "'>" + data[i].title + "</td>"
						+ "<td class='newsClip' data-fulltext='" + data[i].text + "'>" + data[i].text + "</td>"
						+ "<td class='newsClip' data-fulltext='" + data[i].url + "'>" + "<a href='" + data[i].url + "' target='_blank'>" + data[i].url + "</a>" + "</td>"
						+ "<td>" + "<img class='newsTinyImg' src='" + data[i].imgurl + "'>" + "</td>"
						+ "</tr>";
				}



				// 控制tooltip位置
				const newsCells = document.querySelectorAll('.newsClip');
				newsCells.forEach(cell => {
					const tooltip = document.createElement('div');
					tooltip.className = 'newsTooltip';
					tooltip.textContent = cell.getAttribute('data-fulltext');
					cell.appendChild(tooltip);

					cell.addEventListener('mousemove', (e) => {
						const tooltipWidth = tooltip.offsetWidth;

						// 計算顯示位置
						let left = e.clientX;
						let top = e.clientY - document.getElementById("header").offsetHeight; // 向下偏移
						// 檢查 tooltip 是否會超出視窗
						if (left + tooltipWidth > window.innerWidth) {
							left = e.clientX - tooltipWidth; // 改為顯示在左邊
						}

						// 設置 tooltip 位置
						tooltip.style.left = `${left}px`;
						tooltip.style.top = `${top}px`;
					});

					cell.addEventListener('mouseenter', () => {
						tooltip.style.display = 'block'; // 顯示 tooltip
					});

					cell.addEventListener('mouseleave', () => {
						tooltip.style.display = 'none'; // 隱藏 tooltip
					});
				});

				// 新聞小圖切換大圖

				const newsImgModal = document.getElementById("newsImgModal");
				const newsImg = document.getElementById("newsImg");
				const newsImgCloseBtn = document.getElementById("newsImgCloseBtn");
				const newsTinyImg = document.querySelectorAll(".newsTinyImg");
				newsTinyImg.forEach(image => {
					image.addEventListener('click', (e) => {
						// 在懸停時顯示大圖
						console.log(e.target)
						newsImg.src = image.src.replace('small-image.jpg', 'large-image.jpg');
						newsImgModal.style.display = "flex";
					});
				});

				newsImgCloseBtn.onclick = () => {
					newsImgModal.style.display = "none";
				};

				window.onclick = (event) => {
					// 點擊模態外部也可以關閉
					if (event.target == newsImgModal) {
						newsImgModal.style.display = "none";
					}
				};
			})
			.catch(error => {
				console.error('get News err:', error);
			});

		// 加入新聞
		document.getElementById('addForm').addEventListener('submit', (e) => {
			e.preventDefault(); // 阻止表單的默認提交行為
			let title = document.getElementById('addTitle').value;
			let text = document.getElementById('addText').value;
			let newsURL = document.getElementById('addNewsURL').value;
			let imgURL;

			const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
			const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

			const files = document.getElementById('addFile').files;
			if (files.length > 0) {
				const file = files[0];
				// 檢查檔案大小
				if (file.size > MAX_FILE_SIZE) {
					alert('檔案大小不能超過 10 MB。');
					return;
				}
				// 檢查檔案類型
				if (!ALLOWED_FILE_TYPES.includes(file.type)) {
					alert('只允許上傳 JPEG、PNG 檔案。');
					return;
				}
				const storage = getStorage();
				// 上傳檔案的邏輯
				const storageRef = ref(storage, `news/${file.name}`);
				try {
					uploadBytes(storageRef, file).then(() => {
						getDownloadURL(ref(storage, `news/${file.name}`))
							.then((url) => {
								imgURL = url;

								let formData = new FormData(); // 創建 FormData 物件
								formData.append('title', title);
								formData.append('text', text);
								formData.append('newsURL', newsURL);
								formData.append('imgURL', imgURL);
								fetch('/news/add', {
									method: 'Post',
									body: formData
								})
									.then(response => {
										if (!response.ok) {
											throw new Error('Error:add News ->');
										}
										return response.json();
									})
									.then(data => {
										console.log('Success');
										window.location.href = '/admin';
									})
									.catch(error => {
										console.error('add News err:', error);
									});

							})
							.catch((error) => {
								console.error('獲取url失敗 ', error)
							});
					});
				} catch (error) {
					console.error('上傳失敗:', error);
				}
			} else {
				console.log('沒有選擇檔案');
			}

		});

		// 更改新聞
		document.getElementById('updateForm').addEventListener('submit', function(e) {
			// e.preventDefault(); // 阻止表單的默認提交行為
			let newsId = document.getElementById('updateNewsId').value;
			let title = document.getElementById('updateTitle').value;
			let text = document.getElementById('updateText').value;
			let newsURL = document.getElementById('updateNewsURL').value;

			let imgURL;

			const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
			const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

			const files = document.getElementById('updateFile').files;
			if (files.length > 0) {
				const file = files[0];
				// 檢查檔案大小
				if (file.size > MAX_FILE_SIZE) {
					alert('檔案大小不能超過 10 MB。');
					return;
				}
				// 檢查檔案類型
				if (!ALLOWED_FILE_TYPES.includes(file.type)) {
					alert('只允許上傳 JPEG、PNG 檔案。');
					return;
				}
				const storage = getStorage();
				// 上傳檔案的邏輯
				const storageRef = ref(storage, `news/${file.name}`);
				try {
					uploadBytes(storageRef, file).then(() => {
						getDownloadURL(ref(storage, `news/${file.name}`))
							.then((url) => {
								imgURL = url;

								let formData = new FormData(); // 創建 FormData 物件
								formData.append('newsId', newsId);
								formData.append('title', title);
								formData.append('text', text);
								formData.append('newsURL', newsURL);
								formData.append('imgURL', imgURL);
								fetch('/news/update', {
									method: 'PUT',
									body: formData
								})
									.then(response => {
										if (!response.ok) {
											throw new Error('Error:update News ->');
										}
										return response.json();
									})
									.then(data => {
										console.log('Success');
										window.location.href = '/admin';
									})
									.catch(error => {
										console.error('update News err:', error);
									});

							})
							.catch((error) => {
								console.error('獲取url失敗 ', error)
							});
					});
				} catch (error) {
					console.error('上傳失敗:', error);
				}
			} else {
				let formData = new FormData(); // 創建 FormData 物件
				formData.append('newsId', newsId);
				formData.append('title', title);
				formData.append('text', text);
				formData.append('newsURL', newsURL);
				formData.append('imgURL', null);
				fetch('/news/update', {
					method: 'PUT',
					body: formData
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Error:update News ->');
						}
						return response.json();
					})
					.then(data => {
						console.log('Success');
						window.location.href = '/admin';
					})
					.catch(error => {
						console.error('update News err:', error);
					});
			}
		});

		// 刪除新聞
		document.getElementById('deleteForm').addEventListener('submit', function(e) {
			// e.preventDefault(); // 阻止表單的默認提交行為
			let newsId = document.getElementById('deleteNewsId').value;
			fetch('/news/delete/' + newsId, {
				method: 'DELETE',
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Error:delete News ->');
					}
					console.log('Success');
					window.location.href = '/admin';
				})
				.catch(error => {
					console.error('delete Mews err:', error);
				});
		});

		// 全部新聞/增加新聞/刪除修改新聞，三個頁面的tab切換
		document.getElementById('newsFind').style.display = "block";
		let allTabBtns = document.querySelectorAll('.newsTabBtn');
		allTabBtns.forEach((e1, index) => {
			e1.addEventListener('click', function(e2) {
				var i, newsContent;
				newsContent = document.getElementsByClassName("newsContent");
				for (i = 0; i < newsContent.length; i++) {
					newsContent[i].style.display = "none";
				}
				for (i = 0; i < allTabBtns.length; i++) {
					allTabBtns[i].classList.remove('newsTabActive');
				}
				e2.target.classList.add('newsTabActive');
				switch (index) {
					case 0:
						document.getElementById('newsFind').style.display = "block";
						break;
					case 1:
						document.getElementById('newsAdd').style.display = "block";
						break;
					case 2:
						document.getElementById('newsUpdate').style.display = "block";
						break;
					default:
						break;
				}
				// document.getElementById(dbMove).style.display = "block";
			});
		});

	}

	loadBackstageLeftSide();//頁面加載初始化
	switchContent('member');//預設顯示會員管理
});