(function () {
    const cash = value => "$" + Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
    const number = value => Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
    const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    const namesOf = slots => (slots || []).map(slot => typeof slot === "string" ? slot : slot?.unitName || slot?.name).filter(Boolean);
    const profileFor = unit => {
        const meta = window.FTC_META_RANKING?.data?.find(item => item.name === unit.name);
        if (meta)
            return meta;
        const levels = unit.stats || [];
        const types = levels.map(stat => String(stat.type || unit.type || "").toLowerCase()).join(" ");
        const passives = (unit.passives || []).join(" ").toLowerCase();
        const damage = levels.some(stat => Number.isFinite(Number(stat.damage)) && Number.isFinite(Number(stat.cooldown)));
        return { name: unit.name, unit, placement: Number(unit.placement) || 0, placements: Number(unit.maxLimit) || 1,
            levels: levels.map((step, index) => ({ level: Number(step.level) || index + 1, dps: Number(step.damage || 0) * Number(step.cooldown || 0), range: Number(step.range) || 0, upgradeCost: index ? Number(step.cost) || 0 : Number(unit.placement) || 0 })),
            roles: { damage, area: /aoe|pierce|cone|splash|toxic/.test(types), single: /single/.test(types), support: /buff|boost|heal/.test(types + passives), control: /slow|stun|freeze/.test(types + passives), status: /toxic|poison/.test(types + passives) } };
    };
    const roleConfig = [
        { key: "single", label: "Boss / single-target", detail: "A direct-damage option focused on a single target" },
        { key: "area", label: "Group coverage", detail: "At least one listed cone, splash, AOE, pierce or toxic attack" },
        { key: "support", label: "Support / buffs", detail: "A documented buff or similar support role" },
        { key: "control", label: "Crowd control", detail: "A documented slow, freeze or stun role" },
        { key: "status", label: "Status effects", detail: "Toxic or another documented damage-over-time mechanic" }
    ];
    const evaluate = (slots, options = {}) => {
        const unitData = typeof units !== "undefined" ? units : [];
        const seen = new Set(), missing = [];
        const chosen = [];
        namesOf(slots).forEach(name => {
            const unit = unitData.find(item => item.name === name);
            if (!unit) {
                missing.push(name);
                return;
            }
            if (seen.has(name))
                return;
            seen.add(name);
            chosen.push(profileFor(unit));
        });
        const budget = Number(options.cash ?? window.FTC_META_RANKING?.context()?.cash ?? 50);
        const cost = chosen.reduce((sum, item) => sum + item.placement, 0);
        const maxInvestment = chosen.reduce((sum, item) => sum + (item.levels[item.levels.length - 1]?.totalInvestment ?? item.levels.reduce((n, step) => n + step.upgradeCost, 0)), 0);
        const firstDps = chosen.reduce((sum, item) => sum + (Number(item.levels[0]?.dps) || 0), 0);
        const finalDps = chosen.reduce((sum, item) => sum + (Number(item.levels[item.levels.length - 1]?.dps) || 0), 0);
        const deployedDps = chosen.reduce((sum, item) => sum + (Number(item.levels[item.levels.length - 1]?.dps) || 0) * item.placements, 0);
        const roles = Object.fromEntries(roleConfig.map(role => [role.key, chosen.filter(item => item.roles[role.key]).map(item => item.name)]));
        const starters = chosen.filter(item => item.placement <= budget);
        const warnings = [];
        if (chosen.length < 5)
            warnings.push(`${5 - chosen.length} team slot(s) are still empty.`);
        if (!starters.length)
            warnings.push(`No selected unit fits the ${cash(budget)} starting-cash budget. Add an affordable opening unit.`);
        if (!roles.area.length)
            warnings.push("No documented group-attack coverage; consider a Pierce, Splash, Cone or AOE unit.");
        if (!roles.single.length)
            warnings.push("No listed single-target attacker; consider how the team handles individual high-health enemies.");
        if (!roles.support.length)
            warnings.push("No documented support buff; a range buffer may improve coverage, but its effect depends on placement.");
        if (!roles.control.length)
            warnings.push("No documented slowing unit; control can improve the time enemies spend within attack range.");
        if (cost > budget * 8)
            warnings.push("The complete lineup has a high combined placement cost relative to starting cash; build it gradually as income allows.");
        if (missing.length)
            warnings.push(`Missing units in the database: ${missing.join(", ")}.`);
        const synergy = [];
        if (roles.area.length && roles.control.length)
            synergy.push("Group attacks and slowing can work well together by keeping groups within range longer. No extra hits are assumed in DPS estimates.");
        if (roles.area.length && roles.support.length)
            synergy.push("Range support may improve group-attack coverage when units are placed inside the buff radius; actual buff stacking is not modeled.");
        if (roles.single.length && roles.area.length)
            synergy.push("Single-target and group damage are both represented, giving the team broader attack coverage.");
        if (roles.status.length)
            synergy.push("Status damage is represented as a role, not added to DPS because damage-over-time tick data is unavailable.");
        const suggestions = [];
        if (window.FTC_META_RANKING) {
            for (const role of ["starter", "crowd", "boss", "support", "control"]) {
                const missingRole = role === "starter" ? !starters.length : role === "crowd" ? !roles.area.length : role === "boss" ? !roles.single.length : role === "support" ? !roles.support.length : !roles.control.length;
                if (!missingRole)
                    continue;
                const candidates = window.FTC_META_RANKING.ranked(role === "crowd" ? "crowd" : role === "boss" ? "boss" : role, { exclude: chosen.map(item => item.name) });
                const suggested = candidates[0];
                if (suggested)
                    suggestions.push({ reason: role, name: suggested.name, placement: suggested.placement });
            }
        }
        return { chosen, cost, maxInvestment, firstDps, finalDps, deployedDps, roles, starters, budget, warnings, synergy, suggestions, missing };
    };
    const summaryHtml = (result) => {
        const cards = [
            ["Team slots", `${result.chosen.length}/5`],
            ["Starting cash", cash(result.budget)],
            ["Opening units", result.starters.length],
            ["Place all five", cash(result.cost)],
            ["Base max DPS", number(result.finalDps)],
            ["Full-deployment DPS", number(result.deployedDps)]
        ];
        const roles = roleConfig.map(role => {
            const covered = result.roles[role.key].length > 0;
            return `<li class="ftc-synergy-role ${covered ? "covered" : "missing"}"><span>${escape(role.label)}</span><strong>${covered ? `${result.roles[role.key].length} unit(s)` : "Not covered"}</strong><small>${escape(covered ? result.roles[role.key].join(", ") : role.detail)}</small></li>`;
        }).join("");
        const findings = [...result.synergy.map(text => `<li class="positive">${escape(text)}</li>`), ...result.warnings.map(text => `<li>${escape(text)}</li>`)];
        return `<div class="ftc-synergy-summary"><div class="ftc-synergy-metrics">${cards.map(([label, value]) => `<div><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join("")}</div><h3>Team role coverage</h3><ul class="ftc-synergy-roles">${roles}</ul><h3>Synergies & limitations</h3><ul class="ftc-synergy-findings">${findings.length ? findings.join("") : '<li>Add units to see the analysis.</li>'}</ul>${result.suggestions.length ? `<h3>Potential role fillers</h3><div class="ftc-synergy-suggestions">${result.suggestions.map(s => `<span>${escape(s.reason)}: <strong>${escape(s.name)}</strong> (${cash(s.placement)})</span>`).join("")}</div>` : ""}<p class="ftc-note">Damage and DPS are per-target estimates from units.js before enchantments or buffs. Full-deployment DPS is only an upper-bound estimate assuming every allowed placement can attack continuously. Full lineups cannot necessarily be purchased at the start of a Night.</p></div>`;
    };
    const comparisonHtml = (a, b, titleA, titleB) => {
        const lines = [
            ["Unit slots", `${a.chosen.length}/5`, `${b.chosen.length}/5`],
            ["Opening units", a.starters.length, b.starters.length],
            ["Combined placement", cash(a.cost), cash(b.cost)],
            ["Base max DPS", number(a.finalDps), number(b.finalDps)],
            ["Max-deployed DPS*", number(a.deployedDps), number(b.deployedDps)],
            ["Group coverage", a.roles.area.length, b.roles.area.length],
            ["Single-target", a.roles.single.length, b.roles.single.length],
            ["Support", a.roles.support.length, b.roles.support.length],
            ["Crowd control", a.roles.control.length, b.roles.control.length]
        ];
        return `<div class="ftc-table-wrap"><table class="ftc-synergy-compare"><thead><tr><th scope="col">Metric</th><th scope="col">${escape(titleA)}</th><th scope="col">${escape(titleB)}</th></tr></thead><tbody>${lines.map(row => `<tr><th scope="row">${escape(row[0])}</th><td>${escape(row[1])}</td><td>${escape(row[2])}</td></tr>`).join("")}</tbody></table></div><p class="ftc-note">*Upper-bound per-target calculation; team synergy, attack hit counts, and enemy resistance are not quantified.</p>`;
    };
    window.FTC_TEAM_ANALYSIS = { evaluate, summaryHtml, comparisonHtml, namesOf, roleConfig };
})();
