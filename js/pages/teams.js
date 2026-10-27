

const teamWarningTooltip =
    document.getElementById("warning-tooltip");

function showTeamWarning(unit) {
    if (!unitHasWarnings(unit) || !teamWarningTooltip) {
        return;
    }

    teamWarningTooltip.textContent = getUnitWarningText(unit);
    teamWarningTooltip.classList.add("show");
}

function hideTeamWarning() {
    if (!teamWarningTooltip) return;

    teamWarningTooltip.classList.remove("show");
}




function createTeamUnitCard(unit, isSubstitute = false, enchant = null) {

    const card = document.createElement("div");
    card.className = "team-unit-card";

    if (isSubstitute) {
        card.classList.add("substitute");
    }

    const imageWrap = document.createElement("div");
    imageWrap.className = "team-unit-image-wrap";

    
    

    const enchantColor =
    getEnchantColor(enchant, "teams");

    if (enchantColor) {
        imageWrap.style.setProperty(
            "--team-enchant-color",
            enchantColor
        );

        imageWrap.classList.add("has-enchant");

        imageWrap.classList.add(
    getEnchantClass(enchant, "team-enchant-")
);

        const enchantLabel = document.createElement("div");
        enchantLabel.className = "team-unit-enchant";
        enchantLabel.textContent = getEnchantLabel(enchant);

        imageWrap.appendChild(enchantLabel);
    }


    const image = document.createElement("img");
    image.className = "team-unit-image";
    image.src = unit.image;
    image.alt = unit.name;
    image.loading = "lazy";

    imageWrap.appendChild(image);

    

    if (unitHasWarnings(unit)) {

        const warning = document.createElement("div");
        warning.className = "team-unit-warning";
        warning.textContent = "⚠";
        warning.tabIndex = 0;

        warning.setAttribute(
            "aria-label",
            "Data warning for " + unit.name
        );

        warning.addEventListener("mouseenter", () => {
            showTeamWarning(unit);
        });

        warning.addEventListener("mouseleave", hideTeamWarning);

        warning.addEventListener("focus", () => {
            showTeamWarning(unit);
        });

        warning.addEventListener("blur", hideTeamWarning);

        imageWrap.appendChild(warning);
    }

    const name = document.createElement("div");
    name.className = "team-unit-name";
    name.textContent = unit.name;

    imageWrap.appendChild(name);
    card.appendChild(imageWrap);

    return card;
}




function createTeamUnitRow(unitNames, isSubstitute = false, enchantNames = []) {

    const row = document.createElement("div");

    row.className = isSubstitute
        ? "team-units team-substitute-units"
        : "team-units";

    unitNames.forEach((unitName, index) => {

        const unit = findUnitByName(unitName);

        if (!unit) {
            console.warn("Team unit not found:", unitName);
            return;
        }

        
row.appendChild(
    createTeamUnitCard(
        unit,
        isSubstitute,
        enchantNames[index] || null
    )
);


    });

    return row;
}




function createTeamSection(team) {

    const section = document.createElement("section");
    section.className = "team-section";

    

    const header = document.createElement("div");
    header.className = "team-section-header";

    const heading = document.createElement("h2");
    heading.textContent = team.title;

    const description = document.createElement("p");
    description.className = "team-section-description";
    description.textContent = team.description;

    header.appendChild(heading);
    header.appendChild(description);

    

    const mainRow = createTeamUnitRow(
    team.units,
    false,
    team.enchants || []
);

    

    const substituteSection = document.createElement("div");
    substituteSection.className = "team-substitutes";

    const substituteTitle = document.createElement("h3");
    substituteTitle.textContent = "SUBSTITUTES";

    const substituteDescription = document.createElement("p");
    substituteDescription.textContent =
        "Alternative units you can use if you don't have a recommended unit. " +
        "Each substitute corresponds to the main unit directly above it.";

    const substituteRow = createTeamUnitRow(
    team.substitutes,
    true,
    team.substituteEnchants || []
);

    substituteSection.appendChild(substituteTitle);
    substituteSection.appendChild(substituteDescription);
    substituteSection.appendChild(substituteRow);

    

    const explanation = document.createElement("div");
    explanation.className = "team-explanation";

    const label = document.createElement("strong");
    label.textContent = "WHY THIS TEAM WORKS: ";

    explanation.appendChild(label);
    explanation.appendChild(
        document.createTextNode(team.explanation)
    );

    

    section.appendChild(header);
    section.appendChild(mainRow);
    section.appendChild(substituteSection);
    section.appendChild(explanation);

    return section;
}




function renderTeams() {

    const container =
        document.getElementById("teams-container");

    if (!container) return;

    container.innerHTML = "";

    TEAM_COMPOSITIONS.forEach(team => {
        container.appendChild(createTeamSection(team));
    });

}




document.addEventListener("mousemove", event => {

    if (
        !teamWarningTooltip ||
        !teamWarningTooltip.classList.contains("show")
    ) {
        return;
    }

    const offset = 14;

    const tooltipWidth = teamWarningTooltip.offsetWidth;
    const tooltipHeight = teamWarningTooltip.offsetHeight;

    let x = event.clientX + offset;
    let y = event.clientY + offset;

    if (x + tooltipWidth > window.innerWidth) {
        x = event.clientX - tooltipWidth - offset;
    }

    if (y + tooltipHeight > window.innerHeight) {
        y = event.clientY - tooltipHeight - offset;
    }

    teamWarningTooltip.style.left =
        `${Math.max(8, x)}px`;

    teamWarningTooltip.style.top =
        `${Math.max(8, y)}px`;

});


/* =========================================
   INITIALIZE
========================================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderTeams);
} else {
    renderTeams();
}

/* =========================================
   TEAM PAGE TAB SYSTEM
========================================= */

const teamBuilderTab =
    document.getElementById("team-builder-tab");

const recommendedTeamsTab =
    document.getElementById("recommended-teams-tab");

const teamBuilderPanel =
    document.getElementById("team-builder-panel");

const recommendedTeamsPanel =
    document.getElementById("recommended-teams-panel");


function switchTeamsTab(tabName) {

    const showBuilder = tabName === "builder";

    teamBuilderTab.classList.toggle("active", showBuilder);
    recommendedTeamsTab.classList.toggle("active", !showBuilder);

    teamBuilderTab.setAttribute(
        "aria-selected",
        String(showBuilder)
    );

    recommendedTeamsTab.setAttribute(
        "aria-selected",
        String(!showBuilder)
    );

    teamBuilderTab.tabIndex = showBuilder ? 0 : -1;
    recommendedTeamsTab.tabIndex = showBuilder ? -1 : 0;

    teamBuilderPanel.hidden = !showBuilder;
    recommendedTeamsPanel.hidden = showBuilder;

    // Close any open warning tooltip when switching tabs.
    hideTeamWarning();
}


if (
    teamBuilderTab &&
    recommendedTeamsTab &&
    teamBuilderPanel &&
    recommendedTeamsPanel
) {

    teamBuilderTab.addEventListener("click", () => {
        switchTeamsTab("builder");
    });

    recommendedTeamsTab.addEventListener("click", () => {
        switchTeamsTab("recommended");
    });

    const tabs = [teamBuilderTab, recommendedTeamsTab];

    tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", event => {

            let nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();

            tabs[nextIndex].focus();

            switchTeamsTab(
                nextIndex === 0 ? "builder" : "recommended"
            );
        });
    });

    switchTeamsTab("builder");

}

/* =========================================
   V2.4.0 — UNIT PICKER
========================================= */

const builderUnitModal = document.getElementById("builder-unit-modal");
const builderUnitSearch = document.getElementById("builder-unit-search");
const builderUnitResults = document.getElementById("builder-unit-results");
const builderRarityFilter = document.getElementById("builder-rarity-filter");
const builderTypeFilter = document.getElementById("builder-type-filter");
const builderModalClose = document.getElementById("builder-unit-modal-close");

const builderSlots = Array(5).fill(null);

let builderSelectedSlot = null;
let builderPreviousFocus = null;

function openBuilderUnitPicker(slotIndex) {
    if (!builderUnitModal) return;

    builderSelectedSlot = slotIndex;
    builderPreviousFocus = document.activeElement;

    builderUnitSearch.value = "";
    builderRarityFilter.value = "";
    builderTypeFilter.value = "";

    renderBuilderUnitOptions();

    builderUnitModal.hidden = false;
    document.body.style.overflow = "hidden";
    builderUnitSearch.focus();
}

function closeBuilderUnitPicker() {
    if (!builderUnitModal) return;

    builderUnitModal.hidden = true;
    document.body.style.overflow = "";

    builderPreviousFocus?.focus();
}

function renderBuilderUnitOptions() {
    if (!builderUnitResults || typeof units === "undefined") return;

    builderUnitResults.innerHTML = "";

    const search = builderUnitSearch.value.trim().toLowerCase();
    const rarity = builderRarityFilter.value;
    const type = builderTypeFilter.value;

    const filtered = units.filter(unit => {
        return (
            unit.name.toLowerCase().includes(search) &&
            (!rarity || unit.rarity === rarity) &&
            (!type || unit.type === type)
        );
    });

    if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "builder-unit-empty";
        empty.textContent = "No matching units found.";
        builderUnitResults.appendChild(empty);
        return;
    }

    filtered.forEach(unit => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "builder-unit-option";

        const alreadyUsed = builderSlots.some(
            slot => slot && slot.unitName === unit.name
        );

        option.disabled = alreadyUsed;

        const img = document.createElement("img");
        img.src = unit.image;
        img.alt = "";
        img.loading = "lazy";

        const name = document.createElement("span");
        name.className = "builder-unit-option-name";
        name.textContent = unit.name;

        const rarityLabel = document.createElement("span");
        rarityLabel.className = "builder-unit-option-rarity";
        rarityLabel.textContent = unit.rarity;

        if (typeof getRarityColor === "function") {
            rarityLabel.style.color = getRarityColor(unit.rarity);
        }

        option.append(img, name, rarityLabel);

        option.addEventListener("click", () => {
            builderIsEditing = Boolean(builderSlots[builderSelectedSlot]);

            // Selecting a replacement opens configuration,
            // but the edit controls are only needed for an
            // already selected unit.
            builderIsEditing = false;

            openBuilderUnitConfig(unit);
        });

        builderUnitResults.appendChild(option);
    });
}

if (
    builderUnitModal &&
    builderUnitSearch &&
    builderUnitResults &&
    builderRarityFilter &&
    builderTypeFilter &&
    builderModalClose
) {
    // Fill filters directly from the existing unit database.
    const rarities = [...new Set(units.map(unit => unit.rarity))];
    const types = [...new Set(units.map(unit => unit.type))];

    rarities.forEach(rarity => {
        builderRarityFilter.add(new Option(rarity, rarity));
    });

    types.forEach(type => {
        builderTypeFilter.add(new Option(type, type));
    });

    document.querySelectorAll(".builder-slot").forEach(slot => {
        slot.addEventListener("click", () => {
            const index = Number(slot.dataset.slot);
            const selection = builderSlots[index];

            if (selection) {
                const unit = findUnitByName(selection.unitName);

                if (unit) {
                    builderSelectedSlot = index;
                    builderPreviousFocus = slot;
                    builderIsEditing = true;

                    openBuilderUnitConfig(unit, selection.enchant);
                }
            } else {
                builderIsEditing = false;
                openBuilderUnitPicker(index);
            }
        });
    });

    builderUnitSearch.addEventListener("input", renderBuilderUnitOptions);
    builderRarityFilter.addEventListener("change", renderBuilderUnitOptions);
    builderTypeFilter.addEventListener("change", renderBuilderUnitOptions);

    builderModalClose.addEventListener("click", closeBuilderUnitPicker);

    builderUnitModal.addEventListener("click", event => {
        if (event.target === builderUnitModal) {
            closeBuilderUnitPicker();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !builderUnitModal.hidden) {
            closeBuilderUnitPicker();
        }
    });
}

/* =========================================
   V2.4.0 — UNIT CONFIGURATION
========================================= */

const builderConfigModal =
    document.getElementById("builder-config-modal");

const builderConfigImage =
    document.getElementById("builder-config-image");

const builderConfigName =
    document.getElementById("builder-config-name");

const builderConfigRarity =
    document.getElementById("builder-config-rarity");

const builderConfigType =
    document.getElementById("builder-config-type");

const builderEnchantOptions =
    document.getElementById("builder-enchant-options");

let builderConfigUnit = null;
let builderSelectedEnchant = null;
let builderIsEditing = false;


function openBuilderUnitConfig(unit, savedEnchant = null) {
    if (!builderConfigModal || !unit) return;

    builderConfigUnit = unit;
    builderSelectedEnchant = savedEnchant;

    const editActions = document.getElementById("builder-edit-actions");
    const addButton = document.getElementById("builder-config-add");

    editActions.hidden = !builderIsEditing;

    addButton.textContent = builderIsEditing
        ? "SAVE CHANGES"
        : "ADD TO TEAM";

    builderConfigImage.src = unit.image;
    builderConfigImage.alt = unit.name;

    builderConfigName.textContent = unit.name;
    builderConfigRarity.textContent = unit.rarity;
    builderConfigType.textContent = unit.type;

    if (typeof getRarityColor === "function") {
        builderConfigRarity.style.color =
            getRarityColor(unit.rarity);
    }

    /* ENCHANTMENTS */

    builderEnchantOptions.innerHTML = "";

    const enchantNames = ["None", ...Object.keys(enchants)];

    enchantNames.forEach(enchantName => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "builder-enchant-option";
        button.dataset.enchant = enchantName;
        const label = document.createElement("span");

        label.textContent =
            enchantName === "None"
                ? "NONE"
                : enchants[enchantName].name;

        if (["Haywire", "Springlock", "Soul"].includes(enchantName)) {
            label.classList.add("builder-enchant-gradient-text");
        }

        button.appendChild(label);

        button.setAttribute(
            "aria-pressed",
            String(enchantName === (savedEnchant || "None"))
        );

        if (enchantName === (savedEnchant || "None")) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            builderSelectedEnchant =
                enchantName === "None" ? null : enchantName;

            builderEnchantOptions
                .querySelectorAll(".builder-enchant-option")
                .forEach(option => {
                    const selected =
                        option.dataset.enchant === enchantName;

                    option.classList.toggle("selected", selected);
                    option.setAttribute(
                        "aria-pressed",
                        String(selected)
                    );
                });
        });

        builderEnchantOptions.appendChild(button);
    });

    /* SWITCH MODALS */

    builderUnitModal.hidden = true;
    builderConfigModal.hidden = false;
    document.body.style.overflow = "hidden";

    document.getElementById("builder-config-close").focus();
}


function closeBuilderUnitConfig(goBack = false) {
    builderConfigModal.hidden = true;

    if (goBack) {
        builderUnitModal.hidden = false;
        renderBuilderUnitOptions();
        builderUnitSearch.focus();
    } else {
        document.body.style.overflow = "";
        builderPreviousFocus?.focus();
    }
}


/* MODAL EVENTS */

document.getElementById("builder-config-close")
    .addEventListener("click", () => {
        closeBuilderUnitConfig();
    });

document.getElementById("builder-config-back")
    .addEventListener("click", () => {
        closeBuilderUnitConfig(true);
    });

builderConfigModal.addEventListener("click", event => {
    if (event.target === builderConfigModal) {
        closeBuilderUnitConfig();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderConfigModal.hidden) {
        closeBuilderUnitConfig();
    }
});

document.getElementById("builder-config-add")
    .addEventListener("click", () => {
        if (!builderConfigUnit || builderSelectedSlot === null) return;

        const duplicate = builderSlots.some((slot, index) =>
            index !== builderSelectedSlot &&
            slot?.unitName === builderConfigUnit.name
        );

        if (duplicate) {
            alert("This unit is already on your team!");
            return;
        }

        builderSlots[builderSelectedSlot] = {
            unitName: builderConfigUnit.name,
            enchant: builderSelectedEnchant
        };

        renderBuilderSlots();
        closeBuilderUnitConfig();
    });

/* =========================================
   V2.4.0 — MAX LEVEL UNIT HELPERS
========================================= */

function getBuilderMaxLevelStats(unit) {
    if (!unit?.stats?.length) return null;

    return unit.stats.reduce((highest, stat) => {
        return Number(stat.level) > Number(highest.level)
            ? stat
            : highest;
    });
}

function getBuilderTotalUpgradeCost(unit) {
    if (!unit) return 0;

    const placement = Number(unit.placement) || 0;

    const upgrades = (unit.stats || []).reduce((total, stat) => {
        return total + (Number(stat.cost) || 0);
    }, 0);

    return placement + upgrades;
}

/* =========================================
   V2.4.0 — TEAM SLOT RENDERING
========================================= */

function renderBuilderSlots() {
    const slotButtons = document.querySelectorAll(".builder-slot");

    slotButtons.forEach((button, index) => {
        const selection = builderSlots[index];

        button.replaceChildren();
        button.classList.toggle("filled", Boolean(selection));

        if (!selection) {
            const plus = document.createElement("span");
            plus.className = "builder-slot-plus";
            plus.textContent = "+";

            const label = document.createElement("span");
            label.className = "builder-slot-label";
            label.textContent = `SLOT ${index + 1}`;

            button.append(plus, label);
            button.setAttribute("aria-label", `Add unit to slot ${index + 1}`);
            return;
        }

        const unit = findUnitByName(selection.unitName);
        if (!unit) return;

        const image = document.createElement("img");
        image.className = "builder-slot-image";
        image.src = unit.image;
        image.alt = "";

        const name = document.createElement("span");
        name.className = "builder-slot-name";
        name.textContent = unit.name;

        const enchant = document.createElement("span");
        enchant.className = "builder-slot-enchant";

        const enchantName = selection.enchant || "None";
        enchant.textContent = enchantName.toUpperCase();
        enchant.dataset.enchant = enchantName;

        const placements = document.createElement("span");
        placements.className = "builder-slot-placements";
        
        const maxPlacements = Number(unit.maxLimit);

        placements.textContent = Number.isFinite(maxPlacements)
            ? `PLACEMENTS: ${maxPlacements}`
            : "PLACEMENTS: —";

        button.append(image, name, enchant, placements);
        button.setAttribute(
            "aria-label",
            `Edit slot ${index + 1}: ${unit.name}`
        );
    });

    const count = builderSlots.filter(Boolean).length;

    document.getElementById("builder-team-count").textContent =
        `${count} / 5 UNITS`;

    document.getElementById("builder-slots-remaining").textContent =
        `${5 - count} slots available`;

    updateBuilderTeamStats();

    if (builderActiveTeamId) {
        saveBuilderTeams();
        updateBuilderActiveTeamInfo();
    }
}

/* =========================================
   V2.4.0 — TEAM STATISTICS
========================================= */

function getBuilderEnchantedStats(unit, enchantName) {
    const maxStats = getBuilderMaxLevelStats(unit);
    if (!maxStats) return null;

    const enchant = enchantName ? enchants[enchantName] : null;

    let damage = Number(maxStats.damage);
    let hps = Number(maxStats.cooldown);

    if (!Number.isFinite(damage) || !Number.isFinite(hps)) {
        return null;
    }

    if (enchant?.damage) {
        damage *= 1 + enchant.damage / 100;
    }

    if (enchant?.attackSpeed) {
        hps /= 1 + enchant.attackSpeed / 100;
    }

    return { damage, hps, dps: damage * hps };
}

/* =========================================
   V2.4.0 — TEAM STATISTICS
========================================= */

function updateBuilderTeamStats() {
    let totalDPS = 0;
    let totalCost = 0;
    let totalPlacements = 0;
    let maxDeployedDPS = 0;
    let maxDeployedCost = 0;

    let hasUnknownDPS = false;
    let hasUnknownPlacements = false;

    builderSlots.forEach(selection => {
        if (!selection) return;

        const unit = findUnitByName(selection.unitName);
        if (!unit) return;

        const placements = Number(unit.maxLimit);
        const validPlacements =
            Number.isFinite(placements) && placements >= 0;

        if (validPlacements) {
            totalPlacements += placements;
        } else {
            hasUnknownPlacements = true;
        }

        const stats = getBuilderEnchantedStats(
            unit,
            selection.enchant
        );

        if (stats) {
            totalDPS += stats.dps;

            if (validPlacements) {
                maxDeployedDPS += stats.dps * placements;
            }
        } else if (
            unit.type !== "Range Buff" &&
            unit.type !== "Damage Buff" &&
            unit.type !== "Slower"
        ) {
            hasUnknownDPS = true;
        }

        let cost = getBuilderTotalUpgradeCost(unit);

        const enchant = selection.enchant
            ? enchants[selection.enchant]
            : null;

        if (enchant?.cost) {
            cost *= 1 + enchant.cost / 100;
        }

        totalCost += cost;

        if (validPlacements) {
            maxDeployedCost += cost * placements;
        }
    });

    const format = value =>
        typeof formatNumber === "function"
            ? formatNumber(value)
            : Math.round(value).toLocaleString();

    const setStat = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setStat(
        "builder-team-dps",
        hasUnknownDPS
            ? `${format(totalDPS)}+ (incomplete)`
            : format(totalDPS)
    );

    setStat(
        "builder-team-cost",
        `$${format(totalCost)}`
    );

    setStat(
        "builder-team-placements",
        hasUnknownPlacements
            ? `${totalPlacements}+ (incomplete)`
            : totalPlacements.toLocaleString()
    );

    setStat(
        "builder-max-dps",
        hasUnknownDPS || hasUnknownPlacements
            ? `${format(maxDeployedDPS)}+ (incomplete)`
            : format(maxDeployedDPS)
    );

    setStat(
        "builder-max-cost",
        hasUnknownPlacements
            ? `$${format(maxDeployedCost)}+ (incomplete)`
            : `$${format(maxDeployedCost)}`
    );
}

/* =========================================
   V2.4.0 — TEAM MANAGEMENT
========================================= */

const builderEditActions =
    document.getElementById("builder-edit-actions");

const builderMoveModal =
    document.getElementById("builder-move-modal");

const builderMoveOptions =
    document.getElementById("builder-move-options");

let builderMoveSource = null;

document.getElementById("builder-config-remove")
    .addEventListener("click", () => {
        if (builderSelectedSlot === null) return;

        builderSlots[builderSelectedSlot] = null;

        renderBuilderSlots();
        closeBuilderUnitConfig();
    });

document.getElementById("builder-config-replace")
    .addEventListener("click", () => {
        closeBuilderUnitConfig(true);
    });

document.getElementById("builder-config-move")
    .addEventListener("click", () => {
        if (builderSelectedSlot === null) return;

        builderMoveSource = builderSelectedSlot;

        builderConfigModal.hidden = true;
        builderMoveModal.hidden = false;

        renderBuilderMoveOptions();

        document.getElementById("builder-move-close").focus();
    });

function renderBuilderMoveOptions() {
    builderMoveOptions.replaceChildren();

    builderSlots.forEach((selection, index) => {
        if (index === builderMoveSource) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "builder-move-option";

        const label = document.createElement("span");
        label.className = "builder-move-slot-label";
        label.textContent = `SLOT ${index + 1}`;

        const unitName = document.createElement("span");
        unitName.className = "builder-move-unit-name";
        unitName.textContent = selection?.unitName || "EMPTY";

        button.append(label, unitName);

        button.addEventListener("click", () => {
            const source = builderMoveSource;

            if (source === null) return;

            const temporary = builderSlots[source];

            builderSlots[source] = builderSlots[index];
            builderSlots[index] = temporary;

            renderBuilderSlots();
            closeBuilderMoveModal();
        });

        builderMoveOptions.appendChild(button);
    });
}

function closeBuilderMoveModal() {
    builderMoveModal.hidden = true;
    builderMoveSource = null;

    document.body.style.overflow = "";
    builderPreviousFocus?.focus();
}

document.getElementById("builder-move-close")
    .addEventListener("click", closeBuilderMoveModal);

builderMoveModal.addEventListener("click", event => {
    if (event.target === builderMoveModal) {
        closeBuilderMoveModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderMoveModal.hidden) {
        closeBuilderMoveModal();
    }
});

/* =========================================
   V2.4.0 — CUSTOM STAT VISIBILITY
========================================= */

const builderStatCheckboxes = document.querySelectorAll(
    "[data-builder-stat]"
);

const BUILDER_STAT_STORAGE_KEY =
    "fivetds-team-builder-stat-preferences";

function updateBuilderStatVisibility() {
    const preferences = {};

    builderStatCheckboxes.forEach(checkbox => {
        const key = checkbox.dataset.builderStat;
        const visible = checkbox.checked;

        preferences[key] = visible;

        const statBox = document.querySelector(
            `[data-stat-box="${key}"]`
        );

        if (statBox) {
            statBox.hidden = !visible;
        }
    });

    try {
        localStorage.setItem(
            BUILDER_STAT_STORAGE_KEY,
            JSON.stringify(preferences)
        );
    } catch (error) {
        console.warn("Could not save stat preferences:", error);
    }
}

function loadBuilderStatPreferences() {
    try {
        const saved = localStorage.getItem(
            BUILDER_STAT_STORAGE_KEY
        );

        if (saved) {
            const preferences = JSON.parse(saved);

            builderStatCheckboxes.forEach(checkbox => {
                const key = checkbox.dataset.builderStat;

                if (typeof preferences[key] === "boolean") {
                    checkbox.checked = preferences[key];
                }
            });
        }
    } catch (error) {
        console.warn("Could not load stat preferences:", error);
    }

    updateBuilderStatVisibility();
}

builderStatCheckboxes.forEach(checkbox => {
    checkbox.addEventListener(
        "change",
        updateBuilderStatVisibility
    );
});

loadBuilderStatPreferences();


/* =========================================
   V2.4.0 — SAVED TEAMS
========================================= */

const BUILDER_TEAMS_STORAGE_KEY = "fivetds-saved-teams-v1";

const builderSavedTeamSelect =
    document.getElementById("builder-saved-team-select");

let builderSavedTeams = [];
let builderActiveTeamId = null;

function createBuilderTeam(name, slots = null) {
    return {
        id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        slots: slots
            ? slots.map(slot => slot ? { ...slot } : null)
            : Array(5).fill(null)
    };
}

function saveBuilderTeams() {
    const activeTeam = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    if (activeTeam) {
        activeTeam.slots = builderSlots.map(
            slot => slot ? { ...slot } : null
        );
    }

    try {
        localStorage.setItem(
            BUILDER_TEAMS_STORAGE_KEY,
            JSON.stringify({
                activeTeamId: builderActiveTeamId,
                teams: builderSavedTeams
            })
        );

        // Only show SAVED after storage succeeds.
        showBuilderSaveStatus();

        return true;

    } catch (error) {
        console.warn("Could not save teams:", error);

        const status = document.getElementById(
            "builder-save-status"
        );

        const text = document.getElementById(
            "builder-save-status-text"
        );

        clearTimeout(builderSaveStatusTimer);

        if (status && text) {
            status.classList.remove("saved");
            text.textContent = "SAVE FAILED";
        }

        return false;
    }
}

function renderBuilderTeamSelector() {
    builderSavedTeamSelect.replaceChildren();

    builderSavedTeams.forEach(team => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;

        builderSavedTeamSelect.appendChild(option);
    });

    builderSavedTeamSelect.value = builderActiveTeamId;
}

function loadBuilderTeam(teamId) {
    const team = builderSavedTeams.find(
        item => item.id === teamId
    );

    if (!team) return;

    builderActiveTeamId = team.id;

    team.slots.forEach((slot, index) => {
        builderSlots[index] = slot ? { ...slot } : null;
    });

    renderBuilderTeamSelector();
    renderBuilderSlots();
    saveBuilderTeams();
}

function loadSavedBuilderTeams() {
    try {
        const saved = localStorage.getItem(
            BUILDER_TEAMS_STORAGE_KEY
        );

        if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed.teams)) {
                builderSavedTeams = parsed.teams;
                builderActiveTeamId = parsed.activeTeamId;
            }
        }
    } catch (error) {
        console.warn("Could not load saved teams:", error);
    }

    if (!builderSavedTeams.length) {
        const defaultTeam = createBuilderTeam("My First Team");

        builderSavedTeams.push(defaultTeam);
        builderActiveTeamId = defaultTeam.id;
    }

    if (!builderSavedTeams.some(
        team => team.id === builderActiveTeamId
    )) {
        builderActiveTeamId = builderSavedTeams[0].id;
    }

    loadBuilderTeam(builderActiveTeamId);
}

/* =========================================
   TEAM ACTIONS
========================================= */

builderSavedTeamSelect.addEventListener("change", () => {
    // Save current team before switching.
    saveBuilderTeams();
    loadBuilderTeam(builderSavedTeamSelect.value);
});

document.getElementById("builder-new-team")
    .addEventListener("click", () => openBuilderTeamAction("new"));

document.getElementById("builder-rename-team")
    .addEventListener("click", () => openBuilderTeamAction("rename"));

document.getElementById("builder-duplicate-team")
    .addEventListener("click", () => openBuilderTeamAction("duplicate"));

document.getElementById("builder-delete-team")
    .addEventListener("click", () => openBuilderTeamAction("delete"));

/* =========================================
   V2.4.0 — POLISHED TEAM MANAGEMENT
========================================= */

const builderTeamActionModal =
    document.getElementById("builder-team-action-modal");

const builderTeamActionTitle =
    document.getElementById("builder-team-action-title");

const builderTeamActionDescription =
    document.getElementById("builder-team-action-description");

const builderTeamNameInput =
    document.getElementById("builder-team-name-input");

const builderTeamNameLabel =
    document.getElementById("builder-team-name-label");

const builderTeamActionError =
    document.getElementById("builder-team-action-error");

const builderTeamActionConfirm =
    document.getElementById("builder-team-action-confirm");

let builderTeamAction = null;
let builderTeamActionPreviousFocus = null;
let builderSaveStatusTimer = null;

function openBuilderTeamAction(action) {
    const active = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    builderTeamAction = action;
    builderTeamActionPreviousFocus = document.activeElement;

    builderTeamActionError.hidden = true;
    builderTeamNameInput.value = "";
    builderTeamNameInput.hidden = action === "delete";
    builderTeamNameLabel.hidden = action === "delete";

    const configs = {
        new: {
            title: "CREATE NEW TEAM",
            description: "Give your new team a name to get started.",
            confirm: "CREATE TEAM",
            name: ""
        },
        rename: {
            title: "RENAME TEAM",
            description: "Choose a new name for your current team.",
            confirm: "SAVE NAME",
            name: active?.name || ""
        },
        duplicate: {
            title: "DUPLICATE TEAM",
            description: "Create a copy of your current team, including its units and enchantments.",
            confirm: "DUPLICATE",
            name: `${active?.name || "Team"} (Copy)`
        },
        delete: {
            title: "DELETE TEAM",
            description: `Permanently delete "${active?.name || "this team"}" from this browser? This cannot be undone.`,
            confirm: "DELETE TEAM",
            name: ""
        }
    };

    const config = configs[action];
    if (!config) return;

    builderTeamActionTitle.textContent = config.title;
    builderTeamActionDescription.textContent = config.description;
    builderTeamActionConfirm.textContent = config.confirm;
    builderTeamNameInput.value = config.name;

    builderTeamActionConfirm.classList.toggle(
        "builder-team-delete-confirm",
        action === "delete"
    );

    builderTeamActionModal.hidden = false;
    document.body.style.overflow = "hidden";

    if (action === "delete") {
        builderTeamActionConfirm.focus();
    } else {
        builderTeamNameInput.focus();
        builderTeamNameInput.select();
    }
}

function closeBuilderTeamAction() {
    builderTeamActionModal.hidden = true;
    builderTeamAction = null;
    document.body.style.overflow = "";
    builderTeamActionPreviousFocus?.focus();
}

function confirmBuilderTeamAction() {
    const action = builderTeamAction;
    if (!action) return;

    const name = builderTeamNameInput.value.trim();

    if (action !== "delete" && !name) {
        builderTeamActionError.textContent = "Please enter a team name.";
        builderTeamActionError.hidden = false;
        builderTeamNameInput.focus();
        return;
    }

    const active = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    if (action === "new") {
        saveBuilderTeams();

        const team = createBuilderTeam(name);
        builderSavedTeams.push(team);
        loadBuilderTeam(team.id);
    }

    if (action === "rename" && active) {
        active.name = name;
        renderBuilderTeamSelector();
        saveBuilderTeams();
    }

    if (action === "duplicate" && active) {
        saveBuilderTeams();

        const copy = createBuilderTeam(name, active.slots);
        builderSavedTeams.push(copy);
        loadBuilderTeam(copy.id);
    }

    if (action === "delete" && active) {
        builderSavedTeams = builderSavedTeams.filter(
            team => team.id !== active.id
        );

        if (!builderSavedTeams.length) {
            builderSavedTeams.push(
                createBuilderTeam("My First Team")
            );
        }

        loadBuilderTeam(builderSavedTeams[0].id);
    }

    closeBuilderTeamAction();
    updateBuilderActiveTeamInfo();
}

document.getElementById("builder-team-action-close")
    .addEventListener("click", closeBuilderTeamAction);

document.getElementById("builder-team-action-cancel")
    .addEventListener("click", closeBuilderTeamAction);

builderTeamActionConfirm.addEventListener(
    "click",
    confirmBuilderTeamAction
);

builderTeamNameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        confirmBuilderTeamAction();
    }
});

builderTeamActionModal.addEventListener("click", event => {
    if (event.target === builderTeamActionModal) {
        closeBuilderTeamAction();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderTeamActionModal.hidden) {
        closeBuilderTeamAction();
    }
});

/* Active team summary */

function updateBuilderActiveTeamInfo() {
    const active = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    if (!active) return;

    document.getElementById("builder-active-team-name").textContent =
        active.name;

    const count = builderSlots.filter(Boolean).length;

    document.getElementById("builder-active-team-summary").textContent =
        `${count} / 5 units`;
}

/* Save feedback */

function showBuilderSaveStatus() {
    const status = document.getElementById("builder-save-status");
    const text = document.getElementById("builder-save-status-text");

    if (!status || !text) return;

    clearTimeout(builderSaveStatusTimer);

    text.textContent = "SAVED";
    status.classList.add("saved");

    builderSaveStatusTimer = setTimeout(() => {
        text.textContent = "AUTO-SAVE ON";
        status.classList.remove("saved");
    }, 1800);
}

loadSavedBuilderTeams();

/* =========================================
   V2.4.0 — CAPTURE TEAM AS PNG
========================================= */

const builderCaptureButton =
    document.getElementById("builder-capture-team");

function builderCaptureRoundedRect(ctx, x, y, w, h, radius, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }

    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

function builderCaptureFitText(ctx, text, maxWidth, fontSize, minSize = 13) {
    let size = fontSize;

    while (size > minSize) {
        ctx.font = `900 ${size}px Arial`;

        if (ctx.measureText(text).width <= maxWidth) {
            break;
        }

        size--;
    }

    return size;
}

function builderCaptureWrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach(word => {
        const test = line ? `${line} ${word}` : word;

        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    });

    if (line) lines.push(line);

    return lines;
}

function builderCaptureDrawEnchant(ctx, enchant, x, y) {
    const special = {
        Haywire: ["#8b5cf6", "#98ffcc"],
        Springlock: ["#98ffcc", "#ff3b3b"],
        Soul: ["#14b8a6", "#ff69b4"]
    };

    const normal = {
        Battery: "#b4ffaa",
        Hunt: "#aaaaff",
        Hook: "#ff8787",
        Eco: "#fffa96",
        None: "#aaaaaa"
    };

    ctx.font = "900 20px Arial";
    ctx.textAlign = "center";

    const label = enchant.toUpperCase();

    if (special[enchant]) {
        const width = ctx.measureText(label).width;
        const gradient = ctx.createLinearGradient(
            x - width / 2,
            y,
            x + width / 2,
            y
        );

        gradient.addColorStop(0, special[enchant][0]);
        gradient.addColorStop(1, special[enchant][1]);

        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = normal[enchant] || "#aaaaaa";
    }

    ctx.fillText(label, x, y);
}

async function builderCaptureLoadImage(src) {
    return new Promise(resolve => {
        const image = new Image();

        // Request cross-origin images using CORS
        image.crossOrigin = "anonymous";

        image.onload = () => resolve(image);

        image.onerror = () => {
            console.warn("Could not load image for capture:", src);
            resolve(null);
        };

        image.src = src;
    });
}

async function captureBuilderTeam() {
    const active = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    if (!active) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const slotWidth = 212;
    const slotHeight = 330;
    const gap = 20;
    const padding = 22;

    canvas.width = padding * 2 + slotWidth * 5 + gap * 4;
    canvas.height = slotHeight + padding * 2;

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const images = await Promise.all(
        builderSlots.map(async selection => {
            if (!selection) return null;

            const unit = findUnitByName(selection.unitName);

            if (!unit) return null;

            return builderCaptureLoadImage(unit.image);
        })
    );

    const missingImages = builderSlots.some(
        (selection, index) => selection && !images[index]
    );

    if (missingImages) {
        throw new Error(
            "One or more unit images could not be loaded for capture."
        );
    }

    builderSlots.forEach((selection, index) => {
        const x = padding + index * (slotWidth + gap);
        const y = padding;

        builderCaptureRoundedRect(
            ctx,
            x,
            y,
            slotWidth,
            slotHeight,
            16,
            "#151515",
            "#444444"
        );

        if (!selection) {
            ctx.fillStyle = "#777";
            ctx.textAlign = "center";
            ctx.font = "900 18px Arial";

            ctx.fillText(
                `SLOT ${index + 1}`,
                x + slotWidth / 2,
                y + slotHeight / 2
            );

            return;
        }

        const unit = findUnitByName(selection.unitName);

        if (!unit) return;

        const centerX = x + slotWidth / 2;

        /* Unit image */

        const image = images[index];

        if (image) {
            const imageSize = 118;
            const imageX = centerX - imageSize / 2;
            const imageY = y + 23;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(
                imageX,
                imageY,
                imageSize,
                imageSize,
                14
            );
            ctx.clip();

            const scale = Math.max(
                imageSize / image.width,
                imageSize / image.height
            );

            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;

            ctx.drawImage(
                image,
                imageX + (imageSize - drawWidth) / 2,
                imageY + (imageSize - drawHeight) / 2,
                drawWidth,
                drawHeight
            );

            ctx.restore();
        }

        /* Unit name */

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        const nameSize = builderCaptureFitText(
            ctx,
            unit.name,
            slotWidth - 24,
            23,
            17
        );

        ctx.font = `900 ${nameSize}px Arial`;

        const nameLines = builderCaptureWrapText(
            ctx,
            unit.name,
            slotWidth - 24
        ).slice(0, 3);

        let nameY = y + 170;

        nameLines.forEach(line => {
            ctx.fillText(line, centerX, nameY);
            nameY += nameSize + 4;
        });

        /* Enchantment */

        builderCaptureDrawEnchant(
            ctx,
            selection.enchant || "None",
            centerX,
            y + 255
        );

        /* Placements */

        const placements = Number(unit.maxLimit);

        ctx.fillStyle = "#b4fcff";
        ctx.textAlign = "center";
        ctx.font = "900 17px Arial";

        ctx.fillText(
            "PLACEMENTS:",
            centerX,
            y + 287
        );

        ctx.font = "900 22px Arial";

        ctx.fillText(
            Number.isFinite(placements)
                ? String(placements)
                : "—",
            centerX,
            y + 313
        );
    });

    const safeName = active.name
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "") || "My-Team";

    const filename = `${safeName}.png`;

    canvas.toBlob(blob => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
}

if (builderCaptureButton) {
    builderCaptureButton.addEventListener("click", async () => {
        builderCaptureButton.disabled = true;
        builderCaptureButton.textContent = "CAPTURING...";

        try {
            await captureBuilderTeam();
        } catch (error) {
            console.error("Team capture failed:", error);
            alert("Could not capture the team. Please try again.");
        } finally {
            builderCaptureButton.disabled = false;
            builderCaptureButton.textContent = "CAPTURE TEAM";
        }
    });
}

/* =========================================
   V2.4.0 — SHAREABLE TEAMS
========================================= */

const builderShareButton =
    document.getElementById("builder-share-team");

const builderShareModal =
    document.getElementById("builder-share-modal");

const builderSharePreview =
    document.getElementById("builder-share-preview");

const builderShareDescription =
    document.getElementById("builder-share-description");

let builderIncomingTeam = null;
let builderSharePreviousFocus = null;

/* Encode UTF-8 text safely for URL sharing */

function builderEncodeTeam(data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));

    let binary = "";

    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function builderDecodeTeam(encoded) {
    const normalized = encoded
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const binary = atob(normalized);

    const bytes = Uint8Array.from(
        binary,
        character => character.charCodeAt(0)
    );

    return JSON.parse(new TextDecoder().decode(bytes));
}

/* Generate share link */

async function shareBuilderTeam() {
    const active = builderSavedTeams.find(
        team => team.id === builderActiveTeamId
    );

    if (!active) return;

    const data = {
        version: 1,
        name: active.name,
        slots: builderSlots.map(slot =>
            slot
                ? {
                    unitName: slot.unitName,
                    enchant: slot.enchant || null
                }
                : null
        )
    };

    const url = new URL(window.location.href);

    url.searchParams.set("team", builderEncodeTeam(data));

    // Avoid carrying an old URL fragment into the shared link.
    url.hash = "";

    try {
        await navigator.clipboard.writeText(url.toString());

        const originalText = builderShareButton.textContent;

        builderShareButton.textContent = "LINK COPIED!";

        setTimeout(() => {
            builderShareButton.textContent = originalText;
        }, 2000);
    } catch (error) {
        // Clipboard may be unavailable on HTTP or local file pages.
        window.prompt("Copy your team link:", url.toString());
    }
}

/* Validate imported team data */

function validateBuilderSharedTeam(data) {
    if (!data || data.version !== 1) return null;

    if (
        typeof data.name !== "string" ||
        !Array.isArray(data.slots) ||
        data.slots.length !== 5
    ) {
        return null;
    }

    const usedUnits = new Set();

    const slots = [];

    for (const slot of data.slots) {
        if (slot === null) {
            slots.push(null);
            continue;
        }

        if (
            !slot ||
            typeof slot.unitName !== "string" ||
            typeof slot.enchant !== "string" && slot.enchant !== null
        ) {
            return null;
        }

        const unit = findUnitByName(slot.unitName);

        if (!unit || usedUnits.has(unit.name)) {
            return null;
        }

        if (slot.enchant && !enchants[slot.enchant]) {
            return null;
        }

        usedUnits.add(unit.name);

        slots.push({
            unitName: unit.name,
            enchant: slot.enchant
        });
    }

    return {
        name: data.name.trim().slice(0, 50) || "Shared Team",
        slots
    };
}

/* Shared team preview */

function openBuilderSharePreview(team) {
    builderIncomingTeam = team;
    builderSharePreviousFocus = document.activeElement;

    builderShareDescription.textContent =
        `Someone shared "${team.name}" with you. ` +
        "Importing creates a new saved team without changing your existing teams.";

    builderSharePreview.replaceChildren();

    team.slots.forEach((selection, index) => {
        const card = document.createElement("div");
        card.className = "builder-share-unit";

        if (!selection) {
            card.textContent = `SLOT ${index + 1} — EMPTY`;
            builderSharePreview.appendChild(card);
            return;
        }

        const unit = findUnitByName(selection.unitName);

        const image = document.createElement("img");
        image.src = unit.image;
        image.alt = "";

        const name = document.createElement("strong");
        name.textContent = unit.name;

        const enchant = document.createElement("span");
        enchant.textContent =
            (selection.enchant || "None").toUpperCase();

        enchant.dataset.enchant =
            selection.enchant || "None";

        enchant.className = "builder-slot-enchant";

        card.append(image, name, enchant);

        builderSharePreview.appendChild(card);
    });

    builderShareModal.hidden = false;
    document.body.style.overflow = "hidden";

    document.getElementById("builder-share-import").focus();
}

function closeBuilderSharePreview() {
    builderShareModal.hidden = true;
    builderIncomingTeam = null;

    document.body.style.overflow = "";

    // Remove the shared team from the URL
    // so refreshing won't reopen the preview.
    const url = new URL(window.location.href);

    if (url.searchParams.has("team")) {
        url.searchParams.delete("team");

        window.history.replaceState(
            window.history.state,
            "",
            url.toString()
        );
    }

    builderSharePreviousFocus?.focus();
}

/* Import as a new saved team */

function importBuilderSharedTeam() {
    if (!builderIncomingTeam) return;

    saveBuilderTeams();

    const imported = createBuilderTeam(
        builderIncomingTeam.name,
        builderIncomingTeam.slots
    );

    builderSavedTeams.push(imported);

    closeBuilderSharePreview();

    loadBuilderTeam(imported.id);
    updateBuilderActiveTeamInfo();

    // Remove the share parameter after importing.
    const url = new URL(window.location.href);
    url.searchParams.delete("team");

    window.history.replaceState({}, "", url.toString());
}

/* Button events */

builderShareButton.addEventListener("click", shareBuilderTeam);

document.getElementById("builder-share-close")
    .addEventListener("click", closeBuilderSharePreview);

document.getElementById("builder-share-cancel")
    .addEventListener("click", closeBuilderSharePreview);

document.getElementById("builder-share-import")
    .addEventListener("click", importBuilderSharedTeam);

builderShareModal.addEventListener("click", event => {
    if (event.target === builderShareModal) {
        closeBuilderSharePreview();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !builderShareModal.hidden) {
        closeBuilderSharePreview();
    }
});

/* Check for a shared team in the URL */

function checkBuilderSharedTeamURL() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("team");

    if (!encoded) return;

    try {
        if (encoded.length > 12000) {
            throw new Error("Shared team link is too long.");
        }

        const decoded = builderDecodeTeam(encoded);
        const team = validateBuilderSharedTeam(decoded);

        if (!team) {
            throw new Error("Invalid shared team data.");
        }

        openBuilderSharePreview(team);
    } catch (error) {
        console.warn("Could not load shared team:", error);

        // Remove the invalid team parameter.
        const cleanURL = new URL(window.location.href);
        cleanURL.searchParams.delete("team");

        window.history.replaceState(
            window.history.state,
            "",
            cleanURL.toString()
        );

        alert(
            "This shared team link is invalid or no longer supported. " +
            "Your saved teams have not been changed."
        );
    }
}

checkBuilderSharedTeamURL();

/* =========================================
   V2.4.0 — MODAL KEYBOARD ACCESSIBILITY
========================================= */

const builderAccessibleModals = [
    builderUnitModal,
    builderConfigModal,
    builderMoveModal,
    builderTeamActionModal,
    builderShareModal
].filter(Boolean);

function getBuilderActiveModal() {
    return [...builderAccessibleModals]
        .reverse()
        .find(modal => !modal.hidden);
}

function getBuilderModalFocusableElements(modal) {
    const selector = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(",");

    return [...modal.querySelectorAll(selector)].filter(element => {
        return (
            !element.hidden &&
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility !== "hidden"
        );
    });
}

document.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const modal = getBuilderActiveModal();

    if (!modal) return;

    const focusable = getBuilderModalFocusableElements(modal);

    // No available controls: keep focus on the modal.
    if (!focusable.length) {
        event.preventDefault();

        if (!modal.hasAttribute("tabindex")) {
            modal.tabIndex = -1;
        }

        modal.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const current = document.activeElement;
    const focusIsInside = modal.contains(current);

    // If focus somehow escaped the modal, bring it back.
    if (!focusIsInside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
    }

    // Shift + Tab from first control wraps to last.
    if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
        return;
    }

    // Tab from last control wraps to first.
    if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
    }
});