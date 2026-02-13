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

/* ----- AI Summarize feature (frontend-only simulation) ----- */

document.addEventListener("DOMContentLoaded", () => {
  const SUMMARY_MIN_LENGTH = 120;
  const SUMMARY_MAX_CHARS = 200;
  const summaryCache = new Map();

  const FILLER_WORDS = new Set([
    "the", "a", "an", "very", "really", "just", "actually", "basically",
    "literally", "so", "quite", "rather", "somewhat", "perhaps", "maybe",
    "often", "sometimes", "only", "even", "also", "well", "now", "oh"
  ]);

  const STOP_WORDS = new Set([
    ...FILLER_WORDS, "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "to", "of", "in",
    "for", "on", "with", "at", "by", "from", "as", "it", "its", "or", "and",
    "but", "if", "then", "else", "when", "this", "that", "these", "those",
    "i", "you", "he", "she", "we", "they", "what", "which", "who", "whom"
  ]);

  function normalizeWord(w) {
    return w.toLowerCase().replace(/\W/g, "");
  }

  function generateSummary(text) {
    const raw = text.trim();
    if (raw.length <= SUMMARY_MAX_CHARS) return raw;

    const sentences = raw.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
    if (sentences.length === 0) sentences.push(raw);

    function removeFiller(str) {
      return str.split(/\s+/).filter((w) => !FILLER_WORDS.has(normalizeWord(w))).join(" ");
    }

    function scoreSentence(s) {
      const cleaned = removeFiller(s);
      const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
      const keywordScore = words.reduce(
        (acc, w) => acc + (w.length > 4 ? 2 : w.length > 2 ? 1 : 0),
        0
      );
      const len = words.length;
      return len * 2 + keywordScore;
    }

    let best = null;
    let bestScore = -1;
    for (const s of sentences) {
      const trimmed = s.trim();
      if (trimmed.length < 15) continue;
      const score = scoreSentence(trimmed);
      if (score > bestScore) {
        const candidate = trimmed.slice(0, SUMMARY_MAX_CHARS);
        if (candidate.length >= 20) {
          best = candidate;
          bestScore = score;
        }
      }
    }
    if (best) return best;

    const words = raw.split(/\s+/).filter((w) => !STOP_WORDS.has(normalizeWord(w)) && w.length > 0);
    const take = Math.min(25, Math.max(20, Math.ceil(words.length / 3)));
    const summary = words.slice(0, take).join(" ").trim();
    return (summary.length > SUMMARY_MAX_CHARS ? summary.slice(0, SUMMARY_MAX_CHARS - 1) + "…" : summary) || raw.slice(0, SUMMARY_MAX_CHARS);
  }

  function createSummarizeButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "action action-summarize";
    btn.setAttribute("aria-label", "AI Summarize");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></g></svg>';
    return btn;
  }

  function initSummarizeButtons() {
    const feed = document.querySelector(".feed");
    if (!feed) return;
    feed.querySelectorAll(".post").forEach((post) => {
      const textEl = post.querySelector(".post-text");
      if (!textEl || textEl.textContent.trim().length <= SUMMARY_MIN_LENGTH) return;
      post.classList.add("long-tweet");
      if (post.querySelector(".action-summarize")) return;
      const btn = createSummarizeButton();
      post.appendChild(btn);
    });
  }

  function handleSummarizeClick(btn) {
    const post = btn.closest(".post");
    const postMain = post.querySelector(".post-main");
    const postActions = post.querySelector(".post-actions");
    const textEl = post.querySelector(".post-text");
    const id = post.id || "post-" + (post.getAttribute("data-post-id") || Math.random().toString(36).slice(2));
    if (!postMain || !postActions || !textEl) return;

    const cached = summaryCache.get(id);
    if (cached) {
      cached.element.classList.toggle("hidden");
      return;
    }

    if (post.getAttribute("data-summarize-loading") === "true") return;

    const loadingEl = document.createElement("div");
    loadingEl.className = "ai-summary-loading";
    loadingEl.setAttribute("aria-live", "polite");
    loadingEl.innerHTML = 'Analyzing<span class="ai-summary-loading-dots">…</span>';
    postMain.appendChild(loadingEl);
    post.setAttribute("data-summarize-loading", "true");

    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const text = textEl.textContent.trim();
      const summaryText = generateSummary(text);
      loadingEl.remove();
      post.removeAttribute("data-summarize-loading");

      const box = document.createElement("div");
      box.className = "ai-summary";
      box.setAttribute("aria-label", "AI-generated summary");
      box.innerHTML =
        '<span class="ai-summary-label">AI Summary</span><span class="ai-summary-text"></span>';
      box.querySelector(".ai-summary-text").textContent = summaryText;
      postMain.appendChild(box);
      summaryCache.set(id, { element: box, summaryText });
    }, delay);
  }

  const feed = document.querySelector(".feed");
  if (feed) {
    feed.addEventListener("click", (e) => {
      const btn = e.target.closest(".action-summarize");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      handleSummarizeClick(btn);
    });
    feed.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const btn = e.target.closest(".action-summarize");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      handleSummarizeClick(btn);
    });
  }

  initSummarizeButtons();
});


























