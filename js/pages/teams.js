const teamWarningTooltip = document.getElementById("warning-tooltip");
function showTeamWarning(unit) {
    if (!unitHasWarnings(unit) || !teamWarningTooltip) {
        return;
    }
    teamWarningTooltip.textContent = getUnitWarningText(unit);
    teamWarningTooltip.classList.add("show");
}
function hideTeamWarning() {
    if (!teamWarningTooltip)
        return;
    teamWarningTooltip.classList.remove("show");
}
function createTeamUnitCard(unit, isSubstitute = false, enchant = null) {
    const card = document.createElement("div");
    card.className = "team-unit-card";
    const confidenceUnit = window.FTC_META_RANKING?.data?.find(item => item.name === unit.name);
    const modeledConfidence = confidenceUnit && window.FTC_META_RANKING?.confidenceFor?.(confidenceUnit);
    if (modeledConfidence) card.title = `Modeled confidence: ${modeledConfidence.label}. ${modeledConfidence.reasons.join(" ")}`;
    if (isSubstitute) {
        card.classList.add("substitute");
    }
    const imageWrap = document.createElement("div");
    imageWrap.className = "team-unit-image-wrap";
    if (enchant) {
        imageWrap.classList.add("has-enchant", getEnchantClass(enchant, "team-enchant-"), "enchant-frame", getEnchantClass(enchant, "enchant-frame-"));
        imageWrap.style.setProperty("--team-enchant-color", getEnchantColor(enchant, "bestTowers") || "#b4fcff");
        imageWrap.style.setProperty("--enchant-frame-color", getEnchantColor(enchant, "bestTowers") || "#b4fcff");
        const enchantLabel = document.createElement("span");
        enchantLabel.className = "team-unit-enchant enchant-frame-label";
        const enchantName = document.createElement("span");
        enchantName.className = "enchant-frame-label-text";
        enchantName.textContent = `${enchant.toUpperCase()} ENCHANT`;
        enchantLabel.appendChild(enchantName);
        imageWrap.appendChild(enchantLabel);
        card.tabIndex = 0;
        card.setAttribute("aria-label", `${unit.name}. ${isSubstitute ? "Substitute." : "Main team."} Recommended enchantment ${enchant}.`);
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
        warning.setAttribute("aria-label", "Data warning for " + unit.name);
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
        row.appendChild(createTeamUnitCard(unit, isSubstitute, enchantNames[index] || null));
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
    const mainRow = createTeamUnitRow(team.units, false, team.enchants || []);
    const substituteSection = document.createElement("div");
    substituteSection.className = "team-substitutes";
    const substituteTitle = document.createElement("h3");
    substituteTitle.textContent = "SUBSTITUTES";
    const substituteDescription = document.createElement("p");
    substituteDescription.textContent =
        "Alternative units you can use if you don't have a recommended unit. " +
            "Each substitute corresponds to the main unit directly above it.";
    const substituteRow = createTeamUnitRow(team.substitutes, true, team.substituteEnchants || []);
    substituteSection.appendChild(substituteTitle);
    substituteSection.appendChild(substituteDescription);
    substituteSection.appendChild(substituteRow);
    const explanation = document.createElement("div");
    explanation.className = "team-explanation";
    const label = document.createElement("strong");
    label.textContent = "WHY THIS TEAM WORKS: ";
    explanation.appendChild(label);
    explanation.appendChild(document.createTextNode(team.explanation));
    section.appendChild(header);
    section.appendChild(mainRow);
    section.appendChild(substituteSection);
    section.appendChild(explanation);
    return section;
}
function renderTeams() {
    const container = document.getElementById("teams-container");
    if (!container)
        return;
    container.innerHTML = "";
    TEAM_COMPOSITIONS.forEach(team => {
        container.appendChild(createTeamSection(team));
    });
}
document.addEventListener("mousemove", event => {
    if (!teamWarningTooltip ||
        !teamWarningTooltip.classList.contains("show")) {
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
}
else {
    renderTeams();
}
/* =========================================
   TEAM PAGE TAB SYSTEM
========================================= */
const teamBuilderTab = document.getElementById("team-builder-tab");
const recommendedTeamsTab = document.getElementById("recommended-teams-tab");
const teamBuilderPanel = document.getElementById("team-builder-panel");
const recommendedTeamsPanel = document.getElementById("recommended-teams-panel");
function switchTeamsTab(tabName) {
    const showBuilder = tabName === "builder";
    teamBuilderTab.classList.toggle("active", showBuilder);
    recommendedTeamsTab.classList.toggle("active", !showBuilder);
    teamBuilderTab.setAttribute("aria-selected", String(showBuilder));
    recommendedTeamsTab.setAttribute("aria-selected", String(!showBuilder));
    teamBuilderTab.tabIndex = showBuilder ? 0 : -1;
    recommendedTeamsTab.tabIndex = showBuilder ? -1 : 0;
    teamBuilderPanel.hidden = !showBuilder;
    recommendedTeamsPanel.hidden = showBuilder;
    // Close any open warning tooltip when switching tabs.
    hideTeamWarning();
}
if (teamBuilderTab &&
    recommendedTeamsTab &&
    teamBuilderPanel &&
    recommendedTeamsPanel) {
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
            }
            else if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            }
            else if (event.key === "Home") {
                nextIndex = 0;
            }
            else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            }
            else {
                return;
            }
            event.preventDefault();
            tabs[nextIndex].focus();
            switchTeamsTab(nextIndex === 0 ? "builder" : "recommended");
        });
    });
    switchTeamsTab("builder");
}
