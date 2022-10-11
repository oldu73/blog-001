console.log("topbar.js");

const iconMobile = document.querySelector(".header-menu-icon");
const headerMenu = document.querySelector(".header-menu");
let isMenuOpen = false;
let mobileMenuDom;

const closeMenu = () => {
  mobileMenuDom.classList.remove("open");
};

const createMobileMenu = () => {
  mobileMenuDom = document.createElement("div");
  mobileMenuDom.classList.add("mobile-menu");
  mobileMenuDom.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  mobileMenuDom.append(headerMenu.querySelector("ul").cloneNode(true));
  headerMenu.append(mobileMenuDom);
};

const openMenu = () => {
  if (mobileMenuDom) {
  } else {
    createMobileMenu();
  }
  mobileMenuDom.classList.add("open");
};

const toggleMobileMenu = (event) => {
  console.log(event);
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
  isMenuOpen = !isMenuOpen;
};

iconMobile.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMobileMenu();
});

window.addEventListener("click", () => {
  if (isMenuOpen) {
    toggleMobileMenu();
  }
});

window.addEventListener("resize", (event) => {
  console.log(window.innerWidth);
  if (window.innerWidth > 480 && isMenuOpen) {
    toggleMobileMenu();
  }
});
