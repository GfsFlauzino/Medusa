document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSearch();
  initCopyCode();
  initTopLink();
});

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function initSearch() {
  const index = window.MEDUSA_SEARCH_INDEX || [];
  document.querySelectorAll(".search-box").forEach((box) => {
    const input = box.querySelector("input");
    const results = box.querySelector(".search-results");
    if (!input || !results) return;

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.classList.remove("open");
        results.innerHTML = "";
        return;
      }

      const matches = index.filter((item) =>
        (item.title + " " + item.excerpt + " " + item.tags.join(" "))
          .toLowerCase()
          .includes(q)
      );

      renderResults(results, matches);
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) results.classList.add("open");
    });

    document.addEventListener("click", (e) => {
      if (!box.contains(e.target)) results.classList.remove("open");
    });
  });
}

function renderResults(container, matches) {
  container.innerHTML = "";
  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "search-empty";
    empty.textContent = "Nenhum resultado encontrado.";
    container.appendChild(empty);
    container.classList.add("open");
    return;
  }

  matches.slice(0, 8).forEach((item) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.innerHTML = `<div class="result-title">${item.title}</div><div class="result-meta">${item.category}</div>`;
    container.appendChild(a);
  });
  container.classList.add("open");
}

function initCopyCode() {
  document.querySelectorAll(".post-content pre > code").forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const button = document.createElement("button");
    button.className = "copy-code";
    button.type = "button";
    button.textContent = "copy";

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
      } catch (err) {
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }
      button.textContent = "copied!";
      setTimeout(() => (button.textContent = "copy"), 2000);
    });

    pre.appendChild(button);
  });
}

function initTopLink() {
  const link = document.getElementById("top-link");
  if (!link) return;

  window.addEventListener("scroll", () => {
    link.classList.toggle("visible", window.scrollY > 600);
  });

  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
