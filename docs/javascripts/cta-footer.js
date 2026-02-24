(function () {
  const EMAIL = "inquiry@shoug-tech.com";
  const MAIN_WEBSITE = "https://shoug-tech.com/";
  function getBase() {
    try {
      if (typeof __md_get === "function") {
        return __md_get("__base") || "";
      }
    } catch (e) { }
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

  function addHeaderCTA() {
    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return;

    if (headerInner.querySelector("a.header-cta")) return;

    const cta = document.createElement("a");
    cta.className = "header-cta";
    cta.href = `mailto:${EMAIL}`;
    cta.textContent = "Contact Us";
    cta.setAttribute("aria-label", "Contact Us");

    headerInner.appendChild(cta);
  }

  function addFooterBlock() {
    const footer = document.querySelector(".md-footer");
    if (!footer) return;

    if (footer.querySelector(".custom-footer")) return;

    const meta = footer.querySelector(".md-footer-meta");
    const block = document.createElement("section");
    block.className = "custom-footer";

    const siteName = getSiteName();

    // Links mapped to your nav (MkDocs pretty URLs)
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

          <!-- Note: mailto forms won't truly "subscribe" users; it opens their email client -->
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
            By submitting your email, you agree to be contacted regarding this website.
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
  <a class="footer-link" href="${MAIN_WEBSITE}" target="_blank" rel="noopener">
    shoug-tech.com
  </a>
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

  function run() {
    addHeaderCTA();
    addFooterBlock();
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(run);
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
