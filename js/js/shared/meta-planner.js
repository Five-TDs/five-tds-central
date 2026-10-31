(function () {
    const engine = window.FTC_META_RANKING;
    const container = document.getElementById("teams-container");
    if (!engine?.modelNight || !container) return;
    const section = document.createElement("details");
    section.className = "ftc-night-planner";
    section.innerHTML = `<summary>Optional Night economy planner</summary>
        <p>Try an estimated income per wave and see what your recommended team could afford. Only starting cash and wave count come from the Nights Database.</p>
        <form class="ftc-planner-form">
            <label>Recommended team <select name="team"></select></label>
            <label>Estimated cash earned per wave <input name="income" type="number" min="0" step="1" inputmode="numeric" placeholder="Unknown / $0 assumed"></label>
            <label>Optional enemy health <input name="health" type="number" min="1" step="1" inputmode="numeric" placeholder="Not recorded"></label>
            <button type="submit">Calculate scenario</button>
        </form>
        <div class="ftc-planner-results" aria-live="polite"></div>
        <p class="ftc-note">This is a spending scenario, not a live-game wave simulator. Per-wave income, enemy health, actual hit counts and buff behavior must be supplied or verified separately.</p>`;
    container.after(section);
    const form = section.querySelector("form");
    const results = section.querySelector(".ftc-planner-results");
    const select = form.elements.team;
    const escape = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const money = value => "$" + Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
    function refreshOptions() {
        const previous = select.value;
        select.replaceChildren();
        TEAM_COMPOSITIONS.forEach((team, index) => {
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent = team.title;
            select.appendChild(option);
        });
        if (previous && Number(previous) < TEAM_COMPOSITIONS.length) select.value = previous;
    }
    function run() {
        const chosen = TEAM_COMPOSITIONS[Number(select.value) || 0];
        const income = form.elements.income.value.trim();
        const health = form.elements.health.value.trim();
        const result = engine.modelNight({
            ...engine.context(), lineup: chosen?.units || [],
            waveIncome: income === "" ? null : Number(income),
            enemyHealth: health === "" ? null : Number(health),
            enchantment: engine.getRankingPreset()
        });
        if (!result) {
            results.textContent = "Night data isn't available for this selection.";
            return;
        }
        results.innerHTML = `<div class="ftc-planner-summary"><strong>${result.waveCount} waves · ${money(result.startingCash)} starting cash</strong><span>${result.incomeProvided ? "User-entered income scenario" : "No wave income supplied; assumes no additional cash"}</span></div>
            <div class="ftc-table-wrap"><table><thead><tr><th>Wave</th><th>Purchases</th><th>Estimated group DPS</th><th>Cash after purchases</th></tr></thead><tbody>
            ${result.timeline.map(row => `<tr><th>${row.wave}</th><td>${row.purchased.length ? row.purchased.map(escape).join(", ") : "None"}</td><td>${row.modeledGroupDps.toLocaleString("en-US")}</td><td>${money(row.bankAfterPurchases)}</td></tr>`).join("")}</tbody></table></div>`;
    }
    form.addEventListener("submit", event => { event.preventDefault(); run(); });
    document.addEventListener("ftc:meta-night-change", () => { refreshOptions(); if (section.open) run(); });
    refreshOptions();
})();
