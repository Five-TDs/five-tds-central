const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");

const root = path.resolve(__dirname, "..");
const files = [
    "js/data/units.js",
    "js/data/enchantments.js",
    "js/data/nights-data.js",
    "js/config/meta-settings.js",
    "js/data/tierlist-data.js",
    "js/data/best-towers-data.js",
    "js/data/teams-data.js",
    "js/meta/ranking-engine.js",
    "js/meta/strategy-model.js",
    "js/meta/tierlist-model.js"
];
const scripts = files.map(filename => ({
    filename,
    content: fs.readFileSync(path.join(root, filename), "utf8")
}));
const durations = [];
for (let run = 0; run < 5; run++) {
    const context = vm.createContext({ window: {}, console });
    const start = performance.now();
    for (const script of scripts) {
        vm.runInContext(script.content, context, { filename: script.filename, timeout: 60000 });
    }
    const elapsed = performance.now() - start;
    const checked = vm.runInContext("window.FTC_META_RANKING.optimizedTeams()[0].checked", context);
    if (checked !== 98280) throw new Error(`Unexpected team search size: ${checked}`);
    durations.push(elapsed);
}
const ordered = [...durations].sort((a, b) => a - b);
console.log("META initialization timings (ms):", durations.map(value => value.toFixed(1)).join(", "));
console.log("Median (ms):", ordered[2].toFixed(1));
console.log("All 98,280 distinct five-unit combinations were evaluated.");
