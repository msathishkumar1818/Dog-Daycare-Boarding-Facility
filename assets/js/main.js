/**
 * CANINE HAVEN - DOG DAYCARE & BOARDING FACILITY
 * Global Master JavaScript (assets/js/main.js)
 * Clean, modular Vanilla JS without any external libraries.
 */

(function () {
  'use strict';

  // --- 1. Page Loader ---
  function initLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    const dismissLoader = () => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 450);
    };

    if (document.readyState === 'complete') {
      setTimeout(dismissLoader, 200);
    } else {
      window.addEventListener('load', () => setTimeout(dismissLoader, 250));
    }

    // Safety fallback
    setTimeout(dismissLoader, 1500);
  }

  // --- 2. Dark Mode (#000000 strictly enforced) ---
  function initTheme() {
    const STORAGE_KEY = 'ch_theme_preference';
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEY, theme);

      // Update all theme toggle buttons
      document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
        btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    };

    applyTheme(initialTheme);

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
  }

  // --- 3. RTL / LTR Direction Switching ---
  function initRTL() {
    const STORAGE_KEY = 'ch_direction_preference';
    const savedDir = localStorage.getItem(STORAGE_KEY) || 'ltr';

    const applyDirection = (dir) => {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem(STORAGE_KEY, dir);

      document.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
        const span = btn.querySelector('span');
        if (span) {
          span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        } else {
          btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
        btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to left to right layout' : 'Switch to right to left layout');
      });
    };

    applyDirection(savedDir);

    document.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir);
      });
    });
  }

  // --- 4. Desktop Navigation Dropdown (CLICK ONLY) ---
  function initDropdown() {
    const trigger = document.getElementById('homeDropdownTrigger');
    const menu = document.getElementById('homeDropdownMenu');
    if (!trigger || !menu) return;

    const toggleDropdown = (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    const openDropdown = () => {
      menu.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
      menu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    // Highlight Home trigger if current page is Home 1 or Home 2
    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('home-2.html') || currentPath.endsWith('/') || currentPath.endsWith('\\') || (!currentPath.includes('.html') && !currentPath.includes('dashboard'));
    if (isHome) {
      trigger.classList.add('active');
    }

    trigger.addEventListener('click', toggleDropdown);

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Close when navigating
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeDropdown());
    });
  }

  // --- 5. Mobile Drawer & Mobile Accordion ---
  function initMobileMenu() {
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    const closeBtn = document.getElementById('mobileDrawerCloseBtn');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const accordionBtn = document.getElementById('mobileHomeAccordionBtn');
    const accordionContent = document.getElementById('mobileHomeAccordionContent');

    if (!drawer) return;

    const openDrawer = () => {
      // Accordion starts closed by default until explicitly clicked
      if (accordionContent) {
        accordionContent.classList.remove('is-open');
      }
      if (accordionBtn) {
        accordionBtn.setAttribute('aria-expanded', 'false');
      }
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    };

    const closeDrawer = () => {
      if (accordionContent) {
        accordionContent.classList.remove('is-open');
      }
      if (accordionBtn) {
        accordionBtn.setAttribute('aria-expanded', 'false');
      }
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    };

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close on link click
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeDrawer());
    });

    // Mobile Home Accordion (Click only to toggle)
    if (accordionBtn && accordionContent) {
      accordionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = accordionContent.classList.contains('is-open');
        if (isOpen) {
          accordionContent.classList.remove('is-open');
          accordionBtn.setAttribute('aria-expanded', 'false');
        } else {
          accordionContent.classList.add('is-open');
          accordionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }

  // --- 6. Active Navigation State ---
  function initActiveNav() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = (rawPath === '' || rawPath === '/') ? 'index.html' : rawPath;

    const links = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.split('/').pop();

      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // If it is in the desktop home dropdown, also highlight desktop trigger
        if (link.closest('#homeDropdownMenu')) {
          const trigger = document.getElementById('homeDropdownTrigger');
          if (trigger) trigger.classList.add('active');
        }

        // If it is in the mobile home dropdown (Home 1 or Home 2), highlight the mobile accordion trigger
        if (link.closest('#mobileHomeAccordionContent')) {
          const mobileAccordionBtn = document.getElementById('mobileHomeAccordionBtn');
          if (mobileAccordionBtn) {
            mobileAccordionBtn.classList.add('active');
            mobileAccordionBtn.setAttribute('aria-current', 'page');
          }
        }
      }
    });

    // Explicit fallback: if on Home 1 or Home 2, ensure Home buttons are highlighted
    if (currentPath === 'index.html' || currentPath === 'home-2.html') {
      const mobileAccordionBtn = document.getElementById('mobileHomeAccordionBtn');
      if (mobileAccordionBtn) {
        mobileAccordionBtn.classList.add('active');
      }
      const desktopTrigger = document.getElementById('homeDropdownTrigger');
      if (desktopTrigger) {
        desktopTrigger.classList.add('active');
      }
    }
  }

  // --- 7. Header Scroll State ---
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 8. Scroll-To-Top Button ---
  function initScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
        }
      },
      { passive: true }
    );

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- 9. Auth Portal (login.html) Interactive Handlers ---
  function initAuthPortal() {
    const tabSignIn = document.getElementById('tabSignIn');
    const tabRegister = document.getElementById('tabRegister');
    const panelSignIn = document.getElementById('panelSignIn');
    const panelRegister = document.getElementById('panelRegister');
    const toRegisterLink = document.getElementById('toRegisterLink');
    const toSignInLink = document.getElementById('toSignInLink');
    const togglePwBtn = document.getElementById('togglePasswordBtn');
    const pwInput = document.getElementById('loginPassword');

    if (!tabSignIn || !tabRegister) return;

    const switchToSignIn = () => {
      tabSignIn.classList.add('active');
      tabRegister.classList.remove('active');
      if (panelSignIn) panelSignIn.classList.remove('is-hidden');
      if (panelRegister) panelRegister.classList.add('is-hidden');
    };

    const switchToRegister = () => {
      tabRegister.classList.add('active');
      tabSignIn.classList.remove('active');
      if (panelSignIn) panelSignIn.classList.add('is-hidden');
      if (panelRegister) panelRegister.classList.remove('is-hidden');
    };

    tabSignIn.addEventListener('click', switchToSignIn);
    tabRegister.addEventListener('click', switchToRegister);

    if (toRegisterLink) toRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToRegister();
    });

    if (toSignInLink) toSignInLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToSignIn();
    });

    if (togglePwBtn && pwInput) {
      togglePwBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = pwInput.getAttribute('type') === 'password';
        pwInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePwBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
      });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
      });
    }
  }

  // --- 10. Dashboard (dashboard.html) Interactive Handlers ---
  function initDashboardInteractions() {
    // Cam Feed Switcher
    const camBtns = document.querySelectorAll('.cam-tab-btn');
    const camImg = document.getElementById('activeCamImg');
    const camTitle = document.getElementById('activeCamTitle');

    if (camBtns.length > 0 && camImg) {
      camBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          camBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const newSrc = btn.getAttribute('data-cam-src');
          const newTitle = btn.getAttribute('data-cam-title');
          if (newSrc) camImg.src = newSrc;
          if (newTitle && camTitle) camTitle.textContent = newTitle;
        });
      });
    }

    // Interactive Booking Form Simulation
    const bookingForm = document.getElementById('dashBookingForm');
    const toast = document.getElementById('bookingToast');

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (toast) {
          toast.classList.add('is-show');
          setTimeout(() => {
            toast.classList.remove('is-show');
          }, 4500);
        }
      });
    }

    // Dynamic Price Preview Calculation
    const suiteSelect = document.getElementById('bookingSuiteTier');
    const priceDisplay = document.getElementById('bookingTotalPreview');
    const addonChecks = document.querySelectorAll('.addon-check-input');

    const updateEstimatedTotal = () => {
      if (!priceDisplay) return;
      let base = 58;
      if (suiteSelect) {
        const val = suiteSelect.value;
        if (val === 'penthouse') base = 78;
        else if (val === 'villa') base = 95;
        else if (val === 'standard') base = 48;
      }
      addonChecks.forEach((chk) => {
        if (chk.checked) {
          const addonPrice = parseInt(chk.getAttribute('data-addon-price'), 10) || 0;
          base += addonPrice;
        }
      });
      priceDisplay.textContent = '$' + base + '.00';
    };

    if (suiteSelect) {
      suiteSelect.addEventListener('change', updateEstimatedTotal);
    }
    addonChecks.forEach((chk) => chk.addEventListener('change', updateEstimatedTotal));
  }

  // --- 11. Contact Form Interaction Handler ---
  function initContactForm() {
    const contactForm = document.getElementById('mainContactForm');
    const toast = document.getElementById('contactToast');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (toast) {
        toast.classList.add('is-show');
        setTimeout(() => {
          toast.classList.remove('is-show');
        }, 5000);
      }
      contactForm.reset();
    });
  }

  // Document Ready Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initRTL();
    initDropdown();
    initMobileMenu();
    initActiveNav();
    initHeaderScroll();
    initScrollToTop();
    initAuthPortal();
    initDashboardInteractions();
    initContactForm();
  });
})();


