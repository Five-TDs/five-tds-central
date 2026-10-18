/* =========================================================
   STATS SIMULATOR
========================================================= */


/* =========================================================
   DOM
========================================================= */

const unitGrid = document.getElementById("unit-grid");

const raritySelect = document.getElementById("rarity-select");

const enchantSelect = document.getElementById("enchant-select");

const unitSearch = document.getElementById("unit-search");

const statsTableBody = document.getElementById("stats-table-body");

const enchantmentHelp = document.getElementById("enchantment-help");

const enchantmentModal = document.getElementById("enchantment-modal");

const closeEnchantmentModal =
    document.getElementById("close-enchantment-modal");

const enchantmentList =
    document.getElementById("enchantment-list");

const mobileMenuButton =
    document.getElementById("mobile-menu-button");

const mobileMenu =
    document.getElementById("mobile-menu");

const mobileCloseButton =
    document.getElementById("mobile-close-button");


/* =========================================================
   STATE
========================================================= */

let selectedUnit = null;

let selectedEnchant = "none";


/* =========================================================
   RARITY COLORS
========================================================= */

const rarityColors = {

    Common: "#AAAAAA",

    Uncommon: "#65FF01",

    Rare: "#0165FF",

    Epic: "#C801FF",

    Exclusive: "#FF0101",

    Legendary: "#FFD619"

};


/* =========================================================
   GET FILTERED UNITS
========================================================= */

function getFilteredUnits() {

    const rarity = raritySelect.value;

    const search = unitSearch.value
        .trim()
        .toLowerCase();


    return units.filter(unit => {

        const matchesRarity =
            rarity === "all" ||
            unit.rarity === rarity;


        const matchesSearch =
            unit.name
                .toLowerCase()
                .includes(search);


        return (
            matchesRarity &&
            matchesSearch
        );

    });

}


/* =========================================================
   DISPLAY UNITS
========================================================= */

function displayUnits() {

    unitGrid.innerHTML = "";

    const filteredUnits =
        getFilteredUnits();


    /* -----------------------------------------------------
       NO RESULTS
    ----------------------------------------------------- */

    if (filteredUnits.length === 0) {

        selectedUnit = null;

        unitGrid.innerHTML = `
            <div class="no-units">
                NO UNITS FOUND.
            </div>
        `;

        displayStats();

        return;

    }


    /* -----------------------------------------------------
       MAKE SURE SELECTED UNIT IS STILL VISIBLE
    ----------------------------------------------------- */

    const selectedStillVisible =
        selectedUnit &&
        filteredUnits.some(
            unit => unit.name === selectedUnit.name
        );


    if (!selectedStillVisible) {

        selectedUnit = filteredUnits[0];

    }


    /* -----------------------------------------------------
       BUILD CARDS
    ----------------------------------------------------- */

    filteredUnits.forEach(unit => {

        const card = document.createElement("div");


const rarityClass =
    unit.rarity
        .toLowerCase()
        .replace(/\s+/g, "-");


card.className =
    `unit-card ${rarityClass}`;


if (
    selectedUnit &&
    selectedUnit.name === unit.name
) {

    card.classList.add("selected");

}


/* IMAGE */

const imageWrapper =
    document.createElement("div");

imageWrapper.className =
    "unit-card-image";


const image =
    document.createElement("img");

image.src =
    unit.image;

image.alt =
    unit.name;


image.onerror = () => {

    image.style.display = "none";

};


imageWrapper.appendChild(image);


/* NAME */

const name =
    document.createElement("div");

name.className =
    "unit-card-name";

name.textContent =
    unit.name;


/* BUILD CARD */

card.appendChild(
    imageWrapper
);

card.appendChild(
    name
);


card.addEventListener(
    "click",
    () => {

        selectUnit(unit);

    }
);


unitGrid.appendChild(card);

    });


    displayStats();

}


/* =========================================================
   SELECT UNIT
========================================================= */

function selectUnit(unit) {

    selectedUnit = unit;

    displayUnits();

}


/* =========================================================
   BUILD ENCHANTMENT SELECT
========================================================= */

function buildEnchantSelect() {

    enchantSelect.innerHTML = `
        <option value="none">
            NONE
        </option>
    `;


    if (typeof enchants === "undefined") {

        return;

    }


    getEnchantEntries().forEach(
        ([key, enchant]) => {

            const option =
                document.createElement("option");


            option.value =
                key;


            option.textContent =
                enchant.name ||
                key.toUpperCase();


            enchantSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   GET ENCHANTMENT ENTRIES
========================================================= */

function getEnchantEntries() {

    if (typeof enchants === "undefined") {

        return [];

    }


    /*
        Supports either:

        const enchants = {
            Hook: {...}
        };

        OR:

        const enchants = [
            {
                name: "Hook",
                ...
            }
        ];
    */


    if (Array.isArray(enchants)) {

        return enchants.map(
            enchant => [
                enchant.name,
                enchant
            ]
        );

    }


    return Object.entries(enchants);

}


/* =========================================================
   GET SELECTED ENCHANTMENT
========================================================= */

function getSelectedEnchant() {

    if (selectedEnchant === "none") {

        return null;

    }


    if (typeof enchants === "undefined") {

        return null;

    }


    if (Array.isArray(enchants)) {

        return (
            enchants.find(
                enchant =>
                    enchant.name === selectedEnchant
            ) || null
        );

    }


    return (
        enchants[selectedEnchant] ||
        null
    );

}


/* =========================================================
   APPLY ENCHANTMENT
========================================================= */

function applyEnchant(stats) {

    const enchant = getSelectedEnchant();

    const result = {
        ...stats
    };

    if (!enchant) {
        return result;
    }


    /*
        DAMAGE
    */

    if (
        typeof enchant.damage === "number"
    ) {

        result.damage *=
            1 + (
                enchant.damage / 100
            );

    }


    /*
        RANGE
    */

    if (
        typeof enchant.range === "number"
    ) {

        result.range *=
            1 + (
                enchant.range / 100
            );

    }


    /*
        ATTACK SPEED

        More attack speed =
        shorter cooldown.
    */

    if (
        typeof enchant.attackSpeed === "number"
    ) {

        result.cooldown /=
            1 + (
                enchant.attackSpeed / 100
            );

    }


    /*
        COST

        Negative percentage means
        cheaper cost.
    */

    if (
        typeof enchant.cost === "number"
    ) {

        result.cost *=
            1 + (
                enchant.cost / 100
            );

    }


    return result;

}


/* =========================================================
   CALCULATE DPS
========================================================= */

function calculateDPS(
    damage,
    cooldown
) {

    if (
        !cooldown ||
        cooldown <= 0
    ) {

        return 0;

    }

    return damage * cooldown;
}


/* =========================================================
   DISPLAY STATS
========================================================= */

function displayStats() {

    statsTableBody.innerHTML = "";

    resetMaxStats();


    if (!selectedUnit) {
        return;
    }


    if (
        !Array.isArray(selectedUnit.stats) ||
        selectedUnit.stats.length === 0
    ) {

        statsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    STATS HAVE NOT BEEN ADDED FOR THIS UNIT YET.
                </td>
            </tr>
        `;

        return;
    }


    let maxDamage = 0;
    let maxDPS = 0;


    selectedUnit.stats.forEach(stat => {

        const modifiedStats = applyEnchant({

            damage: stat.damage,

            cooldown: stat.cooldown,

            range: stat.range,

            cost: stat.cost

        });

        const cooldownSeconds =
            1 / modifiedStats.cooldown;

        const dps = calculateDPS(
            modifiedStats.damage,
            cooldownSeconds
        );


        /*
            Track the highest level's stats.
        */

        if (modifiedStats.damage > maxDamage) {
            maxDamage = modifiedStats.damage;
        }


        if (dps > maxDPS) {
            maxDPS = dps;
        }


        const row = document.createElement("tr");

const enchant = getSelectedEnchant();

const damageModified =
    enchant &&
    typeof enchant.damage === "number" &&
    enchant.damage !== 0;

const costModified =
    enchant &&
    typeof enchant.cost === "number" &&
    enchant.cost !== 0;

const rangeModified =
    enchant &&
    (
        (typeof enchant.range === "number" && enchant.range !== 0) ||
        (typeof enchant.rng === "number" && enchant.rng !== 0)
    );

const speedModified =
    enchant &&
    (
        (typeof enchant.attackSpeed === "number" && enchant.attackSpeed !== 0) ||
        (typeof enchant.speed === "number" && enchant.speed !== 0)
    );

    row.innerHTML = `
        <td>
            ${stat.level}
        </td>

        <td class="${costModified ? "stat-modified" : ""}">
            ${
                stat.cost === undefined ||
                stat.cost === null ||
                stat.cost === ""
                    ? "-"
                    : `$${formatNumber(stat.cost)}`
            }
        </td>

        <td class="${damageModified ? "stat-modified" : ""}">
            ${formatDecimal(modifiedStats.damage)}
        </td>

        <td class="${speedModified ? "stat-modified" : ""}">
            ${formatDecimal(cooldownSeconds)}s
        </td>

        <td class="${rangeModified ? "stat-modified" : ""}">
            ${formatDecimal(modifiedStats.range)}
        </td>

        <td>
            ${formatDecimal(dps)}
        </td>
    `;


        statsTableBody.appendChild(row);

    });


    /*
        MAX PLACEMENTS

        Uses maxLimit from units.js.

        Example:

        maxLimit: 5

        Max Damage:
        damage × 5

        Max Total DPS:
        DPS × 5
    */

    const maxPlacements =
        Number(selectedUnit.maxLimit) > 0
            ? Number(selectedUnit.maxLimit)
            : 1;


    const totalMaxDamage =
        maxDamage * maxPlacements;


    const totalMaxDPS =
        maxDPS * maxPlacements;


    updateMaxStats(
        totalMaxDamage,
        totalMaxDPS,
        maxPlacements
    );

}

/* =========================================================
   MAX STATS
========================================================= */

function updateMaxStats(
    maxDamage,
    maxDPS,
    placements
) {

    const maxDamageElement =
        document.getElementById("max-damage");

    const maxDPSElement =
        document.getElementById("max-total-dps");

    const maxDamagePlacements =
        document.getElementById(
            "max-damage-placements"
        );

    const maxDPSPlacements =
        document.getElementById(
            "max-dps-placements"
        );


    const placementText =
        placements === 1
            ? `(X1 PLACEMENT)`
            : `(X${placements} PLACEMENTS)`;


    maxDamageElement.textContent =
        formatDecimal(maxDamage);


    maxDPSElement.textContent =
        formatDecimal(maxDPS);


    maxDamagePlacements.textContent =
        placementText;


    maxDPSPlacements.textContent =
        placementText;

}


/* =========================================================
   RESET MAX STATS
========================================================= */

function resetMaxStats() {

    const maxDamageElement =
        document.getElementById("max-damage");

    const maxDPSElement =
        document.getElementById("max-total-dps");

    const maxDamagePlacements =
        document.getElementById(
            "max-damage-placements"
        );

    const maxDPSPlacements =
        document.getElementById(
            "max-dps-placements"
        );


    maxDamageElement.textContent = "0";

    maxDPSElement.textContent = "0";


    maxDamagePlacements.textContent =
        "(X1 PLACEMENT)";


    maxDPSPlacements.textContent =
        "(X1 PLACEMENT)";

}


/* =========================================================
   NUMBER FORMATTING
========================================================= */

function formatNumber(number) {
    const value = Number(number);

    if (!Number.isFinite(value)) {
        return "-";
    }

    return value.toLocaleString("en-US");
}


function formatDecimal(number) {

    const value =
        Number(number);


    if (!Number.isFinite(value)) {

        return "0";

    }


    return value
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");

}


/* =========================================================
   ENCHANTMENT POPUP
========================================================= */

function buildEnchantmentPopup() {

    enchantmentList.innerHTML = "";

    if (typeof enchants === "undefined") {

        enchantmentList.innerHTML = `
            <div class="enchantment-description">
                NO ENCHANTMENTS FOUND.
            </div>
        `;

        return;
    }

    getEnchantEntries().forEach(
        ([key, enchant]) => {

            const entry = document.createElement("div");

            entry.className = "enchantment-entry";

            /*
                ENCHANTMENT NAME
            */

            const name = document.createElement("div");

            name.className = "enchantment-name";

            if (enchant.colorClass) {
                name.classList.add(enchant.colorClass);
            }

            name.textContent =
                enchant.name ||
                key.toUpperCase();


            /*
                INFORMATION
            */

            const information = document.createElement("div");


            /*
                EFFECT DESCRIPTION
            */

            const description =
                document.createElement("div");

            description.className =
                "enchantment-description";


            const effects = [];


            if (
                typeof enchant.damage === "number" &&
                enchant.damage !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.damage,
                        "DMG"
                    )
                );

            }


            if (
                typeof enchant.attackSpeed === "number" &&
                enchant.attackSpeed !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.attackSpeed,
                        "Attack Speed"
                    )
                );

            }


            if (
                typeof enchant.range === "number" &&
                enchant.range !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.range,
                        "Range"
                    )
                );

            }


            if (
                typeof enchant.speed === "number" &&
                enchant.speed !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.speed,
                        "Speed"
                    )
                );

            }


            if (
                typeof enchant.rng === "number" &&
                enchant.rng !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.rng,
                        "RNG"
                    )
                );

            }


            if (
                typeof enchant.cost === "number" &&
                enchant.cost !== 0
            ) {

                effects.push(
                    formatEffect(
                        enchant.cost,
                        "Cost"
                    )
                );

            }


            description.textContent =
                effects.length > 0
                    ? effects.join("  ")
                    : "No stat effects";


            information.appendChild(description);


            /*
                PROBABILITY
            */

            const probabilityValue =
                typeof enchant.probability === "number"
                    ? enchant.probability
                    : enchant.prob;


            if (
                typeof probabilityValue === "number" &&
                probabilityValue > 0
            ) {

                const probability =
                    document.createElement("div");

                probability.className =
                    "enchantment-prob";

                probability.textContent =
                    `PROB ${probabilityValue}%`;

                information.appendChild(
                    probability
                );

            }


            /*
                BUILD ENTRY
            */

            entry.appendChild(name);

            entry.appendChild(information);

            enchantmentList.appendChild(entry);

        }
    );

}


/* =========================================================
   ENCHANTMENT EFFECT TEXT
========================================================= */

function formatEffect(
    value,
    name
) {

    const sign =
        value > 0
            ? "+"
            : "";


    return `${sign}${value}% ${name}`;

}


/* =========================================================
   FILTER EVENTS
========================================================= */

raritySelect.addEventListener(
    "change",
    () => {

        displayUnits();

    }
);


unitSearch.addEventListener(
    "input",
    () => {

        displayUnits();

    }
);


/* =========================================================
   ENCHANTMENT SELECT
========================================================= */

enchantSelect.addEventListener(
    "change",
    () => {

        selectedEnchant =
            enchantSelect.value;


        displayStats();

    }
);


/* =========================================================
   ENCHANTMENT POPUP
========================================================= */

enchantmentHelp.addEventListener(
    "click",
    () => {

        buildEnchantmentPopup();

        enchantmentModal.classList.add("open");

        document.body.style.overflow = "hidden";

    }
);


function closeEnchantmentModalFunction() {

    enchantmentModal.classList.remove("open");

    document.body.style.overflow = "";

}


closeEnchantmentModal.addEventListener(
    "click",
    closeEnchantmentModalFunction
);


enchantmentModal.addEventListener(
    "click",
    event => {

        if (
            event.target === enchantmentModal
        ) {

            closeEnchantmentModalFunction();

        }

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            enchantmentModal.classList.contains("open")
        ) {

            closeEnchantmentModalFunction();

        }

    }
);


/* =========================================================
   MOBILE NAV
========================================================= */

function closeMobileMenu() {

    mobileMenu.classList.remove("open");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow = "";

}


mobileMenuButton.addEventListener(
    "click",
    () => {

        const isOpen =
            mobileMenu.classList.toggle("open");


        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        document.body.style.overflow =
            isOpen
                ? "hidden"
                : "";

    }
);


mobileCloseButton.addEventListener(
    "click",
    closeMobileMenu
);


/* ---------------------------------------------------------
   MOBILE DROPDOWNS
--------------------------------------------------------- */

document
    .querySelectorAll(
        ".mobile-nav-section-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.closest(
                        ".mobile-nav-section"
                    );


                section.classList.toggle(
                    "open"
                );

            }
        );

    });


/* ---------------------------------------------------------
   CLOSE MOBILE MENU WHEN LINK IS CLICKED
--------------------------------------------------------- */

document
    .querySelectorAll(
        ".mobile-menu a"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


/* ---------------------------------------------------------
   ESCAPE CLOSES MOBILE MENU
--------------------------------------------------------- */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("open")
        ) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   START
========================================================= */

buildEnchantSelect();

buildEnchantmentPopup();

displayUnits();