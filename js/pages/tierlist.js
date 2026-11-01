const board = document.getElementById("tierlist-board");
const warningTooltip = document.getElementById("warning-tooltip");
const confidenceLookup = new Map((window.FTC_META_RANKING?.data || []).map(item => [item.name, item]));
let scoreLookup = new Map();
let currentScoreDialog = null;
function openTierScore(unit, record) {
    if (!record) return;
    if (currentScoreDialog) currentScoreDialog.close();
    const model = window.FTC_META_TIERLIST;
    const mode = model?.getMode() || "overall";
    const modeName = model?.modeNames?.[mode] || "Overall Strength";
    const tier = Object.entries(TIER_ASSIGNMENTS).find(([, names]) => names.includes(unit.name))?.[0] || "—";
    const percent = Math.max(0, Math.min(100, (Number(record.score) || 0) * 100));
    const breakdown = [
        ["Wave clearing", record.stats?.wave],
        ["Boss damage", record.stats?.boss],
        ["Upgrade progression", record.stats?.progression],
        ["Range and reach", record.stats?.reach],
        ["Opening affordability", record.stats?.opening]
    ];
    if (mode === "night" || mode === "value") breakdown.push(["Selected Night budget", record.stats?.nightWave]);
    const overlay = document.createElement("div");
    overlay.className = "ftc-score-overlay";
    const panel = document.createElement("section");
    panel.className = "ftc-score-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "ftc-score-heading");
    const header = document.createElement("div");
    header.className = "ftc-score-header";
    const heading = document.createElement("div");
    const kicker = document.createElement("span");
    kicker.className = "ftc-score-kicker";
    kicker.textContent = `TIER ${tier} · ${modeName}`;
    const title = document.createElement("h2");
    title.id = "ftc-score-heading";
    title.textContent = unit.name;
    heading.append(kicker, title);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "ftc-score-close";
    close.setAttribute("aria-label", "Close score breakdown");
    close.textContent = "×";
    header.append(heading, close);
    const main = document.createElement("div");
    main.className = "ftc-score-main";
    const dial = document.createElement("div");
    dial.className = "ftc-score-dial";
    dial.style.setProperty("--score-fill", `${percent}%`);
    const dialInner = document.createElement("div");
    dialInner.className = "ftc-score-dial-inner";
    const value = document.createElement("strong");
    value.textContent = percent.toFixed(1);
    const suffix = document.createElement("span");
    suffix.textContent = "MODELED SCORE / 100";
    dialInner.append(value, suffix);
    dial.appendChild(dialInner);
    const bars = document.createElement("div");
    bars.className = "ftc-score-bars";
    breakdown.forEach(([label, rating]) => {
        const score = Math.max(0, Math.min(100, (Number(rating) || 0) * 100));
        const item = document.createElement("div");
        item.className = "ftc-score-metric";
        const labelRow = document.createElement("div");
        labelRow.className = "ftc-score-metric-label";
        const text = document.createElement("span");
        text.textContent = label;
        const figure = document.createElement("strong");
        figure.textContent = score.toFixed(0);
        labelRow.append(text, figure);
        const track = document.createElement("div");
        track.className = "ftc-score-track";
        track.setAttribute("role", "meter");
        track.setAttribute("aria-label", label);
        track.setAttribute("aria-valuemin", "0");
        track.setAttribute("aria-valuemax", "100");
        track.setAttribute("aria-valuenow", score.toFixed(0));
        const fill = document.createElement("span");
        fill.style.width = `${score}%`;
        track.appendChild(fill);
        item.append(labelRow, track);
        bars.appendChild(item);
    });
    main.append(dial, bars);
    const note = document.createElement("p");
    note.className = "ftc-score-note";
    const context = window.FTC_META_RANKING?.context?.();
    const preset = window.FTC_META_RANKING?.getRankingPreset?.() || "recommended";
    note.textContent = `Relative modeled ratings for ${modeName.toLowerCase()}${context ? ` · Game ${context.game} Night ${context.night} ${context.mode.toUpperCase()}` : ""} · ${preset} enchant assumption. These are comparisons with other units, not measured in-game damage or win rates.`;
    panel.append(header, main, note);
    overlay.appendChild(panel);
    const originalFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    const dismiss = () => {
        if (!overlay.isConnected) return;
        overlay.remove();
        document.body.style.overflow = oldOverflow;
        document.removeEventListener("keydown", keydown);
        currentScoreDialog = null;
        originalFocus?.isConnected && originalFocus.focus?.({ preventScroll: true });
    };
    const keydown = event => {
        if (event.key === "Escape") { event.preventDefault(); dismiss(); }
        if (event.key === "Tab") { event.preventDefault(); close.focus(); }
    };
    close.addEventListener("click", dismiss);
    overlay.addEventListener("click", event => { if (event.target === overlay) dismiss(); });
    document.addEventListener("keydown", keydown);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    currentScoreDialog = { close: dismiss };
    close.focus({ preventScroll: true });
}
function createUnitCard(unit) {
    const card = document.createElement("div");
    card.className =
        "tier-unit";
    const confidenceUnit = confidenceLookup.get(unit.name);
    const modeledConfidence = confidenceUnit && window.FTC_META_RANKING?.confidenceFor?.(confidenceUnit);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    const image = document.createElement("img");
    image.className =
        "tier-unit-image";
    image.src =
        unit.image;
    image.alt =
        unit.name;
    image.loading =
        "lazy";
    image.decoding = "async";
    card.appendChild(image);
    if (unitHasWarnings(unit)) {
        const warning = document.createElement("button");
        warning.type = "button";
        warning.className = "tier-unit-warning ftc-compact-warning";
        warning.textContent = "i";
        warning.setAttribute("aria-label", getUnitWarningText(unit));
        card.appendChild(warning);
        const warningText = getUnitWarningText(unit);
        function showWarning() {
            if (!warningTooltip)
                return;
            warningTooltip.textContent = warningText;
            warningTooltip.classList.add("visible");
            warningTooltip.setAttribute("aria-hidden", "false");
        }
        function hideWarning() {
            if (!warningTooltip)
                return;
            warningTooltip.classList.remove("visible");
            warningTooltip.setAttribute("aria-hidden", "true");
        }
        warning.addEventListener("mouseenter", showWarning);
        warning.addEventListener("mouseleave", hideWarning);
        warning.addEventListener("focus", showWarning);
        warning.addEventListener("blur", hideWarning);
        warning.addEventListener("click", event => {
            event.stopPropagation();
            showWarning();
            if (warningTooltip) {
                const rect = warning.getBoundingClientRect();
                warningTooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - warningTooltip.offsetWidth - 8, rect.left))}px`;
                warningTooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - warningTooltip.offsetHeight - 8, rect.bottom + 8))}px`;
            }
        });
    }
    const name = document.createElement("div");
    name.className =
        "tier-unit-name";
    name.textContent =
        unit.name;
    card.appendChild(name);
    const tierlist = window.FTC_META_TIERLIST;
    const record = scoreLookup.get(unit.name);
    if (tierlist && record) {
        card.setAttribute("aria-label", `${unit.name}. Open modeled ${tierlist.modeNames[tierlist.getMode()]} score breakdown.`);
        const hint = document.createElement("span");
        hint.className = "ftc-tier-score-hint";
        hint.textContent = "SCORE";
        const track = document.createElement("span");
        track.className = "ftc-tier-score-mini";
        const fill = document.createElement("span");
        fill.style.width = `${Math.max(0, Math.min(100, record.score * 100))}%`;
        track.appendChild(fill);
        card.append(hint, track);
        card.addEventListener("click", event => {
            if (event.target.closest(".tier-unit-warning")) return;
            openTierScore(unit, record);
        });
        card.addEventListener("keydown", event => {
            if (event.target !== card) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openTierScore(unit, record);
            }
        });
    }
    return card;
}
function renderTier(tier) {
    const row = document.createElement("section");
    row.className =
        `tier-row tier-${tier.toLowerCase()}`;
    /* =====================================================
       TIER LABEL
    ===================================================== */
    const label = document.createElement("div");
    label.className =
        "tier-label";
    const letter = document.createElement("div");
    letter.className =
        "tier-label-letter";
    letter.textContent =
        tier;
    const description = document.createElement("div");
    description.className =
        "tier-label-description";
    description.textContent =
        TIER_DESCRIPTIONS[tier] || "";
    label.appendChild(letter);
    label.appendChild(description);
    /* =====================================================
       UNIT CONTAINER
    ===================================================== */
    const unitsContainer = document.createElement("div");
    unitsContainer.className =
        "tier-units";
    /* =====================================================
       GET ASSIGNED UNIT NAMES
    ===================================================== */
    const assignedNames = TIER_ASSIGNMENTS[tier] || [];
    /* =====================================================
       FIND UNIT DATA
    ===================================================== */
    const tierUnits = assignedNames
        .map(name => findUnitByName(name))
        .filter(unit => unit);
    /* =====================================================
       EMPTY TIER
    ===================================================== */
    if (tierUnits.length === 0) {
        const empty = document.createElement("div");
        empty.className =
            "tier-empty";
        empty.textContent =
            "No units fall in this score band.";
        unitsContainer.appendChild(empty);
    }
    /* =====================================================
       RENDER UNITS
    ===================================================== */
    else {
        tierUnits.forEach(unit => {
            unitsContainer.appendChild(createUnitCard(unit));
        });
    }
    /* =====================================================
       BUILD ROW
    ===================================================== */
    row.appendChild(label);
    row.appendChild(unitsContainer);
    board.appendChild(row);
}
/* =========================================================
   RENDER EVERYTHING
========================================================= */
function renderTierlist() {
    if (!board) {
        console.error("Tierlist board was not found.");
        return;
    }
    board.innerHTML = "";
    scoreLookup = new Map((window.FTC_META_TIERLIST?.ranked() || []).map(row => [row.name, row]));
    TIER_ORDER.forEach(tier => {
        renderTier(tier);
    });
}
/* =========================================================
   WARNING TOOLTIP
========================================================= */
function hideWarningTooltip() {
    if (!warningTooltip) {
        return;
    }
    warningTooltip.classList.remove("visible");
    warningTooltip.setAttribute("aria-hidden", "true");
}
/* =========================================================
   WARNING FOLLOWS CURSOR
========================================================= */
document.addEventListener("mousemove", event => {
    if (!warningTooltip) {
        return;
    }
    if (!warningTooltip.classList.contains("visible")) {
        return;
    }
    const offset = 14;
    const tooltipWidth = warningTooltip.offsetWidth;
    const tooltipHeight = warningTooltip.offsetHeight;
    let x = event.clientX +
        offset;
    let y = event.clientY +
        offset;
    /* ---------------------------------------------
       RIGHT EDGE
    --------------------------------------------- */
    if (x + tooltipWidth >
        window.innerWidth - 8) {
        x =
            event.clientX -
                tooltipWidth -
                offset;
    }
    /* ---------------------------------------------
       BOTTOM EDGE
    --------------------------------------------- */
    if (y + tooltipHeight >
        window.innerHeight - 8) {
        y =
            event.clientY -
                tooltipHeight -
                offset;
    }
    warningTooltip.style.left =
        `${Math.max(8, x)}px`;
    warningTooltip.style.top =
        `${Math.max(8, y)}px`;
});
/* =========================================================
   INITIALIZE
========================================================= */
renderTierlist();
