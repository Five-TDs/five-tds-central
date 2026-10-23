/* =========================================================
   FIVE TD'S CENTRAL — SHARED NAVIGATION
========================================================= */
(() => {
    const DISCORD_URL = "https://discord.gg/7UPX3MT9TS";

    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.innerHTML = `
        <a href="index.html" class="nav-logo">FIVE TD'S CENTRAL</a>
        <div class="nav-links">
            <a href="index.html" class="nav-link" data-nav="home">HOME</a>

            <div class="nav-dropdown" data-group="database">
                <button class="nav-dropdown-button" type="button">DATABASE <span class="nav-arrow">▾</span></button>
                <div class="nav-dropdown-menu">
                    <a href="units.html" data-nav="units">UNITS</a>
                    <a href="nights.html" data-nav="nights">NIGHTS</a>
                </div>
            </div>

            <div class="nav-dropdown" data-group="meta">
                <button class="nav-dropdown-button" type="button">META <span class="nav-arrow">▾</span></button>
                <div class="nav-dropdown-menu">
                    <a href="tierlist.html" data-nav="tierlist">TIERLIST</a>
                    <a href="best-towers.html" data-nav="best-towers">BEST TOWERS</a>
                </div>
            </div>

            <div class="nav-dropdown" data-group="tools">
                <button class="nav-dropdown-button" type="button">TOOLS <span class="nav-arrow">▾</span></button>
                <div class="nav-dropdown-menu">
                    <a href="stats-simulator.html" data-nav="stats-simulator">STATS SIMULATOR</a>
                    <a href="raw-dps.html" data-nav="raw-dps">RAW DPS CHART</a>
                </div>
            </div>

            <a href="${DISCORD_URL}" class="nav-link" target="_blank" rel="noopener" data-nav="discord">DISCORD</a>
        </div>
        <button id="mobile-menu-button" class="mobile-menu-button" type="button" aria-label="Open navigation" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    `;

    const mobile = document.createElement("div");
    mobile.id = "mobile-menu";
    mobile.className = "mobile-menu";
    mobile.innerHTML = `
        <div class="mobile-nav-header">
            <span>FIVE TD'S CENTRAL</span>
            <button id="mobile-close-button" type="button" aria-label="Close navigation">×</button>
        </div>
        <a href="index.html" class="mobile-nav-link" data-nav="home">HOME</a>

        <div class="mobile-nav-section">
            <button class="mobile-nav-section-button" type="button">
                <span>DATABASE</span><span class="mobile-section-arrow">▾</span>
            </button>
            <div class="mobile-nav-submenu">
                <a href="units.html" data-nav="units">UNITS</a>
                <a href="nights.html" data-nav="nights">NIGHTS</a>
            </div>
        </div>

        <div class="mobile-nav-section">
            <button class="mobile-nav-section-button" type="button">
                <span>META</span><span class="mobile-section-arrow">▾</span>
            </button>
            <div class="mobile-nav-submenu">
                <a href="tierlist.html" data-nav="tierlist">TIERLIST</a>
                <a href="best-towers.html" data-nav="best-towers">BEST TOWERS</a>
            </div>
        </div>

        <div class="mobile-nav-section">
            <button class="mobile-nav-section-button" type="button">
                <span>TOOLS</span><span class="mobile-section-arrow">▾</span>
            </button>
            <div class="mobile-nav-submenu">
                <a href="stats-simulator.html" data-nav="stats-simulator">STATS SIMULATOR</a>
                <a href="raw-dps.html" data-nav="raw-dps">RAW DPS CHART</a>
            </div>
        </div>

        <a href="${DISCORD_URL}" class="mobile-nav-link" target="_blank" rel="noopener" data-nav="discord">DISCORD</a>
    `;

    document.body.prepend(mobile);
    document.body.prepend(nav);

    const path = location.pathname.split("/").pop().toLowerCase() || "index.html";
    const active = path.replace(/\.html$/, "").replace(/^unit$/, "units");
    document.querySelectorAll(`[data-nav="${active}"]`).forEach(el => el.classList.add("active"));
    const activeEl = document.querySelector(`[data-nav="${active}"]`);
    if (activeEl) {
        const dropdown = activeEl.closest(".nav-dropdown");
        if (dropdown) dropdown.classList.add("active");
    }

    const menuButton = document.getElementById("mobile-menu-button");
    const closeButton = document.getElementById("mobile-close-button");

    const setMenu = open => {
        mobile.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("nav-locked", open);
    };

    menuButton.addEventListener("click", () => setMenu(!mobile.classList.contains("open")));
    closeButton.addEventListener("click", () => setMenu(false));

    mobile.querySelectorAll(".mobile-nav-section-button").forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".mobile-nav-section").classList.toggle("open");
        });
    });

    mobile.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenu(false);
    });
})();
