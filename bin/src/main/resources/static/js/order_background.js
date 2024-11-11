document.addEventListener('DOMContentLoaded', function() {
	// 設定一個空的訂單列表
	let orders = [];

	fetch('/orders/api/orders')
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('Orders:', data); // 打印订单数据
			const tableBody = document.getElementById('orders-table-body');

			// 动态填充表格
			data.forEach(order => {
				const row = document.createElement('tr');
				row.innerHTML = `
	                        <td>${order.orderNumber}</td>
	                        <td>1</td>
	                        <td>${order.finalPrice}</td>
	                        <td>${order.createDate}</td>
	                    `;
				tableBody.appendChild(row);
			});
		})
		.catch(error => {
			console.error('Error:', error);
		});

	function renderOrder(order_list) {
		const tbody = document.getElementById('order_tbody');
		tbody.innerHTML = '';

		order_list.forEach(order => {
			const orderNumber = order.orderNumber;
			const contactName = order.contactName;
			const finalPrice = new Intl.NumberFormat('zh-TW', {
				style: 'currency',
				currency: 'TWD',
				currencyDisplay: 'symbol',  // 顯示 NT$
				maximumFractionDigits: 0    // 不顯示小數點
			}).format(order.finalPrice);

			const createDate = order.createDate;

			console.log(order.finalPrice);

			const row = `<tr>
	               <td>${orderNumber}</td>
	               <td>${contactName}</td>
	               <td>${finalPrice}</td>
	               <td>${createDate}</td>
	           </tr>`;
			tbody.innerHTML += row;
		});
	}

	function sortOrders(criteriaArray) {
		let sortedOrders = [...orders];  // 從已獲取的 orders 中排序
		sortedOrders.sort((a, b) => {
			for (let criteria of criteriaArray) {
				if (a[criteria] < b[criteria]) return -1;
				if (a[criteria] > b[criteria]) return 1;
			}
			return 0;
		});
		renderOrder(sortedOrders);
	}

	document.getElementById('sort_button').addEventListener('click', (event) => {
		event.preventDefault();
		const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
		const selectedCriteria = Array.from(checkboxes).map(checkbox => checkbox.value);
		sortOrders(selectedCriteria);
	});

});

let orders = [];

function renderOrders(order_list) {
	const tbody = document.getElementById('order_tbody');

	order_list.forEach(order => {
		const row = `<tr>
                        <td>${order.order_number}</td>
                        <td>${order.contact_name}</td>
                        <td>${order.finalpirce}</td>
                        <td>${order.createDate}</td>
                       </tr>`;
		tbody.innerHTML += row;
	})

}

document.querySelectorAll('.tab').forEach(tab => {
	tab.addEventListener('click', () => {
		const target = tab.getAttribute('data-tab');

		document.querySelectorAll('.tab_content').forEach(content => {
			content.style.display = 'none';
		});

		document.getElementById(target).style.display = 'block';

		document.querySelectorAll('.tab').forEach(tab => {
			tab.classList.remove('active');
		});

		tab.classList.add('active');
	});
});

document.querySelector('.tab').click();

renderOrders(orders, 'order_tbody');


