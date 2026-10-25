/* =========================================
   SHARED STAT UTILITIES
========================================= */

/*
    The database field "cooldown" stores
    Hits Per Second (HPS), not seconds.
*/

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

    if (
        !Number.isFinite(dmg) ||
        !Number.isFinite(speed) ||
        speed <= 0
    ) {
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