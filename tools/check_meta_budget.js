const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const base = path.join(__dirname, "..", "js");
const context = vm.createContext({ window: {}, console });
for (const name of ["data/units.js", "data/enchantments.js", "data/nights-data.js", "config/meta-settings.js", "data/tierlist-data.js", "data/best-towers-data.js", "data/teams-data.js", "meta/ranking-engine.js"])
    vm.runInContext(fs.readFileSync(path.join(base, name), "utf8"), context, { filename: name });
const meta = context.window.FTC_META_RANKING;
assert.equal(meta.data.length, 28);
const roles = new Set(meta.data.flatMap(item => item.levels.map(level => level.role)));
for (const name of ["single", "pierce", "toxic", "splash", "cone", "aoe", "support", "control"])
    assert.ok(roles.has(name), `Missing attack role ${name}`);
for (const item of meta.data) {
    for (const [phase, budgets] of Object.entries(meta.settings.phaseInvestmentBudgets)) {
        for (const mode of ["wave", "boss"]) {
            const scenarios = item.budgetProfiles[phase][mode];
            assert.equal(scenarios.length, budgets.length);
            for (let index = 0; index < budgets.length; index++) {
                const row = scenarios[index];
                assert.equal(row.budget, budgets[index]);
                assert.ok(row.spent <= row.budget, `${item.name}: overspent budget`);
                assert.ok(row.placements <= item.placements, `${item.name}: exceeded max placements`);
                assert.ok(row.power >= 0);
                if (row.placements === 0)
                    assert.equal(row.power, 0);
            }
            assert.ok(item.budgetProfiles[phase][`${mode}Score`] >= 0);
            assert.ok(item.budgetProfiles[phase][`${mode}Score`] <= 1.000001);
        }
    }
    for (const step of item.levels) {
        assert.equal(step.upgradeCost, step.level === 1 ? item.placement : item.unit.stats.find(row => row.level === step.level).cost);
        if (step.damage !== null && step.hps !== null)
            assert.ok(Math.abs(step.dps - step.damage * step.hps) < 1e-8);
    }
}
assert.equal(meta.ranked("overall")[0].name, "Shadow Freddy");
assert.equal(meta.ranked("boss")[0].name, "Shadow Bonnie");
const original = JSON.parse(fs.readFileSync(path.join(__dirname, "data-reference.json"), "utf8"));
assert.ok(original.hashes["js/data/units.js"]);
console.log(`Budget and role checks passed: ${meta.data.length} units, ${meta.data.reduce((sum, item) => sum + item.levels.length, 0)} levels, ${Object.values(meta.settings.phaseInvestmentBudgets).flat().length} budget scenarios and eight unit roles.`);
