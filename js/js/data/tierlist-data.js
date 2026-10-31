const TIER_DESCRIPTIONS = {
    "S": "Excellent performance across levels and roles",
    "A": "Strong progression and team value",
    "B": "Useful with complementary roles",
    "C": "Effective in the right circumstances",
    "D": "Narrower cost or coverage value",
    "F": "Limited relative efficiency",
    "U": "Utility: slows and range buffs"
};
const TIER_ORDER = [
    "S",
    "A",
    "B",
    "U",
    "C",
    "D",
    "F"
];
const TIER_ASSIGNMENTS = Object.fromEntries(TIER_ORDER.map(tier => [tier, []]));
