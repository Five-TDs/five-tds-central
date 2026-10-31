const rarities = [
    "Legendary",
    "Exclusive",
    "Epic",
    "Rare",
    "Uncommon",
    "Common"
];
const grid = document.getElementById("unit-grid");
const resultsCount = document.getElementById("unit-results-count");
const clearFiltersButton = document.getElementById("clear-unit-filters");
const searchInput = document.getElementById("search-input");
const filterButton = document.getElementById("filter-button");
const filters = document.getElementById("filters");
let activeRarities = [];
let activeTypes = [];
let favoritesOnly = false;
let selectedForCompare = [];
const favoriteKey = "ftc-favorite-units";
const readFavorites = () => {
    try {
        return JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    }
    catch {
        return [];
    }
};
const writeFavorites = values => localStorage.setItem(favoriteKey, JSON.stringify(values));
const rarityRank = { Legendary: 6, Exclusive: 5, Epic: 4, Rare: 3, Uncommon: 2, Common: 1 };
const baseStats = unit => {
    const stat = (unit.stats || []).find(s => s.level === 1) || (unit.stats || [])[0] || {};
    const damage = Number(stat.damage) || 0;
    const cooldown = Number(stat.cooldown) || 0;
    return { damage, cooldown, dps: damage * cooldown,
        hps: cooldown, range: Number(stat.range) || 0,
        placement: Number(unit.placement) || 0 };
};
filterButton.addEventListener("click", () => {
    filters.classList.toggle("open");
    filterButton.classList.toggle("open");
});
document
    .querySelectorAll(".rarity-option")
    .forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        if (activeRarities.includes(value)) {
            activeRarities =
                activeRarities.filter(rarity => rarity !== value);
            button.classList.remove("active");
        }
        else {
            activeRarities.push(value);
            button.classList.add("active");
        }
        displayUnits();
    });
});
document
    .querySelectorAll(".type-option")
    .forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        if (activeTypes.includes(value)) {
            activeTypes =
                activeTypes.filter(type => type !== value);
            button.classList.remove("active");
        }
        else {
            activeTypes.push(value);
            button.classList.add("active");
        }
        displayUnits();
    });
});
searchInput.addEventListener("input", () => {
    displayUnits();
});
clearFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    activeRarities = [];
    activeTypes = [];
    document
        .querySelectorAll(".rarity-option.active, .type-option.active")
        .forEach(button => {
        button.classList.remove("active");
    });
    displayUnits();
});
function displayUnits() {
    grid.innerHTML = "";
    const searchText = searchInput.value
        .toLowerCase()
        .trim();
    let filteredUnits = units.filter(unit => {
        const matchesSearch = unit.name
            .toLowerCase()
            .includes(searchText);
        const matchesRarity = activeRarities.length === 0 ||
            activeRarities.includes(unit.rarity);
        const matchesType = activeTypes.length === 0 ||
            activeTypes.includes(unit.type);
        const matchesFavorite = !favoritesOnly || readFavorites().includes(unit.name);
        return matchesSearch && matchesRarity && matchesType && matchesFavorite;
    });
    const sortMode = document.getElementById("unit-sort")?.value || "default";
    if (sortMode !== "default") {
        filteredUnits.sort((a, b) => {
            if (sortMode === "name")
                return a.name.localeCompare(b.name);
            if (sortMode === "rarity")
                return (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0);
            const av = baseStats(a)[sortMode] || 0;
            const bv = baseStats(b)[sortMode] || 0;
            return bv - av;
        });
    }
    if (resultsCount) {
        const visibleCount = filteredUnits.length;
        const totalCount = units.length;
        resultsCount.textContent =
            `Showing ${visibleCount} of ${totalCount} units`;
    }
    /* =========================
    CLEAR BUTTON VISIBILITY
    ========================= */
    const hasActiveFilters = searchText.length > 0 ||
        activeRarities.length > 0 ||
        activeTypes.length > 0;
    clearFiltersButton.hidden = !hasActiveFilters;
    /*
        Create rarity sections.
    */
    rarities.forEach(rarity => {
        /*
            Find units belonging
            to this rarity.
        */
        const rarityUnits = filteredUnits.filter(unit => unit.rarity === rarity);
        if (sortMode !== "default") {
            rarityUnits.sort((a, b) => {
                if (sortMode === "name")
                    return a.name.localeCompare(b.name);
                if (sortMode === "rarity")
                    return 0;
                return (baseStats(b)[sortMode] || 0) - (baseStats(a)[sortMode] || 0);
            });
        }
        /*
            Don't show empty sections.
        */
        if (rarityUnits.length === 0) {
            return;
        }
        /* =========================
           RARITY SECTION
        ========================== */
        const section = document.createElement("section");
        section.className =
            "rarity-section";
        /* =========================
           RARITY TITLE
        ========================== */
        const titleContainer = document.createElement("div");
        titleContainer.className =
            "rarity-title";
        const title = document.createElement("h2");
        title.textContent =
            rarity;
        /* =========================
        RARITY UNIT COUNT
        ========================= */
        const rarityCount = document.createElement("span");
        rarityCount.className =
            "rarity-count";
        rarityCount.textContent =
            rarityUnits.length;
        const line = document.createElement("div");
        line.className =
            "rarity-line";
        titleContainer.appendChild(title);
        titleContainer.appendChild(rarityCount);
        titleContainer.appendChild(line);
        section.appendChild(titleContainer);
        /* =========================
           UNIT GRID
        ========================== */
        const unitGrid = document.createElement("div");
        unitGrid.className =
            "unit-grid";
        /* =========================
           CREATE CARDS
        ========================== */
        rarityUnits.forEach(unit => {
            const card = document.createElement("div");
            /*
                Give the card its rarity class.

                Example:

                Common -> common

                Legendary -> legendary
            */
            card.className =
                `unit-card ${rarity.toLowerCase()}`;
            /*
                Create card contents.
            */
            card.innerHTML = `

                <div class="unit-image">

                    ${unit.image
                ?
                    `<img
                            src="${unit.image}"
                            alt="${unit.name}"
                        >`
                :
                    `<span>
                            IMAGE
                        </span>`}

                </div>


                <div class="unit-name">

                    ${unit.name}

                </div>

                <div class="unit-card-extra-actions">
                    <button class="unit-favorite-toggle" type="button" aria-label="Favorite ${unit.name}" title="Toggle favorite">${readFavorites().includes(unit.name) ? "★" : "☆"}</button>
                    <label class="unit-compare-toggle" title="Select for comparison"><input type="checkbox" value="${unit.name}" ${selectedForCompare.includes(unit.name) ? "checked" : ""}> Compare</label>
                </div>
                <button
                    class="unit-card-copy-link"
                    type="button"
                    aria-label="Copy link to ${unit.name}"
                    title="Copy a direct link to ${unit.name}"
                >
                    🔗 COPY LINK
                </button>

            `;
            const favoriteButton = card.querySelector(".unit-favorite-toggle");
            favoriteButton.addEventListener("click", event => {
                event.stopPropagation();
                const favorites = readFavorites();
                const exists = favorites.includes(unit.name);
                writeFavorites(exists ? favorites.filter(name => name !== unit.name) : [...favorites, unit.name]);
                favoriteButton.textContent = exists ? "☆" : "★";
                if (favoritesOnly)
                    displayUnits();
            });
            const compareLabel = card.querySelector(".unit-compare-toggle");
            const compareCheckbox = card.querySelector(".unit-compare-toggle input");
            compareLabel.addEventListener("click", event => event.stopPropagation());
            compareCheckbox.addEventListener("click", event => event.stopPropagation());
            compareCheckbox.addEventListener("change", event => {
                if (event.target.checked) {
                    if (selectedForCompare.length >= 4) {
                        event.target.checked = false;
                        alert("You can compare up to 4 units at once.");
                        return;
                    }
                    selectedForCompare.push(unit.name);
                }
                else
                    selectedForCompare = selectedForCompare.filter(name => name !== unit.name);
                updateCompareControls();
            });
            /*
            Make the card open the unit page.
            */
            card.addEventListener("click", () => {
                window.location.href =
                    `unit.html?unit=${encodeURIComponent(unit.name)}`;
            });
            // =========================
            // COPY UNIT LINK
            // =========================
            const copyLinkButton = card.querySelector(".unit-card-copy-link");
            copyLinkButton.addEventListener("click", async (event) => {
                // Prevent opening the unit page.
                event.stopPropagation();
                const unitURL = new URL(`unit.html?unit=${encodeURIComponent(unit.name)}`, window.location.href);
                try {
                    await navigator.clipboard.writeText(unitURL.toString());
                    copyLinkButton.textContent = "✓ LINK COPIED!";
                }
                catch (error) {
                    copyLinkButton.textContent = "COPY FAILED";
                }
                clearTimeout(copyLinkButton.resetTimeout);
                copyLinkButton.resetTimeout = setTimeout(() => {
                    if (copyLinkButton.isConnected) {
                        copyLinkButton.textContent = "🔗 COPY LINK";
                    }
                }, 2000);
            });
            /*
                Add card to grid.
            */
            unitGrid.appendChild(card);
        });
        /*
            Add grid to section.
        */
        section.appendChild(unitGrid);
        /*
            Add section to database.
        */
        grid.appendChild(section);
    });
    /*
        If nothing matched,
        show a message.
    */
    if (filteredUnits.length === 0) {
        grid.innerHTML = `

            <div class="no-results">

                No units found.

            </div>

        `;
    }
}
function updateCompareControls() {
    const count = document.getElementById("compare-count");
    const button = document.getElementById("compare-selected");
    if (count)
        count.textContent = selectedForCompare.length;
    if (button)
        button.disabled = selectedForCompare.length < 2;
}
document.getElementById("unit-sort")?.addEventListener("change", displayUnits);
document.getElementById("favorites-filter")?.addEventListener("click", event => {
    favoritesOnly = !favoritesOnly;
    event.currentTarget.classList.toggle("active", favoritesOnly);
    event.currentTarget.setAttribute("aria-pressed", String(favoritesOnly));
    event.currentTarget.textContent = favoritesOnly ? "★ FAVORITES ON" : "☆ FAVORITES";
    displayUnits();
});
document.getElementById("compare-selected")?.addEventListener("click", () => {
    const chosen = selectedForCompare.map(name => units.find(unit => unit.name === name)).filter(Boolean);
    if (chosen.length < 2)
        return;
    const modal = document.createElement("div");
    modal.className = "unit-compare-modal";
    const escape = value => String(value ?? "—").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const levels = chosen.map(unit => (unit.stats || []).slice().sort((a, b) => Number(a.level) - Number(b.level)));
    const selected = levels.map(items => items[0] || {});
    const format = value => Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
    modal.innerHTML = `<section class="unit-compare-panel" role="dialog" aria-modal="true" aria-label="Unit comparison">
        <button type="button" class="unit-compare-close" aria-label="Close comparison">×</button>
        <div class="unit-compare-heading"><div><span class="unit-compare-kicker">UNIT DATABASE</span><h2>COMPARE UNITS</h2><p>Select each unit's upgrade level to compare their stats.</p></div></div>
        <div class="unit-compare-table-wrap"><table><thead><tr><th scope="col">STAT</th>${chosen.map((unit, i) => `<th scope="col"><span class="unit-compare-name">${escape(unit.name)}</span><label class="unit-compare-level-label">LEVEL <select class="unit-compare-level" data-index="${i}" aria-label="Level for ${escape(unit.name)}">${levels[i].map(step => `<option value="${escape(step.level)}">Level ${escape(step.level)}</option>`).join("")}</select></label></th>`).join("")}</tr></thead><tbody id="unit-compare-stats"></tbody></table></div>
        <p class="unit-compare-footnote">HPS means hits per second. DPS estimate = damage × HPS. Support effects and special attack behavior may not be reflected in DPS.</p>
    </section>`;
    const render = () => {
        const rows = [
            ["Rarity", (unit, stat) => escape(unit.rarity)],
            ["Attack Type", (unit, stat) => escape(stat.type || unit.type)],
            ["Placement Cost", unit => "$" + format(unit.placement)],
            ["Damage", (unit, stat) => format(stat.damage)],
            ["HPS", (unit, stat) => format(stat.cooldown)],
            ["DPS", (unit, stat) => format((Number(stat.damage) || 0) * (Number(stat.cooldown) || 0))],
            ["Range", (unit, stat) => format(stat.range)],
            ["Placement Limit", unit => escape(unit.maxLimit)]
        ];
        const highestNumeric = new Set(["Damage", "HPS", "DPS", "Range", "Placement Limit"]);
        const lowestNumeric = new Set(["Placement Cost"]);
        modal.querySelector("#unit-compare-stats").innerHTML = rows.map(([label, fn]) => {
            const values = chosen.map((unit, i) => fn(unit, selected[i]));
            const nums = values.map(v => Number(String(v).replace(/[$,]/g, "")));
            const valid = nums.filter(Number.isFinite);
            const target = lowestNumeric.has(label) ? Math.min(...valid) : Math.max(...valid);
            const distinct = new Set(valid).size > 1;
            return `<tr><th scope="row">${label}</th>${values.map((value, i) => {
                const winner = distinct && (highestNumeric.has(label) || lowestNumeric.has(label)) && Number.isFinite(nums[i]) && nums[i] === target;
                return `<td${winner ? ' class="unit-compare-best"' : ''}>${winner ? '<span class="unit-compare-best-icon" aria-label="Best value">★ </span>' : ''}${value}</td>`;
            }).join("")}</tr>`;
        }).join("");
    };
    modal.querySelectorAll(".unit-compare-level").forEach(select => select.addEventListener("change", () => {
        const i = Number(select.dataset.index);
        selected[i] = levels[i].find(stat => String(stat.level) === select.value) || levels[i][0] || {};
        render();
    }));
    document.body.appendChild(modal);
    render();
    const close = () => { modal.remove(); document.removeEventListener("keydown", onKeydown); };
    const onKeydown = event => { if (event.key === "Escape")
        close(); };
    modal.querySelector(".unit-compare-close").addEventListener("click", close);
    modal.addEventListener("click", event => { if (event.target === modal)
        close(); });
    document.addEventListener("keydown", onKeydown);
});
updateCompareControls();
/* =========================================================
   INITIAL DISPLAY
========================================================= */
displayUnits();
