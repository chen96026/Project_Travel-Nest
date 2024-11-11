const scrollRevealOption = {
	distance: "50px",
	origin: "bottom",
	duration: 1000,
};

ScrollReveal().reveal(".banner-left", {
	...scrollRevealOption,
});
ScrollReveal().reveal(".banner-right", {
	...scrollRevealOption,
});
ScrollReveal().reveal(".popular-destination-area", {
	...scrollRevealOption,
	delay: 500,
});

// 點擊get Started後會聚焦在航班出發地輸入欄位
document.getElementById("HpStardBtn").addEventListener("click", function() {
	// Focus the first input field without moving the page
	document.getElementById("des_start").focus();
	document.getElementById("des_start").style.borderColor = 'red';
});

// 新聞的輪播
fetch('/news/getAll')
	.then(response => {
		if (!response.ok) {
			throw new Error('Error:get all News ->');
		}
		return response.json();
	})
	.then(data => {
		console.log(data);
		let news = document.getElementById("HpNews");

		if (data.length === 0) {
			news.innerHTML = "<p>No news available</p>";
			return;
		}

		news.innerHTML += "<div class='Hp_prev' onclick='posterPlusSlides(-1)'>&#10094;</div>";
		for (let i = 0; i < data.length; i++) {
			news.innerHTML += "<div class='container-fluid'>"
				+ "<div class='row align-items-center justify-content-end'>"
				+ "<div class='col-lg-6 col-md-12 home-about-left'>"
				+ "<h1>" + data[i].title + "</h1>"
				+ "<p>" + data[i].text + "</p>"
				+ "<div onclick=\"out('" + data[i].url + "')\" class='primary-btn text-uppercase'>閱讀更多. . .</div>"
				+ "</div>"
				+ "<div class='col-lg-6 col-md-12 home-about-right no-padding'>"
				+ "<img class='img-fluid' src='" + data[i].img + "'>"
				+ "</div></div></div>";
		}
		news.innerHTML += "<div class='Hp_next' onclick='posterPlusSlides(1)'>&#10095;</div>";

		let allNews = document.querySelectorAll('.container-fluid');
		if (allNews.length > 0) {
			allNews[0].style.display = "flex";
		}
	})
	.catch(error => {
		console.error('add News err:', error);
	});

let slideIndex = 1;
let timer;

function posterPlusSlides(n) {
	showSlides(slideIndex += n);
}

function showSlides(n) {
	let i;
	let slides = document.getElementsByClassName("container-fluid");

	if (slides.length === 0) {
		console.log("No slides available");
		return;
	}

	if (n > slides.length) { slideIndex = 1; }
	if (n < 1) { slideIndex = slides.length; }

	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}

	if (slides[slideIndex - 1]) {
		slides[slideIndex - 1].style.display = "flex";
	}

	clearInterval(timer);
	timer = setInterval(() => {
		showSlides(++slideIndex);
	}, 3000);
}

timer = setInterval(() => {
	showSlides(++slideIndex);
}, 3000);

function out(source) {
	swal({
		title: "確定後前往此新聞連結",
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
			window.open(source, '_blank');
		}
	});
}


// 搜尋
const searchBtn = document.getElementById('search_btn');
const inputFields = document.querySelectorAll('input');
searchBtn.addEventListener('click', function(event) {
	localStorage.removeItem('selectedFlights');
	localStorage.removeItem('selectedFlights2');

	event.preventDefault();
	const desStart = document.getElementById('des_start').value;
	const desEnd = document.getElementById('des_end').value;
	const dateStart = document.getElementById('date_start').value;
	const dateEnd = document.getElementById('date_end').value;
	const adults = document.getElementById('adults').value;
	const child = document.getElementById('child').value;
	const type = document.querySelector('input[name="type"]:checked').value;

	const formData = `?des_start=${desStart}&des_end=${desEnd}&date_start=${dateStart}&date_end=${dateEnd}&adults=${adults}&child=${child}&type=${type}`;

	if (!desStart || !desEnd || !dateStart || !dateEnd || !adults || !child) {
		swal("請完整填寫所有欄位", "", "error", { button: "確認" });
	} else {
		checkLocation([desStart, desEnd]).then(isValid => {
			if (!isValid) {
				swal("無至此國家或城市的航班", "", "error", { button: "確認" });
			} else {
				if (desEnd === '世界各地') {
					window.location.href = 'http://localhost:8890/searchpage?des_start=台灣&des_end=世界各地&date_start=2024%2F10%2F29&date_end=2024%2F10%2F30&adults=1&child=0&type=經濟艙';
				} else {
					fetch('http://localhost:8890/plane/check_country', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ country: desEnd })
					})
						.then(response => response.json())
						.then(data => {
							const searchPage = data.length !== 0 ? 'http://localhost:8890/searchpage' : 'http://localhost:8890/searchpage2';
							window.location.href = searchPage + formData;
						})
						.catch(error => {
							console.error('Error:', error);
						});
				}
			}
		});
	}
});

// 檢查出發地與目的地是否存在資料表
function checkLocation(locations) {
	const promises = locations.map(item => {
		return fetch(`/plane/checkLocation?value=${item}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Error: 無法檢查地點');
				}
				return response.json();
			})
			.then(data => data.exists)
			.catch(error => {
				console.error('檢查錯誤:', error);
				return false;
			});
	});

	return Promise.all(promises).then(results => results.every(exists => exists));
}

inputFields.forEach(input => {
	input.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			searchBtn.click();
		}
	});
});


fetch('/forum/api/getHomePagePosts')
	.then(response => {
		if (!response.ok) {
			throw new Error('blog Error: no response');
		}
		return response.json();
	})
	.then(data => {
		// 0~5
		console.log(data);
		console.log("------------");
		// 0~11
		let imgTemp = document.querySelectorAll('.HpBlogImg');
		console.log(imgTemp);
		console.log("------------");
		let img = document.querySelectorAll('.HpBlogImg');
		let tags = document.querySelectorAll('.HpBlogTags');
		let title = document.querySelectorAll('.HpBlogTitle');
		let text = document.querySelectorAll('.HpBlogText');
		let icon = document.querySelectorAll('.HpBlogIcon');
		let author = document.querySelectorAll('.HpBlogAuthor');
		let date = document.querySelectorAll('.HpBlogDate');
		for (let index = 0; index < 12; index++) {
			img[index].src = data[(index + 3) % 6].coverImgURL;
			let tagSplit = data[(index + 3) % 6].post.tags.split(",");
			let tagString = "";
			tagSplit.forEach(tag => {
				tagString += "<li><a href='/forum?key=" + tag + "'>" + tag + "</a></li>"
			});
			tags[index].innerHTML = tagString;
			title[index].innerHTML = "<a href='/forum/detail/" + data[(index + 3) % 6].post.id + "'>" + data[(index + 3) % 6].post.mainTitle + "</a>";
			text[index].innerHTML = data[(index + 3) % 6].post.content;
			icon[index].src = data[(index + 3) % 6].userNameIconDTO.iconURL;
			author[index].innerHTML = data[(index + 3) % 6].userNameIconDTO.username;
			date[index].innerHTML = data[(index + 3) % 6].post.startDate;
		}

	})
	.catch(error => {
		console.error('blog err:', error);
	});



// 防抖函數
function debounce(func, delay) {
	let debounceTimer;
	return function() {
		const context = this;
		const args = arguments;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(context, args), delay);
	}
}

// 追蹤當前選中的建議索引，分別為 des_start 和 des_end
const currentFocus = {
	des_start: -1,
	des_end: -1
};

// 函數：顯示建議
function showSuggestions(input, suggestionsDiv, inputId) {
	const inputValue = input.value.toLowerCase();

	// 清空之前的建議
	suggestionsDiv.innerHTML = '';

	if (inputValue) {
		// 從伺服器獲取建議數據
		fetch(`/plane/inputSearch?query=${encodeURIComponent(inputValue)}`)
			.then(response => response.json())
			.then(data => {
				if (data.length === 0) {
					suggestionsDiv.style.display = 'none';
					return;
				}

				data.forEach(item => {
					const suggestionText = `${item.country} - ${item.city}`;
					const div = document.createElement('div');
					div.textContent = suggestionText;
					div.setAttribute('role', 'option');

					// 當點擊某個建議時，將其設置為輸入框的值
					div.addEventListener('click', function() {
						input.value = item.city;
						suggestionsDiv.style.display = 'none';
					});

					suggestionsDiv.appendChild(div);
				});

				suggestionsDiv.style.display = 'block';
			})
			.catch(error => {
				console.error('Error fetching suggestions:', error);
				suggestionsDiv.style.display = 'none';
			});
	} else {
		suggestionsDiv.style.display = 'none';
	}
}

// 監聽輸入事件並綁定防抖
const inputs = ['des_start', 'des_end'];
inputs.forEach(inputId => {
	const input = document.getElementById(inputId);
	const suggestionsDiv = document.getElementById(`suggestions_${inputId}`);

	input.addEventListener('input', debounce(function() {
		showSuggestions(input, suggestionsDiv, inputId);
		currentFocus[inputId] = -1; // 重置選中索引
	}, 300));

	// 監聽鍵盤事件
	input.addEventListener('keydown', function(e) {
		let suggestionItems = suggestionsDiv.getElementsByTagName('div');
		if (e.keyCode === 40) { // Arrow Down
			currentFocus[inputId]++;
			addActive(suggestionItems, inputId);
		} else if (e.keyCode === 38) { // Arrow Up
			currentFocus[inputId]--;
			addActive(suggestionItems, inputId);
		} else if (e.keyCode === 13) { // Enter
			e.preventDefault();
			if (currentFocus[inputId] > -1) {
				if (suggestionItems) suggestionItems[currentFocus[inputId]].click();
			}
		}
	});

	// 添加 active 類名以高亮選中項目
	function addActive(items, inputId) {
		if (!items) return false;
		removeActive(items);
		if (currentFocus[inputId] >= items.length) currentFocus[inputId] = 0;
		if (currentFocus[inputId] < 0) currentFocus[inputId] = items.length - 1;
		items[currentFocus[inputId]].classList.add('active');
		// 滾動到可見範圍
		items[currentFocus[inputId]].scrollIntoView({ block: 'nearest' });
	}

	// 移除所有 active 類名
	function removeActive(items) {
		for (let i = 0; i < items.length; i++) {
			items[i].classList.remove('active');
		}
	}
});

// 當點擊建議框外部時隱藏建議框
document.addEventListener('click', function(e) {
	inputs.forEach(inputId => {
		const suggestionsDiv = document.getElementById(`suggestions_${inputId}`);
		const input = document.getElementById(inputId);
		if (e.target === input || e.target.closest(`#suggestions_${inputId}`)) {
			// 點擊在輸入框內或建議框內，不做任何操作
			return;
		}
		// 隱藏所有建議框
		suggestionsDiv.style.display = 'none';
	});
});

document.addEventListener('keydown', function(e) {
	if (e.keyCode === 9) { // Tab 鍵
		inputs.forEach(inputId => {
			const suggestionsDiv = document.getElementById(`suggestions_${inputId}`);
			// 隱藏所有建議框
			suggestionsDiv.style.display = 'none';
		});
	}
});