(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const navMobileMenu = document.getElementById("navMobileMenu");
  navToggle.addEventListener("click", () => {
    const open = navMobileMenu.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  navMobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navMobileMenu.classList.remove("open");
      navToggle.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  /* ---------------- Active link highlighting ---------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const setActive = (id) => {
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
  };
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = prefersReducedMotion ? 0 : (entry.target.dataset.delay || i % 4) * 70;
          setTimeout(() => entry.target.classList.add("in-view"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- Experience item + progress line ---------------- */
  const expItems = document.querySelectorAll(".exp-item");
  const expTrack = document.querySelector(".exp-track");
  const expProgress = document.getElementById("expProgress");

  const expObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("in-view", e.isIntersecting)),
    { threshold: 0.4 }
  );
  expItems.forEach((el) => expObserver.observe(el));

  if (expTrack && expProgress) {
    const updateProgress = () => {
      const rect = expTrack.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
      expProgress.style.height = `${(visible / total) * 100}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* ---------------- Hero role rotator ---------------- */
  const roles = [
    "AI-powered agents",
    "SAP BTP cloud apps",
    "ML-driven products",
    "full-stack platforms",
  ];
  const roleWord = document.getElementById("roleWord");
  if (roleWord && !prefersReducedMotion) {
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % roles.length;
      roleWord.style.opacity = "0";
      roleWord.style.transform = "translateY(6px)";
      setTimeout(() => {
        roleWord.textContent = roles[idx];
        roleWord.style.transition = "opacity 300ms ease, transform 300ms ease";
        roleWord.style.opacity = "1";
        roleWord.style.transform = "translateY(0)";
      }, 260);
    }, 2600);
  }

  /* ---------------- Skills filter ---------------- */
  const tabs = document.querySelectorAll(".skills-tab");
  const skillCards = document.querySelectorAll(".skill-card");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      skillCards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat.split(" ").includes(filter);
        card.style.display = match ? "" : "none";
      });
    });
  });

  /* ---------------- Project card tilt / glow ---------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        const rx = ((y / rect.height) - 0.5) * -6;
        const ry = ((x / rect.width) - 0.5) * 6;
        card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((wrap) => {
      const el = wrap.querySelector("a, button");
      if (!el) return;
      wrap.addEventListener("mousemove", (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      wrap.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.body.classList.add("cursor-ready");
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll("a, button, .project-card, .skill-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ---------------- Blob parallax on mouse ---------------- */
  if (!isTouch && !prefersReducedMotion) {
    const blobs = document.querySelectorAll(".hero .blob, .bg-layer > .blob");
    window.addEventListener(
      "mousemove",
      (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        blobs.forEach((b, i) => {
          const strength = 10 + i * 4;
          b.style.setProperty("--px", `${dx * strength}px`);
          b.style.setProperty("--py", `${dy * strength}px`);
        });
      },
      { passive: true }
    );
  }
})();
