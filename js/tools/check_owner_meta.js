const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..', 'js');
const context = vm.createContext({ window: {} });
for (const name of ['data/units', 'data/nights-data', 'config/meta-settings', 'data/tierlist-data', 'data/best-towers-data', 'data/teams-data', 'meta/ranking-engine'])
    vm.runInContext(fs.readFileSync(path.join(root, `${name}.js`), 'utf8'), context);
const engine = context.window.FTC_META_RANKING;
assert.equal(engine.data.length, 28);
assert.equal(engine.ranked('overall')[0].name, 'Shadow Freddy');
assert.equal(engine.ranked('mid')[0].name, 'Shadow Freddy');
assert.equal(engine.ranked('late')[0].name, 'Shadow Freddy');
assert.equal(engine.ranked('crowd')[0].name, 'Shadow Freddy');
assert.ok(!vm.runInContext('TIER_ASSIGNMENTS.S', context).includes('Chupcake'));
assert.ok(vm.runInContext('TIER_ASSIGNMENTS.S', context).includes('Shadow Freddy'));
assert.equal(engine.ranked('starter', { budget: 50 }).length, 1);
assert.equal(engine.ranked('starter', { budget: 50 })[0].name, 'Endo 01');
assert.ok(engine.ranked('starter', { budget: 150 }).some(x => x.name === 'Crying Child'));
assert.equal(vm.runInContext('BEST_UNIT_RANKINGS["BEST MID GAME"].units[0]', context), 'Shadow Freddy');
for (const item of engine.data) {
    const scores = item.peerLevels;
    if (item.roles.damage)
        assert.ok(scores.length > 0, item.name);
    for (const entry of scores)
        assert.ok(entry.score >= 0 && entry.score <= 1, item.name);
}
for (const group of vm.runInContext('TEAM_COMPOSITIONS', context)) {
    assert.equal(group.units.length, 5, group.title);
    assert.ok(group.units.includes('Shadow Freddy'), group.title);
    assert.equal(new Set(group.units).size, 5, group.title);
}
console.log('Owner-informed rankings and same-level comparisons passed.');
