let indexedUnitSource = null;
let unitNameLookup = null;
function findUnitByName(name) {
    if (!name || typeof units === "undefined" || !Array.isArray(units)) {
        return null;
    }
    if (indexedUnitSource !== units) {
        indexedUnitSource = units;
        unitNameLookup = new Map();
        for (const unit of units) {
            if (!unitNameLookup.has(unit.name)) unitNameLookup.set(unit.name, unit);
        }
    }
    return unitNameLookup.get(name) || null;
}
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
function getUnitWarningText(unit) {
    return getUnitWarnings(unit).join(" ");
}
function unitHasWarnings(unit) {
    return getUnitWarnings(unit).length > 0;
}
