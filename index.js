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

/* ----- AI Bookmarks feature ----- */

const BOOKMARKS_STORAGE_KEY = "bookmarkedPosts";

function getBookmarkedIds() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setBookmarkedIds(ids) {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids));
}

function applyBookmarkedState() {
  const ids = getBookmarkedIds();
  document.querySelectorAll(".feed .post").forEach((post) => {
    const id = post.id;
    if (!id) return;
    const btn = post.querySelector(".action-bookmark");
    if (!btn) return;
    if (ids.includes(id)) {
      btn.classList.add("bookmarked");
    } else {
      btn.classList.remove("bookmarked");
    }
  });
}

function toggleBookmark(postEl) {
  const id = postEl.id;
  if (!id) return;
  const ids = getBookmarkedIds();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
  } else {
    ids.splice(idx, 1);
  }
  setBookmarkedIds(ids);
  const btn = postEl.querySelector(".action-bookmark");
  if (btn) {
    btn.classList.toggle("bookmarked", ids.includes(id));
  }
}

function openBookmarksModal() {
  const overlay = document.getElementById("bookmarksModalOverlay");
  const listEl = document.querySelector(".bookmarks-modal-list");
  const emptyEl = document.querySelector(".bookmarks-modal-empty");
  if (!overlay || !listEl) return;

  const ids = getBookmarkedIds();
  listEl.innerHTML = "";

  if (ids.length === 0) {
    if (emptyEl) {
      emptyEl.style.display = "block";
    }
  } else {
    if (emptyEl) {
      emptyEl.style.display = "none";
    }
    ids.forEach((postId) => {
      const post = document.getElementById(postId);
      if (!post) return;
      const nameEl = post.querySelector(".post-author .name");
      const handleEl = post.querySelector(".post-author .handle");
      const textEl = post.querySelector(".post-text");
      const name = nameEl ? nameEl.textContent.trim() : "Unknown";
      const handle = handleEl ? handleEl.textContent.trim() : "";
      let text = textEl ? textEl.textContent.trim() : "";
      if (text.length > 120) {
        text = text.slice(0, 117) + "...";
      }
      const item = document.createElement("button");
      item.type = "button";
      item.className = "bookmark-modal-item";
      item.setAttribute("data-post-id", postId);
      item.innerHTML =
        '<span class="bookmark-modal-item-name">' +
        escapeHtml(name) +
        "</span>" +
        (handle ? '<span class="bookmark-modal-item-handle">' + escapeHtml(handle) + "</span>" : "") +
        (text ? '<span class="bookmark-modal-item-text">' + escapeHtml(text) + "</span>" : "");
      listEl.appendChild(item);
    });
  }

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function closeBookmarksModal() {
  const overlay = document.getElementById("bookmarksModalOverlay");
  if (overlay) {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }
}

function scrollToPostAndHighlight(postId) {
  const post = document.getElementById(postId);
  if (!post) return;
  post.scrollIntoView({ behavior: "smooth", block: "center" });
  post.classList.add("post-highlight");
  setTimeout(() => {
    post.classList.remove("post-highlight");
  }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
  applyBookmarkedState();

  const feed = document.querySelector(".feed");
  if (feed) {
    feed.addEventListener("click", (e) => {
      const btn = e.target.closest(".action-bookmark");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const post = btn.closest(".post");
      if (post) {
        toggleBookmark(post);
      }
    });
  }

  document.querySelectorAll("[data-open-bookmarks]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openBookmarksModal();
    });
  });

  document.querySelectorAll(".js-open-bookmarks").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openBookmarksModal();
    });
  });

  const overlay = document.getElementById("bookmarksModalOverlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeBookmarksModal();
      }
    });
  }

  const closeBtn = document.querySelector(".bookmarks-modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeBookmarksModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.getElementById("bookmarksModalOverlay");
      if (overlay && overlay.classList.contains("is-open")) {
        closeBookmarksModal();
      }
    }
  });

  const listEl = document.querySelector(".bookmarks-modal-list");
  if (listEl) {
    listEl.addEventListener("click", (e) => {
      const item = e.target.closest(".bookmark-modal-item");
      if (!item) return;
      const postId = item.getAttribute("data-post-id");
      if (postId) {
        closeBookmarksModal();
        scrollToPostAndHighlight(postId);
      }
    });
  }
});





























