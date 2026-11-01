(function () {
    if (typeof units === "undefined" || !Array.isArray(units))
        return;
    const settings = FTC_META_SETTINGS;
    const numeric = value => value === undefined || value === null || value === "" || !Number.isFinite(Number(value)) ? null : Number(value);
    const asNumber = value => numeric(value) ?? 0;
    const low = value => String(value || "").toLowerCase();
    const cash = amount => "$" + asNumber(amount).toLocaleString("en-US");
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const coverageFactors = settings.estimatedHitLimits;
    const coverageScale = Math.max(1, Math.max(...settings.groupedTargetCounts) -1);
    const estimatedHitLimit = (role, range) => {
        const assumption = coverageFactors[role] ?? coverageFactors.single;
        const value = typeof assumption === "function" ? assumption(range ?? 0, settings.enemySpacing) : assumption;
        return Number.isFinite(value) ? Math.max(0, value) : 0;
    };
    const typeRole = type => {
        const t = low(type);
        if (/range buff|buff|support/.test(t))
            return "support";
        if (/slower|slow|freeze|stun/.test(t))
            return "control";
        if (/toxic/.test(t))
            return "toxic";
        if (/pierce/.test(t))
            return "pierce";
        if (/splash/.test(t))
            return "splash";
        if (/aoe/.test(t))
            return "aoe";
        if (/cone/.test(t))
            return "cone";
        return "single";
    };
    const cashByNight = [];
    if (typeof nights !== "undefined" && Array.isArray(nights)) {
        nights.forEach(chapter => (chapter.nights || []).forEach(entry => ["normal", "max"].forEach(mode => {
            const value = numeric(entry[mode]?.startingCash);
            if (value !== null)
                cashByNight.push({ game: chapter.game, night: entry.number, mode, cash: value });
        })));
    }
    const firstNight = cashByNight.find(entry => entry.game === 1 && entry.night === 1 && entry.mode === "normal") || cashByNight[0] || { game: 1, night: 1, mode: "normal", cash: 50 };
    let current = { ...firstNight };
    const data = units.filter(unit => unit?.name && Array.isArray(unit.stats) && unit.stats.length).map(unit => {
        const placement = asNumber(unit.placement);
        const placements = Math.max(1, asNumber(unit.maxLimit));
        let investment = placement;
        let previous = null;
        const levels = [...unit.stats].sort((a, b) => asNumber(a.level) - asNumber(b.level)).map((step, index) => {
            const upgradeCost = index ? asNumber(step.cost) : placement;
            if (index)
                investment += upgradeCost;
            const damage = numeric(step.damage);
            const hps = numeric(step.cooldown);
            const range = numeric(step.range);
            const dps = damage !== null && hps !== null ? damage * hps : null;
            const type = String(step.type || unit.type || "Unknown");
            const role = typeRole(type);
            const coverageFactor = estimatedHitLimit(role, range);
            const deployedDps = dps === null ? null : dps * placements;
            
            const scenarios = settings.groupedTargetCounts.map(targets => {
                const possibleHits = Math.min(targets, coverageFactor);
                const likelihood = asNumber(settings.pathHitLikelihood?.[role] ?? 1);
                const estimatedHits = possibleHits < 1 ? possibleHits : 1 + Math.max(0, possibleHits - 1) * clamp(likelihood);
                const groupedDps = deployedDps === null
                    ? null
                    : deployedDps * estimatedHits;

                return {
                    targets,
                    estimatedHits,
                    deployedDps: groupedDps,
                    reachAdjustedDps: groupedDps
                };
            });

            const scenarioDeployedDps = deployedDps === null
                ? null
                : scenarios.reduce(
                    (sum, entry, index) =>
                        sum + entry.deployedDps * settings.targetCountWeights[index],
                    0
                );

            const radiusDamage = scenarioDeployedDps;

            const row = {
                level: asNumber(step.level) || index + 1, damage, hps, dps, range, type, role,
                rangeBuff: numeric(step.rangeBuff), slow: numeric(step.slow), upgradeCost, totalInvestment: investment,
                maxPlacements: placements, deployedDps, coverageFactor, radiusDamage, scenarios, scenarioDeployedDps,
                dpsPerUpgradeCost: dps === null ? null : dps / Math.max(1, upgradeCost),
                dpsPerTotalCost: dps === null ? null : dps / Math.max(1, investment),
                incrementalDpsPerUpgradeCost: dps === null || previous?.dps === null || !index ? null : (dps - previous.dps) / Math.max(1, upgradeCost)
            };
            previous = row;
            return row;
        });
        const passives = Array.isArray(unit.passives) ? unit.passives.map(String) : [];
        const roleNames = [...new Set(levels.map(row => row.role))];
        const passiveText = low(passives.join(" "));
        const roles = {
            damage: levels.some(row => row.dps !== null),
            single: roleNames.includes("single"),
            area: roleNames.some(role => ["pierce", "toxic", "splash", "cone", "aoe"].includes(role)),
            support: roleNames.includes("support") || /buff|boost|support|heal/.test(passiveText),
            control: roleNames.includes("control") || /slows|freeze|stun/.test(passiveText),
            status: roleNames.includes("toxic") || /toxic|poison|damage over time/.test(passiveText)
        };
        const base = levels[0], last = levels[levels.length - 1];
        const damageLevels = levels.filter(row => row.dps !== null);
        const buffPower = Math.max(0, ...levels.map(row => row.rangeBuff === null ? 0 : row.rangeBuff - 1));
        const slowPower = Math.max(0, ...levels.map(row => row.slow === null ? 0 : 1 - row.slow));
        const entry = {
            name: String(unit.name), unit, rarity: unit.rarity || "Unknown", placement, placements,
            levels, first: base, last, roles, passives, finalType: last.type, initialType: base.type,
            warning: Array.isArray(unit.warn) && unit.warn.length > 0,
            buffPower, slowPower,
            initialDps: base.dps || 0, finalDps: last.dps || 0,
            maxDps: Math.max(0, ...damageLevels.map(row => row.dps)),
            meanDps: mean(damageLevels.map(row => row.dps)),
            meanDamage: mean(damageLevels.map(row => row.damage)),
            meanHps: mean(damageLevels.map(row => row.hps)),
            meanRange: mean(levels.map(row => row.range || 0)),
            maxRange: Math.max(0, ...levels.map(row => row.range || 0)),
            maxDeployedDps: Math.max(0, ...damageLevels.map(row => row.deployedDps)),
            initialDeployedDps: base.deployedDps || 0,
            maxRadiusDamage: Math.max(0, ...damageLevels.map(row => row.radiusDamage || 0)),
            maxScenarioDeployedDps: Math.max(0, ...damageLevels.map(row => row.scenarioDeployedDps || 0)),
            meanRadiusDamage: mean(damageLevels.map(row => row.radiusDamage || 0)),
            meanEfficiency: mean(damageLevels.map(row => row.dpsPerTotalCost || 0)),
            peakUpgradeEfficiency: Math.max(0, ...levels.map(row => row.incrementalDpsPerUpgradeCost || 0)),
            totalInvestment: last.totalInvestment,
            initialTypeRole: base.role, finalTypeRole: last.role,
            coverageFactor: mean(levels.map(row => row.coverageFactor)),
            abilityProfile: [
                ...(buffPower ? [`${Number((buffPower * 100).toFixed(2))}% listed range buff at its highest level`] : []),
                ...(slowPower ? [`${Number((slowPower * 100).toFixed(2))}% listed slow at its highest level`] : []),
                ...(roles.status ? ["Toxic effect; damage-over-time amount is not listed"] : []),
                ...passives.filter(text => !/range of all units|slows all enemies|toxic effect/i.test(text))
            ]
        };
        entry.earlyAvailable = cashByNight.filter(n => placement <= n.cash).map(n => `${n.game}:${n.night}:${n.mode}`);
        return entry;
    });
    const levelNumbers = [...new Set(data.flatMap(unit => unit.levels.map(row => row.level)))].sort((a, b) => a - b);
    const metrics = ["damage", "hps", "dps", "range", "deployedDps", "dpsPerUpgradeCost", "dpsPerTotalCost", "incrementalDpsPerUpgradeCost", "radiusDamage", "scenarioDeployedDps"];
    const levelWeights = settings.levelWeights;
    const scoreOfMetric = (value, top) => value === null || top <= 0 ? 0 : Math.log1p(Math.max(0, value)) / Math.log1p(top);
    const peerTables = new Map();
    levelNumbers.forEach(level => {
        const available = data.map(item => ({ item, step: item.levels.find(row => row.level === level) })).filter(pair => pair.step);
        const peaks = Object.fromEntries(metrics.map(metric => [metric, Math.max(0, ...available.map(pair => pair.step[metric] || 0))]));
        const mostExpensive = Math.max(1, ...available.map(pair => pair.step.totalInvestment));
        const values = available.map(({ item, step }) => {
            const normalized = Object.fromEntries(metrics.map(metric => [metric, scoreOfMetric(step[metric], peaks[metric])]));
            const investmentScore = 1 - Math.log1p(step.totalInvestment) / Math.log1p(mostExpensive);
            const area = item.roles.area
                ? clamp((step.coverageFactor - 1) / coverageScale)
                : 0;
            const utility = item.roles.support ? clamp((step.rangeBuff || 1) - 1, 0, .3) / .3 : item.roles.control ? clamp(1 - (step.slow || 1), 0, .35) / .35 : 0;
            const utilityReach = utility * normalized.range;
            const damageValue = step.dps === null ? 0 : metrics.reduce((sum, metric) => sum + normalized[metric] * levelWeights[metric], 0);
            const peerScore = step.dps === null ? utilityReach * .63 + investmentScore * .17 + utility * .20 : damageValue * .85 + investmentScore * .10 + area * .05;
            step.peer = { score: peerScore, normalized, costScore: investmentScore, roleScore: utilityReach, level };
            return { name: item.name, item, step, peerScore };
        }).sort((a, b) => b.peerScore - a.peerScore || a.name.localeCompare(b.name));
        peerTables.set(level, values);
        values.forEach((entry, index) => { entry.step.peer.rank = index + 1; entry.step.peer.comparedWith = values.length; });
    });
    for (const item of data) {
        const profiles = item.levels.map(row => row.peer).filter(Boolean);
        item.peerLevels = profiles.map(peer => ({ level: peer.level, score: peer.score, cost: peer.costScore, rank: peer.rank, comparedWith: peer.comparedWith }));
        const progressionWeights = item.levels.map(row => 1 / Math.sqrt(row.level));
        const totalWeight = progressionWeights.reduce((a, b) => a + b, 0) || 1;
        item.levelPeerScore = item.levels.reduce((sum, row, index) => sum + (row.peer?.score || 0) * progressionWeights[index], 0) / totalWeight;
        item.levelCostScore = item.levels.reduce((sum, row, index) => sum + (row.peer?.costScore || 0) * progressionWeights[index], 0) / totalWeight;
        item.areaMultiplier = item.coverageFactor;
        item.waveDamageProxy = item.maxScenarioDeployedDps;
        item.waveLevelProxy = mean(item.levels.map(row => row.scenarioDeployedDps || 0));
        item.radiusDamageProxy = item.maxRadiusDamage;
        item.roleCoverage = item.roles.area
            ? mean(item.levels.map(row =>
                clamp((row.coverageFactor - 1) / coverageScale)
            ))
            : 0;
    }
    const comparableRole = (a, b) => a.roles.damage && b.roles.damage && (a.roles.area === b.roles.area || b.initialDps >= a.initialDps * 1.8);
    const nearCostAlternatives = item => data.filter(other => other !== item && comparableRole(item, other) && other.placement > item.placement && other.placement - item.placement <= settings.closePlacementGap)
        .filter(other => other.initialDps > item.initialDps * settings.minimumBetterOpeningDps && (other.maxRadiusDamage > item.maxRadiusDamage * settings.minimumBetterWavePotential || other.maxDeployedDps > item.maxDeployedDps * 1.3))
        .sort((a, b) => a.placement - b.placement || b.initialDps - a.initialDps);
    for (const item of data)
        item.waitFor = nearCostAlternatives(item).slice(0, 2).map(other => ({ name: other.name, extraCost: other.placement - item.placement, firstDps: other.initialDps }));
    const modelBudget = (item, budget, mode) => {
        if (!item.roles.damage)
            return { power: 0, spent: 0, placements: 0 };
        const options = item.levels.filter(level => level.dps !== null && level.totalInvestment <= budget).map(level => ({
            cost: level.totalInvestment,
            power: mode === "boss" ? level.dps : (level.radiusDamage || 0) / item.placements
        }));
        if (!options.length)
            return { power: 0, spent: 0, placements: 0 };
        let states = [{ spent: 0, power: 0, count: 0 }];
        for (let placed = 0; placed < item.placements; placed++) {
            const possible = [...states];
            for (const state of states)
                for (const option of options)
                    if (state.spent + option.cost <= budget)
                        possible.push({ spent: state.spent + option.cost, power: state.power + option.power, count: state.count + 1 });
            possible.sort((a, b) => a.spent - b.spent || b.power - a.power);
            const filtered = [];
            let bestPower = -1;
            for (const state of possible)
                if (state.power > bestPower + 1e-8) {
                    filtered.push(state);
                    bestPower = state.power;
                }
            states = filtered;
        }
        const best = states.reduce((winner, state) => state.power > winner.power ? state : winner, states[0]);
        return { power: best.power, spent: best.spent, placements: best.count };
    };
    const phaseBudgets = settings.phaseInvestmentBudgets;
    for (const item of data) {
        item.budgetProfiles = {};
        for (const [phase, budgets] of Object.entries(phaseBudgets))
            item.budgetProfiles[phase] = {
                wave: budgets.map(budget => ({ budget, ...modelBudget(item, budget, "wave") })),
                boss: budgets.map(budget => ({ budget, ...modelBudget(item, budget, "boss") }))
            };
    }
    for (const phase of Object.keys(phaseBudgets)) {
        const weights = settings.phaseBudgetWeights[phase];
        for (const mode of ["wave", "boss"]) {
            const peaks = phaseBudgets[phase].map((_, index) => Math.max(0, ...data.map(item => item.budgetProfiles[phase][mode][index].power)));
            for (const item of data) {
                const values = item.budgetProfiles[phase][mode];
                item.budgetProfiles[phase][`${mode}Score`] = values.reduce((total, value, index) => {
                    if (!peaks[index] || !value.power)
                        return total;
                    return total + Math.log1p(value.power) / Math.log1p(peaks[index]) * weights[index];
                }, 0);
            }
        }
    }
    const scenarioScore = (item, phase, mode = "wave") => item.budgetProfiles[phase][`${mode}Score`] || 0;
    const maxima = Object.fromEntries([
        "initialDps", "maxDps", "meanDps", "initialDeployedDps", "maxDeployedDps", "maxScenarioDeployedDps", "maxRadiusDamage", "meanRadiusDamage",
        "meanEfficiency", "peakUpgradeEfficiency", "maxRange", "meanRange", "meanHps", "placements", "buffPower", "slowPower", "levelPeerScore", "roleCoverage"
    ].map(metric => [metric, Math.max(0, ...data.map(item => item[metric] || 0))]));
    const norm = (item, metric) => scoreOfMetric(item[metric] || 0, maxima[metric]);
    const costDiscount = item => 1 - Math.log1p(item.placement) / Math.log1p(Math.max(1, ...data.map(other => other.placement)));
    const supportScore = item => item.roles.support ? .55 + norm(item, "buffPower") * .25 + norm(item, "maxRange") * .2 : item.roles.control ? .55 + norm(item, "slowPower") * .25 + norm(item, "maxRange") * .2 : item.roles.status ? .35 : 0;
    const progressScore = item => item.levelPeerScore;
    const earlyPower = item => (norm(item, "initialDps") * .12 + norm(item, "initialDeployedDps") * .11 + norm(item, "meanEfficiency") * .10 + norm(item, "maxRange") * .06 + progressScore(item) * .17 + costDiscount(item) * .25 + norm(item, "maxRadiusDamage") * .11 + norm(item, "placements") * .08) * .52 + scenarioScore(item, "early") * .48;
    const wavePower = item => (norm(item, "maxRadiusDamage") * .39 + norm(item, "meanRadiusDamage") * .15 + norm(item, "maxDeployedDps") * .18 + norm(item, "maxRange") * .10 + progressScore(item) * .12 + norm(item, "placements") * .06) * .60 + scenarioScore(item, "late") * .40;
    const midPower = item => wavePower(item) * .30 + scenarioScore(item, "mid") * .35 + scenarioScore(item, "mid", "boss") * .20 + progressScore(item) * .15;
    const completePower = item => progressScore(item) * .18 + wavePower(item) * .37 + earlyPower(item) * .12 + norm(item, "peakUpgradeEfficiency") * .05 + norm(item, "maxDeployedDps") * .06 + supportScore(item) * .07 + norm(item, "roleCoverage") * .07 + scenarioScore(item, "mid", "boss") * .08;
    const scores = (item, mode = "overall", budget = current.cash) => {
        const operational = item.roles.damage ? 1 : 0;
        const group = item.roles.area ? 1 : 0;
        let answer;
        if (mode === "starter")
            answer = earlyPower(item) * .55 + norm(item, "initialDeployedDps") * .2 + costDiscount(item) * .15 + progressScore(item) * .10;
        else if (mode === "early")
            answer = earlyPower(item) * .76 + progressScore(item) * .14 + norm(item, "maxRadiusDamage") * .1;
        else if (mode === "mid")
            answer = midPower(item) * .73 + earlyPower(item) * .12 + norm(item, "maxDeployedDps") * .09 + norm(item, "roleCoverage") * .06;
        else if (mode === "late")
            answer = wavePower(item) * .64 + progressScore(item) * .19 + norm(item, "maxDeployedDps") * .11 + norm(item, "maxRange") * .06;
        else if (mode === "boss")
            answer = operational * (norm(item, "maxDeployedDps") * .27 + norm(item, "maxDps") * .12 + progressScore(item) * .12 + scenarioScore(item, "mid", "boss") * .19 + scenarioScore(item, "late", "boss") * .25 + norm(item, "maxRange") * .05) * (item.roles.single ? 1.05 : .97);
        else if (mode === "damage")
            answer = operational * (wavePower(item) * .56 + norm(item, "maxDeployedDps") * .22 + scenarioScore(item, "mid") * .12 + progressScore(item) * .10);
        else if (mode === "crowd")
            answer = group * (wavePower(item) * .64 + scenarioScore(item, "mid") * .14 + progressScore(item) * .12 + norm(item, "maxRange") * .10) + (item.roles.control ? supportScore(item) * .4 : 0);
        else if (mode === "support")
            answer = supportScore(item);
        else if (mode === "control")
            answer = item.roles.control ? supportScore(item) : 0;
        else if (mode === "fifth")
            answer = completePower(item) * .71 + supportScore(item) * .17 + norm(item, "maxRange") * .12;
        else
            answer = completePower(item);
        if (["early", "mid"].includes(mode) && item.waitFor.length)
            answer *= 1 - (mode === "mid" ? 0.055 : 0.04) * Math.min(2, item.waitFor.length);
        if (mode === "starter" && item.placement > budget)
            return -1;
        if (mode === "early" && item.placement > 150)
            answer *= item.placement <= 500 ? .94 : item.placement <= 1000 ? .79 : .58;
        return answer * (item.warning ? .97 : 1);
    };
    const ranked = (mode = "overall", options = {}) => {
        const { budget = current.cash, exclude = [], onlyAffordable = mode === "starter" } = options;
        return data.filter(item => !exclude.includes(item.name) && (!onlyAffordable || item.placement <= budget) &&
            (mode !== "support" || item.roles.support || item.roles.control || item.roles.status) &&
            (mode !== "control" || item.roles.control) &&
            (mode !== "crowd" || item.roles.area || item.roles.control) &&
            (!["boss", "damage"].includes(mode) || item.roles.damage))
            .sort((a, b) => scores(b, mode, budget) - scores(a, mode, budget) || a.name.localeCompare(b.name));
    };
    const score = (item, mode = "overall", budget = current.cash) => scores(item, mode, budget);
    const pick = (mode, count, exclude = [], options = {}) => ranked(mode, { ...options, exclude }).slice(0, count).map(item => item.name);
    const rankAtLevel = (level, metric = "overall") => {
        const allowed = ["overall", ...metrics, "totalInvestment", "upgradeCost"];
        const key = allowed.includes(metric) ? metric : "overall";
        const list = data.map(item => ({ item, step: item.levels.find(row => row.level === Number(level)) || null }));
        const compare = (entry) => {
            if (!entry.step)
                return -Infinity;
            if (key === "overall")
                return entry.step.peer.score;
            const value = entry.step[key];
            return value === null ? -Infinity : (key === "totalInvestment" || key === "upgradeCost" ? -value : value);
        };
        return list.sort((a, b) => compare(b) - compare(a) || a.item.name.localeCompare(b.item.name)).map((entry, index) => ({ ...entry, rank: entry.step && (key === "overall" || entry.step[key] !== null) ? index + 1 : null }));
    };
    const shortStats = item => `${cash(item.placement)} placement · ${item.placements} max · ${item.roles.damage ? `${Number(item.maxDps.toFixed(2))} listed max DPS` : (item.abilityProfile[0] || "Utility")}`;
    const descriptions = {
        "BEST STARTER": () => `Immediate placements for Game ${current.game} Night ${current.night} ${current.mode.toUpperCase()} (${cash(current.cash)} starting cash).`,
        "BEST EARLY GAME": () => "Opening value across recorded levels and hypothetical $150–$3,000 investment budgets; price matters more than maximum DPS.",
        "BEST MID GAME": () => "Level-by-level efficiency and simulated placement/upgrade choices with $3,000–$30,000 investment.",
        "BEST LATE GAME": () => "Maximum placements, reach, area coverage and affordable upgrade combinations at larger budgets.",
        "BEST 5TH UNIT": () => "Complementary damage and utility when opening defense is already covered.",
        "BEST DAMAGE": () => "Damage across upgrade levels, total deployed DPS and estimated area coverage; exact hit counts are unknown.",
        "BEST OVERALL": () => "Every recorded level, upgrade costs, placement counts, role coverage and affordable upgrade scenarios.",
        "BEST SUPPORT & CONTROL": () => "Range buffs, slowing and toxic effects have distinct value; missing effect damage is not guessed."
    };
    const categoryModes = settings.rankingModes;
    const enchantInfo = key => typeof enchants !== "undefined" ? enchants[key] : null;
    const enchantMetrics = (item, key, level = null) => {
        const step = level ? item.levels.find(row => row.level === Number(level)) : item.last;
        if (!step)
            return null;
        const effects = enchantInfo(key) || {};
        const damage = step.damage === null ? null : step.damage * (1 + asNumber(effects.damage) / 100);
        const speed = 1 + asNumber(effects.attackSpeed) / 100;
        const hps = step.hps === null ? null : step.hps / (speed > 0 ? speed : 1);
        const range = step.range === null ? null : step.range * (1 + asNumber(effects.range) / 100);
        const dps = damage !== null && hps !== null ? damage * hps : null;
        const costFactor = Math.max(0, 1 + asNumber(effects.cost) / 100);
        return { damage, hps, range, dps, costFactor, placement: item.placement * costFactor, investment: step.totalInvestment * costFactor, deployedDps: dps === null ? null : dps * item.placements };
    };
    const enchantFor = item => {
        if (!item)
            return { best: "Soul", alternative: "Hunt", reason: "No matching unit data." };
        const starter = item.placement <= 200 && item.roles.damage;
        if (starter)
            return { best: "Eco", alternative: "Soul", reason: `Eco reduces listed placement and upgrade costs by 50% instead of Soul's 25%. Ideal for opening economy; Soul offers stronger later damage, HPS and range.`, context: "Early economy" };
        if (item.roles.support)
            return { best: "Soul", alternative: "Battery", reason: "Soul gives +20% reach and -25% listed cost; Battery provides +10% reach without damage-oriented bonuses.", context: "Support reach" };
        if (item.roles.control)
            return { best: "Soul", alternative: "Battery", reason: "Soul extends slowing coverage by +20% range and discounts cost; Battery is the common +10% range option.", context: "Control reach" };
        if (item.roles.status)
            return { best: "Soul", alternative: "Hunt", reason: "Soul improves damage, attack frequency, range and cost. Hunt increases attack frequency; toxic tick damage is not listed.", context: "Toxic application" };
        if (item.roles.area && item.maxRange <= 12)
            return { best: "Soul", alternative: "Battery", reason: "Soul improves DPS, coverage range and cost; Battery increases coverage by 10% and is more common.", context: "Group coverage" };
        if (item.roles.area)
            return { best: "Soul", alternative: "Hunt", reason: "Soul boosts damage, HPS and range and reduces cost; Hunt is an accessible speed-focused alternative.", context: "Wave damage" };
        return { best: "Soul", alternative: "Hunt", reason: "Soul boosts damage (+15%), reach (+20%), attack frequency and cost; Hunt focuses on repeated single-target hits.", context: "Single-target DPS" };
    };
    const assignEnchants = () => {
        if (typeof BEST_UNIT_ENCHANTS === "undefined")
            return;
        for (const item of data)
            BEST_UNIT_ENCHANTS[item.name] = enchantFor(item);
    };
    const assignRankings = () => {
        if (typeof BEST_UNIT_RANKINGS !== "undefined")
            for (const [title, mode] of Object.entries(categoryModes)) {
                BEST_UNIT_RANKINGS[title] ||= {};
                BEST_UNIT_RANKINGS[title].units = pick(mode, 3);
                BEST_UNIT_RANKINGS[title].description = descriptions[title]();
            }
        if (typeof TIER_ASSIGNMENTS !== "undefined") {
            const utilityUnits = ranked("support").filter(item => !item.roles.damage && (item.roles.support || item.roles.control)).map(item => item.name);
            const ordered = ranked("overall").filter(item => !utilityUnits.includes(item.name)).map(item => item.name);
            const widths = settings.tierWidths;
            let offset = 0;
            ["S", "A", "B", "C", "D", "F"].forEach((tier, index) => {
                const end = index === 5 ? ordered.length : offset + widths[index];
                TIER_ASSIGNMENTS[tier] = ordered.slice(offset, end);
                offset = end;
            });
            TIER_ASSIGNMENTS.U = utilityUnits;
            if (typeof TIER_ORDER !== "undefined" && !TIER_ORDER.includes("U"))
                TIER_ORDER.splice(3, 0, "U");
            if (typeof TIER_DESCRIPTIONS !== "undefined")
                Object.assign(TIER_DESCRIPTIONS, {
                    S: "Excellent performance across levels and roles", A: "Strong progression and team value", B: "Useful with complementary roles", U: "Utility: slows and range buffs", C: "Effective in the right circumstances", D: "Narrower cost or coverage value", F: "Limited relative efficiency"
                });
        }
    };
    const substitutions = { support: ["support", "crowd"], control: ["control", "support", "crowd"], crowd: ["crowd", "late"], boss: ["boss", "damage"], starter: ["starter", "early"], early: ["early", "starter"], late: ["late", "damage"], damage: ["damage", "boss"], fifth: ["fifth", "overall"] };
    const chooseRole = (role, used = []) => {
        for (const category of substitutions[role] || [role, "overall"]) {
            const candidates = ranked(category, { exclude: used, onlyAffordable: category === "starter" });
            const preferred = candidates.find(item => category !== "support" && category !== "control" || item.roles.support || item.roles.control);
            if (preferred)
                return preferred;
        }
        return ranked("overall", { exclude: used })[0] || null;
    };
    const patterns = settings.teamRoles;
    const generateTeams = () => {
        if (typeof TEAM_COMPOSITIONS === "undefined")
            return;
        TEAM_COMPOSITIONS.forEach((team, index) => {
            const pattern = patterns[index] || patterns[0];
            const selected = [];
            const positions = [];
            for (const role of pattern) {
                const item = chooseRole(role, selected);
                if (!item)
                    return;
                selected.push(item.name);
                positions.push({ role, item });
            }
            const used = [...selected];
            const substitutes = positions.map(({ role }) => {
                const replacement = chooseRole(role, used);
                if (replacement)
                    used.push(replacement.name);
                return replacement?.name || "";
            });
            team.units = selected;
            team.substitutes = substitutes;
            team.enchants = selected.map(name => enchantFor(data.find(item => item.name === name)).best);
            team.substituteEnchants = substitutes.map(name => name ? enchantFor(data.find(item => item.name === name)).best : "");
            const opener = positions[0].item;
            const rest = positions.slice(1).map(({ role, item }) => `${item.name} (${role.replace("crowd", "group coverage").replace("boss", "boss damage")})`).join(", ");
            team.description = `Game ${current.game} Night ${current.night} ${current.mode.toUpperCase()}: ${cash(current.cash)} start; ${opener.name} costs ${cash(opener.placement)} to place.`;
            team.explanation = `${opener.name} fits the opening budget. Build toward ${rest}. Each role is checked against per-level damage, HPS, range and upgrade costs, then compared under different investment budgets and single/grouped-target scenarios. Substitutes match their corresponding role. Actual hits per attack, slow uptime, and buff stacking are unmeasured.`;
        });
    };
    const refresh = () => { assignEnchants(); assignRankings(); generateTeams(); };
    const setNight = (game, night, mode) => {
        const found = cashByNight.find(entry => entry.game === Number(game) && entry.night === Number(night) && entry.mode === low(mode));
        if (!found)
            return false;
        current = { ...found };
        refresh();
        return true;
    };
    const context = () => ({ ...current });
    const getAudit = () => data.map(item => ({
        name: item.name, rarity: item.rarity, placement: item.placement, maxPlacements: item.placements,
        type: item.initialType, finalType: item.finalType, roles: { ...item.roles },
        levels: item.levels.map(row => ({ ...row })), passives: [...item.passives], abilityProfile: [...item.abilityProfile],
        warning: item.warning, totalInvestment: item.totalInvestment, levelPeerScore: item.levelPeerScore, peerLevels: item.peerLevels, budgetProfiles: item.budgetProfiles,
        areaMultiplier: item.areaMultiplier, waveDamageProxy: item.waveDamageProxy, radiusDamageProxy: item.radiusDamageProxy,
        waitFor: item.waitFor, enchant: enchantFor(item),
        scores: Object.fromEntries(["overall", "starter", "early", "mid", "late", "damage", "boss", "crowd", "support"].map(mode => [mode, Number(score(item, mode).toFixed(5))]))
    }));
    window.FTC_META_RANKING = {
        data, ranked, score, pick, setNight, context, cashByNight, shortStats, getAudit, rankAtLevel, levelNumbers, metrics,
        enchantFor, enchantMetrics, enchantInfo, coverageFactors, settings, modelBudget, scenarioScore,
        generatedFrom: "Unit statistics, Night starting cash, role effects and explicitly modeled 1-, 3- and 5-target scenarios",
        verifiedLiveMeta: false
    };
    refresh();
})();
