/* =========================================
   FIVE TD'S CENTRAL
   SHARED UNIT UTILITIES
========================================= */

/* =========================================
   FIND UNIT BY NAME
========================================= */

function findUnitByName(name) {
    if (!name || typeof units === "undefined") {
        return null;
    }

    return units.find(unit => unit.name === name) || null;
}


/* =========================================
   NORMALIZE UNIT WARNINGS
========================================= */

function getUnitWarnings(unit) {
    if (!unit || !unit.warn) {
        return [];
    }

    if (Array.isArray(unit.warn)) {
        return unit.warn
            .filter(warning => warning != null && String(warning).trim())
            .map(warning => String(warning));
    }

    const warning = String(unit.warn).trim();

    return warning ? [warning] : [];
}


/* =========================================
   COMBINE WARNING TEXT
========================================= */

function getUnitWarningText(unit) {
    return getUnitWarnings(unit).join(" ");
}


/* =========================================
   CHECK FOR WARNINGS
========================================= */

function unitHasWarnings(unit) {
    return getUnitWarnings(unit).length > 0;
}