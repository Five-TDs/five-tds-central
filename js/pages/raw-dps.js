const searchInput = document.getElementById("search-input");
const filterButton = document.getElementById("filter-button");
const filters = document.getElementById("filters");
const statBody = document.getElementById("dps-body");
const statHead = document.getElementById("stat-list-head");
const resultCount = document.getElementById("stat-list-count");
const rarityFilters = new Set();
const typeFilters = new Set();
let sortColumn = "maxDps";
let sortDirection = "desc";
const statSortPreferenceKey = "ftc-stat-list-sort-preference";

const columns = [
    { key: "name", label: "UNIT", type: "text" },
    { key: "rarity", label: "RARITY", type: "text" },
    { key: "type", label: "TYPE", type: "text" },
    { key: "placement", label: "PLACEMENT COST", type: "number", money: true },
    { key: "maxLimit", label: "MAX PLACED", type: "number" },
    { key: "level", label: "MAX LEVEL", type: "number" },
    { key: "hps", label: "HPS", type: "number" },
    { key: "range", label: "RANGE", type: "number" },
    { key: "damage", label: "DAMAGE", type: "number" },
    { key: "maxDps", label: "MAX DPS", type: "number" },
    { key: "investment", label: "TOTAL COST", type: "number", money: true },
    { key: "deployedDps", label: "DEPLOYED DPS*", type: "number" },
    { key: "efficiency", label: "DPS / $1K", type: "number" }
];

try {
    const saved = JSON.parse(localStorage.getItem(statSortPreferenceKey) || "null");
    if (saved && columns.some(column => column.key === saved.column) && ["asc", "desc"].includes(saved.direction)) {
        sortColumn = saved.column;
        sortDirection = saved.direction;
    }
} catch { }
const saveStatSortPreference = () => {
    try { localStorage.setItem(statSortPreferenceKey, JSON.stringify({ column: sortColumn, direction: sortDirection })); } catch { }
};
const resetStatSearch = () => {
    searchInput.value = "";
    rarityFilters.clear();
    typeFilters.clear();
    document.querySelectorAll(".rarity-option, .type-option").forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });
    renderRows();
    searchInput.focus();
};
const finite = value => value !== "" && value !== null && value !== undefined && Number.isFinite(Number(value));
const numberOrNull = value => finite(value) ? Number(value) : null;
const displayValue = (value, column) => {
    if (value === null || value === undefined || (typeof value === "number" && !Number.isFinite(value))) return "—";
    if (column.type === "text") return String(value);
    const rendered = Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
    return column.money ? `$${rendered}` : rendered;
};

function summarizeUnit(unit) {
    const levels = [...(unit.stats || [])].sort((a, b) => Number(a.level) - Number(b.level));
    const last = levels[levels.length - 1] || {};
    const damage = numberOrNull(last.damage);
    const hps = numberOrNull(last.cooldown);
    const range = numberOrNull(last.range);
    const levelDps = levels.map(step => {
        const d = numberOrNull(step.damage);
        const h = numberOrNull(step.cooldown);
        return d === null || h === null ? null : { dps: d * h, level: step.level };
    }).filter(Boolean);
    const bestLevel = levelDps.reduce((best, entry) => !best || entry.dps > best.dps ? entry : best, null);
    const maxDps = bestLevel?.dps ?? null;
    const placement = numberOrNull(unit.placement);
    const maxLimit = numberOrNull(unit.maxLimit);
    const investment = getTotalInvestment(unit);
    return {
        unit,
        name: unit.name,
        rarity: unit.rarity,
        type: last.type || unit.type || "—",
        placement,
        maxLimit,
        level: numberOrNull(last.level),
        hps,
        range,
        damage,
        maxDps,
        investment,
        deployedDps: maxDps === null || maxLimit === null ? null : maxDps * maxLimit,
        efficiency: maxDps === null || bestLevel === null ? null : maxDps * 1000 / Math.max(1, getTotalInvestment(unit, Number(bestLevel.level)) ?? 0)
    };
}

const records = units.map(summarizeUnit);

function sortRecords(a, b) {
    const left = a[sortColumn];
    const right = b[sortColumn];
    const leftMissing = left === null || left === undefined || left === "";
    const rightMissing = right === null || right === undefined || right === "";
    if (leftMissing !== rightMissing) return leftMissing ? 1 : -1;
    if (leftMissing && rightMissing) return a.name.localeCompare(b.name);
    const column = columns.find(item => item.key === sortColumn);
    const result = column.type === "text"
        ? String(left).localeCompare(String(right), undefined, { numeric: true })
        : Number(left) - Number(right);
    return (sortDirection === "asc" ? result : -result) || a.name.localeCompare(b.name);
}

function renderHeaders() {
    statHead.replaceChildren();
    const index = document.createElement("th");
    index.scope = "col";
    index.textContent = "#";
    index.className = "rank-column";
    statHead.appendChild(index);
    for (const column of columns) {
        const th = document.createElement("th");
        th.scope = "col";
        const active = column.key === sortColumn;
        th.setAttribute("aria-sort", active ? (sortDirection === "asc" ? "ascending" : "descending") : "none");
        th.className = `stat-sort-header${active ? " active" : ""}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "stat-sort-button";
        button.dataset.sort = column.key;
        button.setAttribute("aria-label", `Sort ${column.label}, ${active ? (sortDirection === "asc" ? "ascending" : "descending") : "choose column"}`);
        const label = document.createElement("span");
        label.textContent = column.label;
        const arrow = document.createElement("span");
        arrow.className = "stat-sort-arrow";
        arrow.textContent = active ? (sortDirection === "desc" ? "▼" : "▲") : "↕";
        button.append(label, arrow);
        button.addEventListener("click", () => {
            if (sortColumn === column.key) sortDirection = sortDirection === "desc" ? "asc" : "desc";
            else {
                sortColumn = column.key;
                sortDirection = column.type === "text" ? "asc" : "desc";
            }
            saveStatSortPreference();
            renderHeaders();
            renderRows();
        });
        th.appendChild(button);
        statHead.appendChild(th);
    }
}

function renderRows() {
    const text = searchInput.value.trim().toLowerCase();
    const filtered = records.filter(record => {
        if (!record.name.toLowerCase().includes(text)) return false;
        if (rarityFilters.size && !rarityFilters.has(record.rarity)) return false;
        if (typeFilters.size && !typeFilters.has(record.type) && !typeFilters.has(record.unit.type)) return false;
        return true;
    }).sort(sortRecords);
    statBody.replaceChildren();
    resultCount.textContent = `Showing ${filtered.length} of ${records.length} units`;
    if (!filtered.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = columns.length + 1;
        cell.className = "no-results";
        const empty = document.createElement("div");
        empty.className = "ftc-empty-state";
        const title = document.createElement("strong");
        title.textContent = "No matching units";
        const explanation = document.createElement("p");
        explanation.textContent = "Try another name, rarity, or attack type.";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ftc-empty-reset";
        button.textContent = "CLEAR SEARCH & FILTERS";
        button.addEventListener("click", resetStatSearch);
        empty.append(title, explanation, button);
        cell.appendChild(empty);
        row.appendChild(cell);
        statBody.appendChild(row);
        return;
    }
    filtered.forEach((record, index) => {
        const row = document.createElement("tr");
        const rank = document.createElement("td");
        rank.className = "rank";
        rank.textContent = index + 1;
        row.appendChild(rank);
        columns.forEach(column => {
            const cell = document.createElement("td");
            if (column.key === "name") {
                const link = document.createElement("a");
                link.className = `unit-name unit-name-${String(record.rarity).toLowerCase()}`;
                link.href = `unit.html?unit=${encodeURIComponent(record.name)}`;
                link.textContent = record.name;
                cell.appendChild(link);
            } else {
                cell.textContent = displayValue(record[column.key], column);
                if (column.key === "rarity") cell.classList.add(`unit-name-${String(record.rarity).toLowerCase()}`);
            }
            if (column.key === sortColumn) cell.classList.add("stat-sorted-value");
            if (record[column.key] === null) cell.classList.add("stat-unlisted");
            row.appendChild(cell);
        });
        statBody.appendChild(row);
    });
}

filterButton?.addEventListener("click", () => {
    const open = filters.classList.toggle("open");
    filterButton.classList.toggle("open", open);
    filterButton.setAttribute("aria-expanded", String(open));
});
for (const kind of ["rarity", "type"]) {
    const active = kind === "rarity" ? rarityFilters : typeFilters;
    document.querySelectorAll(`.${kind}-option`).forEach(button => {
        button.addEventListener("click", () => {
            if (active.has(button.dataset.value)) active.delete(button.dataset.value);
            else active.add(button.dataset.value);
            button.classList.toggle("active", active.has(button.dataset.value));
            button.setAttribute("aria-pressed", String(active.has(button.dataset.value)));
            renderRows();
        });
    });
}
searchInput?.addEventListener("input", renderRows);
renderHeaders();
renderRows();
