document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);

	let des_start = urlParams.get('des_start');
	let des_end = urlParams.get('des_end');
	let date_start = urlParams.get('date_start');
	let date_end = urlParams.get('date_end');
	let adults = urlParams.get('adults');
	let child = urlParams.get('child');
	let type = urlParams.get('type');

	document.getElementById('des_start').value = des_start;
	document.getElementById('des_end').value = des_end;
	document.getElementById('date_start').value = date_start;
	document.getElementById('date_end').value = date_end;
	document.getElementById('adults').value = adults;
	document.getElementById('child').value = child;
	document.querySelector(`input[name="type"][value="${type}"]`).checked = true;

	let totalResults = [];
	let searchType = type == '經濟艙' ? 'search2' : 'search2ByBusiness';
	
	if(localStorage.getItem('selectedFlights')) {
		let temp = date_start;
		date_start = date_end;
		date_end = temp;
	}
	const apiUrl = `http://localhost:8890/plane/${searchType}?departureCountry=${encodeURIComponent(des_start)}&arrivalCity=${encodeURIComponent(des_end)}&departureDate=${encodeURIComponent(date_start)}&requiredSeats=${Number(adults) + Number(child)}`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			airline_choice(removeDuplicates(data), data);
			totalResults = sortBy(data, chooseMethod());
			loadChoice(totalResults);
		})
		.catch(error => {
			console.error('Error fetching flight data:', error);
		});

	function loadChoice(data) {
		const choiceContainer = document.querySelector('#search2_choice');
		choiceContainer.innerHTML = '';

		if (data.length === 0) {
			choiceContainer.innerHTML = '<p>沒有找到符合條件的航班...</p>';
			return;
		}

		data.forEach(flight => {
			let duration = calculateDuration(flight.plane.time_start, flight.plane.time_end, flight.time_zone);
			const choice = document.createElement('a');
			choice.classList.add('choice-card');
			choice.style.color = 'black';
			choice.href = '#';

			choice.innerHTML += `
								<div class="flight_logo_container"><img class="flight_logo" src="/assets/airline_logo/${flight.plane.airline}.png"></div>
								<h3 id="flight_plane">${flight.plane.airline}</h3>
								<div class="middle_group">
									<div class="arrow-text-up">
										<span>${flight.plane.time_start.slice(0, 5)}</span>
										<span>${flight.plane.des_start}</span>
									</div>
									<div class="arrow">
										<span>${Math.floor(duration / 60)}小時${duration % 60}分</span>
										<img src="/assets/airline_logo/plane_line.png">
										<span>直飛</span>	
									</div>
									<div class="arrow-text-down">
										<span>${flight.plane.time_end.slice(0, 5)}</span>
										<span>${flight.plane.des_end}</span>
									</div>
								</div>
								<div class="plane-price">NT$${flight.plane.eco_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</d>
							`;

			choice.addEventListener('click', (e) => {
				e.preventDefault(); // Prevent default action

				const sectionTitle = document.getElementById('section_title').innerText.trim();
				if (sectionTitle === '選擇回程') {
					flight.duration = duration;
					flight.des_start = des_start;
					flight.des_end = des_end;
					flight.seat = type;
					flight.adults = Number(adults);
					flight.child = Number(child);
					localStorage.setItem('selectedFlights2', JSON.stringify(flight))
					modalContent(flight);//模態窗口資訊
					showModal(); // 顯示模態窗口
				} else {
					swapDestinations(des_start, des_end);
					flight.duration = duration;
					flight.des_start = des_start;
					flight.des_end = des_end;
					flight.seat = type;
					flight.adults = Number(adults);
					flight.child = Number(child);
					localStorage.setItem('selectedFlights', JSON.stringify(flight))
				}
			});

			choiceContainer.appendChild(choice);
		});
	}

	function swapDestinations(start, end) {
		const newUrl = `${window.location.origin}${window.location.pathname}?des_start=${end}&des_end=${start}&date_start=${encodeURIComponent(date_start)}&date_end=${encodeURIComponent(date_end)}&adults=${encodeURIComponent(adults)}&child=${encodeURIComponent(child)}&type=${type}`;
		window.location.href = newUrl;
	}

	// 顯示選擇的航班
	function displaySelectedFlights() {
		const flight = JSON.parse(localStorage.getItem('selectedFlights'));
		const search2Space = document.querySelector('#search2_space');
		search2Space.innerHTML = '';


		let duration = calculateDuration(flight.plane.time_start, flight.plane.time_end, flight.time_zone);
		const flightCard = document.createElement('div');
		flightCard.classList.add('choice-card2');
		flightCard.innerHTML += `
				<div class="section_des_start">去程</div>
				<div class="card2_airline">${flight.plane.airline}</div>
				<div class="arrow-text-up">${flight.plane.des_start} - ${flight.plane.time_start.slice(0, 5)}</div>
				<div><img id="flight_takeoff" src="/img/flight_takeoff.png"></div>
				<div class="arrow-text-down">${flight.plane.des_end} - ${flight.plane.time_end.slice(0, 5)}</div>
				<div class="card2_duration">飛行時間: ${Math.floor(duration / 60)}小時${duration % 60}分</div>
				<div class="card2_price">價格: NT$${flight.plane.eco_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
				<button class="close-btn" id="close-btn">取消</button>
			`;
		search2Space.appendChild(flightCard);

		if (localStorage.getItem('selectedFlights')) {
			const cancelled = document.getElementById('close-btn');
			cancelled.addEventListener('click', () => {
				localStorage.removeItem('selectedFlights');
				localStorage.removeItem('selectedFlights2');
				swapDestinations(des_start, des_end);
			})
		}
	}

	// 顯示模態窗口
	function showModal() {
		const modal = document.getElementById('myModal');

		modal.style.display = 'block';

		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = 'none';
			}
		}
	}

	function modalContent(flight) {
		let selectedFlights = JSON.parse(localStorage.getItem('selectedFlights'));
		let arr = [];
		arr.push(selectedFlights);
		arr.push(flight)

		let check = true;
		let text = '去程';
		const modalFlightInfo = document.getElementById('modalFlightInfo');
		modalFlightInfo.innerHTML = '';
		arr.forEach(item => {
			if (!check) text = '回程';
			let duration = calculateDuration(item.plane.time_start, item.plane.time_end, item.time_zone);
			const flightCard = document.createElement('div');
			flightCard.classList.add('choice-card3');
			flightCard.innerHTML += `
					<div class="section_des_start">${text}</div>
					<h4 class="card2_airline">${item.plane.airline}</h4>
					<div class="arrow-text-up">${item.plane.des_start} - ${item.plane.time_start.slice(0, 5)}</div>
					<div><img id="flight_takeoff" src="/img/flight_takeoff.png"></div>
					<div class="arrow-text-down">${item.plane.des_end} - ${item.plane.time_end.slice(0, 5)}</div>
						
				<div class="card2_duration">飛行時間: ${Math.floor(duration / 60)}小時${duration % 60}分</span>
				<div class="card2_price">價格: NT$${item.plane.eco_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
						`;
			check = false;
			modalFlightInfo.appendChild(flightCard);
		});
	}

	if (localStorage.getItem('selectedFlights')) displaySelectedFlights();

	// 計算飛行時間
	function calculateDuration(time_start, time_end, time_zone) {
		let hour_start = Number(time_start.slice(0, 2));
		let minute_start = Number(time_start.slice(3, 5));
		let hour_end = Number(time_end.slice(0, 2));
		let minute_end = Number(time_end.slice(3, 5));

		let total_time_start = hour_start * 60 + minute_start;
		let total_time_end = hour_end * 60 + minute_end;
		
		if(document.getElementById('section_title').textContent === '選擇回程') time_zone = (JSON.parse(localStorage.getItem('selectedFlights')).time_zone)*(-1);
		total_time_end -= time_zone * 60;

		let total_time = total_time_end - total_time_start;

		if (total_time < 0) {
			total_time += 1440;
		}

		return total_time;
	}

	// 排序方式
	function chooseMethod() {
		const sort_selects = document.querySelectorAll('.sort');
		sort_selects.forEach(sort_select => {
			sort_select.addEventListener('change', function() {
				applyFilters();
			});
		});
	}

	function sortBy(data, method) {
		if (method === 'price') {
			return data.sort((a, b) => a.plane.eco_price - b.plane.eco_price);
		} else if (method === 'time') {
			return data.sort((a, b) => calculateDuration(a.plane.time_start, a.plane.time_end, a.time_zone) -
				calculateDuration(b.plane.time_start, b.plane.time_end, b.time_zone));
		} else {
			return data;
		}
	}

	function getSortMethod() {
		const selectedSort = document.querySelector('.sort:checked');
		return selectedSort ? selectedSort.value : null;
	}

	// 去除重複資料(以航空公司做篩選)
	function removeDuplicates(data) {
		let unique = [];
		for (let i = 0; i < data.length; i++) {
			if (!unique.includes(data[i].plane.airline)) {
				unique.push(data[i].plane.airline);
			}
		}
		return unique;
	}

	// slider篩選時間
	const slider = document.getElementById('slider');

	noUiSlider.create(slider, {
		start: [0, 1439],
		connect: true,
		range: {
			'min': 0,
			'max': 1439
		},
		step: 30,
		format: {
			to: function(value) {
				return Number(value);
			},
			from: function(value) {
				return Number(value);
			}
		}
	});

	// 取得最小和最大值顯示區域
	var minValue = document.getElementById('min-value');
	var maxValue = document.getElementById('max-value');

	// 當滑塊值更新時，更新顯示的時間
	slider.noUiSlider.on('update', function(values) {
		minValue.textContent = Math.floor(values[0] / 60) + ':' + Math.floor(values[0] % 60);
		maxValue.textContent = Math.floor(values[1] / 60) + ':' + Math.floor(values[1] % 60);
		applyFilters();
	});

	// checkbox篩選航空公司
	function airline_choice(airline, data) {
		const airline_choice = document.getElementById('airline_container');
		const input = document.createElement('div');
		input.classList.add('airline_choice');
		input.setAttribute('id', 'airline_choice');
		let input_choice = '';

		input_choice += '<input type="checkbox" id="select_all" class="checkbox_all" checked><label for="select_all">&nbsp;全選</label><br>';

		for (let i = 0; i < airline.length; i++) {
			input_choice += '<input type="checkbox" class="checkbox" checked id="' + airline[i] + '" value="' + airline[i] + '">';
			input_choice += '<label for="' + airline[i] + '">&nbsp;' + airline[i] + '</label><br>';
		}

		input.innerHTML = input_choice;
		airline_choice.appendChild(input);

		const checkboxes = document.querySelectorAll('.checkbox');

		checkboxes.forEach(checkbox => {
			checkbox.addEventListener('change', function() {
				applyFilters();
			});
		});

		const selectAllCheckbox = document.getElementById('select_all');
		selectAllCheckbox.addEventListener('change', function() {
			const isChecked = this.checked;
			checkboxes.forEach(checkbox => {
				checkbox.checked = isChecked;
			});
			applyFilters();
		});

		loadChoice(data);
	}

	function getSelectedAirlines() {
		const selected = [];
		const checkboxes = document.querySelectorAll('.checkbox:checked');
		checkboxes.forEach(checkbox => {
			selected.push(checkbox.value);
		});
		return selected;
	}

	function filterData(data, minTime, maxTime, selectedAirlines) {
		return data.filter(flight => {
			const flightTimeHour = Number(flight.plane.time_start.slice(0, 2));
			const flightTimeMinute = Number(flight.plane.time_start.slice(3, 5));
			const flightStartTime = flightTimeHour * 60 + flightTimeMinute;
			const airlineMatch = selectedAirlines.includes(flight.plane.airline);
			const timeMatch = flightStartTime >= Number(minTime) && flightStartTime <= Number(maxTime);
			return airlineMatch && timeMatch;
		});
	}

	// 有篩選動作便重新load
	function applyFilters() {
		const selectedAirlines = getSelectedAirlines();
		const sliderValues = slider.noUiSlider.get();
		const filteredData = filterData(totalResults, sliderValues[0], sliderValues[1], selectedAirlines);
		const selectedSortMethod = getSortMethod();
		const sortedData = sortBy(filteredData, selectedSortMethod);
		loadChoice(sortedData);
	}

	document.getElementById('confirmReturn').addEventListener('click', () => {
		if (!localStorage.getItem('uid')) {
			localStorage.setItem('lastUrl', '/orders/order');
			window.location.href = '/login';
		} else {
			window.location.href = '/orders/order';
		}
	})

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

	if (localStorage.getItem('selectedFlights') != null) document.getElementById('section_title').innerHTML = '選擇回程';
	localStorage.setItem('lastUrl', window.location.href);

	const card2 = document.querySelector('.choice-card2');
	const close_btn = document.querySelector('.close-btn');

	card2.addEventListener('mouseover', () => {
		close_btn.classList.add('hovered');
	});

	card2.addEventListener('mouseout', () => {
		close_btn.classList.remove('hovered');
	});
});