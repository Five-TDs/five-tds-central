const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({
    window: {},
    console,
    document: { readyState: "loading", addEventListener() {} }
});
const load = filename => vm.runInContext(fs.readFileSync(path.join(root, filename), "utf8"), context, { filename });
for (const filename of [
    "js/data/units.js", "js/data/enchantments.js", "js/data/nights-data.js",
    "js/shared/stat-utils.js", "js/config/meta-settings.js",
    "js/meta/ranking-engine.js", "js/shared/performance-graphs.js",
    "js/pages/team-builder/slots-and-stats.js"
]) load(filename);
const entries = vm.runInContext("units.map(unit => unit.name)", context);
const audit = vm.runInContext("window.FTC_META_RANKING.data", context);
assert.equal(entries.length, 28);
let levelsChecked = 0;
for (const item of audit) {
    const unit = item.unit;
    const graph = context.window.FTC_PERFORMANCE.levelsOf(unit);
    assert.equal(graph.length, item.levels.length, item.name);
    const total = vm.runInContext(`getTotalInvestment(units.find(unit => unit.name === ${JSON.stringify(item.name)}))`, context);
    assert.equal(total, item.last.totalInvestment, item.name);
    assert.equal(vm.runInContext(`getBuilderTotalUpgradeCost(units.find(unit => unit.name === ${JSON.stringify(item.name)}))`, context), total);
    for (let index = 0; index < graph.length; index++) {
        const meta = item.levels[index];
        const row = graph[index];
        assert.equal(row.level, meta.level, `${item.name} level`);
        assert.equal(row.investment, meta.totalInvestment, `${item.name} investment`);
        assert.equal(row.dps, meta.dps, `${item.name} DPS`);
        assert.equal(row.hps, meta.hps, `${item.name} HPS`);
        levelsChecked++;
    }
    for (const name of ["Soul", "Haywire", "Springlock", "Eco", "Hunt", "Hook", "Battery"]) {
        const effects = vm.runInContext(`enchants[${JSON.stringify(name)}]`, context);
        const builder = vm.runInContext(`getBuilderEnchantedStats(units.find(unit => unit.name === ${JSON.stringify(item.name)}), ${JSON.stringify(name)})`, context);
        if (item.last.dps === null) {
            assert.equal(builder, null, `${item.name} cannot invent support DPS`);
            continue;
        }
        const expectedHps = item.last.hps / (1 + Number(effects.attackSpeed || 0) / 100);
        const expectedDamage = item.last.damage * (1 + Number(effects.damage || 0) / 100);
        assert.ok(Math.abs(builder.hps - expectedHps) < 1e-8, `${item.name} ${name} HPS`);
        assert.ok(Math.abs(builder.dps - expectedDamage * expectedHps) < 1e-8, `${item.name} ${name} DPS`);
    }
}
assert.equal(vm.runInContext("getEnchantedHPS(2, -100)", context), null);
assert.equal(vm.runInContext("getEnchantedHPS(2, -20)", context), 2.5);
assert.equal(vm.runInContext("getTotalInvestment({ placement: 50, stats: [{level: 3,cost: 200},{level: 1},{level: 2,cost: 100}] }, 2)", context), 150);
console.log(`Cross-page stat consistency passed: ${entries.length} units, ${levelsChecked} levels, seven enchantments.`);
