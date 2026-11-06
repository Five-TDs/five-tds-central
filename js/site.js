(() => {
    const NAV_ITEMS = window.SITE_NAVIGATION;
    const readPreference = (key, fallback = null) => {
        try {
            return window.localStorage.getItem(key) ?? fallback;
        } catch {
            return fallback;
        }
    };
    const savePreference = (key, value) => {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            return;
        }
    };
    const readSession = key => {
        try {
            return window.sessionStorage.getItem(key);
        } catch {
            return null;
        }
    };
    const saveSession = (key, value) => {
        try {
            window.sessionStorage.setItem(key, value);
        } catch {
            return;
        }
    };
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
    navigation.setAttribute("aria-label", "Primary navigation");
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
    mobile.setAttribute("role", "region");
    mobile.setAttribute("aria-label", "Mobile navigation");
    mobile.setAttribute("aria-hidden", "true");
    mobile.innerHTML = `
        <div class="mobile-nav-header">
            <span>FIVE TD'S CENTRAL</span>
            <button id="mobile-close-button" type="button" aria-label="Close navigation">×</button>
        </div>
        ${NAV_ITEMS.map(mobileItem).join("")}`;
    document.body.prepend(mobile);
    document.body.prepend(navigation);
    function addSkipLink() {
        const mainContent = document.querySelector("main");
        if (!mainContent) return;
        if (!mainContent.id) mainContent.id = "main-content";
        mainContent.setAttribute("tabindex", "-1");
        const skipLink = document.createElement("a");
        skipLink.className = "skip-to-content";
        skipLink.href = `#${mainContent.id}`;
        skipLink.textContent = "SKIP TO CONTENT";
        document.body.prepend(skipLink);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addSkipLink, { once: true });
    } else {
        addSkipLink();
    }
    const currentPage = location.pathname.split("/").pop().toLowerCase() || "index.html";
    const activeKey = currentPage.replace(/\.html$/, "").replace(/^index$/, "home").replace(/^unit$/, "units");
    document.querySelectorAll(`[data-nav="${activeKey}"]`).forEach(link => {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    });
    const activeLink = document.querySelector(`[data-nav="${activeKey}"]`);
    activeLink?.closest(".nav-dropdown")?.classList.add("active");
    const desktopGroups = [...navigation.querySelectorAll(".nav-dropdown")];
    const closeDesktopGroups = (exception = null) => {
        for (const group of desktopGroups) {
            if (group === exception) continue;
            group.classList.remove("is-open");
            group.querySelector(".nav-dropdown-button").setAttribute("aria-expanded", "false");
        }
    };
    desktopGroups.forEach(group => {
        const button = group.querySelector(".nav-dropdown-button");
        const menuId = `nav-menu-${group.dataset.group}`;
        group.querySelector(".nav-dropdown-menu").id = menuId;
        button.setAttribute("aria-controls", menuId);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-haspopup", "true");
        button.addEventListener("click", () => {
            const shouldOpen = !group.classList.contains("is-open");
            closeDesktopGroups(group);
            group.classList.toggle("is-open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));
        });
        group.addEventListener("keydown", event => {
            if (event.key === "ArrowDown" && document.activeElement === button) {
                event.preventDefault();
                closeDesktopGroups(group);
                group.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
                group.querySelector(".nav-dropdown-menu a")?.focus();
            }
        });
    });
    document.addEventListener("click", event => {
        if (!navigation.contains(event.target)) closeDesktopGroups();
    });
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        const openGroup = desktopGroups.find(group => group.classList.contains("is-open"));
        if (openGroup) {
            closeDesktopGroups();
            openGroup.querySelector(".nav-dropdown-button").focus();
        }
    });
    const menuButton = document.getElementById("mobile-menu-button");
    menuButton.setAttribute("aria-controls", "mobile-menu");
    const closeButton = document.getElementById("mobile-close-button");
    const mobileSections = [...mobile.querySelectorAll(".mobile-nav-section")];
    let lockedScrollY = 0;
    function setMenu(open) {
        if (open === mobile.classList.contains("open"))
            return;
        if (open) {
            closeDesktopGroups();
            lockedScrollY = window.scrollY;
            document.body.style.top = `-${lockedScrollY}px`;
            document.body.classList.add("nav-locked");
            document.documentElement.classList.add("nav-locked");
        }
        const focusWasInside = mobile.contains(document.activeElement);
        mobile.classList.toggle("open", open);
        mobile.setAttribute("aria-hidden", String(!open));
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (!open) {
            document.body.classList.remove("nav-locked");
            document.documentElement.classList.remove("nav-locked");
            document.body.style.top = "";
            window.scrollTo(0, lockedScrollY);
            if (focusWasInside) menuButton.focus({ preventScroll: true });
        } else {
            closeButton.focus({ preventScroll: true });
        }
        if (document.getElementById("back-to-top"))
            updateBackToTop();
    }
    function setSection(section, open) {
        section.classList.toggle("open", open);
        const button = section.querySelector(".mobile-nav-section-button");
        const submenu = section.querySelector(".mobile-nav-submenu");
        button.setAttribute("aria-expanded", String(open));
        submenu.setAttribute("aria-hidden", String(!open));
        submenu.inert = !open;
    }
    mobileSections.forEach((section, index) => {
        const button = section.querySelector(".mobile-nav-section-button");
        const submenu = section.querySelector(".mobile-nav-submenu");
        submenu.id = `mobile-nav-submenu-${index}`;
        button.setAttribute("aria-controls", submenu.id);
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
    const savedTransitions = readPreference("ftc-page-transitions");
    transitionToggle.checked = savedTransitions !== "off";
    document.documentElement.classList.toggle("transitions-disabled", !transitionToggle.checked);
    let settingsTrigger = null;
    function updateDialogLock() {
        document.documentElement.classList.toggle("site-dialog-open",
            settingsModal.classList.contains("open") || searchModal.classList.contains("open"));
    }
    function closeSettings(restoreFocus = true) {
        if (!settingsModal.classList.contains("open")) return;
        settingsModal.classList.remove("open");
        settingsModal.setAttribute("aria-hidden", "true");
        updateDialogLock();
        if (restoreFocus) settingsTrigger?.focus({ preventScroll: true });
    }
    settingsButton.addEventListener("click", () => {
        closeSearch(false);
        if (mobile.classList.contains("open")) setMenu(false);
        settingsTrigger = settingsButton;
        settingsModal.classList.add("open");
        settingsModal.setAttribute("aria-hidden", "false");
        updateDialogLock();
        const focusSettings = () => {
            if (settingsModal.classList.contains("open") && !settingsModal.contains(document.activeElement))
                settingsModal.querySelector(".site-settings-close").focus({ preventScroll: true });
        };
        setTimeout(focusSettings, 0);
        setTimeout(focusSettings, 200);
    });
    settingsModal.querySelector(".site-settings-close").addEventListener("click", closeSettings);
    settingsModal.addEventListener("click", event => {
        if (event.target === settingsModal)
            closeSettings();
    });
    transitionToggle.addEventListener("change", () => {
        savePreference("ftc-page-transitions", transitionToggle.checked ? "on" : "off");
        document.documentElement.classList.toggle("transitions-disabled", !transitionToggle.checked);
    });
    const compactToggle = settingsModal.querySelector("#site-compact-toggle");
    compactToggle.checked = readPreference("ftc-compact-layout") === "on";
    document.documentElement.classList.toggle("ftc-compact-layout", compactToggle.checked);
    compactToggle.addEventListener("change", () => {
        savePreference("ftc-compact-layout", compactToggle.checked ? "on" : "off");
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
    searchResults.setAttribute("aria-live", "polite");
    searchResults.setAttribute("aria-relevant", "additions text");
    const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
    const searchablePages = NAV_ITEMS.flatMap(item => item.children ? item.children : [item])
        .filter(item => !item.external)
        .map(item => ({ title: item.label, href: item.href, detail: "Website page" }));
    let searchTrigger = null;
    let unitSearchLoading = false;
    function ensureSearchUnits() {
        if (typeof units !== "undefined" || unitSearchLoading) return;
        unitSearchLoading = true;
        const script = document.createElement("script");
        script.src = "js/data/units.js";
        script.async = true;
        script.addEventListener("load", () => {
            unitSearchLoading = false;
            renderSearchResults(searchInput.value);
        }, { once: true });
        script.addEventListener("error", () => { unitSearchLoading = false; }, { once: true });
        document.head.appendChild(script);
    }
    function openSearch() {
        if (searchModal.classList.contains("open")) {
            searchInput.focus();
            return;
        }
        const fromSettings = settingsModal.classList.contains("open");
        searchTrigger = fromSettings ? document.getElementById("global-search-trigger") : document.activeElement;
        closeSettings(false);
        if (mobile.classList.contains("open")) setMenu(false);
        ensureSearchUnits();
        searchModal.classList.add("open");
        searchModal.setAttribute("aria-hidden", "false");
        searchInput.value = "";
        renderSearchResults("");
        updateDialogLock();
        searchInput.focus();
    }
    function closeSearch(restoreFocus = true) {
        if (!searchModal.classList.contains("open")) return;
        searchModal.classList.remove("open");
        searchModal.setAttribute("aria-hidden", "true");
        updateDialogLock();
        if (restoreFocus) searchTrigger?.focus({ preventScroll: true });
    }
    function renderSearchResults(query) {
        const q = query.trim().toLowerCase();
        const matches = searchablePages.filter(item => !q || (item.title + " " + item.href).toLowerCase().includes(q));
        let unitMatches = [];
        if (typeof units !== "undefined" && Array.isArray(units))
            unitMatches = units.filter(unit => !q || unit.name.toLowerCase().includes(q)).slice(0, 12)
                .map(unit => ({ title: unit.name, href: "unit.html?unit=" + encodeURIComponent(unit.name), detail: unit.rarity + " unit" }));
        const all = [...unitMatches, ...matches].slice(0, 16);
        searchResults.innerHTML = all.length ? all.map(item => `<a class="global-search-result" href="${escapeHTML(item.href)}"><span>${escapeHTML(item.title)}</span><small>${escapeHTML(item.detail || "Website page")}</small></a>`).join("") : "<p>No matching pages or loaded units. Try a shorter search.</p>";
    }
    document.getElementById("global-search-trigger").addEventListener("click", openSearch);
    searchModal.querySelector(".global-search-close").addEventListener("click", closeSearch);
    searchModal.addEventListener("click", event => { if (event.target === searchModal)
        closeSearch(); });
    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    document.addEventListener("keydown", event => {
        const target = document.activeElement;
        const canType = target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
        if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !canType && !event.altKey && !event.ctrlKey && !event.metaKey)) {
            event.preventDefault();
            openSearch();
        }
        if (event.key === "Escape") {
            closeSearch();
            closeSettings();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key !== "Tab") return;
        const opened = searchModal.classList.contains("open") ? searchModal :
            settingsModal.classList.contains("open") ? settingsModal : null;
        if (!opened) return;
        const items = [...opened.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
            .filter(item => item.getClientRects().length > 0);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!opened.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && transitionToggle.checked && !readSession("ftc-transition-ready")) {
        document.documentElement.classList.add("page-transition-ready");
        requestAnimationFrame(() => document.documentElement.classList.add("page-transition-enter"));
        saveSession("ftc-transition-ready", "1");
    }
    document.addEventListener("click", event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion || !transitionToggle.checked)
            return;
        const link = event.target.closest("a[href]");
        if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
        let url;
        try {
            url = new URL(link.href, location.href);
        } catch {
            return;
        }
        if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
        event.preventDefault();
        document.documentElement.classList.add("page-transition-leave");
        setTimeout(() => { location.href = url.href; }, 140);
    });
})();
