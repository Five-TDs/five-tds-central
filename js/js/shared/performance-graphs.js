(function () {
    const metrics = [
        { key: "dps", label: "DPS", unit: "DPS" },
        { key: "damage", label: "Damage", unit: "damage" },
        { key: "hps", label: "HPS", unit: "hits/sec" },
        { key: "range", label: "Range", unit: "range" },
        { key: "deployed", label: "Deploy DPS*", unit: "DPS estimate" },
        { key: "rangeBuff", label: "Range buff %", unit: "percent" },
        { key: "slow", label: "Slow strength %", unit: "percent" },
        { key: "efficiency", label: "DPS / $1k", unit: "DPS per $1,000" },
        { key: "investment", label: "Investment", unit: "cash" }
    ];
    const valid = value => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
    const format = value => Number.isFinite(value) ? Number(value.toFixed(3)).toLocaleString("en-US", { maximumFractionDigits: 3 }) : "—";
    const svgElement = (tag, attributes = {}, text = "") => {
        const item = document.createElementNS("http://www.w3.org/2000/svg", tag);
        Object.entries(attributes).forEach(([key, value]) => item.setAttribute(key, String(value)));
        if (text)
            item.textContent = text;
        return item;
    };
    const levelsOf = unit => {
        let investment = Number(unit.placement) || 0;
        return [...(unit.stats || [])].sort((a, b) => Number(a.level) - Number(b.level)).map((step, index) => {
            if (index)
                investment += Number(step.cost) || 0;
            const damage = valid(step.damage) ? Number(step.damage) : null;
            const hps = valid(step.cooldown) ? Number(step.cooldown) : null;
            const range = valid(step.range) ? Number(step.range) : null;
            const dps = damage !== null && hps !== null ? damage * hps : null;
            return { level: Number(step.level) || index + 1, damage, hps, range, dps,
                deployed: dps === null ? null : dps * Math.max(1, Number(unit.maxLimit) || 1),
                rangeBuff: valid(step.rangeBuff) ? (Number(step.rangeBuff) - 1) * 100 : null,
                slow: valid(step.slow) ? (1 - Number(step.slow)) * 100 : null,
                investment, efficiency: dps === null ? null : dps * 1000 / Math.max(1, investment) };
        });
    };
    const mount = (container, unit, opts = {}) => {
        if (!container || !unit || !Array.isArray(unit.stats) || !unit.stats.length)
            return;
        const levels = levelsOf(unit);
        let metric = opts.metric && metrics.some(item => item.key === opts.metric) ? opts.metric : levelsOf(unit).some(level => level.dps !== null) ? "dps" : levelsOf(unit).some(level => level.rangeBuff !== null) ? "rangeBuff" : levelsOf(unit).some(level => level.slow !== null) ? "slow" : "range";
        container.classList.add("ftc-performance");
        container.replaceChildren();
        const title = document.createElement("div");
        title.className = "ftc-performance-heading";
        const header = document.createElement("h3");
        header.textContent = "UPGRADE PERFORMANCE";
        const context = document.createElement("span");
        context.className = "ftc-performance-context";
        context.textContent = unit.name;
        title.append(header, context);
        const toolbar = document.createElement("div");
        toolbar.className = "ftc-performance-metrics";
        toolbar.setAttribute("role", "group");
        toolbar.setAttribute("aria-label", "Choose graph statistic");
        const buttons = metrics.filter(item => !["rangeBuff", "slow"].includes(item.key) || levels.some(level => level[item.key] !== null)).map(item => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = item.label;
            button.dataset.metric = item.key;
            button.addEventListener("click", () => { metric = item.key; selectedLevel = null; render(); });
            toolbar.appendChild(button);
            return button;
        });
        const plot = document.createElement("div");
        plot.className = "ftc-performance-plot";
        const summary = document.createElement("div");
        summary.className = "ftc-performance-summary";
        summary.setAttribute("aria-live", "polite");
        const accessible = document.createElement("div");
        accessible.className = "ftc-performance-accessible";
        const footnote = document.createElement("p");
        footnote.className = "ftc-note";
        footnote.textContent = "*Deployed DPS assumes the maximum listed placements can all attack one target continuously. Multi-target hits, buffs and status damage are not added.";
        const chosen = document.createElement("div");
        chosen.className = "ftc-performance-selected";
        chosen.setAttribute("aria-live", "polite");
        chosen.textContent = "Select a graph point to see its exact value.";
        let selectedLevel = null;
        container.append(title, toolbar, plot, chosen, summary, footnote, accessible);
        const render = () => {
            buttons.forEach(button => { const active = button.dataset.metric === metric; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
            plot.replaceChildren();
            const values = levels.map(row => row[metric]);
            const numbers = values.filter(valid).map(Number);
            if (!numbers.length) {
                const empty = document.createElement("p");
                empty.className = "ftc-note";
                empty.textContent = "This unit has no numerical data for the selected statistic. Support effects cannot be converted into DPS without more information.";
                plot.appendChild(empty);
                summary.textContent = "";
                chosen.textContent = "No recorded value for this statistic.";
                accessible.textContent = "";
                return;
            }
            const metricInfo = metrics.find(item => item.key === metric);
            const max = Math.max(1, ...numbers);
            const min = Math.min(0, ...numbers);
            const w = 740, h = 290, left = 64, right = 18, top = 18, bottom = 48;
            const chartWidth = w - left - right, chartHeight = h - top - bottom;
            const x = index => left + (levels.length === 1 ? chartWidth / 2 : index * chartWidth / (levels.length - 1));
            const y = value => top + chartHeight - (value - min) / (max - min || 1) * chartHeight;
            const svg = svgElement("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": `${unit.name} ${metricInfo.label} across upgrade levels`, preserveAspectRatio: "xMidYMid meet" });
            const bg = svgElement("rect", { x: left, y: top, width: chartWidth, height: chartHeight, rx: 4, class: "ftc-performance-background" });
            svg.appendChild(bg);
            for (let tick = 0; tick <= 4; tick++) {
                const value = min + (max - min) * tick / 4;
                const cy = y(value);
                svg.append(svgElement("line", { x1: left, y1: cy, x2: w - right, y2: cy, class: "ftc-performance-grid" }));
                svg.append(svgElement("text", { x: left - 10, y: cy + 4, "text-anchor": "end", class: "ftc-performance-axis" }, format(value)));
            }
            levels.forEach((row, index) => svg.append(svgElement("text", { x: x(index), y: h - 19, "text-anchor": "middle", class: "ftc-performance-axis" }, `LVL ${row.level}`)));
            let segment = [];
            const addSegment = () => {
                if (segment.length) {
                    const points = segment.map(item => `${x(item.index)},${y(item.value)}`).join(" ");
                    svg.appendChild(svgElement("polyline", { points, fill: "none", stroke: "#b4fcff", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }));
                    segment = [];
                }
            };
            values.forEach((value, index) => { if (!valid(value))
                addSegment();
            else
                segment.push({ value: Number(value), index }); });
            addSegment();
            levels.forEach((row, index) => {
                const value = values[index];
                if (!valid(value))
                    return;
                const dot = svgElement("circle", { cx: x(index), cy: y(Number(value)), r: 7, fill: "#f06b68", stroke: "#ffffff", "stroke-width": 1.5, tabindex: 0, role: "button", class: "ftc-performance-point", "aria-label": `Show level ${row.level} ${metricInfo.label} value: ${format(Number(value))}` });
                dot.appendChild(svgElement("title", {}, `Level ${row.level}: ${format(Number(value))} ${metricInfo.unit}`));
                const reveal = () => {
                    selectedLevel = row.level;
                    svg.querySelectorAll(".ftc-performance-callout, .ftc-performance-point-ring").forEach(item => item.remove());
                    const exact = format(Number(value));
                    const pointX = x(index);
                    const pointY = y(Number(value));
                    const width = Math.max(76, exact.length * 10 + 22);
                    const labelX = Math.max(left + width / 2, Math.min(w - right - width / 2, pointX));
                    const labelY = pointY - 44 < top ? pointY + 16 : pointY - 44;
                    const ring = svgElement("circle", { cx: pointX, cy: pointY, r: 11, fill: "none", stroke: "#b4fcff", "stroke-width": 2, class: "ftc-performance-point-ring" });
                    const bubble = svgElement("g", { class: "ftc-performance-callout", "aria-hidden": "true" });
                    bubble.append(svgElement("rect", { x: labelX - width / 2, y: labelY, width, height: 31, rx: 7, fill: "#20313b", stroke: "#b4fcff", "stroke-width": 1.5 }));
                    bubble.append(svgElement("text", { x: labelX, y: labelY + 21, "text-anchor": "middle", class: "ftc-performance-value-label" }, exact));
                    svg.append(ring, bubble);
                    chosen.textContent = `Level ${row.level} · ${metricInfo.label}: ${exact} ${metricInfo.unit}`;
                };
                dot.addEventListener("click", reveal);
                dot.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); reveal(); }
                });
                svg.appendChild(dot);
                if (selectedLevel === row.level) requestAnimationFrame(reveal);
            });
            plot.appendChild(svg);
            if (selectedLevel === null) chosen.textContent = "Select a graph point to see its exact value.";
            const first = levels.find(row => valid(row[metric])), last = [...levels].reverse().find(row => valid(row[metric]));
            const change = Number(last[metric]) - Number(first[metric]);
            summary.textContent = `Level ${first.level}: ${format(Number(first[metric]))}  ·  Level ${last.level}: ${format(Number(last[metric]))}  ·  Change: ${change >= 0 ? "+" : ""}${format(change)} ${metricInfo.unit}`;
            accessible.textContent = levels.map(row => `Level ${row.level}: ${valid(row[metric]) ? format(Number(row[metric])) : "not listed"}`).join(" · ");
        };
        render();
        return { updateUnit: next => mount(container, next, { metric }) };
    };
    window.FTC_PERFORMANCE = { mount, levelsOf, metrics };
    const initialize = () => {
        const simulator = document.querySelector(".simulator-page .stats-section");
        if (simulator) {
            const container = document.createElement("section");
            container.id = "ftc-simulator-performance";
            container.className = "ftc-performance-section";
            simulator.after(container);
            const update = () => {
                const unit = typeof selectedUnit !== "undefined" ? selectedUnit : null;
                if (unit)
                    mount(container, unit);
                else
                    container.replaceChildren();
            };
            document.getElementById("unit-grid")?.addEventListener("click", () => requestAnimationFrame(update));
            document.getElementById("unit-search")?.addEventListener("input", () => requestAnimationFrame(update));
            document.getElementById("rarity-select")?.addEventListener("change", () => requestAnimationFrame(update));
            update();
        }
        const detail = document.querySelector(".unit-page #stats-content");
        if (detail) {
            const selected = typeof unit !== "undefined" ? unit : null;
            if (selected) {
                const container = document.createElement("section");
                container.className = "ftc-performance-section";
                detail.appendChild(container);
                mount(container, selected);
            }
        }
    };
    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", initialize);
    else
        initialize();
})();
