(function () {
  function markTargets() {
    var content = document.querySelector('.md-content__inner');
    if (!content) return;

    document.querySelectorAll('[data-sillah-reveal]').forEach(function (el) {
      delete el.dataset.sillahReveal;
      delete el.dataset.sillahRevealed;
    });

    var targets = content.querySelectorAll(
      'h2, h3, .admonition, table:not([class]), details, .sillah-hero'
    );
    targets.forEach(function (el) {
      el.dataset.sillahReveal = '1';
    });
  }

  function reveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-sillah-reveal]').forEach(function (el) {
        el.dataset.sillahRevealed = '1';
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.dataset.sillahRevealed = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-sillah-reveal]:not([data-sillah-revealed])').forEach(function (el) {
      observer.observe(el);
    });

    // Safety net: guarantee everything is readable even if the observer
    // logic above ever misses an element (e.g. an unusually tall one).
    setTimeout(function () {
      document.querySelectorAll('[data-sillah-reveal]:not([data-sillah-revealed])').forEach(function (el) {
        el.dataset.sillahRevealed = '1';
      });
    }, 4000);
  }

  function setupProgressBar() {
    var bar = document.getElementById('sillah-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sillah-progress';
      document.body.appendChild(bar);
    }

    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    }

    if (!bar.dataset.bound) {
      bar.dataset.bound = '1';
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    }
    update();
  }

  function init() {
    markTargets();
    reveal();
    setupProgressBar();
  }

  if (window.document$) {
    // Material for MkDocs instant-navigation observable
    window.document$.subscribe(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
