(function () {
    const engine = window.FTC_META_RANKING;
    if (!engine || !engine.cashByNight?.length)
        return;
    const header = document.querySelector(".best-units-header, .tierlist-header, .teams-header");
    if (!header)
        return;
    const panel = document.createElement("section");
    panel.className = "ftc-night-selector";
    panel.setAttribute("aria-label", "Night starting cash and META context");
    panel.innerHTML = '<div class="ftc-night-selector-intro"><strong>Night-aware recommendations</strong><span>Starter picks must fit the selected Night’s initial cash. Other rankings consider the full upgrade path.</span></div><div class="ftc-night-selector-controls"><label for="ftc-night-choice">NIGHT<select id="ftc-night-choice"></select></label><label for="ftc-mode-choice">MODE<select id="ftc-mode-choice"><option value="normal">Normal</option><option value="max">MAX</option></select></label><div class="ftc-cash-display" role="status" aria-live="polite"><span>STARTING CASH</span><strong id="ftc-current-night-cash">—</strong></div></div><p class="ftc-night-selector-footnote">Estimates from <a href="nights.html">Nights</a> and <a href="units.html">Units</a>. They do not include wave income, buffs, extra targets, or unlisted mechanics. · <a href="index.html#open-version-history">Version history</a></p><details class="ftc-meta-details"><summary>How the rankings are calculated</summary><p>Every unit’s placement cost, max placements, attack type, documented abilities, damage, HPS, DPS, range and upgrade costs are reviewed across its listed levels. Starter rankings only show units immediately affordable on the selected Night. Support and control units are evaluated by their listed effects, without invented DPS. Same-level comparisons use damage, HPS, DPS, range, upgrade costs, incremental DPS gained per dollar, DPS per total investment and maximum deployed DPS. Modeled group coverage uses 1, 3, 5, 10 and 20 enemy scenarios with adjustable hit likelihood by attack type. Enchantments are included in modeled rankings, while support buffs, exact enemy positions and real wave earnings are not measured. This is a comparison scenario, not measured targets hit or an exact DPS forecast. Nearby-cost alternatives are compared using the configured placement gap. The results combine recorded data and clearly stated modeling assumptions; verify decisions against game tests.</p></details>';
    header.after(panel);
    if (typeof engine.setRankingPreset === "function") {
        const controls = panel.querySelector(".ftc-night-selector-controls");
        const modelLabel = document.createElement("label");
        modelLabel.textContent = "RANKING ASSUMPTION";
        const modelSelect = document.createElement("select");
        modelSelect.id = "ftc-ranking-preset";
        modelSelect.setAttribute("aria-label", "Enchantment assumption used for META rankings");
        for (const [value, title] of [["none", "Unenchanted"], ["recommended", "Recommended enchant"], ["maximum", "Maximum potential"]]) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = title;
            modelSelect.appendChild(option);
        }
        modelLabel.appendChild(modelSelect);
        controls.appendChild(modelLabel);
        let savedPreset = "recommended";
        try { savedPreset = localStorage.getItem("ftc-meta-ranking-preset") || "recommended"; } catch { }
        if (!["none", "recommended", "maximum"].includes(savedPreset)) savedPreset = "recommended";
        modelSelect.value = savedPreset;
        engine.setRankingPreset(savedPreset);
        const rerender = () => {
            if (typeof renderTierlist === "function") renderTierlist();
            if (typeof renderBestUnits === "function") renderBestUnits();
            if (typeof renderTeams === "function") renderTeams();
            document.dispatchEvent(new CustomEvent("ftc:meta-night-change", { detail: engine.context() }));
        };
        modelSelect.addEventListener("change", () => {
            if (!engine.setRankingPreset(modelSelect.value)) return;
            try { localStorage.setItem("ftc-meta-ranking-preset", modelSelect.value); } catch { }
            rerender();
        });
    }
    const tierlist = window.FTC_META_TIERLIST;
    if (tierlist) {
        panel.querySelector(".ftc-night-selector-intro span").textContent = "Select Overall Strength for an across-Nights ranking, or Selected Night to factor in that Night's starting cash. Wave earnings are not assumed.";
        panel.querySelector(".ftc-night-selector-footnote").firstChild.textContent = "Night cash and unit stats come from the website data. Enemy group sizes, hit rates and investment budgets are modeling assumptions. ";
        const viewLabel = document.createElement("label");
        viewLabel.textContent = "TIERLIST FOCUS";
        const viewSelect = document.createElement("select");
        viewSelect.id = "ftc-tierlist-focus";
        for (const [value, title] of Object.entries(tierlist.modeNames)) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = title;
            viewSelect.appendChild(option);
        }
        viewLabel.appendChild(viewSelect);
        panel.querySelector(".ftc-night-selector-controls").appendChild(viewLabel);
        let initial = "overall";
        try { initial = localStorage.getItem("ftc-tierlist-focus") || initial; } catch { }
        if (!tierlist.setMode(initial)) tierlist.setMode("overall");
        viewSelect.value = tierlist.getMode();
        viewSelect.addEventListener("change", () => {
            if (!tierlist.setMode(viewSelect.value)) return;
            try { localStorage.setItem("ftc-tierlist-focus", viewSelect.value); } catch { }
            if (typeof renderTierlist === "function") renderTierlist();
        });
    }
    const nightInput = panel.querySelector("#ftc-night-choice"), modeInput = panel.querySelector("#ftc-mode-choice"), cashDisplay = panel.querySelector("#ftc-current-night-cash");
    const nights = [...new Map(engine.cashByNight.map(item => [`${item.game}:${item.night}`, item])).values()].sort((a, b) => a.game - b.game || a.night - b.night);
    nightInput.innerHTML = nights.map(item => `<option value="${item.game}:${item.night}">Game ${item.game} · Night ${item.night}</option>`).join("");
    const update = () => {
        const [game, night] = nightInput.value.split(":").map(Number);
        const mode = modeInput.value;
        if (!engine.setNight(game, night, mode))
            return;
        const chosen = engine.context();
        cashDisplay.textContent = "$" + chosen.cash.toLocaleString("en-US");
        try {
            localStorage.setItem("ftc-meta-night", JSON.stringify({ game, night, mode }));
        }
        catch { }
        if (typeof renderTierlist === "function")
            renderTierlist();
        if (typeof renderBestUnits === "function")
            renderBestUnits();
        if (typeof renderTeams === "function")
            renderTeams();
        document.dispatchEvent(new CustomEvent("ftc:meta-night-change", { detail: chosen }));
    };
    let chosen = engine.context();
    try {
        const saved = JSON.parse(localStorage.getItem("ftc-meta-night") || "null");
        if (saved && engine.cashByNight.some(item => item.game === saved.game && item.night === saved.night && item.mode === saved.mode))
            chosen = saved;
    }
    catch { }
    nightInput.value = `${chosen.game}:${chosen.night}`;
    modeInput.value = chosen.mode;
    nightInput.addEventListener("change", update);
    modeInput.addEventListener("change", update);
    update();
})();
