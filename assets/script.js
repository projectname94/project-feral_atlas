var Site = {}
Site.items = []
document.addEventListener('DOMContentLoaded', init)


function init(){

	Site.container = document.getElementById("container")


	return fetch("/files/images.json")
	.then((r) => r.json())
	.then((responseJson) => {

		Site.items = responseJson;

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

Site.itemComponent = (item, index) => {
	return `<li class="item" id="item-${index}" style="left: ${item.style.left}; top: ${item.style.top};">
		<a href="${item.url}">
			<img loading="lazy" src="${item.imagepath}">
			<aside>
				<h1>${item.title}</h1>
				<h2>${item.subtitle}</h2>
			</aside>
		</a>
	</li>`
}