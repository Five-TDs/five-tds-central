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

/* =========================================================
   STATE
========================================================= */

let selectedUnit = null;

let selectedEnchant = "none";


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

    if (
        !selectedEnchant ||
        selectedEnchant === "none"
    ) {
        return null;
    }

    if (typeof enchants === "undefined") {
        return null;
    }

    return enchants[selectedEnchant] || null;
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


    /* =========================
       DAMAGE
    ========================= */

    if (enchant.damage != null) {

        const percent = Number(enchant.damage);

        if (Number.isFinite(percent)) {

            result.damage =
                Number(result.damage) *
                (1 + percent / 100);

        }

    }


    /* =========================
   RANGE
========================= */

if (enchant.range != null) {

    const percent =
        Number(enchant.range);

    if (
        Number.isFinite(percent) &&
        Number.isFinite(Number(result.range))
    ) {

        result.range =
            Number(result.range) *
            (1 + percent / 100);

    }

}


    /* =========================
   ATTACK SPEED

   Negative percentages reduce
   the attack interval, increasing HPS.
========================= */

if (enchant.attackSpeed != null) {

    const speedPercent =
        Number(enchant.attackSpeed);

    const intervalMultiplier =
        1 + speedPercent / 100;

    if (
        Number.isFinite(speedPercent) &&
        intervalMultiplier > 0
    ) {

        const originalHPS =
            getHPS(result);

        if (originalHPS > 0) {

            result.cooldown =
                originalHPS / intervalMultiplier;

        }

    }

}


    /* =========================
       COST
    ========================= */

    if (enchant.cost != null) {

        const percent =
            Number(enchant.cost);

        if (Number.isFinite(percent)) {

            result.cost =
                Number(result.cost) *
                (1 + percent / 100);

        }

    }


    return result;
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

        /*
         * LEVEL 1 COST
         *
         * Level 1 uses placement instead of stat.cost.
         */
        const baseCost =
            stat.level === 1
                ? Number(selectedUnit.placement)
                : Number(stat.cost);

        /*
         * ORIGINAL STATS
         */
        const originalStats = {
            damage: Number(stat.damage),
            cooldown: Number(stat.cooldown),
            range: Number(stat.range),
            cost: baseCost
        };

        /*
         * ENCHANTED STATS
         */
        const modifiedStats =
            applyEnchant(originalStats);

        /*
         * CHECK WHETHER THE ACTUAL VALUE CHANGED
         */
        const damageModified =
            Number.isFinite(originalStats.damage) &&
            Number.isFinite(modifiedStats.damage) &&
            Math.abs(
                modifiedStats.damage -
                originalStats.damage
            ) > 0.000001;

        const costModified =
            Number.isFinite(originalStats.cost) &&
            Number.isFinite(modifiedStats.cost) &&
            Math.abs(
                modifiedStats.cost -
                originalStats.cost
            ) > 0.000001;

        const rangeModified =
            Number.isFinite(originalStats.range) &&
            Number.isFinite(modifiedStats.range) &&
            Math.abs(
                modifiedStats.range -
                originalStats.range
            ) > 0.000001;

        const cooldownModified =
            Number.isFinite(originalStats.cooldown) &&
            Number.isFinite(modifiedStats.cooldown) &&
            Math.abs(
                modifiedStats.cooldown -
                originalStats.cooldown
            ) > 0.000001;

        /*
         * HITS PER SECOND
         *
         * The database keeps its historical `cooldown` key,
         * but the stored value is HPS.
         */
        const hps = getHPS(modifiedStats);

        /*
         * DPS
         */
        const dps =
            calculateDPS(
                modifiedStats.damage,
                hps
            );

        /*
         * MAX STATS
         */
        if (modifiedStats.damage > maxDamage) {
            maxDamage = modifiedStats.damage;
        }

        if (dps > maxDPS) {
            maxDPS = dps;
        }

        /*
         * BUILD ROW
         */
        const row =
            document.createElement("tr");

        /*
         * LEVEL 1 PLACEMENT
         */
        const isPlacementCost =
    stat.level === 1;

const costClasses = [
    isPlacementCost ? "placement-cost" : "",
    costModified ? "stat-modified" : ""
]
    .filter(Boolean)
    .join(" ");

const displayedCost =
    Number.isFinite(modifiedStats.cost)
        ? `$${formatSimulatorNumber(modifiedStats.cost)}`
        : "-";

        row.innerHTML = `

            <td>
                ${stat.level}
            </td>

            <td class="${costClasses}">
    ${displayedCost}
</td>

            <td
                class="${
                    damageModified
                        ? "stat-modified"
                        : ""
                }"
            >
                ${formatDecimal(modifiedStats.damage)}
            </td>

            <td
                class="${
                    cooldownModified
                        ? "stat-modified"
                        : ""
                }"
            >
                ${formatDecimal(hps)}
            </td>

            <td
                class="${
                    rangeModified
                        ? "stat-modified"
                        : ""
                }"
            >
                ${formatDecimal(modifiedStats.range)}
            </td>

            <td>
                ${formatDecimal(dps)}
            </td>

        `;

        statsTableBody.appendChild(row);

    });

    /*
     * MAX PLACEMENTS
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
                        "Attack Interval"
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

enchantSelect.addEventListener("change", () => {

    selectedEnchant = enchantSelect.value;

    displayStats();

});


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
   START
========================================================= */

buildEnchantSelect();

buildEnchantmentPopup();

displayUnits();