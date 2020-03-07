var Site = {}
Site.items = []
document.addEventListener('DOMContentLoaded', init)


function init(){

	Site.container = document.getElementById("container")


	return fetch("../files/images.json")
	.then((r) => r.json())
	.then((responseJson) => {

		Site.items = responseJson;

		Site.generateStyles();
		// generate random start positions + end positions
		
		// add start + end positions to items

		Site.loadingItems(Site.items, Site.container)

	})
	.catch((error) => {
		console.log(error)
	})
}

Site.loadingItems = (items, container) => {
	items.forEach((item, index) => {	
		container.insertAdjacentHTML('beforeend', Site.itemComponent(item, index))
	})
}

Site.generateStyles = () => {
	var d = new Date();
	var minute = d.getUTCMinutes()


}

Site.itemComponent = (item, index) => {
	// list item gets one class for animation keyframes
	// item fades in and out, added to animatino keyframes
	// list item gets one class defines start and end using translation
	// ten points of starting on each side
	// 2 possible animations per side and direction, upper lower and middle
	// middle gets either
	// item gets inline styles for speed
	// item gets inline-styles for easing

	// item_image gets inline styles for bobbing speed
	// item_image also has an inline bobbing delay
	// item_image gets inline-styles for bobbing easing
	// Lazy loading of images

	return `<li class="item left vertical1" style="animation: right3 infinite linear 10s;" id="item-${index}">
		<a href="${item.url}">
			<img loading="lazy" class="item_image" src="${item.imagepath}">
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