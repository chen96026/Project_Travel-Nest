document.addEventListener('DOMContentLoaded', function() {
	
	const weekday = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
	
	function getday(flight_date) {
		console.log(flight_date);
		let date = new Date(flight_date);
		return date.getDay();
	}
	
	const flight_start = JSON.parse(localStorage.getItem('selectedFlights'));
	const flight_end = JSON.parse(localStorage.getItem('selectedFlights2'));
	
	const order_details = document.createElement('div');
	order_details.innerHTML = `
		 	<div>${flight_start.plane.airline}</div>
		 	<div style="display: flex;">
		 		<div style="font-weight: bold;">${flight_start.des_start} 到 ${flight_start.des_end}&nbsp;&nbsp;&nbsp;&nbsp;</div>
		 		<p>${flight_start.plane.date_start}</p>
		 	</div>
		 	<div style="display: flex; align-items: center; margin: 0 10%">
		 		<div style="display: flex; flex-direction: column; align-items: center;">
		 			<div>${flight_start.plane.time_start.slice(0,5)}</div>
		 			<div>${flight_start.plane.des_start}</div>
		 		</div>
		 		<div style="flex-grow: 0; border-bottom: 1px solid black; margin: 0 10px; width:30%;"></div>
		 		<div style="display: flex; flex-direction: column; align-items: center;">
		 			<div>${flight_start.plane.time_end.slice(0,5)}</div>
		 			<div>${flight_start.plane.des_end}</div>
		 		</div>
		 		<div style="display: flex; flex-direction: column; align-items: center; margin: 0 30px;">
		 			<div>飛行時間: ${Math.floor(flight_start.duration / 60)}小時 ${flight_start.duration % 60}分</div>
		 			<div>${flight_start.plane.type}</div>
		 		</div>
		 		<div>${flight_start.seat}</div>
		 	</div>	
		 	<hr style="border: 1px solid gray; width: 100%;">
		 	
		 	<div>${flight_end.plane.airline}</div>
		 	<div style="display: flex;">
		 		<div style="font-weight: bold;">${flight_end.des_start} 到 ${flight_end.des_end}&nbsp;&nbsp;&nbsp;&nbsp;</div>
		 		<p>${flight_end.plane.date_start}</p>
		 	</div>
		 	<div style="display: flex; align-items: center; margin: 0 10% 5% 10%">
		 		<div style="display: flex; flex-direction: column; align-items: center;">
		 			<div>${flight_end.plane.time_start.slice(0,5)}</div>
		 			<div>${flight_end.plane.des_start}</div>
		 		</div>
		 		<div style="flex-grow: 0; border-bottom: 1px solid black; margin: 0 10px; width:30%;"></div>
		 		<div style="display: flex; flex-direction: column; align-items: center;">
		 			<div>${flight_end.plane.time_end.slice(0,5)}</div>
		 			<div>${flight_end.plane.des_end}</div>
		 		</div>
		 		<div style="display: flex; flex-direction: column; align-items: center; margin: 0 30px;">
		 			<div>飛行時間: ${Math.floor(flight_end.duration / 60)}小時 ${flight_end.duration % 60}分</div>
		 			<div>${flight_end.plane.type}</div>
		 		</div>
		 		<div>${flight_end.seat}</div>
		 	</div>
		`;							

	const container_all = document.getElementById('container_all');
	container_all.appendChild(order_details);
	
	var modal = document.getElementById("confirmModal");
	var payButton = document.getElementById("payButton");
	var closeButton = document.getElementsByClassName("close");
	var latterButton = document.getElementsByClassName("paylatter");
	var confirmPaymentButton = document.getElementById("confirmPayment");
	
	payButton.onclick = function() {
		modal.style.display = "block";
	}
	
	for(var i=0 ; i <closeButton.length;i++){
		closeButton[i].onclick = function(){
			modal.style.display = "none";
		}
	}
	
	for(var i=0 ; i <latterButton.length;i++){
		latterButton[i].onclick = function(){
			window.location.href = "/homepage";
		}
	}
	
	confirmPaymentButton.onclick = function() {
		document.getElementById('paymentForm').submit();
	}
	
	window.onclick = function(event) {
		if (event.target == modal){
			modal.style.display = "none";
		}
	}
	
	
});
		
	 
	 
	 
fetch('/orders/getoid')
    .then(response => response.json())
    .then(data => {
        var oid = data.oid;
        console.log("訂單 ID: ", oid);

        
        fetch('/orders/payBeforeTime/' + oid)
            .then(response => response.json())
            .then(data => {
                var payBeforeTime = data.payBeforeTimeISO;  
                console.log("支付截止時間: ", payBeforeTime);

                if (payBeforeTime) {
                    var deadline = new Date(payBeforeTime).getTime();

                    var countdownFunction = setInterval(function() {
                        var now = new Date().getTime();
                        var timeLeft = deadline - now;

                        if (timeLeft > 0) {
                            var minutes = Math.floor(timeLeft / (1000 * 60));
                            var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                            document.getElementById("countdown").innerHTML = minutes + "分 " + seconds + "秒";
                        } else {
                            clearInterval(countdownFunction);
                            document.getElementById("countdown").innerHTML = "訂單已逾期";
							
							
                            fetch('/orders/ordercancel', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
								credentials: 'include'
                            })
                            .then(response => {
                                if (response.ok) {
                                    console.log("訂單狀態更新成功");
									setTimeout(function(){
										window.location.href = "/orders/order_expired";
									},1000);
                                } else {
                                    console.error("訂單狀態更新失敗，狀態碼:" + response.status);
                                }
                            })
                            .catch(error => {
                                console.error("發生錯誤", error);
                            });
                        }
                    }, 100);
                } else {
                    document.getElementById("countdown").innerHTML = "無法獲取倒數計時時間";
                }
            })
            .catch(error => {
                console.error("無法獲取支付截止時間", error);
            });
    })
    .catch(error => {
        console.error("無法獲取訂單 ID", error);
});



