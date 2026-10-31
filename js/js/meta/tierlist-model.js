(function () {
    const meta = window.FTC_META_RANKING;
    if (!meta || typeof TIER_ASSIGNMENTS === "undefined") return;

    const config = Object.freeze({
        enemyCountWeights: [0.28, 0.32, 0.24, 0.12, 0.04],
        corridorLength: { pierce: 1, toxic: 1, cone: 1, aoe: 2 },
        alignment: { single: 1, pierce: 0.27, toxic: 0.27, splash: 0.85, cone: 0.55, aoe: 0.95 },
        standardBudgets: [2500, 15000, 60000, 150000],
        endgameBudgets: [15000, 60000, 150000, 300000],
        scoreBands: { S: 0.80, A: 0.68, B: 0.54, C: 0.42, D: 0.30 },
        levelWeights: [1, 0.85, 0.7, 0.55, 0.45]
    });
    const modeNames = {
        overall: "Overall strength",
        night: "Selected Night",
        wave: "Wave clearing",
        boss: "Boss damage",
        value: "Budget value"
    };
    let mode = "overall";
    let latest = [];
    const scoreCache = new Map();
    const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    const safe = number => Number.isFinite(number) ? number : 0;
    const normalize = (value, peak) => peak > 0 ? clamp(Math.sqrt(Math.max(0, value) / peak)) : 0;

    function selectedEnchant(item) {
        const preset = meta.getRankingPreset?.() || "recommended";
        if (preset === "none") return "none";
        const choice = meta.enchantFor(item);
        return preset === "maximum" ? (choice.maximum || choice.best) : choice.best;
    }

    function hitCount(item, level, targets) {
        if (level.dps === null) return 0;
        const type = item.levels.find(entry => entry.level === level.level)?.role || "single";
        const assumption = meta.settings.estimatedHitLimits[type] ?? 1;
        const range = Math.max(0, safe(level.range));
        let capacity = typeof assumption === "function" ? assumption(range, meta.settings.enemySpacing) : assumption;
        const corridor = config.corridorLength[type];
        if (corridor) capacity = Math.min(capacity, corridor * range / meta.settings.enemySpacing);
        const eligible = Math.max(0, Math.min(targets, safe(capacity)));
        const baseAlignment = config.alignment[type] ?? 1;
        const alignment = type === "cone" ? baseAlignment * Math.min(1, range / 20) : baseAlignment;
        return eligible < 1 ? eligible : 1 + (eligible - 1) * alignment;
    }

    function modeledLevels(item) {
        const enchant = selectedEnchant(item);
        const input = meta.enchantMetricsByLevel(item, enchant);
        return input.map(level => ({
            ...level,
            wave: level.dps === null ? 0 : config.enemyCountWeights.reduce((sum, weight, index) =>
                sum + weight * level.dps * hitCount(item, level, meta.settings.groupedTargetCounts[index]), 0),
            boss: safe(level.dps)
        }));
    }

    function powerAtBudget(item, levels, money, type) {
        if (!item.roles.damage || money <= 0) return 0;
        const choices = levels.filter(level => level.dps !== null && level.totalInvestment > 0 && level.totalInvestment <= money)
            .map(level => ({ cost: level.totalInvestment, power: level[type] }));
        if (!choices.length) return 0;
        let states = [{ cost: 0, power: 0 }];
        for (let i = 0; i < item.placements; i++) {
            const next = states.slice();
            for (const state of states) for (const choice of choices) {
                if (state.cost + choice.cost <= money + 0.000001)
                    next.push({ cost: state.cost + choice.cost, power: state.power + choice.power });
            }
            next.sort((a, b) => a.cost - b.cost || b.power - a.power);
            const kept = [];
            let highest = -1;
            for (const state of next) if (state.power > highest + 0.0000001) {
                kept.push(state);
                highest = state.power;
            }
            states = kept;
        }
        return Math.max(0, ...states.map(state => state.power));
    }

    function statProfiles(context) {
        const cash = context.cash;
        return meta.data.map(item => {
            const levels = modeledLevels(item);
            const damaging = levels.filter(level => level.dps !== null);
            const peakWave = Math.max(0, ...damaging.map(level => level.wave * item.placements));
            const peakBoss = Math.max(0, ...damaging.map(level => level.boss * item.placements));
            const investment = levels.at(-1)?.totalInvestment || 0;
            const start = levels[0]?.totalInvestment || item.placement;
            const budgetCurve = money => ({
                wave: powerAtBudget(item, levels, money, "wave"),
                boss: powerAtBudget(item, levels, money, "boss")
            });
            const stageBudgets = [cash, cash * 6, cash * 30, cash * 150];
            const stage = stageBudgets.map(budgetCurve);
            const standard = config.standardBudgets.map(budgetCurve);
            const endgame = config.endgameBudgets.map(budgetCurve);
            const opening = start <= cash + 0.000001 ? (safe(levels[0].wave) + safe(levels[0].boss)) / 2 : 0;
            return { item, levels, investment, start, peakWave, peakBoss,
                stage, standard, endgame, progression: 0, opening,
                reach: Math.max(0, ...levels.map(level => safe(level.range))),
                maxPlaced: item.placements };
        });
    }

    function buildScores() {
        const context = meta.context();
        const preset = meta.getRankingPreset?.() || "recommended";
        const cacheKey = [context.game, context.night, context.mode, context.cash, preset].join(":");
        if (scoreCache.has(cacheKey)) return scoreCache.get(cacheKey);
        const data = statProfiles(context);
        const peerLevelMaxima = new Map();
        for (const row of data) for (let index = 0; index < row.levels.length; index++) {
            const level = row.levels[index];
            const previous = row.levels[index - 1];
            const cost = Math.max(1, level.totalInvestment);
            const delta = !previous ? level.wave : Math.max(0, level.wave - previous.wave);
            const purchaseCost = Math.max(1, index ? level.upgradeCost : level.totalInvestment);
            const metrics = {
                waveEfficiency: level.wave / cost,
                bossEfficiency: level.boss / cost,
                upgradeGain: delta / purchaseCost,
                range: Math.max(0, safe(level.range))
            };
            if (!peerLevelMaxima.has(level.level)) peerLevelMaxima.set(level.level, {});
            const highest = peerLevelMaxima.get(level.level);
            for (const [key, value] of Object.entries(metrics)) highest[key] = Math.max(highest[key] || 0, value);
        }
        for (const row of data) {
            let total = 0;
            let count = 0;
            for (let index = 0; index < row.levels.length; index++) {
                const level = row.levels[index];
                const previous = row.levels[index - 1];
                const cost = Math.max(1, level.totalInvestment);
                const purchaseCost = Math.max(1, index ? level.upgradeCost : level.totalInvestment);
                const gain = !previous ? level.wave : Math.max(0, level.wave - previous.wave);
                const reference = peerLevelMaxima.get(level.level);
                const levelScore = .32 * normalize(level.wave / cost, reference.waveEfficiency)
                    + .28 * normalize(level.boss / cost, reference.bossEfficiency)
                    + .28 * normalize(gain / purchaseCost, reference.upgradeGain)
                    + .12 * normalize(safe(level.range), reference.range);
                const weight = config.levelWeights[index] || 0.3;
                total += levelScore * weight;
                count += weight;
            }
            row.progression = count ? total / count : 0;
        }
        const maxima = key => Math.max(0, ...data.map(entry => entry[key]));
        const maxWave = maxima("peakWave"), maxBoss = maxima("peakBoss");
        const maxReach = maxima("reach"), maxProgress = maxima("progression");
        const maxStart = maxima("opening");
        const maxStage = [0, 1, 2, 3].map(index => ({
            wave: Math.max(0, ...data.map(row => row.stage[index].wave)),
            boss: Math.max(0, ...data.map(row => row.stage[index].boss))
        }));
        const maxStandard = [0, 1, 2, 3].map(index => ({
            wave: Math.max(0, ...data.map(row => row.standard[index].wave)),
            boss: Math.max(0, ...data.map(row => row.standard[index].boss))
        }));
        const maxEndgame = [0, 1, 2, 3].map(index => ({
            wave: Math.max(0, ...data.map(row => row.endgame[index].wave)),
            boss: Math.max(0, ...data.map(row => row.endgame[index].boss))
        }));
        const curve = (values, peers, key, weights) => values.reduce((sum, row, index) =>
            sum + weights[index] * normalize(row[key], peers[index][key]), 0);
        const standardWeights = [0.06, 0.16, 0.30, 0.48];
        const lateWeights = [0.05, 0.15, 0.30, 0.50];
        const nightWeights = [0.20, 0.27, 0.30, 0.23];
        const rows = data.map(row => {
            const base = {
                wave: normalize(row.peakWave, maxWave),
                boss: normalize(row.peakBoss, maxBoss),
                reach: normalize(row.reach, maxReach),
                progression: normalize(row.progression, maxProgress),
                opening: normalize(row.opening, maxStart),
                standardWave: curve(row.standard, maxStandard, "wave", standardWeights),
                standardBoss: curve(row.standard, maxStandard, "boss", standardWeights),
                lateWave: curve(row.endgame, maxEndgame, "wave", lateWeights),
                lateBoss: curve(row.endgame, maxEndgame, "boss", lateWeights),
                nightWave: curve(row.stage, maxStage, "wave", nightWeights),
                nightBoss: curve(row.stage, maxStage, "boss", nightWeights)
            };
            const score = {
                overall: .45 * base.wave + .18 * base.boss + .09 * base.lateWave + .08 * base.lateBoss + .07 * base.progression + .13 * base.reach,
                wave: .61 * base.wave + .23 * base.lateWave + .10 * base.reach + .06 * base.progression,
                boss: .66 * base.boss + .27 * base.lateBoss + .07 * base.progression,
                value: .48 * base.nightWave + .22 * base.nightBoss + .18 * base.opening + .12 * base.progression
            };
            const openingInfluence = 0.10 + 0.40 * (1 - Math.min(1, context.cash / 800));
            score.night = score.overall * (0.73 - openingInfluence) + base.nightWave * .23 + base.nightBoss * .04 + base.opening * openingInfluence;
            return { ...row, base, score };
        });
        scoreCache.set(cacheKey, rows);
        return rows;
    }

    function update() {
        const entries = buildScores();
        const utility = entries.filter(row => !row.item.roles.damage && (row.item.roles.support || row.item.roles.control));
        const damage = entries.filter(row => !utility.includes(row));
        damage.sort((a, b) => b.score[mode] - a.score[mode] || a.item.name.localeCompare(b.item.name));
        const peak = damage[0]?.score[mode] || 1;
        const assignments = Object.fromEntries(["S", "A", "B", "C", "D", "F", "U"].map(tier => [tier, []]));
        for (const row of damage) {
            const relative = peak ? row.score[mode] / peak : 0;
            const tier = Object.entries(config.scoreBands).find(([, minimum]) => relative >= minimum)?.[0] || "F";
            assignments[tier].push(row.item.name);
        }
        assignments.U = utility.sort((a, b) => (b.item.buffPower + b.item.slowPower) - (a.item.buffPower + a.item.slowPower)).map(row => row.item.name);
        for (const [tier, names] of Object.entries(assignments)) TIER_ASSIGNMENTS[tier] = names;
        if (typeof TIER_ORDER !== "undefined" && !TIER_ORDER.includes("U")) TIER_ORDER.splice(3, 0, "U");
        if (typeof TIER_DESCRIPTIONS !== "undefined") {
            Object.assign(TIER_DESCRIPTIONS, {
                S: "Exceptional modeled performance", A: "Strong in this category", B: "Reliable performance", U: "Support and control roles",
                C: "Situational use", D: "Limited compared with alternatives", F: "Lowest modeled value"
            });
        }
        latest = [...damage, ...utility];
        return assignments;
    }

    function setMode(next) {
        if (!Object.prototype.hasOwnProperty.call(modeNames, next)) return false;
        mode = next;
        update();
        return true;
    }

    const oldSetNight = meta.setNight.bind(meta);
    const oldSetPreset = meta.setRankingPreset?.bind(meta);
    meta.setNight = (...args) => {
        const result = oldSetNight(...args);
        if (result) update();
        return result;
    };
    if (oldSetPreset) meta.setRankingPreset = value => {
        const result = oldSetPreset(value);
        if (result) update();
        return result;
    };
    window.FTC_META_TIERLIST = { config, modeNames, setMode, getMode: () => mode, update,
        ranked: () => latest.map(row => ({ name: row.item.name, score: row.score[mode], stats: row.base })) };
    update();
})();
