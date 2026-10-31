const TEAM_COMPOSITIONS = [
    "BEST SOLO TEAM",
    "BEST ENDLESS TEAM",
    "BEST CROWD CONTROL TEAM",
    "BEST BOSS KILLER TEAM",
    "BEST SPEEDRUN TEAM"
].map(title => ({
    title,
    description: "",
    units: [],
    substitutes: [],
    enchants: [],
    substituteEnchants: [],
    explanation: ""
}));
