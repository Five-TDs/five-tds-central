/* =========================================
   TEAM ENCHANT COLORS
========================================= */

const TEAM_ENCHANT_COLORS = {
    Battery: "#65c7ff",
    Hunt: "#79d66d",
    Hook: "#ff9860",
    Eco: "#f5ce55",
    Haywire: "#f06b68",
    Springlock: "#b18cff",
    Soul: "#e879f9"
};

/* =========================================
   TEAMS PAGE
========================================= */

const TEAM_COMPOSITIONS = [


    {
        title: "BEST SOLO TEAM",

        description:
            "A balanced five-unit team for taking on waves alone.",

        units: [
            "Crying Child",
            "Golden Freddy",
            "The Marionette",
            "Shadow Bonnie",
            "Chupcake"
        ],

        enchants: [
            "Eco",
            "Soul",
            "Soul",
            "Soul",
            "Soul"
        ],

        substitutes: [
            "Mangle",
            "Bear5",
            "Shadow Freddy",
            "Freddy",
            "Purple Guy"
        ],

        substituteEnchants: [
            "Eco",
            "Eco",
            "Soul",
            "Soul",
            "Soul"
        ],

        explanation:
            "Crying Child provides affordable early defense. " +
            "Golden Freddy and The Marionette handle groups, " +
            "Shadow Bonnie provides strong single-target damage, " +
            "and Chupcake adds powerful piercing attacks."
    },

    {
        title: "BEST ENDLESS TEAM",

        description:
            "A high-damage team designed for pushing as many waves as possible.",

        units: [
            "Golden Freddy",
            "The Marionette",
            "Shadow Bonnie",
            "Chupcake",
            "Bear5"
        ],

        enchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Soul"
        ],

        substitutes: [
            "Shadow Freddy",
            "Old Man Consequences",
            "Freddy",
            "Purple Guy",
            "Withered Freddy"
        ],

        substituteEnchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Soul"
        ],

        explanation:
            "This team combines strong area damage, piercing attacks, " +
            "and single-target damage to handle increasingly difficult waves."
    },

    {
        title: "BEST CROWD CONTROL TEAM",

        description:
            "Designed to slow down enemies and eliminate large groups.",

        units: [
            "Golden Freddy",
            "The Marionette",
            "Shadow Freddy",
            "Chupcake",
            "Endo 02"
        ],

        enchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Battery"
        ],

        substitutes: [
            "Bear5",
            "Old Man Consequences",
            "Withered Foxy",
            "Purple Guy",
            "Withered Chica"
        ],

        substituteEnchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Battery"
        ],

        explanation:
            "Endo 02 slows enemies while the other units use AOE, " +
            "splash, cone, and piercing attacks to damage groups."
    },

    {
        title: "BEST BOSS KILLER TEAM",

        description:
            "Focused on dealing heavy damage to powerful single enemies.",

        units: [
            "Shadow Bonnie",
            "Freddy",
            "Fastbear",
            "Chupcake",
            "The Marionette"
        ],

        enchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Soul"
        ],

        substitutes: [
            "Shadow Freddy",
            "Purple Guy",
            "Foxy",
            "Old Man Consequences",
            "Golden Freddy"
        ],

        substituteEnchants: [
            "Soul",
            "Soul",
            "Soul",
            "Soul",
            "Soul"
        ],

        explanation:
            "Shadow Bonnie, Freddy, and Fastbear provide strong " +
            "single-target damage, while Chupcake and The Marionette " +
            "add extra damage and coverage."
    },

    {
        title: "BEST SPEEDRUN TEAM",

        description:
            "An aggressive team designed to establish defenses quickly and clear waves efficiently.",

        units: [
            "Mangle",
            "Crying Child",
            "Purple Guy",
            "Shadow Freddy",
            "Golden Freddy"
        ],

        enchants: [
            "Eco",
            "Eco",
            "Soul",
            "Soul",
            "Soul"
        ],

        substitutes: [
            "Balloon Boy",
            "Chica",
            "Withered Foxy",
            "Bear5",
            "The Marionette"
        ],

        substituteEnchants: [
            "Eco",
            "Eco",
            "Soul",
            "Eco",
            "Soul"
        ],

        explanation:
            "Mangle and Crying Child provide affordable early defense. " +
            "Purple Guy, Shadow Freddy, and Golden Freddy help clear " +
            "larger groups as more cash becomes available."
    }

];


/* =========================================
   UNIT LOOKUP
========================================= */

function getTeamUnitByName(name) {
    return units.find(unit => unit.name === name);
}


/* =========================================
   WARNING TOOLTIP
========================================= */

const teamWarningTooltip =
    document.getElementById("warning-tooltip");

function showTeamWarning(unit) {
    if (!unit.warn || !teamWarningTooltip) return;

    const warningText = Array.isArray(unit.warn)
        ? unit.warn.join(" ")
        : String(unit.warn);

    teamWarningTooltip.textContent = warningText;
    teamWarningTooltip.classList.add("show");
}

function hideTeamWarning() {
    if (!teamWarningTooltip) return;

    teamWarningTooltip.classList.remove("show");
}


/* =========================================
   CREATE UNIT CARD
========================================= */

function createTeamUnitCard(unit, isSubstitute = false, enchant = null) {

    const card = document.createElement("div");
    card.className = "team-unit-card";

    if (isSubstitute) {
        card.classList.add("substitute");
    }

    const imageWrap = document.createElement("div");
    imageWrap.className = "team-unit-image-wrap";

    
    /* RECOMMENDED ENCHANT */

    const enchantColor = TEAM_ENCHANT_COLORS[enchant];

    if (enchantColor) {
        imageWrap.style.setProperty(
            "--team-enchant-color",
            enchantColor
        );

        imageWrap.classList.add("has-enchant");

        imageWrap.classList.add(
    "team-enchant-" + enchant.toLowerCase()
);

        const enchantLabel = document.createElement("div");
        enchantLabel.className = "team-unit-enchant";
        enchantLabel.textContent = enchant.toUpperCase();

        imageWrap.appendChild(enchantLabel);
    }


    const image = document.createElement("img");
    image.className = "team-unit-image";
    image.src = unit.image;
    image.alt = unit.name;
    image.loading = "lazy";

    imageWrap.appendChild(image);

    /* WARNING ICON */

    if (unit.warn && unit.warn.length) {

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


/* =========================================
   CREATE UNIT ROW
========================================= */

function createTeamUnitRow(unitNames, isSubstitute = false, enchantNames = []) {

    const row = document.createElement("div");

    row.className = isSubstitute
        ? "team-units team-substitute-units"
        : "team-units";

    unitNames.forEach((unitName, index) => {

        const unit = getTeamUnitByName(unitName);

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


/* =========================================
   CREATE TEAM SECTION
========================================= */

function createTeamSection(team) {

    const section = document.createElement("section");
    section.className = "team-section";

    /* HEADER */

    const header = document.createElement("div");
    header.className = "team-section-header";

    const heading = document.createElement("h2");
    heading.textContent = team.title;

    const description = document.createElement("p");
    description.className = "team-section-description";
    description.textContent = team.description;

    header.appendChild(heading);
    header.appendChild(description);

    /* MAIN TEAM */

    const mainRow = createTeamUnitRow(
    team.units,
    false,
    team.enchants || []
);

    /* SUBSTITUTES */

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

    /* EXPLANATION */

    const explanation = document.createElement("div");
    explanation.className = "team-explanation";

    const label = document.createElement("strong");
    label.textContent = "WHY THIS TEAM WORKS: ";

    explanation.appendChild(label);
    explanation.appendChild(
        document.createTextNode(team.explanation)
    );

    /* ASSEMBLE */

    section.appendChild(header);
    section.appendChild(mainRow);
    section.appendChild(substituteSection);
    section.appendChild(explanation);

    return section;
}


/* =========================================
   RENDER TEAMS
========================================= */

function renderTeams() {

    const container =
        document.getElementById("teams-container");

    if (!container) return;

    container.innerHTML = "";

    TEAM_COMPOSITIONS.forEach(team => {
        container.appendChild(createTeamSection(team));
    });

}


/* =========================================
   TOOLTIP POSITION
========================================= */

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