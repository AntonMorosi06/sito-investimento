(() => {
    "use strict";

    // =========================================================
    // HELPERS
    // =========================================================
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const showToast = (message = "Action completed") => {
        const toast = $("toast");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    };

    // Expose toast globally if needed by other files
    window.showMicroBotToast = showToast;

    // =========================================================
    // DOM
    // =========================================================
    const preloader = $("preloader");
    const preloaderPercent = $("preloaderPercent");
    const preloaderStatus = $("preloaderStatus");

    const navbar = $("navbar");
    const menuBtn = $("menuBtn");
    const mobileMenu = $("mobileMenu");
    const themeToggle = $("themeToggle");
    const backToTop = $("backToTop");

    const cursor = $("cursor");
    const cursorDot = $("cursorDot");

    const navLinks = $$("[data-nav]");
    const mobileLinks = $$("[data-ml]");
    const hoverTargets = $$("[data-hover]");
    const revealEls = $$(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate");

    // =========================================================
    // PRELOADER
    // =========================================================
    const preloadMessages = [
        "Inizializzazione sistema...",
        "Caricamento moduli di controllo...",
        "Sincronizzazione rete MicroBot...",
        "Avvio interfacce visive...",
        "Calibrazione dashboard...",
        "Sistema pronto."
    ];

    const runPreloader = () => {
        if (!preloader || !preloaderPercent || !preloaderStatus) return;

        let progress = 0;
        let messageIndex = 0;

        const statusTimer = setInterval(() => {
            messageIndex = Math.min(messageIndex + 1, preloadMessages.length - 1);
            preloaderStatus.textContent = preloadMessages[messageIndex];
        }, 550);

        const progressTimer = setInterval(() => {
            progress += Math.floor(Math.random() * 6) + 2;
            progress = clamp(progress, 0, 100);
            preloaderPercent.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(progressTimer);
                clearInterval(statusTimer);

                preloaderStatus.textContent = "Sistema pronto.";

                setTimeout(() => {
                    preloader.classList.add("hidden");
                    document.body.classList.add("site-loaded");
                }, 500);
            }
        }, 120);

        // fallback in case page is cached or too fast
        setTimeout(() => {
            if (!preloader.classList.contains("hidden")) {
                clearInterval(progressTimer);
                clearInterval(statusTimer);
                preloaderPercent.textContent = "100%";
                preloaderStatus.textContent = "Sistema pronto.";
                preloader.classList.add("hidden");
                document.body.classList.add("site-loaded");
            }
        }, 4200);
    };

    // =========================================================
    // THEME TOGGLE
    // =========================================================
    const initTheme = () => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem("microbot-theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            root.setAttribute("data-theme", savedTheme);
        }

        if (!themeToggle) return;

        themeToggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            localStorage.setItem("microbot-theme", next);
            showToast(`Theme: ${next}`);
        });
    };

    // =========================================================
    // MOBILE MENU
    // =========================================================
    const initMobileMenu = () => {
        if (!menuBtn || !mobileMenu) return;

        const closeMenu = () => {
            mobileMenu.classList.remove("open");
            menuBtn.classList.remove("open");
            document.body.classList.remove("menu-open");
        };

        const openMenu = () => {
            mobileMenu.classList.add("open");
            menuBtn.classList.add("open");
            document.body.classList.add("menu-open");
        };

        menuBtn.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.contains("open");
            if (isOpen) closeMenu();
            else openMenu();
        });

        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    };

    // =========================================================
    // NAVBAR SCROLL BEHAVIOR
    // =========================================================
    const initNavbar = () => {
        if (!navbar) return;

        let lastScrollY = window.scrollY;

        const updateNavbar = () => {
            const currentY = window.scrollY;

            if (currentY > 40) navbar.classList.add("scrolled");
            else navbar.classList.remove("scrolled");

            if (currentY > lastScrollY && currentY > 140) {
                navbar.classList.add("nav-hidden");
            } else {
                navbar.classList.remove("nav-hidden");
            }

            lastScrollY = currentY;
        };

        window.addEventListener("scroll", updateNavbar, { passive: true });
        updateNavbar();
    };

    // =========================================================
    // ACTIVE NAV LINKS
    // =========================================================
    const initSectionSpy = () => {
        const sections = $$("section[id]");

        if (!sections.length || !navLinks.length) return;

        const setActive = (id) => {
            navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                if (href === `#${id}`) link.classList.add("active");
                else link.classList.remove("active");
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-35% 0px -45% 0px",
                threshold: 0.01
            }
        );

        sections.forEach((section) => observer.observe(section));
    };

    // =========================================================
    // REVEAL ON SCROLL
    // =========================================================
    const initReveal = () => {
        if (!revealEls.length) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealEls.forEach((el) => observer.observe(el));
    };

    // =========================================================
    // BACK TO TOP
    // =========================================================
    const initBackToTop = () => {
        if (!backToTop) return;

        const updateVisibility = () => {
            if (window.scrollY > 500) backToTop.classList.add("visible");
            else backToTop.classList.remove("visible");
        };

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", updateVisibility, { passive: true });
        updateVisibility();
    };

    // =========================================================
    // CUSTOM CURSOR
    // =========================================================
    const initCursor = () => {
        if (!cursor || !cursorDot || window.innerWidth <= 768) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let dotX = mouseX;
        let dotY = mouseY;

        const moveCursor = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        document.addEventListener("mousemove", moveCursor);

        hoverTargets.forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
        });

        document.addEventListener("mousedown", () => cursor.classList.add("click"));
        document.addEventListener("mouseup", () => cursor.classList.remove("click"));

        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.16;
            cursorY += (mouseY - cursorY) * 0.16;

            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            requestAnimationFrame(animate);
        };

        animate();
    };

    // =========================================================
    // SMOOTH HASH LINK ENHANCEMENT
    // =========================================================
    const initAnchorLinks = () => {
        const links = $$('a[href^="#"]');

        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
    };

    // =========================================================
    // OPTIONAL CONTACT FORM HANDLER
    // =========================================================
    const initContactForm = () => {
        const form = document.querySelector(".contact-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Messaggio simulato inviato.");
            form.reset();
        });
    };

    // =========================================================
    // OPTIONAL TERMINAL COMMAND CLICK SUPPORT
    // =========================================================
    const initTerminalCommandClicks = () => {
        const terminalInput = $("terminalInput");
        const commands = $$(".terminal-command");

        if (!terminalInput || !commands.length) return;

        commands.forEach((cmd) => {
            cmd.addEventListener("click", () => {
                const text = cmd.dataset.cmd || cmd.textContent.trim();
                terminalInput.textContent = text;
                showToast(`Command selected: ${text}`);
            });
        });
    };

    // =========================================================
    // INIT
    // =========================================================
    const init = () => {
        initTheme();
        initMobileMenu();
        initNavbar();
        initSectionSpy();
        initReveal();
        initBackToTop();
        initCursor();
        initAnchorLinks();
        initContactForm();
        initTerminalCommandClicks();
        runPreloader();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();