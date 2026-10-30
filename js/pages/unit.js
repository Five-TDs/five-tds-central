const params = new URLSearchParams(window.location.search);
const unitName = params.get("unit");
const unit = findUnitByName(unitName);
if (!unit) {
    document.title = "Unit Not Found";
    document.querySelector(".unit-page").innerHTML = `
        <h1>Unit Not Found</h1>
        <p>The unit you're looking for doesn't exist.</p>
    `;
}
else {
    document.title =
        unit.name + " - Unit Database";
    document.getElementById("unit-name").textContent =
        unit.name;
    document.getElementById("unit-image").src =
        unit.image;
    document.getElementById("unit-image").alt =
        unit.name;
    document.getElementById("unit-rarity").textContent =
        unit.rarity;
    document.getElementById("unit-type").textContent =
        unit.type;
    document.getElementById("unit-placement").textContent =
        formatMoney(unit.placement);
    document.getElementById("unit-limit").textContent =
        unit.maxLimit;
    document.getElementById("unit-obtainment").textContent =
        unit.obtainment || "Not available.";
    const lastUpdatedContainer = document.getElementById("unit-last-updated");
    const lastUpdatedDate = document.getElementById("unit-last-updated-date");
    if (lastUpdatedContainer && lastUpdatedDate && unit.lastUpd) {
        const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(unit.lastUpd);
        if (match) {
            const [, month, day, year] = match;
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            const validDate = date.getFullYear() === Number(year) &&
                date.getMonth() === Number(month) - 1 &&
                date.getDate() === Number(day);
            if (validDate) {
                lastUpdatedDate.textContent =
                    date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    });
                lastUpdatedContainer.hidden = false;
            }
        }
    }
    const confidenceIndicator = document.getElementById("unit-data-confidence");
    const confidenceTooltip = document.getElementById("data-confidence-tooltip");
    if (confidenceIndicator && confidenceTooltip) {
        const hasWarnings = getUnitWarnings(unit).length > 0;
        confidenceIndicator.textContent = hasWarnings
            ? "⚠ Data Uncertain ⓘ"
            : "✓ Reviewed ⓘ";
        confidenceIndicator.classList.add(hasWarnings ? "uncertain" : "reviewed");
        confidenceTooltip.textContent = hasWarnings
            ? "Some information for this unit may be incomplete or inaccurate. Check the warning messages on this page for details."
            : "This unit's information has been reviewed on Five TD's Central. This does not guarantee that every stat has been independently verified.";
        confidenceIndicator.hidden = false;
    }
    const rarityColor = getRarityColor(unit.rarity);
    if (rarityColor) {
        document
            .getElementById("rarity-box")
            .style.setProperty("--rarity-color", rarityColor);
        document
            .querySelector(".unit-image-container")
            .style.borderColor =
            rarityColor;
    }
    buildStats();
    displayAbilities(unit);
    displayWarnings(unit);
}
function buildStats() {
    const statsBody = document.getElementById("stats-body");
    const statsHeader = document.getElementById("stats-header-row");
    statsBody.innerHTML = "";
    statsHeader.innerHTML = "";
    if (!unit.stats || unit.stats.length === 0) {
        statsHeader.innerHTML = `
            <th>LVL</th>
            <th>COST</th>
        `;
        statsBody.innerHTML = `
            <tr>
                <td colspan="2">
                    No stats available.
                </td>
            </tr>
        `;
        return;
    }
    const hasRangeBuff = unit.stats.some(stat => stat.rangeBuff !== undefined);
    const hasDamageBuff = unit.stats.some(stat => stat.damageBuff !== undefined);
    const hasCooldownBuff = unit.stats.some(stat => stat.cooldownBuff !== undefined);
    const hasSlow = unit.stats.some(stat => stat.slow !== undefined);
    let statMode = "normal";
    if (hasRangeBuff) {
        statMode = "rangeBuff";
    }
    else if (hasDamageBuff) {
        statMode = "damageBuff";
    }
    else if (hasCooldownBuff) {
        statMode = "cooldownBuff";
    }
    else if (hasSlow) {
        statMode = "slow";
    }
    if (statMode === "normal") {
        statsHeader.innerHTML = `
            <th>LVL</th>
            <th>COST</th>
            <th>DMG</th>
            <th>HPS</th>
            <th>RNG</th>
            <th>DPS</th>
            <th>TYPE</th>
        `;
    }
    else {
        statsHeader.innerHTML = `
            <th>LVL</th>
            <th>COST</th>
            <th>RNG</th>
            <th>SPECIAL</th>
            <th>TYPE</th>
        `;
    }
    let previousType = unit.stats[0].type;
    unit.stats.forEach((stat, index) => {
        const typeChanged = index > 0 &&
            stat.type !== previousType;
        const row = document.createElement("tr");
        if (statMode === "normal") {
            const dps = calculateDPS(stat.damage, getHPS(stat));
            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.level === 1 ? unit.placement : stat.cost)}
                </td>

                <td>
                    ${formatNumber(stat.damage)}
                </td>

                <td>
                    ${formatHPS(stat.cooldown)}
                </td>

                <td>
                    ${formatNumber(stat.range)}
                </td>

                <td class="dps-value">
                    ${formatNumber(dps)}
                </td>

                <td class="attack-type ${typeChanged ? "type-changed" : ""}">
                    ${stat.type}
                </td>
            `;
        }
        // =========================
        // RANGE BUFF
        // =========================
        else if (statMode === "rangeBuff") {
            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.level === 1 ? unit.placement : stat.cost)}
                </td>

                <td>
                    ${formatNumber(stat.range)}
                </td>

                <td class="special-stat">
                    ${formatMultiplier(stat.rangeBuff)}
                </td>

                <td class="attack-type ${typeChanged ? "type-changed" : ""}">
                    ${stat.type}
                </td>
            `;
        }
        // =========================
        // DAMAGE BUFF
        // =========================
        else if (statMode === "damageBuff") {
            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.level === 1 ? unit.placement : stat.cost)}
                </td>

                <td>
                    ${formatNumber(stat.range)}
                </td>

                <td class="special-stat">
                    ${formatMultiplier(stat.damageBuff)}
                </td>

                <td class="attack-type ${typeChanged ? "type-changed" : ""}">
                    ${stat.type}
                </td>
            `;
        }
        // =========================
        // ATTACK SPEED / HPS BUFF
        // =========================
        else if (statMode === "cooldownBuff") {
            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.level === 1 ? unit.placement : stat.cost)}
                </td>

                <td>
                    ${formatNumber(stat.range)}
                </td>

                <td class="special-stat">
                    ${formatMultiplier(stat.cooldownBuff)}
                </td>

                <td class="attack-type ${typeChanged ? "type-changed" : ""}">
                    ${stat.type}
                </td>
            `;
        }
        // =========================
        // SLOWER
        // =========================
        else if (statMode === "slow") {
            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.level === 1 ? unit.placement : stat.cost)}
                </td>

                <td>
                    ${formatNumber(stat.range)}
                </td>

                <td class="special-stat">
                    ${formatMultiplier(stat.slow)}
                </td>

                <td class="attack-type ${typeChanged ? "type-changed" : ""}">
                    ${stat.type}
                </td>
            `;
        }
        statsBody.appendChild(row);
        const headings = [...statsHeader.querySelectorAll("th")].map(th => th.textContent.trim());
        [...row.querySelectorAll("td")].forEach((cell, index) => cell.setAttribute("data-label", headings[index] || "Stat"));
        previousType =
            stat.type;
    });
    // =========================
    // TOTAL COST
    // =========================
    const totalCost = unit.stats.reduce((total, stat) => total + Number(stat.cost || 0), 0);
    document.getElementById("total-cost").textContent =
        formatMoney(totalCost);
}
function displayAbilities(unit) {
    const abilitiesList = document.getElementById("abilities-list");
    if (!abilitiesList)
        return;
    abilitiesList.innerHTML = "";
    const passives = Array.isArray(unit.passives)
        ? unit.passives
        : [];
    if (passives.length === 0) {
        const li = document.createElement("li");
        li.className = "no-abilities";
        li.textContent = "No abilities listed.";
        abilitiesList.appendChild(li);
        return;
    }
    passives.forEach(passive => {
        const li = document.createElement("li");
        li.textContent = passive;
        abilitiesList.appendChild(li);
    });
}
// =========================
// DISPLAY PAGE WARNINGS
// =========================
function displayWarnings(unit) {
    const warningsContainer = document.getElementById("unit-warnings");
    if (!warningsContainer) {
        return;
    }
    warningsContainer.innerHTML = "";
    const warnings = getUnitWarnings(unit);
    if (warnings.length === 0) {
        return;
    }
    warnings.forEach(warning => {
        if (!warning) {
            return;
        }
        const warningElement = document.createElement("div");
        warningElement.className =
            "page-warning";
        warningElement.textContent =
            warning;
        warningsContainer.appendChild(warningElement);
    });
}
// =========================
// BACK BUTTON
// =========================
document
    .getElementById("back-button")
    .addEventListener("click", () => {
    window.location.href =
        "units.html";
});
// =========================
// UNIT TABS
// =========================
const tabs = document.querySelectorAll(".unit-tab");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const selectedTab = tab.dataset.tab;
        // Remove active from all buttons
        tabs.forEach(currentTab => {
            currentTab.classList.remove("active");
        });
        // Activate clicked button
        tab.classList.add("active");
        // Hide all content
        document
            .querySelectorAll(".tab-content")
            .forEach(content => {
            content.classList.remove("active");
        });
        // Show selected content
        const selectedContent = document.getElementById(`${selectedTab}-tab`);
        if (selectedContent) {
            selectedContent.classList.add("active");
        }
    });
});
const statsTabButton = document.getElementById("stats-tab-button");
const abilitiesTabButton = document.getElementById("abilities-tab-button");
const statsContent = document.getElementById("stats-content");
const abilitiesContent = document.getElementById("abilities-content");
if (statsTabButton &&
    abilitiesTabButton &&
    statsContent &&
    abilitiesContent) {
    statsTabButton.addEventListener("click", () => {
        statsTabButton.classList.add("active");
        abilitiesTabButton.classList.remove("active");
        statsContent.style.display = "";
        abilitiesContent.style.display = "none";
    });
    abilitiesTabButton.addEventListener("click", () => {
        abilitiesTabButton.classList.add("active");
        statsTabButton.classList.remove("active");
        statsContent.style.display = "none";
        abilitiesContent.style.display = "";
    });
}
// =========================
// COPY UNIT LINK
// =========================
const copyUnitLinkButton = document.getElementById("copy-unit-link");
const copyUnitLinkText = document.getElementById("copy-unit-link-text");
if (unit && copyUnitLinkButton && copyUnitLinkText) {
    let copyResetTimeout;
    copyUnitLinkButton.addEventListener("click", async () => {
        const unitURL = new URL(window.location.href);
        // Keep only the selected unit in the link.
        unitURL.search = "";
        unitURL.searchParams.set("unit", unit.name);
        unitURL.hash = "";
        try {
            await navigator.clipboard.writeText(unitURL.toString());
            copyUnitLinkText.textContent = "LINK COPIED!";
            copyUnitLinkButton.setAttribute("aria-label", "Unit link copied");
        }
        catch (error) {
            copyUnitLinkText.textContent = "COPY FAILED";
            copyUnitLinkButton.setAttribute("aria-label", "Could not copy unit link");
        }
        clearTimeout(copyResetTimeout);
        copyResetTimeout = setTimeout(() => {
            copyUnitLinkText.textContent = "COPY UNIT LINK";
            copyUnitLinkButton.setAttribute("aria-label", "Copy link to this unit");
        }, 2000);
    });
}
/* =========================================================
   DATA CONFIDENCE TOOLTIP
========================================================= */
const confidenceTrigger = document.getElementById("unit-data-confidence");
const confidencePopup = document.getElementById("data-confidence-tooltip");
if (confidenceTrigger && confidencePopup) {
    const showConfidenceTooltip = () => {
        confidencePopup.hidden = false;
        confidenceTrigger.setAttribute("aria-expanded", "true");
    };
    const hideConfidenceTooltip = () => {
        confidencePopup.hidden = true;
        confidenceTrigger.setAttribute("aria-expanded", "false");
    };
    confidenceTrigger.addEventListener("mouseenter", showConfidenceTooltip);
    confidenceTrigger.addEventListener("mouseleave", hideConfidenceTooltip);
    confidenceTrigger.addEventListener("focus", showConfidenceTooltip);
    confidenceTrigger.addEventListener("blur", hideConfidenceTooltip);
    confidenceTrigger.addEventListener("click", () => {
        if (confidencePopup.hidden) {
            showConfidenceTooltip();
        }
        else {
            hideConfidenceTooltip();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hideConfidenceTooltip();
        }
    });
    document.addEventListener("click", event => {
        if (!confidenceTrigger.contains(event.target) &&
            !confidencePopup.contains(event.target)) {
            hideConfidenceTooltip();
        }
    });
}
/* =========================================================
   LAST UPDATED TOOLTIP
========================================================= */
const lastUpdatedTrigger = document.querySelector(".last-updated-label.unit-info-tooltip-trigger");
const lastUpdatedTooltip = document.getElementById("last-updated-tooltip");
if (lastUpdatedTrigger && lastUpdatedTooltip) {
    const showTooltip = () => {
        lastUpdatedTooltip.hidden = false;
        lastUpdatedTrigger.setAttribute("aria-expanded", "true");
    };
    const hideTooltip = () => {
        lastUpdatedTooltip.hidden = true;
        lastUpdatedTrigger.setAttribute("aria-expanded", "false");
    };
    lastUpdatedTrigger.addEventListener("mouseenter", showTooltip);
    lastUpdatedTrigger.addEventListener("mouseleave", hideTooltip);
    lastUpdatedTrigger.addEventListener("focus", showTooltip);
    lastUpdatedTrigger.addEventListener("blur", hideTooltip);
    lastUpdatedTrigger.addEventListener("click", () => {
        if (lastUpdatedTooltip.hidden) {
            showTooltip();
        }
        else {
            hideTooltip();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            hideTooltip();
        }
    });
    document.addEventListener("click", event => {
        if (!lastUpdatedTrigger.contains(event.target) &&
            !lastUpdatedTooltip.contains(event.target)) {
            hideTooltip();
        }
    });
}
