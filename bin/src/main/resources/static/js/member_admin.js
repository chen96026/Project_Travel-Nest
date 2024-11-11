document.addEventListener("DOMContentLoaded", function () {
  function Back_LeftSide() {
    const back_leftside = document.createElement("div");
    back_leftside.id = "Backstage_LeftInSide";
    back_leftside.innerHTML = `
      <div id="Backstage_LeftMember">會員管理</div>
      <div id="Backstage_LeftOrder">訂單管理</div>
      <div id="Backstage_LeftForum">論壇管理</div>
        `;
    document.getElementById("Backstage_LeftSide").innerHTML = '';
    document.getElementById("Backstage_LeftSide").appendChild(back_leftside);
    member_click_LeftSide();
  }

  function member_click_LeftSide() {
    document
      .getElementById("Backstage_LeftMember")
      .addEventListener("click", function () {
        window.location = "./member_admin.html"
      });

    document
      .getElementById("Backstage_LeftOrder")
      .addEventListener("click", function () {
        window.location = "./order_admin.html"
      });

    document
      .getElementById("Backstage_LeftForum")
      .addEventListener("click", function () {
        window.location = "./forum_admin.html"
      });
  }
  Back_LeftSide();
});

  let Members = [];
  let Member_filtered = [];
  const Member_perPage = 10;
  let Member_currentPage = 1;

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
        Member_filtered = [...Members];  //複製陣列
        console.log('初始化的 Member_filtered:', Member_filtered);
        BackList();
      })
      .catch(error => {
        console.error('發生錯誤:', error);
      });
  }

  // 生成會員清單
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

  // 搜尋
  document
    .getElementById("Member_searchBar")
    .addEventListener("input", function () {
      const searchValue = this.value.toLowerCase();

      Member_filtered = Members.filter((Member_Each) => {
        return (
          Member_Each.name.toLowerCase().includes(searchValue) ||
          Member_Each.email.toLowerCase().includes(searchValue)
        );
      });

      //重置頁碼
      Member_currentPage = 1;
      BackList();
    });

  window.onload = fetchMembers;

