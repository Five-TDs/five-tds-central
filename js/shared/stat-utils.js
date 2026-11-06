const RARITY_COLORS = Object.freeze({
    Common: "#AAAAAA",
    Uncommon: "#65FF01",
    Rare: "#0165FF",
    Epic: "#C801FF",
    Exclusive: "#FF0101",
    Legendary: "#FFD619"
});
function getRarityColor(rarity) {
    return RARITY_COLORS[rarity] || "#666666";
}
function getHPS(stat) {
    const hps = Number(stat?.cooldown);
    return Number.isFinite(hps) && hps > 0
        ? hps
        : 0;
}
function calculateDPS(damage, hps) {
    const dmg = Number(damage);
    const speed = Number(hps);
    if (!Number.isFinite(dmg) ||
        !Number.isFinite(speed) ||
        speed <= 0) {
        return 0;
    }
    return dmg * speed;
}
function formatHPS(value) {
    const hps = Number(value);
    if (!Number.isFinite(hps) || hps <= 0) {
        return "—";
    }
    return hps.toFixed(2).replace(/\.?0+$/, "");
}

function getTotalInvestment(unit, level = Infinity) {
    if (!unit || !Array.isArray(unit.stats)) return null;
    const placement = Number(unit.placement);
    if (!Number.isFinite(placement) || placement < 0) return null;
    let total = placement;
    for (const step of unit.stats) {
        const upgradeLevel = Number(step.level);
        if (upgradeLevel <= 1 || upgradeLevel > level) continue;
        const cost = Number(step.cost);
        if (!Number.isFinite(cost) || cost < 0) return null;
        total += cost;
    }
    return total;
}
function getEnchantedHPS(hps, attackSpeedModifier = 0) {
    const base = Number(hps);
    const modifier = Number(attackSpeedModifier);
    const interval = 1 + modifier / 100;
    if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(modifier) || interval <= 0) return null;
    return base / interval;
}
