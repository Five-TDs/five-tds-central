



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




function formatSimulatorNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "-";
    }

    return number.toLocaleString("en-US");

}