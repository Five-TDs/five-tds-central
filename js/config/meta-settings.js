const FTC_META_SETTINGS = Object.freeze({
    groupedTargetCounts: [1, 3, 5, 10, 20],
    targetCountWeights: [0.12, 0.20, 0.25, 0.25, 0.18],
    enemySpacing: 1.3,
    pathHitLikelihood: {
        single: 1,
        pierce: 0.8,
        toxic: 0.8,
        splash: 0.85,
        cone: 0.65,
        aoe: 0.95,
        support: 0,
        control: 0
    },
    tierScoreCutoffs: { S: 0.90, A: 0.80, B: 0.68, C: 0.56, D: 0.43 },
    rankingBlend: { base: 0.40, enchanted: 0.60 },
    roleSynergyAssumptions: { supportCoverage: 0.045, controlCoverage: 0.035, balancedAttacks: 0.035 },
    enchantAvailabilityPenalty: 0.10,
    simulatedWaveIncome: null,
    
    estimatedHitLimits: {
        single: 1,
        pierce: (range, spacing) => range / spacing,
        toxic: (range, spacing) => range / spacing,
        splash: 3,
        cone: (range, spacing) => (Math.PI * range ** 2) / (6 * spacing),
        aoe: (range, spacing) => (Math.PI * range ** 2) / spacing,
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
        dps: 0.15,
        range: 0.07,
        deployedDps: 0.14,
        dpsPerUpgradeCost: 0.10,
        dpsPerTotalCost: 0.12,
        incrementalDpsPerUpgradeCost: 0.10,
        radiusDamage: 0.20,
        scenarioDeployedDps: 0
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
