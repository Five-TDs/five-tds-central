const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "../js");
const context = vm.createContext({ window: {}, console });
for (const file of [
    "data/units.js", "data/nights-data.js", "data/enchantments.js", "config/meta-settings.js",
    "data/tierlist-data.js", "data/best-towers-data.js", "data/teams-data.js",
    "meta/ranking-engine.js", "meta/strategy-model.js"
]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file, timeout: 60000 });
const meta = context.window.FTC_META_RANKING;
const baseline = vm.runInContext("JSON.stringify({best:BEST_UNIT_RANKINGS,teams:TEAM_COMPOSITIONS})", context);
vm.runInContext(fs.readFileSync(path.join(root, "meta/tierlist-model.js"), "utf8"), context, { filename: "tierlist-model.js", timeout: 60000 });
const tiers = context.window.FTC_META_TIERLIST;
function validate() {
    const list = vm.runInContext("TIER_ORDER.flatMap(tier => TIER_ASSIGNMENTS[tier])", context);
    assert.equal(list.length, 28);
    assert.equal(new Set(list).size, 28);
    const ranked = tiers.ranked();
    assert.equal(ranked.length, 28);
    assert.ok(ranked.every(row => Number.isFinite(row.score) && row.score >= 0 && row.score <= 1));
    assert.deepEqual(ranked.filter(row => row.name === "Endo 02" || row.name === "Withered Chica").length, 2);
}
const initial = tiers.ranked().map(row => row.name).join("|");
for (const mode of Object.keys(tiers.modeNames)) {
    assert.ok(tiers.setMode(mode));
    validate();
}
assert.equal(vm.runInContext("JSON.stringify({best:BEST_UNIT_RANKINGS,teams:TEAM_COMPOSITIONS})", context), baseline);
assert.equal(tiers.setMode("wrong"), false);
assert.ok(tiers.setMode("overall"));
for (const preset of ["none", "recommended", "maximum"]) {
    assert.ok(meta.setRankingPreset(preset));
    validate();
}
meta.setRankingPreset("recommended");
const fullViewBefore = tiers.ranked().map(row => row.name).join("|");
assert.ok(meta.setNight(1, 11, "max"));
assert.equal(tiers.ranked().map(row => row.name).join("|"), fullViewBefore);
assert.ok(tiers.setMode("night"));
const richNight = tiers.ranked().map(row => row.name).join("|");
assert.ok(meta.setNight(1, 1, "normal"));
assert.notEqual(tiers.ranked().map(row => row.name).join("|"), richNight);
assert.ok(tiers.setMode("value"));
validate();
for (const record of meta.cashByNight) {
    assert.ok(meta.setNight(record.game, record.night, record.mode));
    validate();
}
assert.ok(tiers.setMode("overall"));
assert.equal(tiers.ranked().map(row => row.name).join("|"), initial);
console.log("Tierlist model checks passed: 28 units, five views, 22 Night modes, enchant presets, stable overall rankings and unchanged other guide scores.");
