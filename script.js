const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");
 
    function closeMenu() {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      mobileNav.setAttribute("aria-hidden", "true");
    }
 
    function openMenu() {
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
      mobileNav.setAttribute("aria-hidden", "false");
    }
 
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
 
    // Optional niceties:
    // 1) Close menu when clicking a link
    mobileNav.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a") closeMenu();
    });
 
    // 2) Close menu if resizing to desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 769px)").matches) closeMenu();
    });