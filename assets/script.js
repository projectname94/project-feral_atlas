var Site = {}
Site.items = []
Site.itemTracker = 30;
document.addEventListener('DOMContentLoaded', init)


function init(){

	Site.container = document.getElementById("container")

	return fetch("../files/images.json")
	.then((r) => r.json())
	.then((responseJson) => {

		if(!Array.isArray(responseJson)){ return; }
		console.log("what")
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
	animated.addEventListener('animationend', (e) => {
	  // console.log('Animation ended', e.target);
	  // remove
	  if(e.animationName.includes("bobbing")){
	  	return;
	  }
	  
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
	// load in 15 initial items
	items.forEach((item, index) => {	
		if(index > 30){ return; }

		if(index < 10){
			// immediatly load into center
			let seek = true;
			Site.loadItem(item, index, container, seek)

		}else if(index > 20){
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
			startPosition = Math.floor(Math.random()*11),
			leaning = (startPosition > 5) ? lean + 3 : lean,
			side = Math.floor(Math.random()*4),
			bobbing = Math.ceil(Math.random()*3);


	// 2 possible animations per side and direction, upper lower and middle
	// item gets inline styles for speed
	var speed = 50 + Math.round(Math.random()*5),
			delay = Math.round(Math.random()*10),
			bobbingSpeed = 10 + Math.round(Math.random()*5),
			bobbingDelay = Math.round(Math.random()*10);
		
	// if seek is true, it means initial load places item in center
	if(seek){
		delay = (-1 * delay) - 10;
	}


	// item gets inline-styles for easing
	// bob bezier
	var bx1 = 0,
			by1 = Math.random()*0.4,
			bx2 = Math.random(),
			by2 = (bx2 < 0.6) ? bx2 + (Math.random() * 0.4) : (Math.random() * 0.4)


	return `<li 
		class="item ${sideArray[side][0] + startPosition}" 
		style="animation: ${sideArray[side][1] + leaning} linear ${speed}s ${delay}s;" 
		id="item-${index}">
		<a href="${item.url}">
			<img 
				loading="lazy" 
				class="item_image" 
				src="${item.imagepath}"
				style="animation: bobbing${bobbing} cubic-bezier(${bx1}, ${by1}, ${bx2}, ${by2}) ${bobbingSpeed}s ${bobbingDelay}s;"
				>
			<aside class="text_container">
				<h1 class="item_title item_text">${item.title}</h1>
				<div class="categories ${item.category.toLowerCase()}">
					<span class="item_category invasion">Invasion</span>
					<span class="item_category capital">Capital</span>
					<span class="item_category acceleration">Acceleration</span>
					<span class="item_category empire">Empire</span>
				</div>
			</aside>
		</a>
	</li>`
}