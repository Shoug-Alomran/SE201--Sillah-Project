(function () {
  const EMAIL = "inquiry@shoug-tech.com";
  const MAIN_WEBSITE = "https://shoug-tech.com/";
  const LS_PRIMARY = "sillah_hide_primary_nav";
  const LS_TOC = "sillah_hide_toc";

  function getBase() {
    try {
      if (typeof __md_get === "function") {
        return __md_get("__base") || "";
      }
    } catch (e) {}
    return "";
  }

  function url(path) {
    const base = getBase();
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  function getSiteName() {
    const titleEl = document.querySelector(".md-header__title .md-ellipsis");
    return titleEl ? titleEl.textContent.trim() : "Website";
  }

  function getBool(key) {
    try {
      return localStorage.getItem(key) === "1";
    } catch (e) {
      return false;
    }
  }

  function setBool(key, val) {
    try {
      localStorage.setItem(key, val ? "1" : "0");
    } catch (e) {}
  }

  function applySidebarState() {
    const hidePrimary = getBool(LS_PRIMARY);
    const hideToc = getBool(LS_TOC);

    document.body.classList.toggle("hide-primary-nav", hidePrimary);
    document.body.classList.toggle("hide-toc-nav", hideToc);

    const primaryBtn = document.querySelector(".layout-toggle-btn[data-target='primary']");
    const tocBtn = document.querySelector(".layout-toggle-btn[data-target='toc']");

    if (primaryBtn) {
      primaryBtn.setAttribute("aria-pressed", hidePrimary ? "true" : "false");
      primaryBtn.classList.toggle("active", !hidePrimary);
      primaryBtn.querySelector(".btn-label").textContent = hidePrimary ? "Show Nav" : "Hide Nav";
    }

    if (tocBtn) {
      tocBtn.setAttribute("aria-pressed", hideToc ? "true" : "false");
      tocBtn.classList.toggle("active", !hideToc);
      tocBtn.querySelector(".btn-label").textContent = hideToc ? "Show TOC" : "Hide TOC";
    }
  }

  function buildToggleButton(target, defaultText) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "layout-toggle-btn active";
    btn.dataset.target = target;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `<span class="btn-label">${defaultText}</span>`;

    btn.addEventListener("click", () => {
      if (target === "primary") {
        setBool(LS_PRIMARY, !getBool(LS_PRIMARY));
      } else {
        setBool(LS_TOC, !getBool(LS_TOC));
      }
      applySidebarState();
    });

    return btn;
  }

  function addHeaderControls() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return;

    let controls = headerInner.querySelector(".header-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "header-controls";
      headerInner.appendChild(controls);
    }

    if (!controls.querySelector(".layout-toggle-btn[data-target='primary']")) {
      controls.appendChild(buildToggleButton("primary", "Hide Nav"));
    }

    if (!controls.querySelector(".layout-toggle-btn[data-target='toc']")) {
      controls.appendChild(buildToggleButton("toc", "Hide TOC"));
    }

    if (!controls.querySelector("a.header-cta")) {
      const cta = document.createElement("a");
      cta.className = "header-cta";
      cta.href = `mailto:${EMAIL}`;
      cta.textContent = "Contact Us";
      cta.setAttribute("aria-label", "Contact Us");
      controls.appendChild(cta);
    }

    applySidebarState();
  }

  function stripMaterialCredit() {
    document.querySelectorAll(".md-copyright").forEach((el) => {
      const highlight = el.querySelector(".md-copyright__highlight");
      if (!highlight) return;
      const wrapper = document.createElement("div");
      wrapper.className = "md-copyright__highlight";
      wrapper.textContent = highlight.textContent.trim();
      el.innerHTML = "";
      el.appendChild(wrapper);
    });
  }

  function addFooterBlock() {
    const footer = document.querySelector(".md-footer");
    if (!footer) return;

    if (footer.querySelector(".custom-footer")) return;

    const meta = footer.querySelector(".md-footer-meta");
    const block = document.createElement("section");
    block.className = "custom-footer";

    const siteName = getSiteName();

    const LINKS = {
      home: url(""),
      introduction: url("introduction/"),
      requirements: url("requirements/"),
      design: url("design/"),
      prototype: url("prototype/"),
      conclusion: url("conclusion/"),
      references: url("references/"),
      team: url("team/"),
      report: url("report/report/"),
      codeMain: url("code/main/"),
      copyright: url("copyright/"),
    };

    block.innerHTML = `
      <div class="custom-footer__inner">
        <div class="custom-footer__left">
          <div class="custom-footer__brand">${siteName}</div>
          <div class="custom-footer__title">Stay Updated</div>

          <form class="custom-footer__form" action="mailto:${EMAIL}" method="get">
            <input
              class="custom-footer__input"
              type="email"
              name="email"
              placeholder="Email address"
              autocomplete="email"
              required
            >
            <button class="custom-footer__button" type="submit">
              Subscribe
            </button>
          </form>

          <div class="custom-footer__note">
            Early information supports disease prevention. Stay informed about updates.
          </div>
        </div>

        <div class="custom-footer__right">
          <div class="footer-col">
            <div class="footer-col__title">Pages</div>
            <a class="footer-link" href="${LINKS.home}">Home</a>
            <a class="footer-link" href="${LINKS.introduction}">Introduction</a>
            <a class="footer-link" href="${LINKS.requirements}">Requirements</a>
            <a class="footer-link" href="${LINKS.design}">Design</a>
            <a class="footer-link" href="${LINKS.prototype}">Prototype &amp; Testing</a>
            <a class="footer-link" href="${LINKS.conclusion}">Conclusion</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">More</div>
            <a class="footer-link" href="${LINKS.references}">References</a>
            <a class="footer-link" href="${LINKS.team}">Team</a>
            <a class="footer-link" href="${LINKS.copyright}">Copyright</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">Website</div>
            <a class="footer-link" href="${MAIN_WEBSITE}" target="_blank" rel="noopener">shoug-tech.com</a>
          </div>

          <div class="footer-col">
            <div class="footer-col__title">Resources</div>
            <a class="footer-link" href="${LINKS.report}">Report (View &amp; Download)</a>
            <a class="footer-link" href="${LINKS.codeMain}">Code (Main)</a>
            <a class="footer-link" href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
        </div>
      </div>
    `;

    if (meta) footer.insertBefore(block, meta);
    else footer.prepend(block);
  }

  function wrapInCollapsible(targetEl, title, kindClass) {
    if (!targetEl || targetEl.closest(".collapsible-block")) return;

    const details = document.createElement("details");
    details.className = `collapsible-block ${kindClass}`;
    details.open = false;

    const summary = document.createElement("summary");
    summary.className = "collapsible-summary";
    summary.textContent = title;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "collapsible-body";
    details.appendChild(body);

    targetEl.parentNode.insertBefore(details, targetEl);
    body.appendChild(targetEl);
  }

  function makeContentCollapsible() {
    const content = document.querySelector(".md-content__inner");
    if (!content) return;

    const codeBlocks = Array.from(content.querySelectorAll("pre"));
    codeBlocks.forEach((pre, idx) => {
      if (pre.closest(".collapsible-block")) return;
      wrapInCollapsible(pre, `Code Block ${idx + 1}`, "collapsible-code");
    });

    const images = Array.from(content.querySelectorAll("img"));
    let imageCounter = 0;
    images.forEach((img) => {
      if (img.closest(".collapsible-block")) return;
      if (img.closest(".md-header") || img.closest(".custom-footer")) return;

      imageCounter += 1;
      const target = img.closest("figure") || img;
      wrapInCollapsible(target, `Image ${imageCounter}`, "collapsible-image");
    });
  }

  function run() {
    addHeaderControls();
    addFooterBlock();
    stripMaterialCredit();
    applySidebarState();
    makeContentCollapsible();
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(run);
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
