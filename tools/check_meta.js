const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..", "js");
const context = vm.createContext({ window: {}, console, document: { readyState: "loading", addEventListener() { } }, location: {} });
const evaluate = filename => vm.runInContext(fs.readFileSync(path.join(root, filename), "utf8"), context, { filename });
["data/units.js", "data/nights-data.js", "config/meta-settings.js", "data/tierlist-data.js", "data/best-towers-data.js", "data/teams-data.js", "meta/ranking-engine.js", "shared/performance-graphs.js", "shared/team-synergy.js"].forEach(evaluate);
const meta = context.window.FTC_META_RANKING;
assert.equal(meta.data.length, 28);
assert.equal(meta.cashByNight.length, 22);
assert.equal(meta.context().cash, 50);
assert.deepEqual(Array.from(meta.ranked("starter").map(unit => unit.name)), ["Endo 01"]);
assert.equal(meta.data.find(unit => unit.name === "Withered Chica").roles.support, true);
assert.equal(meta.data.find(unit => unit.name === "Endo 02").roles.control, true);
assert.equal(meta.data.find(unit => unit.name === "Withered Chica").roles.damage, false);
assert.equal(meta.data.find(unit => unit.name === "Endo 02").roles.damage, false);
const tierNames = vm.runInContext("TIER_ORDER.flatMap(t=>TIER_ASSIGNMENTS[t])", context);
assert.equal(tierNames.length, 28);
assert.equal(new Set(tierNames).size, 28);
assert.equal(vm.runInContext('TIER_ASSIGNMENTS.U.length', context), 2);
assert.equal(context.window.FTC_PERFORMANCE.levelsOf(meta.data.find(unit => unit.name === "Endo 01").unit)[0].investment, 50);
for (const entry of meta.data) {
    assert.equal(entry.levels[0].upgradeCost, entry.placement, entry.name);
    assert.equal(entry.levels[0].totalInvestment, entry.placement, entry.name);
    assert.equal(entry.levels.length, entry.unit.stats.length, entry.name);
    for (let index = 0; index < entry.levels.length; index++) {
        const step = entry.levels[index];
        if (step.dps !== null)
            assert.ok(Math.abs(step.dps - step.damage * step.hps) < 1e-7, entry.name);
        const investment = entry.levels.slice(0, index + 1).reduce((sum, l) => sum + l.upgradeCost, 0);
        assert.equal(step.totalInvestment, investment, entry.name);
    }
}
for (const night of meta.cashByNight) {
    assert.ok(meta.setNight(night.game, night.night, night.mode));
    assert.equal(meta.context().cash, night.cash);
    for (const item of meta.ranked("starter"))
        assert.ok(item.placement <= night.cash, item.name);
    const teams = vm.runInContext('TEAM_COMPOSITIONS', context);
    for (const team of teams) {
        assert.equal(team.units.length, 5, team.title);
        assert.equal(new Set(team.units).size, 5, team.title);
        assert.equal(team.substitutes.length, 5, team.title);
        assert.equal(new Set(team.substitutes.filter(Boolean)).size, 5, team.title);
        assert.ok(meta.data.find(u => u.name === team.units[0]).placement <= night.cash, `${team.title} game ${night.game} night ${night.night}`);
    }
}
meta.setNight(1, 1, "normal");
const synergy = context.window.FTC_TEAM_ANALYSIS;
const current = synergy.evaluate(["Endo 01", "Withered Chica", "Endo 02", "Mangle", "Shadow Bonnie"]);
assert.equal(current.chosen.length, 5);
assert.ok(current.roles.support.includes("Withered Chica"));
assert.ok(current.roles.control.includes("Endo 02"));
assert.ok(current.roles.area.includes("Mangle"));
assert.equal(current.starters.length, 1);
assert.ok(synergy.summaryHtml(current).includes("Team role coverage"));
assert.ok(synergy.comparisonHtml(current, current, "A", "B").includes("Max-deployed DPS"));
console.log(`META audit passed: ${meta.data.length} units, ${meta.cashByNight.length} Night modes, all levels and team compositions.`);
