/* ============================================================
   MAKUTI THATCH ROOFING — Main JS (vanilla, no dependencies)
   ============================================================ */
(function () {
  "use strict";

  var WA_NUMBER = "254733246274"; // 0733 246 274

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("done");
    }, 500);
  });
  // Failsafe: never trap the user behind the loader
  setTimeout(function () {
    var p = document.getElementById("preloader");
    if (p) p.classList.add("done");
  }, 3500);

  /* ---------- Navbar scroll state ---------- */
  var nav = document.querySelector(".navbar");
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* ---------- Mini-window slideshows (hero RHS) ---------- */
  document.querySelectorAll(".mini-win").forEach(function (win, wi) {
    var slides = win.querySelectorAll(".win-screen img");
    var dotsBox = win.querySelector(".win-dots");
    if (!slides.length) return;
    var idx = 0;

    slides.forEach(function (_, i) {
      var d = document.createElement("i");
      if (i === 0) d.classList.add("on");
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll("i");

    function show(n) {
      slides[idx].classList.remove("active");
      dots[idx].classList.remove("on");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("active");
      dots[idx].classList.add("on");
      var cap = win.querySelector(".win-cap");
      if (cap && slides[idx].dataset.cap) cap.textContent = slides[idx].dataset.cap;
    }
    // Stagger each window so they don't flip in sync
    setInterval(function () { show(idx + 1); }, 3400 + wi * 900);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Testimonials slider ---------- */
  var testis = document.querySelectorAll(".testi");
  var tDotsBox = document.getElementById("tDots");
  var tIdx = 0, tTimer = null;
  function tShow(n) {
    if (!testis.length) return;
    testis[tIdx].classList.remove("active");
    if (tDotsBox) tDotsBox.children[tIdx].classList.remove("on");
    tIdx = (n + testis.length) % testis.length;
    testis[tIdx].classList.add("active");
    if (tDotsBox) tDotsBox.children[tIdx].classList.add("on");
  }
  function tAuto() {
    clearInterval(tTimer);
    tTimer = setInterval(function () { tShow(tIdx + 1); }, 5500);
  }
  if (testis.length) {
    if (tDotsBox) {
      testis.forEach(function (_, i) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Show testimonial " + (i + 1));
        if (i === 0) b.classList.add("on");
        b.addEventListener("click", function () { tShow(i); tAuto(); });
        tDotsBox.appendChild(b);
      });
    }
    var prev = document.getElementById("tPrev");
    var next = document.getElementById("tNext");
    if (prev) prev.addEventListener("click", function () { tShow(tIdx - 1); tAuto(); });
    if (next) next.addEventListener("click", function () { tShow(tIdx + 1); tAuto(); });
    tAuto();
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var gCards = document.querySelectorAll(".g-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.dataset.filter;
      gCards.forEach(function (card) {
        var match = f === "all" || card.dataset.cat === f;
        card.classList.toggle("hide", !match);
        if (match) {
          card.style.opacity = "0";
          card.style.transform = "translateY(14px)";
          setTimeout(function () {
            card.style.opacity = "1";
            card.style.transform = "none";
          }, 60);
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbTitle = document.getElementById("lbTitle");
  var lbDesc = document.getElementById("lbDesc");
  var lbIdx = 0;

  function visibleCards() {
    return Array.prototype.filter.call(gCards, function (c) {
      return !c.classList.contains("hide");
    });
  }
  function lbShow(card) {
    var img = card.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = card.dataset.title || img.alt;
    lbDesc.textContent = card.dataset.desc || "";
    var reqBtn = document.getElementById("lbQuote");
    if (reqBtn) reqBtn.dataset.project = card.dataset.title || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function lbNav(dir) {
    var vis = visibleCards();
    if (!vis.length) return;
    lbIdx = (lbIdx + dir + vis.length) % vis.length;
    lbShow(vis[lbIdx]);
  }
  if (lb) {
    gCards.forEach(function (card) {
      card.querySelector(".ph").addEventListener("click", function () {
        lbIdx = visibleCards().indexOf(card);
        lbShow(card);
      });
    });
    document.getElementById("lbClose").addEventListener("click", closeLb);
    document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); lbNav(-1); });
    document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); lbNav(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") lbNav(-1);
      if (e.key === "ArrowRight") lbNav(1);
    });
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- Quote modal ---------- */
  var modal = document.getElementById("quoteModal");
  var projectInput = document.getElementById("qProject");
  function openQuote(project) {
    if (projectInput && project) {
      // Try to match a select option, else put it in the message
      var msg = document.getElementById("qMsg");
      var matched = false;
      Array.prototype.forEach.call(projectInput.options, function (o) {
        if (o.text.toLowerCase().indexOf(project.toLowerCase().split(" ")[0]) !== -1) {
          projectInput.value = o.value; matched = true;
        }
      });
      if (!matched && msg && !msg.value) msg.value = "I love your project: " + project + ". I want something similar.";
    }
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeQuote() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (modal) {
    document.querySelectorAll("[data-quote]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (lb) closeLb();
        openQuote(btn.dataset.project || btn.dataset.quote || "");
      });
    });
    document.getElementById("modalClose").addEventListener("click", closeQuote);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeQuote(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeQuote();
    });

    /* ----- Quote form -> WhatsApp ----- */
    document.getElementById("quoteForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var lines = [
        "*NEW QUOTATION REQUEST*",
        "--------------------------",
        "*Name:* " + v("qName"),
        "*Phone:* " + v("qPhone"),
        "*Project:* " + v("qProject"),
        "*Location:* " + v("qLocation"),
        "*Approx. Size:* " + (v("qSize") || "Not specified"),
        "",
        "*Details:*",
        v("qMsg") || "Please send me a quotation."
      ];
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank");
      closeQuote();
      this.reset();
    });
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  var cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var lines = [
        "*WEBSITE ENQUIRY — Makuti Thatch Roofing*",
        "--------------------------",
        "*Name:* " + v("cName"),
        "*Phone:* " + v("cPhone"),
        "*Subject:* " + v("cSubject"),
        "",
        v("cMsg")
      ];
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
      this.reset();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
