const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..", "js");
const context = vm.createContext({ window: {} });
const load = name => vm.runInContext(fs.readFileSync(path.join(root, name + ".js"), "utf8"), context, { filename: name + ".js" });
["data/units", "data/nights-data", "config/meta-settings", "data/tierlist-data", "data/best-towers-data", "data/teams-data", "data/enchantments", "meta/ranking-engine", "data/updates"].forEach(load);
const engine = context.window.FTC_META_RANKING;
const updates = vm.runInContext("UPDATES", context);
assert.equal(engine.data.length, 28);
assert.equal(new Set(engine.data.map(x => x.name)).size, 28);
assert.equal(engine.cashByNight.length, 22);
assert.equal(engine.ranked("starter").map(x => x.name).join(), "Endo 01");
assert.equal(engine.ranked("overall")[0].name, "Shadow Freddy");
assert.equal(engine.ranked("mid")[0].name, "Shadow Freddy");
assert.equal(engine.ranked("late")[0].name, "Shadow Freddy");
assert.equal(engine.ranked("boss")[0].name, "Shadow Bonnie");
let counted = 0;
for (const item of engine.data) {
    assert.equal(item.levels.length, item.unit.stats.length, item.name);
    assert.equal(item.levels[0].upgradeCost, item.placement, item.name);
    let investment = item.placement;
    for (let i = 0; i < item.levels.length; i++) {
        counted++;
        const step = item.levels[i];
        if (i)
            investment += item.unit.stats[i].cost;
        assert.equal(step.totalInvestment, investment, item.name);
        assert.equal(step.upgradeCost, i ? item.unit.stats[i].cost : item.placement, item.name);
        assert.equal(step.peer.comparedWith, engine.data.filter(u => u.levels.some(l => l.level === step.level)).length, item.name);
        if (step.dps === null) {
            assert.equal(step.deployedDps, null, item.name);
            assert.equal(step.radiusDamage, null, item.name);
        }
        else {
            assert.ok(Math.abs(step.damage * step.hps - step.dps) < 1e-9, item.name);
            assert.ok(Math.abs(step.dps * item.placements - step.deployedDps) < 1e-9, item.name);
            assert.ok(Math.abs(step.scenarios.reduce((sum, scene, index) => sum + scene.reachAdjustedDps * engine.settings.targetCountWeights[index], 0) - step.radiusDamage) < 1e-9, item.name);
            assert.ok(Math.abs(step.dps / step.upgradeCost - step.dpsPerUpgradeCost) < 1e-9, item.name);
            if (i)
                assert.ok(Math.abs((step.dps - item.levels[i - 1].dps) / step.upgradeCost - step.incrementalDpsPerUpgradeCost) < 1e-9, item.name);
        }
    }
    const recommended = engine.enchantFor(item);
    assert.ok(["Battery", "Hunt", "Hook", "Eco", "Haywire", "Springlock", "Soul"].includes(recommended.best));
    assert.ok(["Battery", "Hunt", "Hook", "Eco", "Haywire", "Springlock", "Soul"].includes(recommended.alternative));
    assert.ok(recommended.reason.length > 20);
    const normal = engine.enchantMetrics(item, "");
    const soul = engine.enchantMetrics(item, "Soul");
    assert.ok(Math.abs(soul.range - normal.range * 1.2) < 1e-9, item.name);
    assert.ok(Math.abs(soul.placement - normal.placement * .75) < 1e-9, item.name);
    if (item.roles.damage) {
        assert.ok(Math.abs(soul.hps - normal.hps / .85) < 1e-9, item.name);
        assert.ok(Math.abs(soul.dps - normal.dps * 1.15 / .85) < 1e-9, item.name);
    }
    const eco = engine.enchantMetrics(item, "Eco");
    assert.ok(Math.abs(eco.placement - item.placement * .5) < 1e-9, item.name);
}
for (const level of engine.levelNumbers) {
    for (const metric of ["overall", "damage", "hps", "dps", "range", "upgradeCost", "totalInvestment", "deployedDps", "dpsPerUpgradeCost", "incrementalDpsPerUpgradeCost", "radiusDamage"]) {
        const ranked = engine.rankAtLevel(level, metric);
        assert.equal(ranked.length, 28);
        assert.equal(new Set(ranked.map(x => x.item.name)).size, 28);
        const count = ranked.filter(x => x.step).length;
        assert.equal(count, engine.data.filter(x => x.levels.some(row => row.level === level)).length);
        assert.equal(ranked.filter(x => x.rank !== null).length, metric === "overall" ? count : ranked.filter(x => x.step && x.step[metric] !== null).length);
    }
}
const game = updates.find(u => u.name === "EARLY ACCESS V0.6.1.2");
assert.ok(game);
assert.equal(game.sections.flatMap(s => s.items).length, 10);
assert.equal(game.date, "");
assert.equal(game.sortOrder, 1);
assert.equal(vm.runInContext('TIER_ORDER.flatMap(level=>TIER_ASSIGNMENTS[level])', context).length, 28);
assert.equal(vm.runInContext('Object.keys(BEST_UNIT_ENCHANTS).length', context), 28);
console.log(`Detailed META, enchantment and update checks passed: 28 units, ${counted} recorded levels, ${engine.levelNumbers.length} comparable numbered levels.`);
