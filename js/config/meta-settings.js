const FTC_META_SETTINGS = Object.freeze({
    referenceRange: 12,
    rangeWeightMin: 0.75,
    rangeWeightMax: 1.3,
    groupedTargetCounts: [1, 3, 5],
    targetCountWeights: [0.2, 0.5, 0.3],
    estimatedHitLimits: {
        single: 1,
        pierce: 2.5,
        toxic: 2.5,
        splash: 2.2,
        cone: 3,
        aoe: 4,
        support: 0,
        control: 0
    },
    closePlacementGap: 500,
    phaseInvestmentBudgets: {
        early: [150, 500, 1500, 3000],
        mid: [3000, 7500, 15000, 30000],
        late: [30000, 60000, 120000, 200000]
    },
    phaseBudgetWeights: {
        early: [0.3, 0.3, 0.25, 0.15],
        mid: [0.15, 0.3, 0.3, 0.25],
        late: [0.15, 0.25, 0.3, 0.3]
    },
    minimumBetterOpeningDps: 1.18,
    minimumBetterWavePotential: 1.1,
    tierWidths: [3, 6, 6, 5, 4],
    levelWeights: {
        damage: 0.06,
        hps: 0.06,
        dps: 0.14,
        range: 0.10,
        deployedDps: 0.13,
        dpsPerUpgradeCost: 0.10,
        dpsPerTotalCost: 0.12,
        incrementalDpsPerUpgradeCost: 0.07,
        radiusDamage: 0.16,
        scenarioDeployedDps: 0.06
    },
    teamRoles: [
        ["starter", "crowd", "boss", "support", "late"],
        ["starter", "crowd", "late", "control", "boss"],
        ["starter", "crowd", "crowd", "control", "support"],
        ["starter", "boss", "boss", "crowd", "support"],
        ["starter", "early", "crowd", "early", "late"]
    ],
    rankingModes: {
        "BEST STARTER": "starter",
        "BEST EARLY GAME": "early",
        "BEST MID GAME": "mid",
        "BEST LATE GAME": "late",
        "BEST 5TH UNIT": "fifth",
        "BEST DAMAGE": "damage",
        "BEST OVERALL": "overall",
        "BEST SUPPORT & CONTROL": "support"
    }
});
