/* V2.5.8–V2.7.1 additive feature layer. Existing page scripts remain in place. */
(() => {
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];
    const safe = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const money = n => Number.isFinite(Number(n)) ? "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
    const num = n => Number.isFinite(Number(n)) ? Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
    const getUnitStats = u => (u?.stats || []).map(s => ({ ...s, level: Number(s.level) || 1 })).sort((a, b) => a.level - b.level);
    const levelCost = (u, s) => s.level === 1 ? Number(u.placement) || 0 : Number(s.cost) || 0;
    const statDps = s => Number(s?.damage) > 0 && Number(s?.cooldown) > 0 ? Number(s.damage) * Number(s.cooldown) : 0;
    const readJson = (k, fallback) => { try {
        return JSON.parse(localStorage.getItem(k)) ?? fallback;
    }
    catch {
        return fallback;
    } };
    const writeJson = (k, v) => { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch { } };
    const modalBase = (label) => {
        const wrap = document.createElement("div");
        wrap.className = "ftc-feature-overlay";
        wrap.innerHTML = `<section class="ftc-feature-panel" role="dialog" aria-modal="true" aria-label="${safe(label)}"><button class="ftc-feature-close" type="button" aria-label="Close">×</button><div class="ftc-feature-content"></div></section>`;
        const close = () => { wrap.remove(); document.removeEventListener("keydown", esc); };
        $(".ftc-feature-close", wrap).addEventListener("click", close);
        wrap.addEventListener("click", e => { if (e.target === wrap)
            close(); });
        const esc = e => { if (e.key === "Escape") {
            close();
            document.removeEventListener("keydown", esc);
        } };
        document.addEventListener("keydown", esc);
        document.body.appendChild(wrap);
        return $(".ftc-feature-content", wrap);
    };
    // Full unit information modal, opened from database cards without removing the direct unit page link.
    function openUnitModal(unit) {
        if (!unit)
            return;
        const host = modalBase(`${unit.name} details`);
        const stats = getUnitStats(unit);
        host.innerHTML = `
      <div class="ftc-unit-hero">
        <img src="${safe(unit.image)}" alt="${safe(unit.name)}" onerror="this.style.visibility='hidden'">
        <div><span class="ftc-kicker">${safe(unit.rarity || "Rarity unavailable")}</span><h2>${safe(unit.name)}</h2>
        <p>${safe(unit.type || "Type unavailable")} · ${safe(unit.maxLimit ?? "—")} placement limit</p>
        <p><strong>Placement Cost:</strong> ${money(unit.placement)}</p><p>${safe(unit.obtainment || "Obtainment information unavailable.")}</p>
        <div class="ftc-action-row"><a class="ftc-action" href="unit.html?unit=${encodeURIComponent(unit.name)}">OPEN FULL UNIT PAGE</a><a class="ftc-action" href="stats-simulator.html?unit=${encodeURIComponent(unit.name)}">OPEN IN SIMULATOR</a></div></div>
      </div>
      <div class="ftc-tabs" role="tablist"><button class="active" type="button" role="tab" aria-selected="true" data-ftc-tab="stats">STATS & UPGRADES</button><button type="button" role="tab" aria-selected="false" data-ftc-tab="abilities">ABILITIES</button><button type="button" role="tab" aria-selected="false" data-ftc-tab="enchant">ENCHANTMENTS</button></div>
      <div data-ftc-panel="stats"><div class="ftc-table-wrap ftc-upgrade-table"><table><thead><tr><th>LVL</th><th>Upgrade</th><th>Total Cost</th><th>Damage</th><th>HPS</th><th>DPS*</th><th>Range</th></tr></thead><tbody>${stats.map((s, i) => `<tr><td>${s.level}</td><td>${s.level === 1 ? "Placement" : money(s.cost)}</td><td>${money(stats.slice(0, i + 1).reduce((sum, x, j) => sum + (j === 0 ? Number(unit.placement) || 0 : Number(x.cost) || 0), 0))}</td><td>${num(s.damage)}</td><td>${num(s.cooldown)}</td><td>${num(statDps(s))}</td><td>${num(s.range)}</td></tr>`).join("") || '<tr><td colspan="7">No upgrade statistics have been entered for this unit.</td></tr>'}</tbody></table></div><p class="ftc-note">*DPS = damage × HPS. Upgrade cost at level 1 is the placement cost. Special attacks may behave differently.</p></div>
      <div data-ftc-panel="abilities" hidden><ul>${(unit.passives || []).map(x => `<li>${safe(x)}</li>`).join("") || "<li>No ability information is listed.</li>"}</ul></div>
      <div data-ftc-panel="enchant" hidden><label>Compare enchantment <select id="ftc-unit-enchant"><option value="">None</option>${typeof enchants !== "undefined" ? Object.entries(enchants).map(([k, v]) => `<option value="${safe(k)}">${safe(v.name || k)}</option>`).join("") : ""}</select></label><div id="ftc-enchant-preview"></div></div>`;
        if (window.FTC_PERFORMANCE) {
            const graph = document.createElement("div");
            $("[data-ftc-panel=stats]", host).appendChild(graph);
            window.FTC_PERFORMANCE.mount(graph, unit);
        }
        const tabs = $$(".ftc-tabs button", host), panels = $$("[data-ftc-panel]", host);
        tabs.forEach(b => b.addEventListener("click", () => { tabs.forEach(t => { t.classList.toggle("active", t === b); t.setAttribute("aria-selected", String(t === b)); }); panels.forEach(p => p.hidden = p.dataset.ftcPanel !== b.dataset.ftcTab); }));
        const enchantSelect = $("#ftc-unit-enchant", host), preview = $("#ftc-enchant-preview", host);
        const paintEnchant = () => {
            const s = stats[stats.length - 1];
            if (!s) {
                preview.textContent = "No stats available.";
                return;
            }
            const key = enchantSelect.value, e = key && typeof enchants !== "undefined" ? enchants[key] : null;
            const dmg = Number(s.damage) || 0, cooldown = Number(s.cooldown) || 0, range = Number(s.range) || 0;
            const speedMultiplier = 1 + (Number(e?.attackSpeed) || 0) / 100;
            const md = dmg * (1 + (Number(e?.damage) || 0) / 100), mc = speedMultiplier > 0 ? cooldown / speedMultiplier : cooldown;
            const mr = range * (1 + (Number(e?.range) || 0) / 100);
            const baseDps = dmg * cooldown, modifiedDps = md * mc;
            const delta = (before, after) => {
                const change = after - before;
                if (Math.abs(change) < 0.000001)
                    return '<small class="ftc-delta-neutral">No change</small>';
                return `<small class="${change > 0 ? "ftc-delta-up" : "ftc-delta-down"}">${change > 0 ? "+" : ""}${num(change)} (${change > 0 ? "+" : ""}${num(before ? change / before * 100 : 0)}%)</small>`;
            };
            const metric = (label, before, after) => `<div class="ftc-enchant-metric"><span>${label}</span><strong>${num(after)}</strong><span class="ftc-enchant-before">Base ${num(before)}</span>${delta(before, after)}</div>`;
            const costPercent = Number(e?.cost) || 0;
            preview.innerHTML = `<div class="ftc-enchant-summary">${key ? `<strong>${safe(e?.name || key)}</strong><span>Compared with no enchantment · Max level ${s.level}</span>` : '<strong>No enchantment selected</strong><span>Choose an enchantment to see changes from the base stats.</span>'}</div><div class="ftc-stat-cards ftc-enchant-stats">${metric("Damage", dmg, md)}${metric("HPS", cooldown, mc)}${metric("DPS estimate", baseDps, modifiedDps)}${metric("Range", range, mr)}<div class="ftc-enchant-metric"><span>Cost modifier</span><strong>${costPercent ? `${costPercent > 0 ? "+" : ""}${costPercent}%` : "No change"}</strong><span class="ftc-enchant-before">Base 0%</span>${costPercent ? `<small class="${costPercent < 0 ? "ftc-delta-up" : "ftc-delta-down"}">${costPercent < 0 ? "Lower" : "Higher"} cost</small>` : '<small class="ftc-delta-neutral">No change</small>'}</div></div><p class="ftc-note">Attack-speed enchantments adjust HPS using the site's configured percentages. These are estimates; special effects and game mechanics may differ.</p>`;
        };
        enchantSelect.addEventListener("change", paintEnchant);
        paintEnchant();
    }
    // Database click interception: only card background/name opens the richer modal; utility controls still work.
    const unitGrid = $("#unit-grid");
    if (unitGrid && typeof units !== "undefined" && $("#search-input")) {
        unitGrid.addEventListener("click", e => {
            if (e.target.closest("button,input,label,a"))
                return;
            const card = e.target.closest(".unit-card");
            if (!card)
                return;
            const name = card.querySelector(".unit-name")?.textContent?.trim() || card.querySelector(".unit-name, .unit-card-name")?.textContent?.trim();
            const unit = units.find(u => u.name === name);
            if (!unit)
                return;
            e.preventDefault();
            e.stopPropagation();
            openUnitModal(unit);
        }, true);
    }
    // Simulator: upgrade deltas, investment efficiency, persistent configurations and share links.
    const simPage = $(".simulator-page");
    if (simPage && typeof units !== "undefined") {
        const toolbar = document.createElement("section");
        toolbar.className = "ftc-sim-enhancements";
        toolbar.innerHTML = `<h2>UPGRADE COMPARISON & CONFIGURATIONS</h2><p>Compare two upgrade levels for the currently selected unit, review incremental investment, and save or share your setup.</p><div class="ftc-sim-controls"><label>Compare level A <select id="ftc-level-a"></select></label><label>Compare level B <select id="ftc-level-b"></select></label><button id="ftc-save-sim" type="button">SAVE CONFIGURATION</button><button id="ftc-share-sim" type="button">COPY SHARE LINK</button><label class="ftc-sim-saved-label">Saved configurations<select id="ftc-saved-sims" aria-label="Saved simulator configurations"><option value="">Load saved configuration…</option></select></label><button id="ftc-load-sim" type="button">LOAD</button></div><div id="ftc-upgrade-diff" aria-live="polite"></div><p class="ftc-note">Saved configurations are local to this browser. Share links contain the selected unit and enchantment.</p>`;
        const statsSection = $(".stats-section", simPage);
        if (statsSection)
            statsSection.after(toolbar);
        else
            simPage.appendChild(toolbar);
        const selA = $("#ftc-level-a"), selB = $("#ftc-level-b"), diff = $("#ftc-upgrade-diff"), saved = $("#ftc-saved-sims");
        const savedKey = "ftc-sim-configurations";
        function currentUnit() { return (typeof selectedUnit !== "undefined" && selectedUnit) || units.find(u => u.name === new URLSearchParams(location.search).get("unit")) || null; }
        function fillLevels() {
            const u = currentUnit(), ss = getUnitStats(u || {});
            [selA, selB].forEach(s => s.innerHTML = ss.map(x => `<option value="${x.level}">Level ${x.level}</option>`).join(""));
            if (ss.length) {
                selA.value = String(ss[0].level);
                selB.value = String(ss[ss.length - 1].level);
            }
            renderDiff();
        }
        function renderDiff() {
            const u = currentUnit(), ss = getUnitStats(u || {});
            if (!u || !ss.length) {
                diff.innerHTML = "<p>Select a unit with upgrade data to compare levels.</p>";
                return;
            }
            const a = ss.find(x => x.level === Number(selA.value)) || ss[0], b = ss.find(x => x.level === Number(selB.value)) || ss[ss.length - 1];
            const costA = ss.filter(x => x.level <= a.level).reduce((sum, x, i) => sum + (i === 0 ? (Number(u.placement) || 0) : (Number(x.cost) || 0)), 0);
            const costB = ss.filter(x => x.level <= b.level).reduce((sum, x, i) => sum + (i === 0 ? (Number(u.placement) || 0) : (Number(x.cost) || 0)), 0);
            const rows = [["Damage", a.damage, b.damage], ["HPS", a.cooldown, b.cooldown], ["DPS estimate", statDps(a), statDps(b)], ["Range", a.range, b.range], ["Total investment", costA, costB]];
            diff.innerHTML = `<h3>${safe(u.name)}: Level ${a.level} → Level ${b.level}</h3><div class="ftc-table-wrap"><table><thead><tr><th>Statistic</th><th>Level ${a.level}</th><th>Level ${b.level}</th><th>Difference</th></tr></thead><tbody>${rows.map(([label, x, y]) => `<tr><th>${label}</th><td>${num(x)}</td><td>${num(y)}</td><td>${num((Number(y) || 0) - (Number(x) || 0))}</td></tr>`).join("")}</tbody></table></div><p>Additional investment from A to B: <strong>${money(costB - costA)}</strong>. DPS improvement per additional cost: <strong>${costB !== costA ? num((statDps(b) - statDps(a)) / (costB - costA)) : "—"}</strong> DPS per currency unit.</p>`;
        }
        function refreshSaved() { const items = readJson(savedKey, []); saved.innerHTML = '<option value="">Load saved configuration…</option>' + items.map((x, i) => `<option value="${i}">${safe(x.name)}</option>`).join(""); }
        [selA, selB].forEach(s => s.addEventListener("change", renderDiff));
        $("#ftc-save-sim").addEventListener("click", () => { const u = currentUnit(); if (!u)
            return; const items = readJson(savedKey, []); const config = { name: `${u.name} · ${new Date().toLocaleDateString()}`, unit: u.name, enchant: typeof selectedEnchant !== "undefined" ? selectedEnchant : "none", a: selA.value, b: selB.value }; items.unshift(config); writeJson(savedKey, items.slice(0, 30)); refreshSaved(); saved.value = "0"; });
        $("#ftc-share-sim").addEventListener("click", async () => { const u = currentUnit(); if (!u)
            return; const url = new URL(location.href); url.searchParams.set("unit", u.name); url.searchParams.set("enchant", typeof selectedEnchant !== "undefined" ? selectedEnchant : "none"); url.searchParams.set("levelA", selA.value); url.searchParams.set("levelB", selB.value); try {
            await navigator.clipboard.writeText(url.toString());
            $("#ftc-share-sim").textContent = "LINK COPIED";
        }
        catch {
            $("#ftc-share-sim").textContent = url.toString();
        } });
        $("#ftc-load-sim").addEventListener("click", () => { const c = readJson(savedKey, [])[Number(saved.value)]; if (!c)
            return; const u = units.find(x => x.name === c.unit); if (!u)
            return; const search = $("#unit-search"); if (search) {
            search.value = u.name;
            search.dispatchEvent(new Event("input", { bubbles: true }));
        } if (typeof selectedUnit !== "undefined")
            selectedUnit = u; if (typeof selectedEnchant !== "undefined")
            selectedEnchant = c.enchant || "none"; if ($("#enchant-select")) {
            $("#enchant-select").value = c.enchant || "none";
            $("#enchant-select").dispatchEvent(new Event("change", { bubbles: true }));
        } fillLevels(); selA.value = c.a; selB.value = c.b; renderDiff(); });
        const params = new URLSearchParams(location.search);
        const qUnit = params.get("unit");
        if (qUnit) {
            const u = units.find(x => x.name.toLowerCase() === qUnit.toLowerCase());
            if (u) {
                if (typeof selectedUnit !== "undefined")
                    selectedUnit = u;
                const search = $("#unit-search");
                if (search) {
                    search.value = u.name;
                    search.dispatchEvent(new Event("input", { bubbles: true }));
                }
                if (params.has("enchant") && $("#enchant-select")) {
                    $("#enchant-select").value = params.get("enchant");
                    $("#enchant-select").dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
        }
        fillLevels();
        refreshSaved();
        const originalDisplay = typeof displayStats === "function" ? displayStats : null;
        // Selection cards change currentUnit; refresh comparison when clicked.
        unitGrid?.addEventListener("click", () => setTimeout(fillLevels, 0));
    }
    // Team Builder: recommended templates, coverage/investment validation, and side-by-side team comparison.
    const teamPage = $(".teams-page");
    if (teamPage && typeof units !== "undefined") {
        const panel = $("#team-builder-panel");
        if (panel) {
            const section = document.createElement("section");
            section.className = "ftc-team-tools";
            section.innerHTML = `<h2>TEAM TEMPLATES & ANALYSIS</h2><p>Load a recommended five-unit template into the existing builder, or analyze the currently selected lineup.</p><div class="ftc-team-tool-row"><label>Recommended template <select id="ftc-team-template"><option value="">Choose a template…</option>${(typeof TEAM_COMPOSITIONS !== "undefined" ? TEAM_COMPOSITIONS : []).map((t, i) => `<option value="${i}">${safe(t.title)}</option>`).join("")}</select></label><button id="ftc-load-template" type="button">LOAD INTO BUILDER</button><button id="ftc-analyze-team" type="button">ANALYZE CURRENT TEAM</button></div><div id="ftc-team-analysis" aria-live="polite"></div><div class="ftc-team-tool-row"><label>Compare team A <select id="ftc-team-a"></select></label><label>Compare team B <select id="ftc-team-b"></select></label><button id="ftc-compare-teams" type="button">COMPARE TEAMS</button></div><div id="ftc-team-comparison"></div>`;
            panel.appendChild(section);
            const templateSelect = $("#ftc-team-template"), analysis = $("#ftc-team-analysis");
            $("#ftc-load-template").addEventListener("click", () => {
                const idx = Number(templateSelect.value), t = (typeof TEAM_COMPOSITIONS !== "undefined" ? TEAM_COMPOSITIONS : [])[idx];
                if (!t)
                    return;
                const missing = (t.units || []).filter(n => !units.some(u => u.name === n));
                if (missing.length) {
                    analysis.innerHTML = `<p class="ftc-warning">Some template units are missing from the database: ${missing.map(safe).join(", ")}. Existing team was not changed.</p>`;
                    return;
                }
                if (typeof builderSlots !== "undefined" && typeof openBuilderUnitConfig === "function") {
                    if (!confirm(`Load "${t.title}" into the current team? This replaces the five current slots but keeps your other saved teams.`))
                        return;
                    builderSlots.fill(null);
                    for (let i = 0; i < 5; i++) {
                        const u = units.find(x => x.name === t.units[i]);
                        if (!u)
                            continue;
                        builderSlots[i] = { unitName: u.name, enchant: t.enchants?.[i] || null };
                    }
                    if (typeof renderBuilderSlots === "function")
                        renderBuilderSlots();
                    analysis.innerHTML = `<p class="ftc-success">Loaded "${safe(t.title)}" into the current team. Your existing team manager and autosave remain active.</p>`;
                }
                else {
                    analysis.innerHTML = `<h3>${safe(t.title)}</h3><ol>${t.units.map((n, i) => `<li>${safe(n)}${t.enchants?.[i] ? ` — ${safe(t.enchants[i])}` : ""}</li>`).join("")}</ol><p>Template units are shown for reference; the existing slot picker remains available.</p>`;
                }
            });
            const collectCurrent = () => {
                if (typeof builderSlots !== "undefined")
                    return builderSlots.map(slot => slot?.unitName).filter(Boolean);
                return $$(".builder-slot.filled .builder-slot-name", panel).map(el => el.textContent.trim()).filter(Boolean);
            };
            $("#ftc-analyze-team").addEventListener("click", () => {
                const names = collectCurrent();
                if (!window.FTC_TEAM_ANALYSIS) {
                    analysis.textContent = "Team analysis is unavailable.";
                    return;
                }
                const result = window.FTC_TEAM_ANALYSIS.evaluate(names);
                analysis.innerHTML = window.FTC_TEAM_ANALYSIS.summaryHtml(result);
            });
            const teamA = $("#ftc-team-a"), teamB = $("#ftc-team-b");
            if (typeof TEAM_COMPOSITIONS !== "undefined") {
                const opts = TEAM_COMPOSITIONS.map((t, i) => `<option value="${i}">${safe(t.title)}</option>`).join("");
                teamA.innerHTML = opts;
                teamB.innerHTML = opts;
                if (teamB.options.length > 1)
                    teamB.selectedIndex = 1;
            }
            $("#ftc-compare-teams").addEventListener("click", () => {
                const ts = typeof TEAM_COMPOSITIONS !== "undefined" ? TEAM_COMPOSITIONS : [], a = ts[Number(teamA.value)], b = ts[Number(teamB.value)];
                if (!a || !b || !window.FTC_TEAM_ANALYSIS)
                    return;
                const x = window.FTC_TEAM_ANALYSIS.evaluate(a.units), y = window.FTC_TEAM_ANALYSIS.evaluate(b.units);
                $("#ftc-team-comparison").innerHTML = window.FTC_TEAM_ANALYSIS.comparisonHtml(x, y, a.title, b.title);
            });
        }
    }
    // META pages get a transparent change/review panel, avoiding invented balance claims.
})();
