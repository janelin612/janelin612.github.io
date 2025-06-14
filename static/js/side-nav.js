(() => {
  let nav = document.createElement("ul");

  let list = Array.from(document.querySelectorAll(".content article.full h2"));
  list.forEach((node) => {
    let li = document.createElement("li");
    li.classList.add("nav2");

    let a = document.createElement("a");
    a.textContent = node.textContent;
    a.setAttribute("href", `javascript:scrollToId("${node.id}")`);

    li.appendChild(a);
    nav.appendChild(li);
  });
  document.querySelector("#side-nav").append(nav);
  initScrollListenEvent();
})();

function scrollToId(id) {
  const target = document.getElementById(id);
  target.scrollIntoView({ behavior: "smooth" });
}

function initScrollListenEvent() {
  const mainElement = document.querySelector("main");
  mainElement.addEventListener(
    "scroll",
    debounce(() => {
      const halfScreen = window.screen.height / 2;
      const position = mainElement.scrollTop + halfScreen;
      const h2PositionArray = Array.from(
        document.querySelectorAll(".content article.full h2")
      ).map((node) => node.offsetTop);

      const chapterIndex = (() => {
        for (let i = 0; i < h2PositionArray.length; i++) {
          if (position < h2PositionArray[i]) return i;
        }
        return h2PositionArray.length;
      })();

      document
        .querySelectorAll(`#side-nav li`)
        .forEach((el, index) =>
          el.classList.toggle("active", index == chapterIndex - 1)
        );
    }, 250) //ms
  );
}

function debounce(func, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
