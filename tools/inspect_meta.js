const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..", "js");
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
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
const meta = context.window.FTC_META_RANKING;
const measure = value => value === null || value === undefined ? "—" : Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
const rows = entries => entries.map(entry => `| ${entry.join(" | ")} |`).join("\n");
const all = meta.ranked("overall");
const group = meta.ranked("crowd");
const boss = meta.ranked("boss");
const starters = meta.ranked("starter");
const support = meta.ranked("support");
console.log("# META data inspection\n");
console.log("Source: current units.js and nights-data.js. These are data-based comparisons, not measured matches.\n");
console.log("## Current ranking categories\n");
for (const [label, list] of [["Overall", all], ["Crowd", group], ["Single-target boss", boss], ["Opening budget", starters], ["Support / control", support]]) {
    console.log(`### ${label}\n`);
    console.log("| Rank | Unit | Comparative score |\n|---:|---|---:|");
    console.log(rows(list.slice(0, 12).map((item, i) => [i + 1, item.name, measure(meta.score(item, label === "Overall" ? "overall" : label === "Crowd" ? "crowd" : label === "Single-target boss" ? "boss" : label === "Opening budget" ? "starter" : "support"))])) + "\n");
}
console.log("## All unit statistics, by recorded level\n");
console.log("| Unit | Level | Type | Placement | Max placed | Damage | HPS | DPS | Range | Upgrade | Investment | Deployed DPS | Modeled 1 target | Modeled 3 targets | Modeled 5 targets | Coverage index |\n|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const item of meta.data)
    for (const level of item.levels) {
        console.log(rows([[item.name, level.level, level.type, measure(item.placement), item.placements, measure(level.damage), measure(level.hps), measure(level.dps), measure(level.range), measure(level.upgradeCost), measure(level.totalInvestment), measure(level.deployedDps), ...level.scenarios.map(scene => measure(scene.deployedDps)), measure(level.radiusDamage)]]));
    }
console.log("\n## Assumptions\n");
console.log(JSON.stringify(meta.settings, null, 2));
console.log("\nSupport/control units have blank DPS where the database omits damage or HPS. Multi-target estimates depend on unverified hypothetical target counts, attack-shape hit limits, and reach weighting. They are not actual total damage measurements.");
