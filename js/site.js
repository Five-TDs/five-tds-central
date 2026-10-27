(() => {
    const NAV_ITEMS = window.SITE_NAVIGATION;

    const linkAttributes = item => `href="${item.href}" data-nav="${item.key}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;

    const desktopItem = item => item.children
        ? `<div class="nav-dropdown" data-group="${item.key}">
            <button class="nav-dropdown-button" type="button">${item.label} <span class="nav-arrow">▾</span></button>
            <div class="nav-dropdown-menu">${item.children.map(child => `<a ${linkAttributes(child)}>${child.label}</a>`).join("")}</div>
           </div>`
        : `<a class="nav-link" ${linkAttributes(item)}>${item.label}</a>`;

    const mobileItem = item => item.children
        ? `<div class="mobile-nav-section">
            <button class="mobile-nav-section-button" type="button"><span>${item.label}</span><span class="mobile-section-arrow">▾</span></button>
            <div class="mobile-nav-submenu">${item.children.map(child => `<a ${linkAttributes(child)}>${child.label}</a>`).join("")}</div>
           </div>`
        : `<a class="mobile-nav-link" ${linkAttributes(item)}>${item.label}</a>`;

    const navigation = document.createElement("nav");
    navigation.className = "site-nav";
    navigation.innerHTML = `
        <a href="index.html" class="nav-logo">FIVE TD'S CENTRAL</a>
        <div class="nav-links">${NAV_ITEMS.map(desktopItem).join("")}</div>
        <button id="mobile-menu-button" class="mobile-menu-button" type="button" aria-label="Open navigation" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>`;

    const mobile = document.createElement("div");
    mobile.id = "mobile-menu";
    mobile.className = "mobile-menu";
    mobile.innerHTML = `
        <div class="mobile-nav-header">
            <span>FIVE TD'S CENTRAL</span>
            <button id="mobile-close-button" type="button" aria-label="Close navigation">×</button>
        </div>
        ${NAV_ITEMS.map(mobileItem).join("")}`;

    document.body.prepend(mobile);
    document.body.prepend(navigation);

    const currentPage = location.pathname.split("/").pop().toLowerCase() || "index.html";
    const activeKey = currentPage.replace(/\.html$/, "").replace(/^index$/, "home").replace(/^unit$/, "units");
    document.querySelectorAll(`[data-nav="${activeKey}"]`).forEach(link => link.classList.add("active"));
    const activeLink = document.querySelector(`[data-nav="${activeKey}"]`);
    activeLink?.closest(".nav-dropdown")?.classList.add("active");

    const menuButton = document.getElementById("mobile-menu-button");
    const closeButton = document.getElementById("mobile-close-button");
    const mobileSections = [...mobile.querySelectorAll(".mobile-nav-section")];

    function setMenu(open) {
        mobile.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        document.body.classList.toggle("nav-locked", open);
        if (document.getElementById("back-to-top")) updateBackToTop();
    }

    function setSection(section, open) {
        section.classList.toggle("open", open);
        section.querySelector(".mobile-nav-section-button").setAttribute("aria-expanded", String(open));
    }

    mobileSections.forEach(section => {
        const button = section.querySelector(".mobile-nav-section-button");
        setSection(section, false);
        button.addEventListener("click", () => {
            const shouldOpen = !section.classList.contains("open");
            mobileSections.forEach(other => setSection(other, false));
            setSection(section, shouldOpen);
        });
    });

    const activeMobileLink = mobile.querySelector(`[data-nav="${activeKey}"]`);
    const activeSection = activeMobileLink?.closest(".mobile-nav-section");
    if (activeSection) setSection(activeSection, true);

    menuButton.addEventListener("click", () => setMenu(!mobile.classList.contains("open")));
    closeButton.addEventListener("click", () => setMenu(false));
    mobile.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", () => {
        if (window.getComputedStyle(menuButton).display === "none" && mobile.classList.contains("open")) setMenu(false);
    });

    const backToTopButton = document.createElement("button");
    backToTopButton.type = "button";
    backToTopButton.id = "back-to-top";
    backToTopButton.className = "back-to-top";
    backToTopButton.setAttribute("aria-label", "Back to top");
    backToTopButton.setAttribute("title", "Back to top");
    backToTopButton.innerHTML = `<span aria-hidden="true">↑</span>`;
    document.body.appendChild(backToTopButton);

    function updateBackToTop() {
        backToTopButton.classList.toggle("visible", window.scrollY > 350 && !mobile.classList.contains("open"));
    }

    backToTopButton.addEventListener("click", () => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    });
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
})();
