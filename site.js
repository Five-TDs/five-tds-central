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
                    <a href="teams.html" data-nav="teams">TEAMS</a>
                </div>
            </div>

            <div class="nav-dropdown" data-group="tools">
                <button class="nav-dropdown-button" type="button">TOOLS <span class="nav-arrow">▾</span></button>
                <div class="nav-dropdown-menu">
                    <a href="stats-simulator.html" data-nav="stats-simulator">STATS SIMULATOR</a>
                    <a href="raw-dps.html" data-nav="raw-dps">RAW DPS CHART</a>
                </div>
            </div>

            
            <a href="${DISCORD_URL}" class="nav-link" target="_blank" rel="noopener noreferrer" data-nav="discord">DISCORD</a>
            <a href="updates.html" class="nav-link" data-nav="updates">UPDATES</a>
            <a href="faq.html" class="nav-link" data-nav="faq">FAQ & SUGGESTIONS</a>
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
                <a href="teams.html" data-nav="teams">TEAMS</a>
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
<a href="updates.html" class="mobile-nav-link" data-nav="updates">UPDATES</a>
<a href="faq.html" class="mobile-nav-link" data-nav="faq">FAQ & SUGGESTIONS</a>

    `;

    document.body.prepend(mobile);
    document.body.prepend(nav);

    const path = location.pathname.split("/").pop().toLowerCase() || "index.html";

const active = path
    .replace(/\.html$/, "")
    .replace(/^index$/, "home")
    .replace(/^unit$/, "units");
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



   /* =========================================
   WEBSITE VERSION HISTORY DATA
========================================= */

const WEBSITE_VERSION_HISTORY = [

    {
        version: "V2.2.0",
        date: "October 24, 2026",
        title: "Enchant Recommendations + Version History",
        description:
            "Expanded the website's META guides with enchant recommendations " +
            "and introduced an interactive version history.",

        changes: {
            "BEST TOWERS": [
                "Added recommended Best Enchants for ranked units.",
                "Added Alternative Enchant recommendations.",
                "Added enchant-colored borders around unit images.",
                "Introduced animated Soul, Haywire, and Springlock gradients.",
                "Synchronized enchant border and text animations.",
                "Improved enchant information layouts for mobile devices."
            ],

            "TEAMS": [
                "Added recommended enchants to team compositions.",
                "Added enchant recommendations for substitute units.",
                "Added enchant-colored borders and hover labels.",
                "Improved the presentation of team enchant information."
            ],

            "WEBSITE": [
                "Added an interactive Version History modal.",
                "Made the footer version number clickable.",
                "Added a version selector and detailed changelog.",
                "Added responsive version history navigation."
            ]
        }
    },

    {
        version: "V2.1.1",
        date: "October 23, 2026",
        title: "Visual Polish + Mobile Improvements",
        description:
            "A small polish update focused on the presentation of " +
            "website components and mobile usability.",

        changes: {
            "VISUAL IMPROVEMENTS": [
                "Refined spacing between content sections.",
                "Adjusted card borders and hover transitions.",
                "Improved text alignment and readability."
            ],

            "MOBILE": [
                "Refined layouts for smaller screens.",
                "Improved spacing around buttons and interactive elements.",
                "Adjusted responsive content widths."
            ]
        }
    },

    {
        version: "V2.1.0",
        date: "October 22, 2026",
        title: "FAQ & Suggestions + QOL",
        description:
            "Introduced a dedicated FAQ and suggestions section " +
            "alongside additional usability improvements.",

        changes: {
            "FAQ & SUGGESTIONS": [
                "Added the FAQ & Suggestions page.",
                "Added a section for frequently asked questions.",
                "Added a suggestion submission interface.",
                "Organized frequently requested information."
            ],

            "QUALITY OF LIFE": [
                "Improved access to important website pages.",
                "Refined navigation consistency.",
                "Improved content organization and readability."
            ],

            "UNITS": [
                "Added Sparky."
            ]
        }
    },

    {
        version: "V2.0.5",
        date: "October 21, 2026",
        title: "META Navigation + Best Towers",
        description:
            "Expanded the META section with new recommendations " +
            "and easier access to ranking guides.",

        changes: {
            "BEST TOWERS": [
                "Added the Best Towers page.",
                "Added Best Starter rankings.",
                "Added Best Early Game and Best Mid Game rankings.",
                "Added Best Late Game rankings.",
                "Added Best 5th Unit recommendations.",
                "Added Best Damage and Best Overall rankings.",
                "Introduced ranked unit cards with featured placements."
            ],

            "NAVIGATION": [
                "Expanded the META navigation section.",
                "Added direct access to Tierlist and Best Towers.",
                "Improved navigation between META guides."
            ],

            "UPDATES": [
                "Improved access to website update information."
            ]
        }
    },

    {
        version: "V2.0.4",
        date: "October 20, 2026",
        title: "Teams Guide + Compositions",
        description:
            "Expanded the META guides with team compositions " +
            "designed for different gameplay situations.",

        changes: {
            "TEAMS": [
                "Added the Teams page.",
                "Added Best Solo Team recommendations.",
                "Added Best Endless Team recommendations.",
                "Added Best Crowd Control Team recommendations.",
                "Added Best Boss Killer Team recommendations.",
                "Added Best Speedrun Team recommendations.",
                "Added substitute units for team compositions."
            ],

            "INTERFACE": [
                "Added team composition cards.",
                "Improved the organization of team recommendations.",
                "Adjusted team layouts for different screen sizes."
            ]
        }
    },

    {
        version: "V2.0.3",
        date: "October 19, 2026",
        title: "Tierlist Improvements",
        description:
            "Expanded and refined the unit tierlist following " +
            "the major website redesign.",

        changes: {
            "TIERLIST": [
                "Refined the presentation of unit rankings.",
                "Improved spacing between tier sections.",
                "Adjusted unit card layouts.",
                "Improved the visibility of unit names and images.",
                "Included warning indicators for uncertain unit data."
            ],

            "QUALITY OF LIFE": [
                "Improved readability across ranking sections.",
                "Refined responsive tierlist layouts."
            ]
        }
    },

    {
        version: "V2.0.2",
        date: "October 18, 2026",
        title: "Stats Simulator Improvements",
        description:
            "A focused update to improve the presentation " +
            "and usability of the website's calculation tools.",

        changes: {
            "STATS SIMULATOR": [
                "Refined the simulator interface.",
                "Improved the organization of unit statistics.",
                "Adjusted calculation result presentation.",
                "Improved input and output readability."
            ],

            "TOOLS": [
                "Improved visual consistency between tools.",
                "Refined tool layouts for smaller screens."
            ],

            "UNITS": [
                "Added Animdude."
            ]
        }
    },

    {
        version: "V2.0.1",
        date: "October 17, 2026",
        title: "Post-Overhaul Fixes",
        description:
            "A follow-up maintenance release focused on " +
            "polishing the redesigned website.",

        changes: {
            "BUG FIXES": [
                "Addressed minor layout inconsistencies.",
                "Refined navigation behavior.",
                "Improved spacing around page content."
            ],

            "QUALITY OF LIFE": [
                "Adjusted hover and focus effects.",
                "Improved mobile content presentation.",
                "Refined responsive styling."
            ]
        }
    },

    {
        version: "V2.0.0",
        date: "October 16, 2026",
        title: "Complete Website UI + QOL Overhaul",
        description:
            "A major overhaul of Five TD's Central, featuring " +
            "a redesigned interface, improved navigation, " +
            "and extensive quality-of-life improvements.",

        changes: {
            "COMPLETE UI REDESIGN": [
                "Reworked the overall website appearance.",
                "Unified fonts and colors across all pages.",
                "Redesigned the website navigation system.",
                "Improved page layouts, spacing, and alignment.",
                "Refined unit cards, buttons, and content panels.",
                "Introduced more consistent hover effects and transitions.",
                "Improved the website's dark-themed visual identity."
            ],

            "QUALITY OF LIFE": [
                "Improved mobile navigation and usability.",
                "Made important pages and tools easier to access.",
                "Improved the organization of website information.",
                "Standardized interactions between pages.",
                "Improved readability throughout the website.",
                "Refined responsive layouts for different screen sizes."
            ],

            "WEBSITE STRUCTURE": [
                "Consolidated shared website styling.",
                "Improved shared JavaScript functionality.",
                "Standardized navigation across website pages.",
                "Reduced inconsistencies between page designs.",
                "Improved overall website organization."
            ],

            "META": [
                "Expanded the website's unit-ranking features.",
                "Introduced the Tierlist system.",
                "Added tier rankings from S through F.",
                "Improved the presentation of unit comparisons."
            ]
        }
    },

    {
        version: "V1.5.0",
        date: "October 15, 2026",
        title: "Website Tools Expansion",
        description:
            "Expanded and organized the website's collection " +
            "of useful tools and resources.",

        changes: {
            "TOOLS": [
                "Improved access to the Stats Simulator.",
                "Improved access to the Raw DPS Chart.",
                "Refined tool navigation links.",
                "Improved consistency between tool pages."
            ],

            "QUALITY OF LIFE": [
                "Improved organization of website tools.",
                "Refined tool page descriptions."
            ]
        }
    },

    {
        version: "V1.4.2",
        date: "October 14, 2026",
        title: "Mobile Layout Fixes",
        description:
            "A maintenance update focused on improving " +
            "the website experience on smaller devices.",

        changes: {
            "MOBILE": [
                "Adjusted responsive navigation spacing.",
                "Improved card sizing on mobile screens.",
                "Refined mobile content alignment.",
                "Improved readability on narrow displays."
            ],

            "FIXES": [
                "Addressed minor responsive layout issues.",
                "Adjusted overflow behavior in content sections."
            ]
        }
    },

    {
        version: "V1.4.1",
        date: "October 13, 2026",
        title: "Unit Database Improvements",
        description:
            "Improved the presentation and organization " +
            "of the Unit Database.",

        changes: {
            "UNIT DATABASE": [
                "Refined unit information layouts.",
                "Improved rarity color presentation.",
                "Adjusted unit statistic labels.",
                "Improved readability of unit upgrade information."
            ],

            "QUALITY OF LIFE": [
                "Refined unit image presentation.",
                "Improved spacing within unit information panels."
            ],

            "UNITS": [
                "Added Bear5"
            ]
        }
    },

    {
        version: "V1.4.0",
        date: "October 12, 2026",
        title: "Nights Database Improvements",
        description:
            "Expanded and refined the presentation " +
            "of the Nights database.",

        changes: {
            "NIGHTS": [
                "Improved night information cards.",
                "Refined the night details modal.",
                "Improved the presentation of wave information.",
                "Organized starting cash, rewards, and boss details.",
                "Refined filtering controls.",
                "Improved the Max Mode interface."
            ],

            "MOBILE": [
                "Adjusted night grid layouts.",
                "Improved modal sizing on smaller screens."
            ],

            "UNITS": [
                "Added Fastbear."
            ]
        }
    },

    {
        version: "V1.3.1",
        date: "October 11, 2026",
        title: "Navigation + Bug Fixes",
        description:
            "A smaller maintenance update focused on " +
            "navigation reliability and page consistency.",

        changes: {
            "NAVIGATION": [
                "Refined desktop dropdown behavior.",
                "Improved mobile navigation interactions.",
                "Adjusted navigation spacing and alignment."
            ],

            "FIXES": [
                "Addressed inconsistent navigation styling.",
                "Refined page transition behavior."
            ]
        }
    },

    {
        version: "V1.3.0",
        date: "October 10, 2026",
        title: "Website Content Expansion",
        description:
            "Expanded the website's informational content " +
            "and improved the organization of existing pages.",

        changes: {
            "CONTENT": [
                "Expanded unit information presentation.",
                "Improved the organization of game-related information.",
                "Refined page descriptions and headings.",
                "Improved access to existing website resources."
            ],

            "WEBSITE": [
                "Refined footer navigation links.",
                "Improved consistency between informational pages."
            ]
        }
    },

    {
        version: "V1.2.1",
        date: "October 9, 2026",
        title: "Navigation Maintenance",
        description:
            "A maintenance update focused on improving " +
            "navigation consistency across the website.",

        changes: {
            "NAVIGATION": [
                "Continued improvements to shared navigation.",
                "Refined links between database and tool pages.",
                "Improved mobile menu consistency."
            ],

            "QUALITY OF LIFE": [
                "Adjusted navigation spacing.",
                "Refined interactive menu behavior."
            ]
        }
    },

    {
        version: "V1.2.0",
        date: "October 8, 2026",
        title: "Database + DPS Improvements",
        description:
            "Improved unit statistic terminology and consistency " +
            "between the Unit Database and Raw DPS Chart.",

        changes: {
            "UNIT DATABASE": [
                "Standardized unit statistic terminology.",
                "Corrected the CD label to HPS.",
                "Improved the presentation of unit statistics.",
                "Preserved existing unit data."
            ],

            "RAW DPS": [
                "Updated displayed statistics to use HPS.",
                "Standardized DPS calculations using damage and HPS.",
                "Improved consistency with the Unit Database."
            ],

            "NAVIGATION": [
                "Improved navigation between tools and databases.",
                "Refined mobile menu behavior."
            ]
        }
    },

    {
        version: "V1.1.0",
        date: "October 7, 2026",
        title: "Website Styling + Navigation",
        description:
            "An early improvement update focused on creating " +
            "a more consistent website experience.",

        changes: {
            "DESIGN": [
                "Improved website fonts and colors.",
                "Refined page backgrounds and content panels.",
                "Improved visual consistency across pages."
            ],

            "NAVIGATION": [
                "Introduced shared navigation components.",
                "Improved desktop dropdown menus.",
                "Improved mobile navigation layouts."
            ],

            "QUALITY OF LIFE": [
                "Refined page spacing and alignment.",
                "Improved responsive styling."
            ]
        }
    },

    {
        version: "V1.0.0",
        date: "October 6, 2026",
        title: "Initial Website Launch",
        description:
            "The beginning of Five TD's Central, an unofficial " +
            "information hub for Five TD's players.",

        changes: {
            "CORE WEBSITE": [
                "Launched the Five TD's Central Home page.",
                "Introduced the Unit Database.",
                "Added unit images, rarities, and statistics.",
                "Added unit searching and filtering."
            ],

            "GAME INFORMATION": [
                "Introduced the Nights database.",
                "Added game night and wave information."
            ],

            "TOOLS": [
                "Introduced the Stats Simulator.",
                "Introduced the Raw DPS Chart."
            ],

            "WEBSITE": [
                "Added basic website navigation.",
                "Introduced the original website design."
            ],

            "UNITS": [
                "Added all summons units.",
                "Added Shadow Bonnie.",
                "Added Radioactive Foxy."
            ]
        }
    }

];


/* =========================================
   VERSION HISTORY MODAL
========================================= */

function initializeVersionHistory() {

    const modal = document.getElementById(
        "version-history-modal"
    );

    const openButton = document.getElementById(
        "open-version-history"
    );

    const closeButton = document.getElementById(
        "close-version-history"
    );

    const sidebar = document.getElementById(
        "version-history-sidebar"
    );

    const content = document.getElementById(
        "version-history-content"
    );

    if (
        !modal ||
        !openButton ||
        !closeButton ||
        !sidebar ||
        !content
    ) {
        return;
    }

    let previousFocus = null;
    let selectedVersion = 0;

    /* =====================================
       DISPLAY SELECTED VERSION
    ===================================== */

    function displayVersion(index) {

        const version = WEBSITE_VERSION_HISTORY[index];

        if (!version) {
            return;
        }

        selectedVersion = index;

        content.replaceChildren();

        const versionNumber = document.createElement("span");
        versionNumber.className = "version-history-version";
        versionNumber.textContent = version.version;

        const heading = document.createElement("h3");
        heading.textContent = version.title;

        const description = document.createElement("p");
        description.className = "version-history-description";
        description.textContent = version.description;

        const releaseDate = document.createElement("div");
releaseDate.className = "version-history-date";
releaseDate.textContent = version.date;

content.appendChild(versionNumber);
content.appendChild(heading);
content.appendChild(releaseDate);
content.appendChild(description);

        Object.entries(version.changes).forEach(
            ([groupTitle, changes]) => {

                const group = document.createElement("section");
                group.className = "version-history-group";

                const groupHeading = document.createElement("h4");
                groupHeading.textContent = groupTitle;

                const list = document.createElement("ul");

                changes.forEach(change => {

                    const item = document.createElement("li");
                    item.textContent = change;

                    list.appendChild(item);
                });

                group.appendChild(groupHeading);
                group.appendChild(list);

                content.appendChild(group);
            }
        );

        content.scrollTop = 0;

        sidebar.querySelectorAll(
            ".version-history-tab"
        ).forEach((tab, tabIndex) => {

            const active = tabIndex === index;

            tab.classList.toggle("active", active);
            tab.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    }


    /* =====================================
       CREATE VERSION BUTTONS
    ===================================== */

    WEBSITE_VERSION_HISTORY.forEach((version, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "version-history-tab";

        const number = document.createElement("span");
        number.className = "version-history-tab-number";
        number.textContent = version.version;

        const title = document.createElement("span");
        title.className = "version-history-tab-title";
        title.textContent = version.title;

        button.appendChild(number);
        button.appendChild(title);

        button.addEventListener("click", () => {
            displayVersion(index);
        });

        sidebar.appendChild(button);
    });


    /* =====================================
       OPEN MODAL
    ===================================== */

    function openModal() {

        previousFocus = document.activeElement;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        displayVersion(0);

        closeButton.focus();
    }


    /* =====================================
       CLOSE MODAL
    ===================================== */

    function closeModal() {

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus();
        }
    }


    /* =====================================
       EVENTS
    ===================================== */

    openButton.addEventListener("click", openModal);

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusable = Array.from(
            modal.querySelectorAll(
                'button:not([disabled]), a[href], ' +
                'input:not([disabled]), select:not([disabled]), ' +
                'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(element => element.getClientRects().length > 0);

        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    });

    displayVersion(selectedVersion);
}


/* =========================================
   INITIALIZE
========================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeVersionHistory
    );

} else {

    initializeVersionHistory();

}
