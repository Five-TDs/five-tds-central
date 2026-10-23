/* =========================================================
   FIVE TD'S CENTRAL — TIERLIST

   ROUGH DRAFT / FIRST STAT-BASED RANKING

   ALL 28 UNITS ARE INCLUDED.
   Units with incomplete/questionable data are still placed
   provisionally so no unit is missing from the tierlist.
========================================================= */

const TIER_DESCRIPTIONS = {

    S: "Amazing",
    A: "Great",
    B: "Good",
    C: "Average",
    D: "Weak",
    F: "Terrible"

};

/* =========================================================
   TIER ORDER
========================================================= */

const TIER_ORDER = [
    "S",
    "A",
    "B",
    "C",
    "D",
    "F"
];


/* =========================================================
   TIER ASSIGNMENTS
========================================================= */

const TIER_ASSIGNMENTS = {

    /* -----------------------------------------------------
       S TIER
    ----------------------------------------------------- */

    S: [
        "Shadow Bonnie",
        "Freddy",
        "The Marionette",
        "Fastbear",
        "Chupcake",
        "Shadow Freddy",
        "Golden Freddy"
    ],


    /* -----------------------------------------------------
       A TIER
    ----------------------------------------------------- */

    A: [
        "Old Man Consequences",
        "Purple Guy",
        "Radioactive Foxy",
        "Withered Foxy",
        "Withered Bonnie",
        "Anim Dude",
        "Withered Freddy",
        "Withered Chica",
        "Endo 02"
    ],


    /* -----------------------------------------------------
       B TIER
    ----------------------------------------------------- */

    B: [
        "Mangle",
        "Bonnie",
        "Toy Chica",
        "Toy Freddy",
        "Bear5",
        "Crying Child",
        "Sparky"
    ],


    /* -----------------------------------------------------
       C TIER
    ----------------------------------------------------- */

    C: [
        "Chica",
        "Balloon Boy",
        "Toy Bonnie"
    ],


    /* -----------------------------------------------------
       D TIER
    ----------------------------------------------------- */

    D: [
        "Foxy",
        "Endo 01"
    ],


    /* -----------------------------------------------------
       F TIER
    ----------------------------------------------------- */

    F: [
    ]

};


/* =========================================================
   ELEMENTS
========================================================= */

const board =
    document.getElementById(
        "tierlist-board"
    );

const warningTooltip =
    document.getElementById(
        "warning-tooltip"
    );


/* =========================================================
   FIND UNIT BY NAME
========================================================= */

function getUnitByName(name) {

    return units.find(
        unit =>
            unit.name === name
    );

}


/* =========================================================
   CREATE UNIT CARD
========================================================= */

function createUnitCard(unit) {

    const card =
        document.createElement("div");

    card.className =
        "tier-unit";


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    if (
        unit.warn &&
        unit.warn.length
    ) {

        card.tabIndex = 0;

    } else {

        card.tabIndex = -1;

    }


    /* =====================================================
       UNIT IMAGE
    ===================================================== */

    const image =
        document.createElement("img");

    image.className =
        "tier-unit-image";

    image.src =
        unit.image;

    image.alt =
        unit.name;

    image.loading =
        "lazy";


    card.appendChild(
        image
    );


    /* =====================================================
       WARNING
    ===================================================== */

    if (
        unit.warn &&
        unit.warn.length
    ) {

        const warning =
            document.createElement("div");

        warning.className =
            "tier-unit-warning";

        warning.textContent =
            "⚠";

        warning.setAttribute(
            "aria-label",
            unit.warn.join(" ")
        );


        card.appendChild(
            warning
        );


        const warningText =
            unit.warn.join(" ");


        function showWarning() {

            warningTooltip.textContent =
                warningText;

            warningTooltip.classList.add(
                "visible"
            );

            warningTooltip.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        function hideWarning() {

            warningTooltip.classList.remove(
                "visible"
            );

            warningTooltip.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        card.addEventListener(
            "mouseenter",
            showWarning
        );

        card.addEventListener(
            "mouseleave",
            hideWarning
        );

        card.addEventListener(
            "focus",
            showWarning
        );

        card.addEventListener(
            "blur",
            hideWarning
        );

    }


    /* =====================================================
       UNIT NAME
    ===================================================== */

    const name =
        document.createElement("div");

    name.className =
        "tier-unit-name";

    name.textContent =
        unit.name;


    card.appendChild(
        name
    );


    return card;
}


/* =========================================================
   CREATE TIER ROW
========================================================= */

function renderTier(tier) {

    const row =
        document.createElement("section");

    row.className =
        `tier-row tier-${tier.toLowerCase()}`;


    /* =====================================================
       TIER LABEL
    ===================================================== */

    const label =
    document.createElement("div");

label.className =
    "tier-label";


const letter =
    document.createElement("div");

letter.className =
    "tier-label-letter";

letter.textContent =
    tier;


const description =
    document.createElement("div");

description.className =
    "tier-label-description";

description.textContent =
    TIER_DESCRIPTIONS[tier] || "";


label.appendChild(
    letter
);

label.appendChild(
    description
);


    /* =====================================================
       UNIT CONTAINER
    ===================================================== */

    const unitsContainer =
        document.createElement("div");

    unitsContainer.className =
        "tier-units";


    /* =====================================================
       GET ASSIGNED UNIT NAMES
    ===================================================== */

    const assignedNames =
        TIER_ASSIGNMENTS[tier] || [];


    /* =====================================================
       FIND UNIT DATA
    ===================================================== */

    const tierUnits =
        assignedNames
            .map(
                name =>
                    getUnitByName(name)
            )
            .filter(
                unit =>
                    unit
            );


    /* =====================================================
       EMPTY TIER
    ===================================================== */

    if (
        tierUnits.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "tier-empty";

        empty.textContent =
            "No units placed yet.";

        unitsContainer.appendChild(
            empty
        );

    }


    /* =====================================================
       RENDER UNITS
    ===================================================== */

    else {

        tierUnits.forEach(
            unit => {

                unitsContainer.appendChild(
                    createUnitCard(unit)
                );

            }
        );

    }


    /* =====================================================
       BUILD ROW
    ===================================================== */

    row.appendChild(
        label
    );

    row.appendChild(
        unitsContainer
    );


    board.appendChild(
        row
    );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderTierlist() {

    if (!board) {

        console.error(
            "Tierlist board was not found."
        );

        return;

    }


    board.innerHTML = "";


    TIER_ORDER.forEach(
        tier => {

            renderTier(tier);

        }
    );

}


/* =========================================================
   WARNING TOOLTIP
========================================================= */

function hideWarningTooltip() {

    if (!warningTooltip) {
        return;
    }


    warningTooltip.classList.remove(
        "visible"
    );

    warningTooltip.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   WARNING FOLLOWS CURSOR
========================================================= */

document.addEventListener(
    "mousemove",
    event => {

        if (!warningTooltip) {
            return;
        }


        if (
            !warningTooltip.classList.contains(
                "visible"
            )
        ) {

            return;

        }


        const offset = 14;


        const tooltipWidth =
            warningTooltip.offsetWidth;

        const tooltipHeight =
            warningTooltip.offsetHeight;


        let x =
            event.clientX +
            offset;

        let y =
            event.clientY +
            offset;


        /* ---------------------------------------------
           RIGHT EDGE
        --------------------------------------------- */

        if (
            x + tooltipWidth >
            window.innerWidth - 8
        ) {

            x =
                event.clientX -
                tooltipWidth -
                offset;

        }


        /* ---------------------------------------------
           BOTTOM EDGE
        --------------------------------------------- */

        if (
            y + tooltipHeight >
            window.innerHeight - 8
        ) {

            y =
                event.clientY -
                tooltipHeight -
                offset;

        }


        warningTooltip.style.left =
            `${Math.max(8, x)}px`;

        warningTooltip.style.top =
            `${Math.max(8, y)}px`;

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

renderTierlist();