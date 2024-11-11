// Stars
$(() => {
	
	const checkedRate = $('input[name="rate"]:checked').val();
	
	if (typeof checkedRate !== 'undefined') {
		fillStar(checkedRate);
	}
	
	
    $('input[name="rate"]').change(function() {
		fillStar(this.value);
    })
	
	
	function fillStar(rate) {
		$('.forum_e_star').removeClass('forum_e_starFill');
		
		for (let i = 1; i <= rate; i++) {
			$(`#forum_star_${i}`).addClass('forum_e_starFill');
		}
	
	}
});