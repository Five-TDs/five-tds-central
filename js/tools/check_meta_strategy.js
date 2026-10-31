const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..", "js");
const context = vm.createContext({ window: {}, console });
for (const file of [
    "data/units.js", "data/nights-data.js", "data/enchantments.js", "config/meta-settings.js",
    "data/tierlist-data.js", "data/best-towers-data.js", "data/teams-data.js",
    "meta/ranking-engine.js", "meta/strategy-model.js"
]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file, timeout: 60000 });
const engine = context.window.FTC_META_RANKING;
assert.equal(engine.data.length, 28);
assert.equal(engine.levelNumbers.length, 5);
const tiers = vm.runInContext("TIER_ORDER.flatMap(tier => TIER_ASSIGNMENTS[tier])", context);
assert.equal(tiers.length, 28);
assert.equal(new Set(tiers).size, 28);
assert.equal(engine.settings.groupedTargetCounts.length, 5);
assert.equal(engine.settings.targetCountWeights.reduce((a, b) => a + b, 0), 1);
for (const item of engine.data) {
    const confidence = engine.confidenceFor(item);
    assert.ok(["Low", "Medium"].includes(confidence.label));
    assert.equal(confidence.verifiedInGame, false);
    const enchant = engine.enchantFor(item);
    assert.ok(enchant.best && enchant.alternative && enchant.maximum);
    for (const level of item.levels) {
        assert.equal(level.scenarios.length, 5);
        assert.ok(level.scenarios.every(scene => scene.estimatedHits <= scene.targets));
        if (level.dps !== null) assert.equal(level.dps, level.damage * level.hps);
    }
}
const affordableMangle = engine.data.find(item => item.name === "Mangle");
assert.equal(affordableMangle.placement, 75);
assert.equal(engine.effectivePlacement(affordableMangle, "starter", "none"), 75);
assert.equal(engine.effectivePlacement(affordableMangle, "starter", "recommended"), 37.5);
assert.ok(engine.ranked("starter").some(item => item.name === "Mangle"));
assert.ok(!engine.ranked("starter", { enchantment: "none" }).some(item => item.name === "Mangle"));
assert.ok(engine.setRankingPreset("none"));
assert.ok(engine.ranked("starter").every(item => item.placement <= 50));
assert.ok(engine.setRankingPreset("maximum"));
assert.ok(engine.setRankingPreset("recommended"));
const teams = vm.runInContext("TEAM_COMPOSITIONS", context);
for (const team of teams) {
    assert.equal(team.units.length, 5);
    assert.equal(new Set(team.units).size, 5);
    assert.equal(team.substitutes.length, 5);
    assert.equal(new Set(team.substitutes).size, 5);
    assert.ok(team.enchants.every(value => !!value));
    assert.ok(engine.effectivePlacement(engine.data.find(item => item.name === team.units[0]), "starter") <= 50);
}
assert.equal(engine.optimizedTeams().length, 5);
assert.equal(engine.optimizedTeams()[0].checked, 98280);
const zero = engine.modelNight({ game: 1, night: 1, mode: "normal" });
const funded = engine.modelNight({ game: 1, night: 1, mode: "normal", waveIncome: 200, enemyHealth: 1000 });
assert.equal(zero.incomeProvided, false);
assert.equal(zero.timeline[0].enteredIncomeAfterWave, 0);
assert.equal(funded.timeline.length, 10);
assert.equal(funded.incomeProvided, true);
assert.ok(funded.timeline.some(row => row.purchased.length > 0));
assert.ok(funded.timeline[9].modeledGroupDps >= zero.timeline[9].modeledGroupDps);
for (const night of engine.cashByNight) {
    assert.ok(engine.setNight(night.game, night.night, night.mode));
    assert.ok(engine.ranked("starter").every(item => engine.effectivePlacement(item, "starter") <= night.cash));
    const updatedTeams = vm.runInContext("TEAM_COMPOSITIONS", context);
    assert.ok(updatedTeams.every(team => engine.effectivePlacement(engine.data.find(item => item.name === team.units[0]), "starter") <= night.cash));
}
console.log("Expanded META modeling passed: all 28 units, 98,280 five-unit combinations, enchant mode comparisons, optional Night economy plans and all 22 Night modes.");
