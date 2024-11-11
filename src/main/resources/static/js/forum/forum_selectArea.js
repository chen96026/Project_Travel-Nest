$(() => {
    let cityData = [];  // 存放讀到的 city.json 資料
	
	const urlParams = new URLSearchParams(window.location.search);
	var setCountry;
	var setCity;
	if (typeof country == 'undefined') {
		setCountry = urlParams.get('country');
		setCity = urlParams.get('city');		
	} else {
		setCountry = country;
		setCity = city;	
	}
	console.log(setCountry);	
	console.log(setCity);	

    // 讀取 JSON 檔案
    // 國家
    $.getJSON('/data/country.json', data => {
        $('#forum_select_country').empty();
        // 區域群組
        data.forEach(data => {
            const group = $(`<optgroup>`, { label: `${data.groupName}` });

            // 國家選項
            data.country.forEach(country => {
                group.append(`<option value=${country}>${country}</option>`)
            })
            $('#forum_select_country').append(group);
			
			if (setCountry !== null) $(`select[name='country'] option[value='${setCountry}']`).prop('selected', true);
        })
    })

    // 城市
    $.getJSON('/data/city.json', data => {
        cityData = data;
		setTimeout (() => {
	        if (typeof setCountry !== 'undefined') {
	            $(`select[name='country'] option[value='${setCountry}']`).prop('selected', true);
	            changeOption($('#forum_select_country').val());
	
	            if (setCity != null) $(`select[name='city'] option[value='${setCity}']`).prop('selected', true);
	
	        } else {
	            changeOption($('#forum_select_country').val());
	        }
		}, 10)

    })

    // 偵測目前選擇的國家
    $('#forum_select_country').change(function () {
        changeOption(this.value);
    });


    // 替換區域選項
    function changeOption(selected) {
        $('#forum_select_city').empty();  // 清除目前顯示的選項

        // 找目前選擇的國家的城市資料
        const countryData = cityData.find(country => country.country === selected);
        // 區域群組
        countryData.area.forEach(area => {
            const citys = $(`<optgroup>`, { label: `${area.areaName}` });

            // 城市選項
            area.city.forEach(city => {
                citys.append(`<option value=${city}>${city}</option>`)
            })

            $('#forum_select_city').append(citys);
        })
    }
    
})

