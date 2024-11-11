$(() => {
// Write:hover
    $('.forum_write').hover(
        () => {
            $('.forum_writeImg').addClass('forum_writeImg_hover');
            $('.forum_writeP').addClass('forum_writeP_hover');
        },
        () => {
            $('.forum_writeImg').removeClass('forum_writeImg_hover');
            $('.forum_writeP').removeClass('forum_writeP_hover');
        }
    );
	
	
// Loading Cards
    const cardsContainer = $('#cards-container');
    const loading = $('#loading');

    let page = 0;
    let isLoading = false;
	
	setTimeout(() => { loadCards() }, 100);

    $(window).scroll(scrollWindow);

    $('#forum_sort, #forum_select_country, #forum_select_city, #forum_search_key').change(() => {
        page = 0;
        cardsContainer.empty();
		
        loadCards();
    })



	function scrollWindow() {
	    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
	        loadCards();    
	    }
	}
	
	function loadCards() {
	    if (isLoading) return;
	    isLoading = true;
	    loading.show();
		
		const sortBy = $('#forum_sort').val();
		const country = $('#forum_select_country').val();
		const city = $('#forum_select_city').val();
		const key = $('#forum_search_key').val();
		
		$(window).off('scroll');
	
	    setTimeout(() => {
			console.log(`country: ${country}, city: ${city}, key: ${key}, sortBy: ${sortBy}, page: ${page}`);
	        fetch(`/forum/api/loadCards?country=${country}&city=${city}&key=${key}&sortBy=${sortBy}&page=${page}`)
	            .then(response => response.json())
	            .then(data => {
					console.log(data);
	                if (data.length > 0) {
	                    data.forEach(post => {
	                        const card = 
						  		`<div class="forum_card">
						        	<a href="/forum/detail/${post.post.id}">
						        		<article>
						        			<img class="forum_articleImg" src="${post.coverImgURL}" alt="photo">
						                    <h2>${post.post.mainTitle}</h2>
						                    <p class="forum_content">${post.post.content}</p>
						                </article>
						                <div>
						                	<img class="forum_authorImg" src="${post.userNameIconDTO.iconURL}" alt="authorIcon">
						                    <p class="forum_author">${post.userNameIconDTO.username}</p>
						                    <p class="forum_postDate">${post.createdDate}</p>
						                </div>
						             </a>
						         </div>`
	                        cardsContainer.append(card);
							$(window).on('scroll', scrollWindow);        
	                    })
	
	                    page++;
	
	                } else {				
						(page == 0) 
						? cardsContainer.append(`<p>查無符合條件的文章</p>`) 
						: cardsContainer.append(`<p>沒有更多文章了！</p>`);
	                }  
	            })
				.catch(error => {
					console.error('Error loading posts:', error);
				})
				.finally(() => {
					isLoading = false; 
	        		loading.hide();
				})
				
	
	    }, 1000);
	
	}
    
});