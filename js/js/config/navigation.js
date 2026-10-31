window.SITE_NAVIGATION = (() => {
    const DISCORD_URL = "https://discord.gg/7UPX3MT9TS";
    const NAV_ITEMS = [
        { label: "HOME", href: "index.html", key: "home" },
        { label: "DATABASE", key: "database", children: [
                { label: "UNITS", href: "units.html", key: "units" },
                { label: "NIGHTS", href: "nights.html", key: "nights" }
            ] },
        { label: "META", key: "meta", children: [
                { label: "TIERLIST", href: "tierlist.html", key: "tierlist" },
                { label: "BEST TOWERS", href: "best-towers.html", key: "best-towers" },
                { label: "TEAMS", href: "teams.html", key: "teams" }
            ] },
        { label: "TOOLS", key: "tools", children: [
                { label: "STATS SIMULATOR", href: "stats-simulator.html", key: "stats-simulator" },
                { label: "UNIT STAT LIST", href: "raw-dps.html", key: "raw-dps" }
            ] },
        { label: "DISCORD", href: DISCORD_URL, key: "discord", external: true },
        { label: "UPDATES", href: "updates.html", key: "updates" },
        { label: "FAQ & SUGGESTIONS", href: "faq.html", key: "faq" }
    ];
    return NAV_ITEMS;
})();
