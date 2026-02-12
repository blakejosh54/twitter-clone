// Tweet input resize function
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
