/* =========================================================
   SHARED NUMBER FORMATTING
========================================================= */

/*
    Used by Unit Database details and Raw DPS.

    Whole numbers receive commas.
    Decimal numbers display up to 2 places.
    Invalid values display "—".
*/

function formatNumber(value) {

    const number = Number(value);

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


/*
    Used by the individual unit page.
*/

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


function formatMultiplier(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return "x" + number.toFixed(2);

}


/*
    Used by the Stats Simulator.

    Keeps its existing decimal formatting
    and invalid-value fallback.
*/

function formatDecimal(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");

}


/*
    Stats Simulator cost formatting.

    This deliberately retains the simulator's
    existing behavior, including its "-" fallback.
*/

function formatSimulatorNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "-";
    }

    return number.toLocaleString("en-US");

}