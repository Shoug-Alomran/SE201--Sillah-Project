(function () {
  var BLOCKED_PARAMS = [
    "q",
    "query",
    "search",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];

  function applySeoGuards() {
    var url = new URL(window.location.href);
    var hasBlockedParam = BLOCKED_PARAMS.some(function (key) {
      return url.searchParams.has(key);
    });

    if (!hasBlockedParam) return;

    var cleanUrl = url.origin + url.pathname;
    var canonical = document.querySelector('link[rel="canonical"]');
    var robots = document.querySelector('meta[name="robots"]');

    if (canonical) canonical.href = cleanUrl;

    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,follow";

    if (
      url.searchParams.size === 1 &&
      ((url.searchParams.has("q") && !url.searchParams.get("q")) ||
        (url.searchParams.has("query") && !url.searchParams.get("query")) ||
        (url.searchParams.has("search") && !url.searchParams.get("search")))
    ) {
      history.replaceState({}, document.title, cleanUrl + url.hash);
    }
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(applySeoGuards);
  } else {
    document.addEventListener("DOMContentLoaded", applySeoGuards);
  }
})();
