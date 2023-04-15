
const tabs = document.querySelector(".tabs");
const tabButton = document.querySelectorAll(".navTab");
const content = document.querySelectorAll(".content");

tabs.addEventListener("click", e => {
	const id = e.target.dataset.toggle;
	if (id) {
		tabButton.forEach(navTab => {
			navTab.classList.remove("active");
		});
		e.target.classList.add("active");
	}
	content.forEach(content => {
		content.classList.remove("active");
	});

	const element = document.getElementById(id);
	element.classList.add("active");
});
