const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ Number, Object });
for (const file of ['js/shared/stat-utils.js', 'js/shared/format-utils.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
assert.equal(vm.runInContext('getHPS({ cooldown: 2.5 })', context), 2.5);
assert.equal(vm.runInContext('getHPS({ cooldown: 0 })', context), 0);
assert.equal(vm.runInContext('calculateDPS(120, 2.5)', context), 300);
assert.equal(vm.runInContext('calculateDPS(120, 0)', context), 0);
assert.equal(vm.runInContext('calculateDPS("invalid", 2)', context), 0);
assert.equal(vm.runInContext('formatHPS(2.5)', context), '2.5');
assert.equal(vm.runInContext('formatHPS(0)', context), '—');
assert.equal(vm.runInContext('formatMoney(1500)', context), '$1,500');
assert.equal(vm.runInContext('getRarityColor("Legendary")', context), '#FFD619');
console.log('Calculation smoke tests passed');
