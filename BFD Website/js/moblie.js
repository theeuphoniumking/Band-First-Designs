const menuBtn = document.querySelector(".menuToggle");
const nav = document.querySelector("nav");
const icon = menuBtn.querySelector("span");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");

  if (nav.classList.contains("active")) {
    icon.textContent = "close";
  } else {
    icon.textContent = "menu";
  }
});
