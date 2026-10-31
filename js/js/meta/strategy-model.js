(function () {
    const meta = window.FTC_META_RANKING;
    if (!meta || typeof units === "undefined") return;

    const settings = meta.settings;
    const originalScore = meta.score.bind(meta);
    const originalRanked = meta.ranked.bind(meta);
    const originalSetNight = meta.setNight.bind(meta);
    const sourceEnchants = typeof enchants !== "undefined" ? enchants : {};
    const enchantKeys = Object.keys(sourceEnchants);
    const phases = settings.phaseInvestmentBudgets;
    const scoreWeights = settings.phaseBudgetWeights;
    const bonusCache = new Map();
    const levelCache = new Map();
    const budgetCache = new Map();
    const recommendationCache = new Map();
    const comboCache = new Map();
    let rankingPreset = "recommended";
    const decimals = (number, places = 2) => Number(Number(number).toFixed(places));
    const clamp = (x, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(maximum, x));
    const roleOf = item => item.roles;
    const stageFor = mode => ["starter", "early"].includes(mode) ? "early" : ["mid", "crowd", "fifth"].includes(mode) ? "mid" : "late";
    const missionFor = mode => mode === "boss" ? "boss" : "wave";
    const validEnchant = name => sourceEnchants[name] ? name : "none";

    function levelsWithEnchant(item, key = "none") {
        key = validEnchant(key);
        const cacheKey = item.name + ":" + key;
        if (levelCache.has(cacheKey)) return levelCache.get(cacheKey);
        const e = sourceEnchants[key] || {};
        const damageFactor = Math.max(0, 1 + Number(e.damage || 0) / 100);
        const speedFactor = Math.max(0.01, 1 + Number(e.attackSpeed || 0) / 100);
        const rangeFactor = Math.max(0, 1 + Number(e.range || 0) / 100);
        const costFactor = Math.max(0, 1 + Number(e.cost || 0) / 100);
        const result = item.levels.map(level => {
            const damage = level.damage === null ? null : level.damage * damageFactor;
            const hps = level.hps === null ? null : level.hps / speedFactor;
            const range = level.range === null ? null : level.range * rangeFactor;
            const dps = damage === null || hps === null ? null : damage * hps;
            const baseLimit = settings.estimatedHitLimits[level.role] ?? settings.estimatedHitLimits.single;
            const coverage = Math.max(0, typeof baseLimit === "function" ? baseLimit(range || 0, settings.enemySpacing) : baseLimit);
            const likelihood = clamp(settings.pathHitLikelihood?.[level.role] ?? 1);
            const scenarios = settings.groupedTargetCounts.map((count, index) => {
                const available = Math.min(count, coverage);
                const hits = available < 1 ? available : 1 + Math.max(0, available - 1) * likelihood;
                return { count, hits, weight: settings.targetCountWeights[index] };
            });
            const groupPower = dps === null ? 0 : scenarios.reduce((sum, scene) => sum + dps * scene.hits * scene.weight, 0);
            return { level: level.level, damage, hps, range, dps, groupPower,
                totalInvestment: level.totalInvestment * costFactor,
                upgradeCost: level.upgradeCost * costFactor,
                coverage, scenarios };
        });
        levelCache.set(cacheKey, result);
        return result;
    }

    function budgetValue(item, amount, mission = "wave", enchant = "none") {
        const key = [item.name, amount, mission, enchant].join(":");
        if (budgetCache.has(key)) return budgetCache.get(key);
        const choices = levelsWithEnchant(item, enchant).filter(level => level.dps !== null && level.totalInvestment <= amount)
            .map(level => ({ cost: level.totalInvestment, power: mission === "boss" ? level.dps : level.groupPower }));
        let states = [{ cost: 0, power: 0, count: 0 }];
        for (let placed = 0; placed < item.placements && choices.length; placed++) {
            const pool = states.slice();
            for (const state of states) {
                for (const choice of choices) {
                    if (state.cost + choice.cost <= amount + 0.000001)
                        pool.push({ cost: state.cost + choice.cost, power: state.power + choice.power, count: state.count + 1 });
                }
            }
            pool.sort((a, b) => a.cost - b.cost || b.power - a.power);
            const pruned = [];
            let maxPower = -1;
            for (const option of pool) {
                if (option.power > maxPower + 0.00000001) {
                    pruned.push(option);
                    maxPower = option.power;
                }
            }
            states = pruned;
        }
        const best = states.reduce((winner, state) => state.power > winner.power ? state : winner, states[0]);
        budgetCache.set(key, best);
        return best;
    }

    function budgetProfile(item, mode, enchant) {
        const stage = stageFor(mode);
        const mission = missionFor(mode);
        const budgets = phases[stage];
        return budgets.map((amount, index) => ({ ...budgetValue(item, amount, mission, enchant),
            amount, weight: scoreWeights[stage][index] }));
    }

    function uplift(item, mode, enchant) {
        if (enchant === "none") return 0;
        const key = item.name + ":" + mode + ":" + enchant;
        if (bonusCache.has(key)) return bonusCache.get(key);
        const altered = budgetProfile(item, mode, enchant);
        const baseline = budgetProfile(item, mode, "none");
        let delta = 0;
        for (let index = 0; index < altered.length; index++) {
            const before = baseline[index].power;
            const after = altered[index].power;
            delta += altered[index].weight * clamp(Math.log1p(after) - Math.log1p(before), -0.5, 1.5);
        }
        if (!item.roles.damage) {
            const before = item.last.range || 0;
            const after = levelsWithEnchant(item, enchant).at(-1).range || 0;
            const cost = Number(sourceEnchants[enchant]?.cost || 0);
            delta = clamp((after - before) / Math.max(1, before) * 0.8 - cost / 100 * 0.3, -0.5, 1.5);
        }
        bonusCache.set(key, delta);
        return delta;
    }

    function enchantRating(item, key, mode, availability = true) {
        let rating = uplift(item, mode, key);
        if (["starter", "early"].includes(mode) && Number(sourceEnchants[key]?.cost || 0) < 0) {
            rating += Math.abs(Number(sourceEnchants[key].cost)) / 100 * (item.placement <= 250 ? 0.12 : 0.04);
        }
        if (availability) {
            const probability = Number(sourceEnchants[key]?.prob || 0);
            rating -= clamp(Math.log10(25 / Math.max(0.1, probability)) / 3, 0, 1) * settings.enchantAvailabilityPenalty;
        }
        return rating;
    }

    function enchantChoices(item, mode = "overall") {
        const key = item.name + ":" + mode;
        if (recommendationCache.has(key)) return recommendationCache.get(key);
        const scored = enchantKeys.map(name => ({ name, score: enchantRating(item, name, mode) }));
        scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
        const maxed = [...enchantKeys].sort((a, b) => enchantRating(item, b, mode, false) - enchantRating(item, a, mode, false));
        const recommendation = {
            best: scored[0]?.name || "Soul",
            alternative: scored[1]?.name || "Hunt",
            maximum: maxed[0] || scored[0]?.name || "Soul",
            context: "Modeled enchantment value",
            reason: "Based on source enchantment percentages, upgrade costs, attainable budgets and the unit's attack role. Rare enchants receive a modest availability penalty; special effects with missing data are excluded."
        };
        recommendationCache.set(key, recommendation);
        return recommendation;
    }

    function effectivePlacement(item, mode = "starter", preset = rankingPreset) {
        if (preset === "none") return item.placement;
        const choices = enchantChoices(item, mode);
        const key = preset === "maximum" ? choices.maximum : choices.best;
        return levelsWithEnchant(item, key)[0].totalInvestment;
    }

    function effectiveScore(item, mode = "overall", budget = meta.context().cash, enchantMode = rankingPreset) {
        let base = originalScore(item, mode, budget);
        if (mode === "starter" && base < 0 && effectivePlacement(item, "starter", enchantMode) <= budget)
            base = originalScore(item, "early", budget) * 0.88;
        if (base < 0 || enchantMode === "none") return base;
        const choices = enchantChoices(item, mode);
        const chosen = sourceEnchants[enchantMode] ? enchantMode : enchantMode === "maximum" ? choices.maximum : choices.best;
        const difference = uplift(item, mode, chosen);
        const blend = settings.rankingBlend;
        const enchantScore = clamp(base + clamp(difference, -0.4, 1.5) * 0.16, 0, 1.2);
        return base * blend.base + enchantScore * blend.enchanted;
    }

    function ranked(mode = "overall", options = {}) {
        const budget = options.budget ?? meta.context().cash;
        const enchantMode = options.enchantment || rankingPreset;
        const affordable = options.onlyAffordable ?? mode === "starter";
        return originalRanked(mode, { ...options, onlyAffordable: false }).filter(item =>
            !affordable || effectivePlacement(item, mode, enchantMode) <= budget)
            .sort((a, b) =>
            effectiveScore(b, mode, budget, enchantMode) - effectiveScore(a, mode, budget, enchantMode)
            || a.name.localeCompare(b.name));
    }

    function score(item, mode = "overall", budget = meta.context().cash, enchantMode = rankingPreset) {
        return effectiveScore(item, mode, budget, enchantMode);
    }

    function confidence(item) {
        const reasons = [];
        if (item.warning) reasons.push("One or more recorded stats have data warnings.");
        if (item.roles.status) reasons.push("Toxic damage ticks are not recorded.");
        if (item.roles.support || item.roles.control) reasons.push("Buff stacking, placement geometry or slow uptime are not confirmed.");
        if (item.roles.area) reasons.push("Real multi-target hit counts and enemy positions are unmeasured.");
        if (!item.roles.area && item.roles.damage) reasons.push("Attack uptime against moving enemies is not measured.");
        const score = item.roles.status || item.warning || item.roles.support || item.roles.control ? "Low" : "Medium";
        return { label: score, reasons, verifiedInGame: false };
    }

    function assignTierlist() {
        if (typeof TIER_ASSIGNMENTS === "undefined") return;
        const utility = ranked("support").filter(item => !item.roles.damage && (item.roles.support || item.roles.control)).map(item => item.name);
        const ordered = ranked("overall").filter(item => !utility.includes(item.name));
        const peak = Math.max(0.00001, score(ordered[0], "overall"));
        const floor = Math.min(...ordered.map(item => score(item, "overall")));
        const spread = Math.max(peak * 0.20, peak - floor);
        for (const tier of ["S", "A", "B", "C", "D", "F"]) TIER_ASSIGNMENTS[tier] = [];
        for (const item of ordered) {
            const relative = clamp((score(item, "overall") - floor) / spread);
            const tier = Object.entries(settings.tierScoreCutoffs).find(([, cutoff]) => relative >= cutoff)?.[0] || "F";
            TIER_ASSIGNMENTS[tier].push(item.name);
        }
        TIER_ASSIGNMENTS.U = utility;
        if (typeof TIER_ORDER !== "undefined" && !TIER_ORDER.includes("U")) TIER_ORDER.splice(3, 0, "U");
        if (typeof TIER_DESCRIPTIONS !== "undefined") {
            TIER_DESCRIPTIONS.S = "Top modeled score band";
            TIER_DESCRIPTIONS.A = "High comparative value";
            TIER_DESCRIPTIONS.B = "Good performance with specific strengths";
            TIER_DESCRIPTIONS.C = "More situational than leading units";
            TIER_DESCRIPTIONS.D = "Limited upgrade or placement efficiency";
            TIER_DESCRIPTIONS.F = "Lowest relative performance band";
            TIER_DESCRIPTIONS.U = "Support and slowing units (separate role comparison)";
        }
    }

    const formats = ["solo", "endless", "crowd", "boss", "speedrun"];
    const teamWeights = {
        solo: { early: .18, wave: .34, boss: .24, total: .24 },
        endless: { early: .06, wave: .46, boss: .22, total: .26 },
        crowd: { early: .08, wave: .62, boss: .10, total: .20 },
        boss: { early: .08, wave: .10, boss: .66, total: .16 },
        speedrun: { early: .48, wave: .28, boss: .07, total: .17 }
    };

    function teamScore(items, format, preset) {
        const cash = preset.currentCash;
        const weights = teamWeights[format] || teamWeights.solo;
        let affordable = 0, area = 0, single = 0, support = 0, control = 0, status = 0, cost = 0, cheap = 0;
        let early = 0, wave = 0, boss = 0, total = 0;
        for (const item of items) {
            const value = preset.get(item.name);
            const enchantedPlacement = value.placement;
            affordable += enchantedPlacement <= cash ? 1 : 0;
            area += !!item.roles.area;
            single += !!item.roles.single;
            support += !!item.roles.support;
            control += !!item.roles.control;
            status += !!item.roles.status;
            cheap += enchantedPlacement <= Math.max(350, cash * 4) ? 1 : 0;
            cost += enchantedPlacement;
            early += value.early;
            wave += value.wave;
            boss += value.boss;
            total += value.total;
        }
        if (!affordable) return -1000;
        const coverage = +(area > 0) + +(single > 0) + +(support > 0) + +(control > 0);
        const synergy = settings.roleSynergyAssumptions;
        let result = (early * weights.early + wave * weights.wave + boss * weights.boss + total * weights.total) / 5;
        result += area && (support || control) ? (support ? synergy.supportCoverage : 0) + (control ? synergy.controlCoverage : 0) : 0;
        result += area && single ? synergy.balancedAttacks : 0;
        result += coverage * .012 + (status ? .006 : 0);
        result -= Math.max(0, 3 - cheap) * (format === "speedrun" ? .028 : .005);
        result -= Math.max(0, area - 3) * .012;
        result -= Math.max(0, cost / Math.max(cash * 30, 1) - 1) * .008;
        if (format === "solo") result -= (!area ? .23 : 0) + (!single ? .18 : 0) + (!support && !control ? .08 : 0);
        if (format === "endless") result -= area < 2 ? .22 : 0;
        if (format === "crowd") result -= (area < 2 ? .28 : 0) + (!control ? .14 : 0);
        if (format === "boss") result -= (single < 2 ? .22 : 0) + (!area ? .05 : 0);
        if (format === "speedrun") result += Math.min(3, cheap) * .015;
        if (["solo", "endless", "crowd"].includes(format) && items.some(item => preset.waveLeaders?.has(item.name))) result += format === "endless" ? .065 : .055;
        if (["solo", "boss"].includes(format) && items.some(item => preset.bossLeaders?.has(item.name))) result += format === "boss" ? .085 : .025;
        return result;
    }

    function optimizerPreset() {
        const values = new Map(meta.data.map(item => [item.name, {
            early: score(item, "early"), wave: score(item, "crowd") || score(item, "late"),
            boss: score(item, "boss"), total: score(item, "overall"), placement: effectivePlacement(item, "starter")
        }]));
        values.currentCash = meta.context().cash;
        values.waveLeaders = new Set(ranked("late").slice(0, 3).map(item => item.name));
        values.bossLeaders = new Set(ranked("boss").slice(0, 2).map(item => item.name));
        return values;
    }

    function optimizeTeams() {
        if (typeof TEAM_COMPOSITIONS === "undefined") return [];
        const cash = meta.context().cash;
        const cacheKey = cash + ":" + rankingPreset;
        if (comboCache.has(cacheKey)) return comboCache.get(cacheKey);
        const choices = meta.data;
        const preset = optimizerPreset();
        const best = formats.map(() => ({ score: -Infinity, members: [] }));
        let inspected = 0;
        for (let a = 0; a < choices.length - 4; a++) {
            for (let b = a + 1; b < choices.length - 3; b++) {
                for (let c = b + 1; c < choices.length - 2; c++) {
                    for (let d = c + 1; d < choices.length - 1; d++) {
                        for (let e = d + 1; e < choices.length; e++) {
                            const members = [choices[a], choices[b], choices[c], choices[d], choices[e]];
                            inspected++;
                            if (!members.some(item => preset.get(item.name).placement <= cash)) continue;
                            for (let i = 0; i < formats.length; i++) {
                                const candidate = teamScore(members, formats[i], preset);
                                if (candidate > best[i].score) best[i] = { score: candidate, members };
                            }
                        }
                    }
                }
            }
        }
        const results = best.map((result, index) => {
            const format = formats[index];
            const members = result.members;
            const starters = members.filter(item => effectivePlacement(item, "starter") <= cash)
                .sort((a, b) => score(b, "starter") - score(a, "starter") || effectivePlacement(a) - effectivePlacement(b));
            const first = starters[0];
            const ordered = [first, ...members.filter(item => item !== first).sort((a, b) => a.placement - b.placement)];
            const used = new Set(ordered.map(item => item.name));
            const substitutes = ordered.map((item, position) => {
                let winner = null, winnerScore = -Infinity;
                for (const alternative of choices) {
                    if (used.has(alternative.name)) continue;
                    if (position === 0 && effectivePlacement(alternative, "starter") > cash) continue;
                    const copy = ordered.slice();
                    copy[position] = alternative;
                    const rating = teamScore(copy, format, preset);
                    if (rating > winnerScore) { winner = alternative; winnerScore = rating; }
                }
                if (!winner) {
                    winner = choices.filter(alternative => !used.has(alternative.name))
                        .sort((a, b) => effectivePlacement(a) - effectivePlacement(b))[0] || null;
                }
                if (winner) used.add(winner.name);
                return winner?.name || "";
            });
            return { format, score: result.score, checked: inspected, units: ordered.map(item => item.name),
                substitutes, bestEnchants: ordered.map((item, position) => enchantChoices(item, position === 0 ? "early" : "overall").best) };
        });
        comboCache.set(cacheKey, results);
        return results;
    }

    function assignGuides() {
        if (typeof BEST_UNIT_RANKINGS !== "undefined" && settings.rankingModes) {
            for (const [category, mode] of Object.entries(settings.rankingModes)) {
                BEST_UNIT_RANKINGS[category] ||= {};
                BEST_UNIT_RANKINGS[category].units = ranked(mode).slice(0, 3).map(item => item.name);
            }
        }
        if (typeof BEST_UNIT_ENCHANTS !== "undefined") {
            for (const item of meta.data) BEST_UNIT_ENCHANTS[item.name] = enchantChoices(item);
        }
        assignTierlist();
        if (typeof TEAM_COMPOSITIONS === "undefined") return;
        const optimized = optimizeTeams();
        TEAM_COMPOSITIONS.forEach((team, index) => {
            const result = optimized[index];
            if (!result || !result.units.length) return;
            team.units = result.units;
            team.substitutes = result.substitutes;
            team.enchants = result.bestEnchants;
            team.substituteEnchants = result.substitutes.map(name => {
                const item = meta.data.find(u => u.name === name);
                return item ? enchantChoices(item, name === result.substitutes[0] ? "early" : "overall").best : "";
            });
            const context = meta.context();
            const opener = meta.data.find(u => u.name === result.units[0]);
            const openingPrice = effectivePlacement(opener, "starter");
            const enchantLabel = rankingPreset === "none" ? "unenchanted" : rankingPreset === "maximum" ? "best modeled enchant" : "recommended enchant";
            team.description = `Modeled ${result.format} composition for Game ${context.game} Night ${context.night} ${context.mode.toUpperCase()}; ${opener.name} opens at $${openingPrice.toLocaleString("en-US")} with ${enchantLabel}.`;
            const openingAlternative = meta.data.find(item => item.name === result.substitutes[0]);
            const alternatePrice = openingAlternative ? effectivePlacement(openingAlternative, "starter") : 0;
            const openingNote = openingAlternative && alternatePrice > context.cash
                ? ` The substitute starter ${openingAlternative.name} costs $${alternatePrice.toLocaleString("en-US")} with the selected enchant assumption and requires saving first.` : "";
            team.explanation = `Selected from ${result.checked.toLocaleString("en-US")} distinct five-unit combinations based on affordable openings, level-by-level damage, enchantment-adjusted budget scenarios, attack coverage and role synergy.${openingNote} Buffs, real target positioning, toxic ticks and actual wave earnings are not measured; use these as planning recommendations.`;
        });
    }

    function simulateNight({ game = meta.context().game, night = meta.context().night, mode = meta.context().mode,
        waveIncome = null, enemyHealth = null, lineup = null, enchantment = "recommended" } = {}) {
        const match = meta.cashByNight.find(entry => entry.game === Number(game) && entry.night === Number(night) && entry.mode === mode);
        if (!match) return null;
        const record = typeof nights !== "undefined" ? nights.find(chapter => chapter.game === Number(game))?.nights.find(n => n.number === Number(night))?.[mode] : null;
        const waves = Number(record?.waveCount || 0);
        const selected = Array.isArray(lineup) ? lineup : optimizeTeams()[0]?.units || [];
        const members = selected.map(name => meta.data.find(item => item.name === name)).filter(Boolean);
        const deployed = new Map(members.map(item => [item.name, []]));
        const incomeProvided = waveIncome !== null && waveIncome !== undefined && waveIncome !== "";
        let balance = match.cash;
        const timeline = [];
        const gainFor = wave => {
            if (!incomeProvided) return 0;
            const value = Array.isArray(waveIncome) ? waveIncome[wave - 1] || 0 : waveIncome;
            return Math.max(0, Number(value) || 0);
        };
        for (let wave = 1; wave <= waves; wave++) {
            const bought = [];
            for (let action = 0; action < 120; action++) {
                let choice = null;
                for (const item of members) {
                    const collection = deployed.get(item.name);
                    if (collection.length < item.placements) {
                        const key = enchantment === "recommended" ? enchantChoices(item, "early").best : enchantment === "maximum" ? enchantChoices(item).maximum : enchantment;
                        const levels = levelsWithEnchant(item, key);
                        const next = levels[0];
                        const price = next.totalInvestment;
                        if (price > 0 && price <= balance + 1e-9) {
                            const effect = Math.max(0.01, next.groupPower + (item.roles.support || item.roles.control ? 2 : 0));
                            const candidate = { item, key, slot: collection.length, level: 0, price, effect, kind: "place" };
                            if (!choice || effect / price > choice.effect / choice.price) choice = candidate;
                        }
                    }
                    collection.forEach((current, slot) => {
                        const levels = levelsWithEnchant(item, current.key);
                        const nextIndex = current.level + 1;
                        if (nextIndex >= levels.length) return;
                        const price = levels[nextIndex].upgradeCost;
                        if (price <= 0 || price > balance + 1e-9) return;
                        const effect = Math.max(0.01, levels[nextIndex].groupPower - levels[current.level].groupPower);
                        const candidate = { item, slot, level: nextIndex, price, effect, kind: "upgrade", key: current.key };
                        if (!choice || effect / price > choice.effect / choice.price) choice = candidate;
                    });
                }
                if (!choice) break;
                balance -= choice.price;
                const collection = deployed.get(choice.item.name);
                if (choice.kind === "place") collection.push({ level: choice.level, key: choice.key });
                else collection[choice.slot].level = choice.level;
                bought.push(`${choice.kind === "place" ? "Place" : "Upgrade"} ${choice.item.name} L${levelsWithEnchant(choice.item, choice.key)[choice.level].level}`);
            }
            let bossDps = 0, modeledGroupDps = 0;
            for (const item of members) for (const deployedUnit of deployed.get(item.name)) {
                const level = levelsWithEnchant(item, deployedUnit.key)[deployedUnit.level];
                bossDps += level.dps || 0;
                modeledGroupDps += level.groupPower;
            }
            const nextIncome = gainFor(wave);
            timeline.push({ wave, purchased: bought, bankAfterPurchases: decimals(balance),
                singleTargetDps: decimals(bossDps), modeledGroupDps: decimals(modeledGroupDps),
                optionalTimeToDefeat: Number(enemyHealth) > 0 && bossDps > 0 ? decimals(Number(enemyHealth) / bossDps) : null,
                enteredIncomeAfterWave: nextIncome });
            balance += nextIncome;
        }
        return { startingCash: match.cash, waveCount: waves, lineup: members.map(item => item.name),
            incomeProvided, simulated: true, finalCash: decimals(balance), timeline,
            limitations: "Only starting cash and wave count come from nights-data.js. Income must be entered by the player. Grouped damage, buff uptime, enemy health, pathing and enchantment access are estimates or unmeasured." };
    }

    function setRankingPreset(value) {
        if (!["none", "recommended", "maximum"].includes(value)) return false;
        rankingPreset = value;
        assignGuides();
        return true;
    }

    meta.getRankingPreset = () => rankingPreset;
    meta.setRankingPreset = setRankingPreset;
    meta.effectivePlacement = effectivePlacement;
    meta.ranked = ranked;
    meta.score = score;
    meta.pick = (mode, count, exclude = [], options = {}) => ranked(mode, { ...options, exclude }).slice(0, count).map(item => item.name);
    meta.enchantFor = item => enchantChoices(item);
    meta.enchantMetricsByLevel = levelsWithEnchant;
    meta.optimizedTeams = optimizeTeams;
    meta.modelNight = simulateNight;
    meta.confidenceFor = confidence;
    meta.enchantmentScore = uplift;
    meta.budgetValueWithEnchant = budgetValue;
    meta.getAudit = (() => { const old = meta.getAudit.bind(meta); return () => old().map(row => {
        const item = meta.data.find(entry => entry.name === row.name);
        return { ...row, confidence: confidence(item), computedEnchant: enchantChoices(item), adjustedScore: score(item, "overall") };
    }); })();
    meta.setNight = (game, night, mode) => {
        const result = originalSetNight(game, night, mode);
        if (result) assignGuides();
        return result;
    };
    window.FTC_META_STRATEGY = { score, ranked, enchantChoices, levelsWithEnchant, budgetValue,
        optimizeTeams, simulateNight, confidence, assignGuides, effectivePlacement, setRankingPreset };
    assignGuides();
})();
