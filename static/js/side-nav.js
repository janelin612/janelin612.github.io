(() => {
  let nav = document.createElement("ul");

  let list = Array.from(document.querySelectorAll(".content article.full h2"));
  list.forEach((node) => {
    let li = document.createElement("li");
    li.classList.add("nav2");

    let a = document.createElement("a");
    a.textContent = node.textContent;
    a.setAttribute("href", "#" + node.id);

    li.appendChild(a);
    nav.appendChild(li);
  });
  document.querySelector("#side-nav").append(nav);
})();
