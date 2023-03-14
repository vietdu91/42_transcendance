// var menuItems = document.querySelectorAll("#menu-items > a");

// menuItems.forEach(function(item) {
// 	item.addEventListener("mouseover", function() {
// 		var index = parseInt(this.classList[1].substr(4)) - 1;
// 		var images = ["img/hell.jpg", "img/image2.jpg", "img/image3.jpg", "img/image4.jpg"];
// 		document.getElementById("menu-background-pattern").style.backgroundImage = "url(" + images[index] + ")";
// 	});
// });

link_test = "./img/south_park_town.jpg"
function changeImg(link) {
	link_test = link
}

function getImg(){
	return (link_test)
}
