var Site = {}
document.addEventListener('DOMContentLoaded', init)


function init(){

	Site.container = document.getElementById("container")
	
	Site.items = [
		{
			title: "title",
			subtitle: "subtitle",
			url: "/feral",
			imagepath: "/files/",
			style: {
				left : "2vw",
				top: "50vh"
			}
		}
	]

	Site.loadingItems(Site.items, Site.container)

}

Site.loadingItems = (items, container) => {
	items.forEach((item, index) => {	
		container.insertAdjacentHTML('beforeend', Site.itemComponent(item, index))
	})
}

Site.itemComponent = (item, index) => {
	return `<li class="item" id="item-${index}" style="left: ${item.style.left}; top: ${item.style.top};">
		<a href="${item.url}">
			<img src="${item.imagepath}">
			<aside>
				<h1>${item.title}</h1>
				<h2>${item.subtitle}</h2>
			</aside>
		</a>
	</li>`
}