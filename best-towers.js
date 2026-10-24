/* =========================================
   BEST UNITS
========================================= */

/*
    Rankings are written in actual rank order:

    [ #1, #2, #3 ]

    The page automatically displays them as:

             #1
        #2         #3
*/


const BEST_UNIT_RANKINGS = {

    /* =====================================
       BEST STARTER
    ===================================== */

    "BEST STARTER": {
        description: "Strong choices for the beginning of a run",

        units: [
            "Crying Child",
            "Mangle",
            "Balloon Boy"
        ]
    },


    /* =====================================
       BEST EARLY GAME
    ===================================== */

    "BEST EARLY GAME": {
        description: "Units that can carry you through the early waves",

        units: [
            "Mangle",
            "Crying Child",
            "Bonnie"
        ]
    },


    /* =====================================
       BEST MID GAME
    ===================================== */

    "BEST MID GAME": {
        description: "Strong units for building into the middle of a run",

        units: [
            "Purple Guy",
            "Freddy",
            "Shadow Freddy"
        ]
    },


    /* =====================================
       BEST LATE GAME
    ===================================== */

    "BEST LATE GAME": {
        description: "Powerful units for pushing deeper into a run",

        units: [
            "Golden Freddy",
            "The Marionette",
            "Shadow Bonnie"
        ]
    },


    /* =====================================
       BEST 5TH UNIT
    ===================================== */

    "BEST 5TH UNIT": {
        description: "Strong choices for your fifth unit slot",

        units: [
            "Chupcake",
            "Bear5",
            "Purple Guy"
        ]
    },


    /* =====================================
       BEST DAMAGE
    ===================================== */

    "BEST DAMAGE": {
        description: "Top units for raw damage potential",

        units: [
            "Golden Freddy",
            "The Marionette",
            "Shadow Bonnie"
        ]
    },


    /* =====================================
       BEST OVERALL
    ===================================== */

    "BEST OVERALL": {
        description: "The strongest overall units",

        units: [
            "Golden Freddy",
            "The Marionette",
            "Shadow Bonnie"
        ]
    }

};


/* =========================================
   BEST UNIT ENCHANT RECOMMENDATIONS
========================================= */

const BEST_UNIT_ENCHANTS = {
    "Crying Child": {
        best: "Eco",
        alternative: "Hunt"
    },

    "Mangle": {
        best: "Eco",
        alternative: "Hunt"
    },

    "Balloon Boy": {
        best: "Eco",
        alternative: "Hunt"
    },

    "Bonnie": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Purple Guy": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Freddy": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Shadow Freddy": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Golden Freddy": {
        best: "Soul",
        alternative: "Hunt"
    },

    "The Marionette": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Shadow Bonnie": {
        best: "Soul",
        alternative: "Hunt"
    },

    "Chupcake": {
        best: "Soul",
        alternative: "Hook"
    },

    "Bear5": {
        best: "Soul",
        alternative: "Hunt"
    }
};

const BEST_ENCHANT_COLORS = {
    Battery: "#B4FFAA",
    Hunt: "#AAAAFF",
    Hook: "#FF8787",
    Eco: "#FFFA96",
    Haywire: "#8B5CF6",
    Springlock: "#98FFCC",
    Soul: "#14B8A6"
};



/* =========================================
   FIND UNIT
========================================= */

function getBestUnitByName(name) {
    return units.find(unit => unit.name === name);
}


/* =========================================
   WARNING TOOLTIP
========================================= */

const warningTooltip = document.getElementById("warning-tooltip");


function showBestWarning(event, warning) {

    if (!warningTooltip || !warning) {
        return;
    }

    warningTooltip.textContent = warning;

    warningTooltip.classList.add("show");

    moveBestWarning(event);
}


function hideBestWarning() {

    if (!warningTooltip) {
        return;
    }

    warningTooltip.classList.remove("show");
}


function moveBestWarning(event) {

    if (!warningTooltip || !warningTooltip.classList.contains("show")) {
        return;
    }

    const offset = 14;

    let x = event.clientX + offset;
    let y = event.clientY + offset;

    const rect = warningTooltip.getBoundingClientRect();

    if (x + rect.width > window.innerWidth - 8) {
        x = event.clientX - rect.width - offset;
    }

    if (y + rect.height > window.innerHeight - 8) {
        y = event.clientY - rect.height - offset;
    }

    warningTooltip.style.left = `${x}px`;
    warningTooltip.style.top = `${y}px`;
}


/* =========================================
   CREATE UNIT CARD
========================================= */


function createBestUnitCard(unit, rank) {

    const card = document.createElement("div");
    card.className = "best-unit-card";

    if (rank === 1) {
        card.classList.add("featured");
    }

    /* Rank */

    const rankNumber = document.createElement("div");
    rankNumber.className = "best-rank-number";
    rankNumber.textContent = `#${rank}`;

    /* Enchant recommendations */

    const recommendations =
        BEST_UNIT_ENCHANTS[unit.name] || null;

    /* Image wrapper */

    const imageWrap = document.createElement("div");
    imageWrap.className = "best-unit-image-wrap";

    if (recommendations) {

        const bestEnchant = recommendations.best;

        const enchantColor =
            BEST_ENCHANT_COLORS[bestEnchant];

        if (enchantColor) {
            imageWrap.classList.add("has-best-enchant");

            imageWrap.classList.add(
                "best-enchant-" + bestEnchant.toLowerCase()
            );

            imageWrap.style.setProperty(
                "--best-enchant-color",
                enchantColor
            );
        }
    }

    /* Image */

    const image = document.createElement("img");
    image.className = "best-unit-image";
    image.src = unit.image;
    image.alt = unit.name;
    image.draggable = false;
    image.loading = "lazy";

    /* Name */

    const name = document.createElement("div");
    name.className = "best-unit-name";
    name.textContent = unit.name;

    imageWrap.appendChild(image);
    imageWrap.appendChild(name);

    /* Warning */

    if (unit.warn) {

        const warning = document.createElement("div");
        warning.className = "best-unit-warning";
        warning.textContent = "⚠";
        warning.tabIndex = 0;
        warning.setAttribute(
            "aria-label",
            "Data warning for " + unit.name
        );

        imageWrap.appendChild(warning);

        warning.addEventListener("mouseenter", event => {
            showBestWarning(event, unit.warn);
        });

        warning.addEventListener("mouseleave", hideBestWarning);

        warning.addEventListener("mousemove", event => {
            moveBestWarning(event);
        });

        warning.addEventListener("focus", () => {
            warningTooltip.textContent = unit.warn;
            warningTooltip.classList.add("show");
            const rect = warning.getBoundingClientRect();
            warningTooltip.style.left = `${rect.left}px`;
            warningTooltip.style.top = `${rect.bottom + 8}px`;
        });

        warning.addEventListener("blur", hideBestWarning);
    }

    card.appendChild(rankNumber);
    card.appendChild(imageWrap);

    /* Enchant information */

    if (recommendations) {

        const enchantInfo = document.createElement("div");
        enchantInfo.className = "best-unit-enchants";

        function createEnchantLine(labelText, enchantName, isBest) {

            const line = document.createElement("div");
            line.className = "best-enchant-line";

            const label = document.createElement("span");
            label.className = "best-enchant-label";
            label.textContent = labelText;

            const value = document.createElement("span");
            value.className = "best-enchant-value";

            if (isBest) {
                value.classList.add("primary");
            }

            value.classList.add(
                "best-enchant-" + enchantName.toLowerCase()
            );

            value.textContent = enchantName.toUpperCase();

            line.appendChild(label);
            line.appendChild(value);

            return line;
        }

        enchantInfo.appendChild(
            createEnchantLine(
                "BEST ENCHANT",
                recommendations.best,
                true
            )
        );

        enchantInfo.appendChild(
            createEnchantLine(
                "ALTERNATIVE",
                recommendations.alternative,
                false
            )
        );

        card.appendChild(enchantInfo);
    }

    return card;
}



/* =========================================
   CREATE TOP 3 SECTION
========================================= */

function createBestSection(title, sectionData) {

    const section = document.createElement("section");

    section.className = "best-section";


    /* Header */

    const header = document.createElement("div");

    header.className = "best-section-header";


    const heading = document.createElement("h2");

    heading.textContent = title;


    const description = document.createElement("p");

    description.textContent = sectionData.description;


    header.appendChild(heading);
    header.appendChild(description);


    /* Ranking */

    const ranking = document.createElement("div");

    ranking.className = "best-ranking top3";


    /*
        sectionData.units is:

        [ #1, #2, #3 ]

        Render order:

        #2
        #1
        #3

        so CSS can place #1 in the middle.
    */

    const displayOrder = [
        {
            unit: sectionData.units[1],
            rank: 2
        },
        {
            unit: sectionData.units[0],
            rank: 1
        },
        {
            unit: sectionData.units[2],
            rank: 3
        }
    ];


    displayOrder.forEach(entry => {

        const unit = getBestUnitByName(entry.unit);

        if (!unit) {
            console.warn(
                `Best Units: Could not find unit "${entry.unit}"`
            );

            return;
        }

        const card = createBestUnitCard(
            unit,
            entry.rank
        );

        ranking.appendChild(card);

    });


    section.appendChild(header);
    section.appendChild(ranking);


    return section;
}


/* =========================================
   RENDER PAGE
========================================= */

function renderBestUnits() {

    const container =
        document.getElementById("best-units-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    Object.entries(BEST_UNIT_RANKINGS).forEach(
        ([title, sectionData]) => {

            const section =
                createBestSection(
                    title,
                    sectionData
                );

            container.appendChild(section);

        }
    );
}


/* =========================================
   GLOBAL WARNING MOVEMENT
========================================= */

document.addEventListener("mousemove", event => {
    moveBestWarning(event);
});


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    renderBestUnits
);