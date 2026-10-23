// =========================
// FIND THE UNIT
// =========================

const params = new URLSearchParams(window.location.search);

const unitName = params.get("unit");

const unit = units.find(
    currentUnit => currentUnit.name === unitName
);


// =========================
// CHECK IF UNIT EXISTS
// =========================

if (!unit) {

    document.title = "Unit Not Found";

    document.querySelector(".unit-page").innerHTML = `
        <h1>Unit Not Found</h1>
        <p>The unit you're looking for doesn't exist.</p>
    `;

} else {

    // =========================
    // PAGE TITLE
    // =========================

    document.title =
        unit.name + " - Unit Database";


    // =========================
    // BASIC INFORMATION
    // =========================

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


    // =========================
    // RARITY COLORS
    // =========================

    const rarityColor = getRarityColor(unit.rarity);


    if (rarityColor) {

        document
            .getElementById("rarity-box")
            .style.setProperty(
                "--rarity-color",
                rarityColor
            );


        document
            .querySelector(".unit-image-container")
            .style.borderColor =
                rarityColor;

    }


    // =========================
    // BUILD STATS
    // =========================

    buildStats();
    displayAbilities(unit);
    displayWarnings(unit);

}


// =========================
// BUILD STATS TABLE
// =========================

function buildStats() {

    const statsBody =
        document.getElementById("stats-body");

    const statsHeader =
        document.getElementById("stats-header-row");

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



    // =========================
    // DETERMINE STAT MODE
    // =========================

    const hasRangeBuff =
        unit.stats.some(stat =>
            stat.rangeBuff !== undefined
        );

    const hasDamageBuff =
        unit.stats.some(stat =>
            stat.damageBuff !== undefined
        );

    const hasCooldownBuff =
        unit.stats.some(stat =>
            stat.cooldownBuff !== undefined
        );

    const hasSlow =
        unit.stats.some(stat =>
            stat.slow !== undefined
        );



    let statMode = "normal";

    if (hasRangeBuff) {
        statMode = "rangeBuff";
    } else if (hasDamageBuff) {
        statMode = "damageBuff";
    } else if (hasCooldownBuff) {
        statMode = "cooldownBuff";
    } else if (hasSlow) {
        statMode = "slow";
    }



    // =========================
    // BUILD HEADER
    // =========================

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

    } else {

        statsHeader.innerHTML = `
            <th>LVL</th>
            <th>COST</th>
            <th>RNG</th>
            <th>SPECIAL</th>
            <th>TYPE</th>
        `;

    }



    // =========================
    // LEVEL ROWS
    // =========================

    let previousType =
        unit.stats[0].type;



    unit.stats.forEach((stat, index) => {

        const typeChanged =
            index > 0 &&
            stat.type !== previousType;



        const row =
            document.createElement("tr");



        // =========================
        // NORMAL UNIT
        // =========================

        if (statMode === "normal") {

            const dps = calculateDPS(stat.damage, getHPS(stat));



            row.innerHTML = `
                <td>
                    ${stat.level}
                </td>

                <td>
                    ${formatMoney(stat.cost)}
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
                    ${formatMoney(stat.cost)}
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
                    ${formatMoney(stat.cost)}
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
                    ${formatMoney(stat.cost)}
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
                    ${formatMoney(stat.cost)}
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



        previousType =
            stat.type;

    });



    // =========================
    // TOTAL COST
    // =========================

    const totalCost =
        unit.stats.reduce(
            (total, stat) =>
                total + Number(stat.cost || 0),
            0
        );



    document.getElementById("total-cost").textContent =
        formatMoney(totalCost);

}


// =========================
// FORMATTING
// =========================

function formatMoney(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return "$" + number.toLocaleString();

}


function formatNumber(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "—";
    }


    if (Number.isInteger(number)) {
        return number.toLocaleString();
    }


    return number
        .toFixed(2)
        .replace(/\.?0+$/, "");

}

function formatMultiplier(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return "x" + number.toFixed(2);
}


function formatCooldown(value) {
    return formatHPS(value);
}

function displayAbilities(unit) {

    const abilitiesList = document.getElementById("abilities-list");

    if (!abilitiesList) return;

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

    const warningsContainer =
        document.getElementById("unit-warnings");

    if (!warningsContainer) {
        return;
    }

    warningsContainer.innerHTML = "";

    const warnings =
        Array.isArray(unit.warn)
            ? unit.warn
            : [];

    if (warnings.length === 0) {
        return;
    }

    warnings.forEach(warning => {

        if (!warning) {
            return;
        }

        const warningElement =
            document.createElement("div");

        warningElement.className =
            "page-warning";

        warningElement.textContent =
            warning;

        warningsContainer.appendChild(
            warningElement
        );

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

const tabs =
    document.querySelectorAll(".unit-tab");


tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const selectedTab =
            tab.dataset.tab;


        // Remove active from all buttons

        tabs.forEach(currentTab => {

            currentTab.classList.remove(
                "active"
            );

        });


        // Activate clicked button

        tab.classList.add("active");


        // Hide all content

        document
            .querySelectorAll(".tab-content")
            .forEach(content => {

                content.classList.remove(
                    "active"
                );

            });


        // Show selected content

        const selectedContent =
            document.getElementById(
                `${selectedTab}-tab`
            );


        if (selectedContent) {

            selectedContent.classList.add(
                "active"
            );

        }

    });

});


const statsTabButton =
    document.getElementById("stats-tab-button");

const abilitiesTabButton =
    document.getElementById("abilities-tab-button");

const statsContent =
    document.getElementById("stats-content");

const abilitiesContent =
    document.getElementById("abilities-content");


if (
    statsTabButton &&
    abilitiesTabButton &&
    statsContent &&
    abilitiesContent
) {

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