// =========================================================
// ACTIVE FILTERS
// =========================================================

let activeRarities = [];

let activeTypes = [];


// =========================================================
// SORT
// =========================================================

// true = highest to lowest
// false = lowest to highest

let highestFirst = true;


// =========================================================
// PAGE ELEMENTS
// =========================================================

const searchInput =
    document.getElementById("search-input");


const filterButton =
    document.getElementById("filter-button");


const filters =
    document.getElementById("filters");


const dpsBody =
    document.getElementById("dps-body");


const dpsHeader =
    document.getElementById("dps-header");


const sortArrow =
    document.getElementById("sort-arrow");


// =========================================================
// FILTER MENU
// =========================================================

filterButton.addEventListener("click", () => {

    filters.classList.toggle("open");

    filterButton.classList.toggle("open");

});


// =========================================================
// RARITY FILTERS
// =========================================================

document
    .querySelectorAll(".rarity-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            if (activeRarities.includes(value)) {

                activeRarities =
                    activeRarities.filter(
                        rarity => rarity !== value
                    );

                button.classList.remove("active");

            } else {

                activeRarities.push(value);

                button.classList.add("active");

            }


            displayDPS();

        });

    });


// =========================================================
// TYPE FILTERS
// =========================================================

document
    .querySelectorAll(".type-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            const value =
                button.dataset.value;


            if (activeTypes.includes(value)) {

                activeTypes =
                    activeTypes.filter(
                        type => type !== value
                    );

                button.classList.remove("active");

            } else {

                activeTypes.push(value);

                button.classList.add("active");

            }


            displayDPS();

        });

    });


// =========================================================
// SEARCH
// =========================================================

searchInput.addEventListener(
    "input",
    () => {

        displayDPS();

    }
);


// =========================================================
// SORT BUTTON
// =========================================================

dpsHeader.addEventListener("click", () => {

    highestFirst =
        !highestFirst;


    updateSortArrow();

    displayDPS();

});


// =========================================================
// SORT ARROW
// =========================================================

function updateSortArrow() {

    if (highestFirst) {

        sortArrow.textContent = "▼";

    } else {

        sortArrow.textContent = "▲";

    }

}


// =========================================================
// GET MAX LEVEL STATS
// =========================================================

function getMaxStats(unit) {

    if (
        !unit.stats ||
        unit.stats.length === 0
    ) {

        return null;

    }


    /*
        The last entry in the stats array
        is treated as the max-level stat.
    */

    return unit.stats[
        unit.stats.length - 1
    ];

}


/* =========================================================
   GET MAX DPS
========================================================= */

function getMaxDPS(unit) {

    const stats = getMaxStats(unit);

    if (!stats) {
        return null;
    }

    const damage = Number(stats.damage);
    const hps = getHPS(stats);

    if (
        !Number.isFinite(damage) ||
        hps <= 0
    ) {
        return null;
    }

    return calculateDPS(damage, hps);
}


// =========================================================
// DISPLAY DPS
// =========================================================

function displayDPS() {

    dpsBody.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    /*
        Start with units that actually
        have max-level stats.
    */

    let filteredUnits =
        units.filter(unit => {

            const maxDPS =
                getMaxDPS(unit);


            if (maxDPS === null) {
                return false;
            }


            // =========================
            // SEARCH
            // =========================

            const matchesSearch =
                unit.name
                    .toLowerCase()
                    .includes(searchText);


            // =========================
            // RARITY
            // =========================

            const matchesRarity =
                activeRarities.length === 0 ||

                activeRarities.includes(
                    unit.rarity
                );


            // =========================
            // TYPE
            // =========================

            const maxStats =
                getMaxStats(unit);


            const matchesType =
                activeTypes.length === 0 ||

                activeTypes.includes(
                    maxStats.type || unit.type
                );


            return (
                matchesSearch &&
                matchesRarity &&
                matchesType
            );

        });


    // =====================================================
    // SORT
    // =====================================================

    filteredUnits.sort((a, b) => {

        const aDPS =
            getMaxDPS(a);


        const bDPS =
            getMaxDPS(b);


        if (highestFirst) {

            return bDPS - aDPS;

        }


        return aDPS - bDPS;

    });


    // =====================================================
    // NO RESULTS
    // =====================================================

    if (filteredUnits.length === 0) {

        dpsBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="no-results"
                >
                    NO UNITS FOUND.
                </td>

            </tr>

        `;

        return;

    }


    // =====================================================
    // CREATE ROWS
    // =====================================================

    filteredUnits.forEach((unit, index) => {

        const maxStats =
            getMaxStats(unit);


        const maxDPS =
            getMaxDPS(unit);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td class="rank">
                ${index + 1}
            </td>


            <td>

                <span
                    class="unit-name unit-name-${unit.rarity.toLowerCase()}"
                    data-unit="${unit.name}"
                >
                    ${unit.name}
                </span>

            </td>


            <td>

                <span
                    class="rarity rarity-${unit.rarity.toLowerCase()}"
                >
                    ${unit.rarity}
                </span>

            </td>


            <td class="attack-type">
                ${maxStats.type || unit.type}
            </td>


            <td>
                ${unit.maxLimit ?? "—"}
            </td>


            <td>
                ${formatHPS(maxStats.cooldown)}
            </td>


            <td>
                ${formatNumber(maxStats.range)}
            </td>


            <td>
                ${formatNumber(maxStats.damage)}
            </td>


            <td class="max-dps">
                ${formatNumber(maxDPS)}
            </td>

        `;


        dpsBody.appendChild(row);


        // =================================================
        // UNIT CLICK
        // =================================================

        const unitLink =
            row.querySelector(".unit-name");


        unitLink.addEventListener(
            "click",
            () => {

                window.location.href =
                    `unit.html?unit=${encodeURIComponent(unit.name)}`;

            }
        );

    });

}

// =========================================================
// INITIAL DISPLAY
// =========================================================

updateSortArrow();

displayDPS();