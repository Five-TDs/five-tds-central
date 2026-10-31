const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const referencePath = path.join(__dirname, "data-reference.json");
const reference = JSON.parse(fs.readFileSync(referencePath, "utf8"));
function load(files, expression) {
    const context = vm.createContext({ window: {}, console });
    for (const filename of files) {
        const script = fs.readFileSync(path.join(root, filename), "utf8");
        vm.runInContext(script, context, { filename });
    }
    return JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));
}
const sources = [
    ["js/data/units.js", ["js/data/units.js"], "units"],
    ["js/data/nights-data.js", ["js/data/nights-data.js"], "nights"],
    ["js/data/enchantments.js", ["js/data/enchantments.js"], "enchants"],
    ["js/data/updates.js", ["js/data/updates.js"], "UPDATES"],
    ["js/data/version-history-data.js", ["js/data/version-history-data.js"], "WEBSITE_VERSION_HISTORY"],
    ["js/config/meta-settings.js", ["js/config/meta-settings.js"], "FTC_META_SETTINGS"],
    ["js/config/navigation.js", ["js/config/navigation.js"], "window.SITE_NAVIGATION"],
    ["js/data/tierlist-data.js", ["js/config/meta-settings.js", "js/data/tierlist-data.js"], "{TIER_DESCRIPTIONS,TIER_ORDER,TIER_ASSIGNMENTS}"],
    ["js/data/teams-data.js", ["js/config/meta-settings.js", "js/data/teams-data.js"], "TEAM_COMPOSITIONS"],
    ["js/data/best-towers-data.js", ["js/config/meta-settings.js", "js/data/best-towers-data.js"], "{BEST_UNIT_RANKINGS,BEST_UNIT_ENCHANTS}"],
    ["ranking", ["js/data/units.js", "js/data/enchantments.js", "js/data/nights-data.js", "js/config/meta-settings.js", "js/data/tierlist-data.js", "js/data/best-towers-data.js", "js/data/teams-data.js", "js/meta/ranking-engine.js"], "({audit:window.FTC_META_RANKING.getAudit(),tiers:TIER_ASSIGNMENTS,best:BEST_UNIT_RANKINGS,enchants:BEST_UNIT_ENCHANTS,teams:TEAM_COMPOSITIONS,night:window.FTC_META_RANKING.context()})"],
    ["ranking-advanced", ["js/data/units.js", "js/data/enchantments.js", "js/data/nights-data.js", "js/config/meta-settings.js", "js/data/tierlist-data.js", "js/data/best-towers-data.js", "js/data/teams-data.js", "js/meta/ranking-engine.js", "js/meta/strategy-model.js"], "({tiers:TIER_ASSIGNMENTS,best:BEST_UNIT_RANKINGS,enchants:BEST_UNIT_ENCHANTS,teams:TEAM_COMPOSITIONS,starter:window.FTC_META_RANKING.ranked('starter').map(x=>x.name),selectedMode:window.FTC_META_RANKING.getRankingPreset()})"]
];
function digest(value) {
    return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
const current = Object.fromEntries(sources.map(([name, files, expression]) => [name, digest(load(files, expression))]));
if (process.argv.includes("--refresh")) {
    fs.writeFileSync(referencePath, JSON.stringify({ ...reference, hashes: current }, null, 2) + "\n");
    console.log("Reference refreshed for the current source data. Check that every data edit was intentional before committing.");
}
else {
    const differences = Object.keys(current).filter(name => current[name] !== reference.hashes[name]);
    if (differences.length) {
        console.error("Data or generated rankings differ from the saved reference:");
        differences.forEach(name => console.error("- " + name));
        process.exitCode = 1;
    }
    else {
        console.log(`Data preserved: ${sources.length} datasets and generated ranking outputs match the reference.`);
        console.log(`${load(["js/data/units.js"], "units").length} unit records; original values, fields, and ordering unchanged.`);
    }
}
