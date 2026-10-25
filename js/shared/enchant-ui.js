/* =========================================
   SHARED ENCHANT PRESENTATION
========================================= */

/*
    These are display colors, not enchant
    gameplay effects.

    Both existing page palettes are preserved.
*/

const ENCHANT_DISPLAY_COLORS = {
    bestTowers: {
        Battery: "#B4FFAA",
        Hunt: "#AAAAFF",
        Hook: "#FF8787",
        Eco: "#FFFA96",
        Haywire: "#8B5CF6",
        Springlock: "#98FFCC",
        Soul: "#14B8A6"
    },

    teams: {
        Battery: "#65c7ff",
        Hunt: "#79d66d",
        Hook: "#ff9860",
        Eco: "#f5ce55",
        Haywire: "#f06b68",
        Springlock: "#b18cff",
        Soul: "#e879f9"
    }
};

/* =========================================
   SHARED ENCHANT HELPERS
========================================= */

function getEnchantColor(enchantName, palette = "bestTowers") {
    if (!enchantName) return null;

    const colors = ENCHANT_DISPLAY_COLORS[palette];

    if (!colors) return null;

    return colors[enchantName] || null;
}

function getEnchantClass(enchantName, prefix) {
    if (!enchantName || !prefix) return "";

    return prefix + enchantName.toLowerCase();
}

function getEnchantLabel(enchantName) {
    return enchantName
        ? String(enchantName).toUpperCase()
        : "";
}