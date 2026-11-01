/* =========================================
   V2.4.0 — MAX LEVEL UNIT HELPERS
========================================= */
function getBuilderMaxLevelStats(unit) {
    if (!unit?.stats?.length)
        return null;
    return unit.stats.reduce((highest, stat) => {
        return Number(stat.level) > Number(highest.level)
            ? stat
            : highest;
    });
}
function getBuilderTotalUpgradeCost(unit) {
    if (!unit)
        return 0;
    return getTotalInvestment(unit) ?? 0;
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
        if (!unit)
            return;
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
        button.setAttribute("aria-label", `Edit slot ${index + 1}: ${unit.name}`);
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
    if (!maxStats)
        return null;
    const enchant = enchantName ? enchants[enchantName] : null;
    let damage = Number(maxStats.damage);
    if (maxStats.damage === undefined || maxStats.damage === null || !Number.isFinite(damage)) return null;
    const hps = getEnchantedHPS(maxStats.cooldown, enchant?.attackSpeed ?? 0);
    if (hps === null) return null;
    if (enchant?.damage != null) damage *= 1 + Number(enchant.damage) / 100;
    return { damage, hps, dps: calculateDPS(damage, hps) };
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
        if (!selection)
            return;
        const unit = findUnitByName(selection.unitName);
        if (!unit)
            return;
        const placements = Number(unit.maxLimit);
        const validPlacements = Number.isFinite(placements) && placements >= 0;
        if (validPlacements) {
            totalPlacements += placements;
        }
        else {
            hasUnknownPlacements = true;
        }
        const stats = getBuilderEnchantedStats(unit, selection.enchant);
        if (stats) {
            totalDPS += stats.dps;
            if (validPlacements) {
                maxDeployedDPS += stats.dps * placements;
            }
        }
        else if (unit.type !== "Range Buff" &&
            unit.type !== "Damage Buff" &&
            unit.type !== "Slower") {
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
    const format = value => typeof formatNumber === "function"
        ? formatNumber(value)
        : Math.round(value).toLocaleString();
    const setStat = (id, value) => {
        const element = document.getElementById(id);
        if (element)
            element.textContent = value;
    };
    setStat("builder-team-dps", hasUnknownDPS
        ? `${format(totalDPS)}+ (incomplete)`
        : format(totalDPS));
    setStat("builder-team-cost", `$${format(totalCost)}`);
    setStat("builder-team-placements", hasUnknownPlacements
        ? `${totalPlacements}+ (incomplete)`
        : totalPlacements.toLocaleString());
    setStat("builder-max-dps", hasUnknownDPS || hasUnknownPlacements
        ? `${format(maxDeployedDPS)}+ (incomplete)`
        : format(maxDeployedDPS));
    setStat("builder-max-cost", hasUnknownPlacements
        ? `$${format(maxDeployedCost)}+ (incomplete)`
        : `$${format(maxDeployedCost)}`);
}
