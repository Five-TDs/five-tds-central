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
        <button type="button" class="global-search-trigger" id="global-search-trigger" aria-label="Search website">⌕ <span>SEARCH</span></button>
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
    let lockedScrollY = 0;
    function setMenu(open) {
        if (open === mobile.classList.contains("open"))
            return;
        if (open) {
            lockedScrollY = window.scrollY;
            document.body.style.top = `-${lockedScrollY}px`;
            document.body.classList.add("nav-locked");
            document.documentElement.classList.add("nav-locked");
        }
        mobile.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (!open) {
            document.body.classList.remove("nav-locked");
            document.documentElement.classList.remove("nav-locked");
            document.body.style.top = "";
            window.scrollTo(0, lockedScrollY);
        }
        if (document.getElementById("back-to-top"))
            updateBackToTop();
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
    if (activeSection)
        setSection(activeSection, true);
    menuButton.addEventListener("click", () => setMenu(!mobile.classList.contains("open")));
    closeButton.addEventListener("click", () => setMenu(false));
    mobile.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape")
            setMenu(false);
    });
    window.addEventListener("resize", () => {
        if (window.getComputedStyle(menuButton).display === "none" && mobile.classList.contains("open"))
            setMenu(false);
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
    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "site-settings-button";
    settingsButton.setAttribute("aria-label", "Website settings");
    settingsButton.title = "Website settings";
    settingsButton.textContent = "⚙";
    document.body.appendChild(settingsButton);
    const settingsModal = document.createElement("div");
    settingsModal.className = "site-settings-modal";
    settingsModal.setAttribute("aria-hidden", "true");
    settingsModal.innerHTML = `
        <section class="site-settings-panel" role="dialog" aria-modal="true" aria-labelledby="site-settings-title">
            <header><h2 id="site-settings-title">WEBSITE SETTINGS</h2><button type="button" class="site-settings-close" aria-label="Close settings">×</button></header>
            <label class="site-settings-option"><span>Page transitions</span><input type="checkbox" id="site-transitions-toggle"></label>
            <label class="site-settings-option"><span>Compact layout</span><input type="checkbox" id="site-compact-toggle"></label>
            <p>Preferences are saved on this device and apply across pages.</p>
        </section>`;
    document.body.appendChild(settingsModal);
    const transitionToggle = settingsModal.querySelector("#site-transitions-toggle");
    const savedTransitions = localStorage.getItem("ftc-page-transitions");
    transitionToggle.checked = savedTransitions !== "off";
    document.documentElement.classList.toggle("transitions-disabled", !transitionToggle.checked);
    function closeSettings() {
        settingsModal.classList.remove("open");
        settingsModal.setAttribute("aria-hidden", "true");
    }
    settingsButton.addEventListener("click", () => {
        settingsModal.classList.add("open");
        settingsModal.setAttribute("aria-hidden", "false");
    });
    settingsModal.querySelector(".site-settings-close").addEventListener("click", closeSettings);
    settingsModal.addEventListener("click", event => {
        if (event.target === settingsModal)
            closeSettings();
    });
    transitionToggle.addEventListener("change", () => {
        localStorage.setItem("ftc-page-transitions", transitionToggle.checked ? "on" : "off");
        document.documentElement.classList.toggle("transitions-disabled", !transitionToggle.checked);
    });
    const compactToggle = settingsModal.querySelector("#site-compact-toggle");
    compactToggle.checked = localStorage.getItem("ftc-compact-layout") === "on";
    document.documentElement.classList.toggle("ftc-compact-layout", compactToggle.checked);
    compactToggle.addEventListener("change", () => {
        localStorage.setItem("ftc-compact-layout", compactToggle.checked ? "on" : "off");
        document.documentElement.classList.toggle("ftc-compact-layout", compactToggle.checked);
    });
    const searchModal = document.createElement("div");
    searchModal.className = "global-search-modal";
    searchModal.setAttribute("aria-hidden", "true");
    searchModal.innerHTML = `<section class="global-search-panel" role="dialog" aria-modal="true" aria-labelledby="global-search-title">
        <div class="global-search-heading"><h2 id="global-search-title">SEARCH FIVE TD'S CENTRAL</h2><button type="button" class="global-search-close" aria-label="Close search">×</button></div>
        <input id="global-search-input" type="search" autocomplete="off" placeholder="Search units, guides, teams, tools…">
        <div id="global-search-results" class="global-search-results"><p>Start typing to search website pages and available unit data.</p></div>
    </section>`;
    document.body.appendChild(searchModal);
    const searchInput = searchModal.querySelector("#global-search-input");
    const searchResults = searchModal.querySelector("#global-search-results");
    const searchablePages = NAV_ITEMS.flatMap(item => item.children ? item.children : [item])
        .filter(item => !item.external)
        .map(item => ({ title: item.label, href: item.href, detail: "Website page" }));
    function openSearch() {
        searchModal.classList.add("open");
        searchModal.setAttribute("aria-hidden", "false");
        searchInput.focus();
        renderSearchResults("");
    }
    function closeSearch() {
        searchModal.classList.remove("open");
        searchModal.setAttribute("aria-hidden", "true");
    }
    function renderSearchResults(query) {
        const q = query.trim().toLowerCase();
        const matches = searchablePages.filter(item => !q || (item.title + " " + item.href).toLowerCase().includes(q));
        let unitMatches = [];
        if (typeof units !== "undefined" && Array.isArray(units))
            unitMatches = units.filter(unit => !q || unit.name.toLowerCase().includes(q)).slice(0, 12)
                .map(unit => ({ title: unit.name, href: "unit.html?unit=" + encodeURIComponent(unit.name), detail: unit.rarity + " unit" }));
        const all = [...unitMatches, ...matches].slice(0, 16);
        searchResults.innerHTML = all.length ? all.map(item => `<a class="global-search-result" href="${item.href}"><span>${item.title}</span><small>${item.detail || "Website page"}</small></a>`).join("") : "<p>No matching pages or loaded units. Try a shorter search.</p>";
    }
    document.getElementById("global-search-trigger").addEventListener("click", openSearch);
    searchModal.querySelector(".global-search-close").addEventListener("click", closeSearch);
    searchModal.addEventListener("click", event => { if (event.target === searchModal)
        closeSearch(); });
    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    document.addEventListener("keydown", event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" || event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
            event.preventDefault();
            openSearch();
        }
        if (event.key === "Escape")
            closeSearch();
    });
    document.querySelectorAll('a[href]').forEach(link => {
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && url.pathname !== location.pathname && !link.target && !link.hasAttribute("download")) {
            link.addEventListener("click", () => {
                let recent = [];
                try {
                    recent = JSON.parse(localStorage.getItem(recentKey) || "[]");
                }
                catch { }
                const target = url.pathname.split("/").pop();
                recent = [{ title: link.textContent.trim() || target, href: target }, ...recent.filter(item => item.href !== target)].slice(0, 6);
                localStorage.setItem(recentKey, JSON.stringify(recent));
            });
        }
    });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && transitionToggle.checked && !sessionStorage.getItem("ftc-transition-ready")) {
        document.documentElement.classList.add("page-transition-ready");
        requestAnimationFrame(() => document.documentElement.classList.add("page-transition-enter"));
        sessionStorage.setItem("ftc-transition-ready", "1");
    }
    document.querySelectorAll('a[href]').forEach(link => {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname === location.pathname || link.target === "_blank" || link.hasAttribute("download"))
            return;
        link.addEventListener("click", event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion || !transitionToggle.checked)
                return;
            event.preventDefault();
            document.documentElement.classList.add("page-transition-leave");
            setTimeout(() => location.href = link.href, 140);
        });
    });
})();
