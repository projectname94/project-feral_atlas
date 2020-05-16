var Site = {}
Site.items = []
Site.itemTracker = 27;
Site.recentStartPosition;
Site.recentSide; 
Site.windowHeight = window.innerHeight;

document.addEventListener('DOMContentLoaded', init)


function init(){

	Site.container = document.getElementById("container")

	window.addEventListener('resize', () => {
		if(window.innerHeight !== Site.windowHeight){
			Site.windowHeight = window.innerHeight;
		}
	})

	return fetch("../files/images.json")
	.then((r) => r.json())
	.then((responseJson) => {
		if(!Array.isArray(responseJson)){ return; }
		Site.items = Site.arrayOrder(responseJson);
		
		// add start + end positions to items
		Site.loadingItems(Site.items, Site.container)

	})
	.catch((error) => {
		console.log(error)
	})
}

Site.arrayOrder = (array) => {
	var i = array.length, k , temp;
	while(--i > 0){
		k = Math.floor(Math.random() * (i+1));
		temp = array[k];
		array[k] = array[i];
		array[i] = temp;
	}
  // shuffled array:
	return array;
}	

Site.loadItem = (item, index, container, seek) => {
	container.insertAdjacentHTML('beforeend', Site.itemComponent(item, index, seek))

	var animated  = document.getElementById("item-" + index)
	
	// determine text position
	animated.addEventListener('mouseover', (e) => {
		if(e.clientY < Site.windowHeight*0.66){
			return;
		}

		animated.querySelector(".text_container").style.top = "auto"
		animated.querySelector(".text_container").style.bottom = "calc(100% - 0.5rem)"

	})


	animated.addEventListener('animationend', (e) => {
	  // remove
	  if(e.animationName.includes("bobbing")){ return; }
	  
	  e.target.parentNode.removeChild(e.target);

	  // track location in array
	  Site.itemTracker++;
	  
	  if(Site.itemTracker > Site.items.length - 1){
	  	Site.itemTracker = 0;
	  	Site.arrayOrder(Site.items)
	  }

	  Site.loadItem(Site.items[Site.itemTracker], Site.itemTracker, container)
	});

}

Site.loadingItems = (items, container) => {
	// load in 27 initial items
	items.forEach((item, index) => {	
		if(index > 27){ return; }

		if(index < 9){
			// immediatly load into center
			let seek = true;
			Site.loadItem(item, index, container, seek)

		}else if(index > 18){
			// stagger loading in
			setTimeout(() => {
				Site.loadItem(item, index, container)
			}, 7000)
		}else{
			Site.loadItem(item, index, container)
		}

	})
}

Site.itemComponent = (item, index, seek) => {
	// list item gets one class for animation keyframes
	// for all animations:
	// 1-3 position positive translations
	// 4-6 position negative translations
	var lean = Math.ceil(Math.random()*3),
			sideArray = [["top horizontal", "down"], ["bottom horizontal", "up"], ["left vertical", "right"], ["right vertical", "left"]],
			startPosition = Math.floor(Math.random()*11)

	// update startPosition to not repeat
	if(startPosition === Site.recentStartPosition){
		startPosition = (startPosition !== 10) ? startPosition + 1 : 0
	}
	// keep track of most recent startPosition
	Site.recentStartPosition = startPosition
	
	var leaning = (startPosition > 5) ? lean + 3 : lean,
			side = Math.floor(Math.random()*4),
			bobbing = Math.ceil(Math.random()*3);


	// update side if previous was same
	if(side === Site.recentSide){
		side = (side !== 3) ? side + 1 : 0;
	}
	// keep track of most recent side
	Site.recentSide = side


	// 2 possible animations per side and direction, upper lower and middle
	// item gets inline styles for speed
	var speed = 60 + Math.round(Math.random()*10),
			delay = Math.round(Math.random()*10),
			bobbingSpeed = 10 + Math.round(Math.random()*5),
			bobbingDelay = Math.round(Math.random()*15);
		
	// if seek is true, it means initial load places item in center
	if(seek){
		delay = (-1 * delay) - 10;
	}


	return `<li 
		class="item ${sideArray[side][0] + startPosition}" 
		style="animation: ${sideArray[side][1] + leaning} linear ${speed}s ${delay}s;" 
		id="item-${index}">
		<a href="${item.url}">
			<img 
				loading="lazy" 
				class="item_image" 
				src="${item.imagepath}"
				style="animation: bobbing${bobbing} ease-in-out ${bobbingSpeed}s ${bobbingDelay}s;"
				>
			<aside class="text_container">
				<h1 class="item_title item_text">${item.title}</h1>
				<div class="categories ${item.category.toLowerCase()}">
					<span class="item_category invasion">Invasion</span>
					<span class="item_category capital active_category">Capital</span>
					<span class="item_category acceleration">Acceleration</span>
					<span class="item_category empire">Empire</span>
				</div>
			</aside>
		</a>
	</li>`
}