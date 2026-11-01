const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const base = path.join(__dirname, "..", "js");
const context = vm.createContext({ window: {} });
for (const file of [
    "data/units.js",
    "data/nights-data.js",
    "config/meta-settings.js",
    "data/tierlist-data.js",
    "data/best-towers-data.js",
    "data/teams-data.js",
    "data/enchantments.js",
    "meta/ranking-engine.js"
])
    vm.runInContext(fs.readFileSync(path.join(base, file), "utf8"), context, { filename: file });
const engine = context.window.FTC_META_RANKING;
const settings = engine.settings;
const near = (a, b) => Math.abs(a - b) < 1e-7;
assert.ok(near(settings.targetCountWeights.reduce((a, b) => a + b, 0), 1));
assert.ok(near(Object.values(settings.levelWeights).reduce((a, b) => a + b, 0), 1));
assert.equal(settings.groupedTargetCounts.length, settings.targetCountWeights.length);
assert.equal(engine.data.length, 28);
for (const item of engine.data) {
    assert.equal(item.placement, item.levels[0].totalInvestment, item.name);
    for (const step of item.levels) {
        assert.equal(step.scenarios.length, settings.groupedTargetCounts.length, item.name);
        if (step.dps === null) {
            assert.equal(step.scenarioDeployedDps, null, item.name);
            assert.equal(step.radiusDamage, null, item.name);
        }
        else {
            assert.ok(near(step.dps, step.damage * step.hps), item.name);
            assert.ok(near(step.deployedDps, step.dps * item.placements), item.name);
            const grouped = step.scenarios.reduce((sum, scene, index) => sum + scene.deployedDps * settings.targetCountWeights[index], 0);
            const ranged = step.scenarios.reduce((sum, scene, index) => sum + scene.reachAdjustedDps * settings.targetCountWeights[index], 0);
            assert.ok(near(step.scenarioDeployedDps, grouped), item.name);
            assert.ok(near(step.radiusDamage, ranged), item.name);
            assert.ok(step.scenarios.every((scene, index) => scene.estimatedHits <= settings.groupedTargetCounts[index]), item.name);
            assert.ok(step.scenarios.every((scene, index) => scene.deployedDps >= step.deployedDps), item.name);
        }
    }
}
const endo = engine.data.find(item => item.name === "Endo 02");
const buff = engine.data.find(item => item.name === "Withered Chica");
assert.ok(endo.roles.control && !endo.roles.damage);
assert.ok(buff.roles.support && !buff.roles.damage);
const shadow = engine.data.find(item => item.name === "Shadow Freddy");
assert.ok(shadow.levels[0].scenarios[2].deployedDps > shadow.levels[0].deployedDps);
const bonnie = engine.data.find(item => item.name === "Shadow Bonnie");
assert.ok(bonnie.levels.every(step => step.scenarios.every(scene => near(scene.deployedDps, step.deployedDps))));
assert.equal(engine.ranked("overall")[0].name, "Shadow Freddy");
assert.equal(engine.ranked("boss")[0].name, "Shadow Bonnie");
for (const night of engine.cashByNight) {
    assert.ok(engine.setNight(night.game, night.night, night.mode));
    assert.ok(engine.ranked("starter").every(unit => unit.placement <= night.cash));
    const titles = vm.runInContext("TEAM_COMPOSITIONS.map(team=>team.title)", context);
    assert.equal(new Set(titles).size, 5);
    const teams = vm.runInContext("TEAM_COMPOSITIONS", context);
    for (const team of teams) {
        assert.equal(team.units.length, 5);
        assert.equal(new Set(team.units).size, 5);
        assert.ok(engine.data.find(u => u.name === team.units[0]).placement <= night.cash);
    }
}
console.log("Modeled coverage and affordability tests passed across all 28 units and 22 Night modes.");
