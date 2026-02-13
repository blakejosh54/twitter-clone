// tweet input resize function
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector(".composer-input");

  if (!textarea) return;

  const autoGrow = () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  textarea.addEventListener("input", autoGrow);

  autoGrow();
});




// navbar, topbar and post button slide away function

document.addEventListener("DOMContentLoaded", () => {
  const topbar = document.querySelector(".topbar");
  const bottomNav = document.querySelector(".mobile-nav");
  const fab = document.querySelector(".fab-post");

  let lastScrollY = window.scrollY;
  let scrollAccumulator = 0;
  const threshold = 40;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    scrollAccumulator += scrollDifference;

    // scroll down
    if (scrollAccumulator > threshold) {
      topbar?.classList.add("hide");
      bottomNav?.classList.add("hide");
      fab?.classList.add("hide");

      scrollAccumulator = 0;
    }

    // scroll up
    if (scrollAccumulator < -threshold) {
      topbar?.classList.remove("hide");
      bottomNav?.classList.remove("hide");
      fab?.classList.remove("hide");

      scrollAccumulator = 0;
    }
    lastScrollY = currentScrollY;
  });
});





// manual theme button feature

document.addEventListener("DOMContentLoaded", () => {
  const account = document.querySelector(".account");
  const mobileAvatar = document.querySelector(".mobile-avatar");
  const menu = document.getElementById("accountMenu");
  const themeBtn = document.getElementById("themeToggleBtn");

  function toggleMenu(e) {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = menu.offsetHeight;

    let left = rect.right + 8;
    let top = rect.top;

    if (left + menuWidth > window.innerWidth) {
      left = rect.left - menuWidth - 8;
    }

    if (top + menuHeight > window.innerHeight) {
      top = window.innerHeight - menuHeight - 10;
    }

    if (top < 10) {
      top = 10;
    }

    menu.style.left = left + "px";
    menu.style.top = top + "px";

    menu.classList.toggle("show");
  }

  if (account) account.addEventListener("click", toggleMenu);
  if (mobileAvatar) mobileAvatar.addEventListener("click", toggleMenu);

  document.addEventListener("click", () => {
    menu.classList.remove("show");
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
    });
  }
});