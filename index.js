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