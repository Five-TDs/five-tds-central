// EXAMPLE UNIT PLACEHOLDER
//    {
//        name: "",
//        rarity: "",
//        type: "",
//        image: "images/.png",
//        
//        placement: ,
//        maxLimit: ,
//
//       obtainment: "- ",
//
//       stats: [
//
//           {
//                level: ,
//                
//                damage: ,
//                cooldown: ,
//                range: ,
//                type: "",
//                rangeBuff: ,
//                damageBuff: ,
//                cooldownBuff: ,
//                slow: ,
//                passives: [
//                  ""
//                ]
//           },
//
//       ]
//    },

const units = [

// COMMONS

    {
        name: "Toy Freddy",
        rarity: "Common",
        type: "Single",
        image: "images/toyfreddy.png",
        
        placement: 350,
        maxLimit: 2,

        obtainment: "- 50% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 20,
                cooldown: 1,
                range: 7,
                type: "Single"
            },

            {
                level:  2,
                cost: 500,
                damage: 22,
                cooldown: 1.1,
                range: 8,
                type: "Single"
            },

            {
                level: 3,
                cost: 800,
                damage: 25,
                cooldown: 1.2,
                range: 9,
                type: "Single"
            }

        ]
    },

    {
        name: "Endo 01",
        rarity: "Common",
        type: "Single",
        image: "images/endo01.png",
        
        placement: 50,
        maxLimit: 4,

        obtainment: "- 50% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 6,
                cooldown: 1,
                range: 5,
                type: "Single"
            },

            {
                level: 2,
                cost: 75,
                damage: 7,
                cooldown: 1.1,
                range: 6,
                type: "Single"
            },

            {
                level: 3,
                cost: 175,
                damage: 8,
                cooldown: 1.2,
                range: 8,
                type: "Single"
            },

            {
                level: 4,
                cost: 450,
                damage: 10,
                cooldown: 1.3,
                range: 8,
                type: "Single"
            }

        ]
    },

    {
        name: "Chica",
        rarity: "Common",
        type: "Pierce",
        image: "images/chica.png",
        
        placement: 200,
        maxLimit: 2,

        obtainment: "- 50% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 20,
                cooldown: 0.5,
                range: 7,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 300,
                damage: 22,
                cooldown: 0.6,
                range: 8,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 600,
                damage: 25,
                cooldown: 0.8,
                range: 9,
                type: "Pierce"
            }

        ]
    },

    {
        name: "Balloon Boy",
        rarity: "Common",
        type: "Pierce",
        image: "images/balloonboy.png",
        
        placement: 100, 
        maxLimit: 3,

        obtainment: "- 50% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 14,
                cooldown: 0.8,
                range: 6,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 200,
                damage: 16,
                cooldown: 0.9,
                range: 7,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 400,
                damage: 18,
                cooldown: 1,
                range: 8,
                type: "Pierce"
            }

        ]
    },

// UNCOMMONS

    {
        name: "Withered Chica",
        rarity: "Uncommon",
        type: "Range Booster",
        image: "images/witheredchica.png",
        
        placement: 400,
        maxLimit: 2,

        obtainment: "- 30% Chance from summons",

        passives: [
                    "Buffs the range of all units within this unit's range by the listed multiplier"
        ],

        stats: [

            {
                level: 1,
                range: 12,
                type: "Range Buff",
                rangeBuff: 1.05
            },

            {
                level: 2,
                cost: 800,
                range: 13,
                type: "Range Buff",
                rangeBuff: 1.08
            },

            {
                level: 3,
                cost: 1600,
                range: 14,
                type: "Range Buff",
                rangeBuff: 1.11
            },

            {
                level: 4,
                cost: 3500,
                range: 15,
                type: "Range Buff",
                rangeBuff: 1.15
            }

        ]
    },

    {
        name: "Toy Bonnie",
        rarity: "Uncommon",
        type: "Single",
        image: "images/toybonnie.png",
        
        placement: 600,
        maxLimit: 4,

        obtainment: "- 30% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 13,
                cooldown: 2,
                range: 9,
                type: "Single"
            },

            {
                level: 2,
                cost: 900,
                damage: 14,
                cooldown: 2.1,
                range: 10,
                type: "Single"
            },

            {
                level: 3,
                cost: 1600,
                damage: 15,
                cooldown: 2.2,
                range: 12,
                type: "Single"
            }

        ]
    },

    {
        name: "Endo 02",
        rarity: "Uncommon",
        type: "Slower",
        image: "images/endo02.png",
        
        placement: 500,
        maxLimit: 2,

        obtainment: "- 30% Chance from summons",

        passives: [
                    "Slows all enemies within this unit's range by the listed multiplier"
        ],

        stats: [

            {
                level: 1,
                range: 12,
                type: "Slower",
                slow: 0.9
            },

            {
                level: 2,
                cost: 1000,
                range: 13,
                type: "slower",
                slow: 0.87
            },

            {
                level: 3,
                cost: 2000,
                range: 14,
                type: "slower",
                slow: 0.84
            },

            {
                level: 4,
                cost: 4000,
                range: 15,
                type: "slower",
                slow: 0.8
            }

        ]
    },

    {
        name: "Bonnie",
        rarity: "Uncommon",
        type: "Splash",
        image: "images/bonnie.png",
        
        placement: 450,
        maxLimit: 3,

        obtainment: "- 30% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 20,
                cooldown: 0.8,
                range: 8.5,
                type: "Single"
            },

            {
                level: 2,
                cost: 800,
                damage: 23,
                cooldown: 0.9,
                range: 9,
                type: "Single"
            },

            {
                level: 3,
                cost: 1350,
                damage: 25,
                cooldown: 1,
                range: 9.5,
                type: "Single"
            },

            {
                level: 4,
                cost: 2000,
                damage: 28,
                cooldown: 1.1,
                range: 10,
                type: "Single"
            }

        ]
    },

// RARES

    {
        name: "Withered Freddy",
        rarity: "Rare",
        type: "AOE",
        image: "images/witheredfreddy.png",
        
        placement: 800,
        maxLimit: 2,

        obtainment: "- 15% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 20,
                cooldown: 1.1,
                range: 12,
                type: "AOE"
            },

            {
                level: 2,
                cost: 1600,
                damage: 22,
                cooldown: 1.2,
                range: 13,
                type: "AOE"
            },

            {
                level: 3,
                cost: 2400,
                damage: 25,
                cooldown: 1.2,
                range: 14,
                type: "AOE"
            },

            {
                level: 4,
                cost: 4000,
                damage: 30,
                cooldown: 1.3,
                range: 15,
                type: "AOE"
            }

        ]
    },

    {
        name: "Withered Bonnie",
        rarity: "Rare",
        type: "Splash",
        image: "images/witheredbonnie.png",
        
        placement: 1250,
        maxLimit: 2,

        obtainment: "- 15% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 30,
                cooldown: 1,
                range: 12,
                type: "Splash"
            },

            {
                level: 2,
                cost: 2500,
                damage: 33,
                cooldown: 1.1,
                range: 13,
                type: "Splash"
            },

            {
                level: 3,
                cost: 5000,
                damage: 36,
                cooldown: 1.2,
                range: 14,
                type: "Splash"
            },

            {
                level: 4,
                cost: 10000,
                damage: 40,
                cooldown: 1.3,
                range: 15,
                type: "Splash"
            }

        ]
    },

    {
        name: "Toy Chica",
        rarity: "Rare",
        type: "Cone",
        image: "images/toychica.png",
        
        placement: 750,
        maxLimit: 2,

        obtainment: "- 15% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 25,
                cooldown: 0.6,
                range: 9,
                type: "Cone"
            },

            {
                level: 2,
                cost: 1500,
                damage: 27,
                cooldown: 0.7,
                range: 9,
                type: "Cone"
            },

            {
                level: 3,
                cost: 2250,
                damage: 31,
                cooldown: 0.8,
                range: 9,
                type: "Cone"
            },

            {
                level: 4,
                cost: 4500,
                damage: 35,
                cooldown: 0.9,
                range: 11,
                type: "Cone"
            }



        ]
    },

    {
        name: "Foxy",
        rarity: "Rare",
        type: "Single",
        image: "images/foxy.png",
        
        placement: 500,
        maxLimit: 4,

        obtainment: "- 15% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 14,
                cooldown: 2,
                range: 7,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 1000,
                damage: 15,
                cooldown: 2.1,
                range: 8,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 2500,
                damage: 17,
                cooldown: 2.2,
                range: 9,
                type: "Pierce"
            }

        ]
    },

// EPICS

    {
        name: "Withered Foxy",
        rarity: "Epic",
        type: "Cone",
        image: "images/witheredfoxy.png",
        
        placement: 900,
        maxLimit: 4,

        obtainment: "- 5% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 25,
                cooldown: 1.3,
                range: 7,
                type: "Cone"
            },

            {
                level: 2,
                cost: 1800,
                damage: 30,
                cooldown: 1.4,
                range: 8,
                type: "Cone"
            },

            {
                level: 3,
                cost: 4000,
                damage: 40,
                cooldown: 1.4,
                range: 9,
                type: "Cone"
            },

            {
                level: 4,
                cost: 9000,
                damage: 50,
                cooldown: 1.5,
                range: 10,
                type: "Cone"
            }

        ]
    },

    {
        name: "Purple Guy",
        rarity: "Epic",
        type: "Pierce",
        image: "images/purpleguy.png",
        
        placement: 1000,
        maxLimit: 4,

        obtainment: "- Unit Quests: 'Don't Leave Me Here'. Complete Game 1",

        stats: [

            {
                level: 1,
                damage: 80,
                cooldown: 0.6,
                range: 12,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 2500,
                damage: 90,
                cooldown: 0.7,
                range: 13,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 5000,
                damage: 100,
                cooldown: 0.8,
                range: 14,
                type: "Pierce"
            },

            {
                level: 4,
                cost: 12500,
                damage: 110,
                cooldown: 0.9,
                range: 15,
                type: "Pierce"
            }

        ]
    },

    {
        name: "Old Man Consequences",
        rarity: "Epic",
        type: "Splash",
        image: "images/oldmanconsequences.png",
        
        placement: 2500,
        maxLimit: 1,

        obtainment: "- Unit Quests: 'Tier 1 - Fazbear Employee'. Reach 2000 total waves",

        stats: [

            {
                level: 1,
                damage: 80,
                cooldown: 1.3,
                range: 14,
                type: "Splash"
            },

            {
                level: 2,
                cost: 5000,
                damage: 85,
                cooldown: 1.4,
                range: 15,
                type: "Splash"
            },

            {
                level: 3,
                cost: 10000,
                damage: 95,
                cooldown: 1.4,
                range: 16,
                type: "Splash"
            },

            {
                level: 4,
                cost: 25000,
                damage: 105,
                cooldown: 1.5,
                range: 17,
                type: "Splash"
            }

        ]
    },

    {
        name: "Mangle",
        rarity: "Epic",
        type: "Pierce",
        image: "images/mangle.png",
        
        placement: 75,
        maxLimit: 4,

        obtainment: "- 5% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 10,
                cooldown: 1.1,
                range: 6,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 250,
                damage: 13,
                cooldown: 1.2,
                range: 6,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 400,
                damage: 17,
                cooldown: 1.2,
                range: 7,
                type: "Pierce"
            },

            {
                level: 4,
                cost: 1000,
                damage: 21,
                cooldown: 1.3,
                range: 7,
                type: "Pierce"
            },

            {
                level: 5,
                cost: 1650,
                damage: 25,
                cooldown: 1.3,
                range: 8,
                type: "Pierce"
            }

        ]
    },

    {
        name: "Freddy",
        rarity: "Epic",
        type: "Single",
        image: "images/freddy.png",
        
        placement: 1500,
        maxLimit: 2,

        obtainment: "- 5% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 120,
                cooldown: 1.3,
                range: 12,
                type: "Single"
            },

            {
                level: 2,
                cost: 2500,
                damage: 140,
                cooldown: 1.4,
                range: 13,
                type: "Single"
            },

            {
                level: 3,
                cost: 5000,
                damage: 180,
                cooldown: 1.4,
                range: 14,
                type: "Single"
            },

            {
                level: 4,
                cost: 1000,
                damage: 225,
                cooldown: 1.5,
                range: 15,
                type: "Single"
            }

        ]
    },

    {
        name: "Crying Child",
        rarity: "Epic",
        type: "Pierce",
        image: "images/cryingchild.png",
        
        placement: 150,
        maxLimit: 5,

        obtainment: "- Unit Quests: 'Was That The..'.   Beat wave 87 in Game 1 Endless (Normal)",

        stats: [

            {
                level: 1,
                damage: 14,
                cooldown: 0.9,
                range: 7,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 1500,
                damage: 25,
                cooldown: 1.1,
                range: 8,
                type: "Pierce"
            }

        ]
    },

// EXCLUSIVES

    {
        name: "Fastbear",
        rarity: "Exclusive",
        type: "Single",
        image: "images/fastbear.png",
        
        placement: 900,
        maxLimit: 2,

        obtainment: "- Unobtainable (THIS UNITS STATS MAY BE INACCURATE)",

        stats: [

            {
                level: 1,
                damage: 275,
                cooldown: 0.5,
                range: 13,
                type: "Single"
            },

            {
                level: 2,
                cost: 2250,
                damage: 325,
                cooldown: 0.5,
                range: 14,
                type: "Single"
            },

            {
                level: 3,
                cost: 4500,
                damage: 500,
                cooldown: 0.5,
                range: 16,
                type: "Single"
            }

        ]
    },

    {
        name: "Radioactive Foxy",
        rarity: "Exclusive",
        type: "Toxic Pierce",
        image: "images/radioactivefoxy.png",
        
        placement: 1000,
        maxLimit: 4,

        obtainment: "- Limited unit in lobby for $2500",

        stats: [

            {
                level: 1,
                damage: 18,
                cooldown: 2,
                range: 7,
                type: "Toxic Pierce"
            },

            {
                level: 2,
                cost: 2000,
                damage: 22,
                cooldown: 2.1,
                range: 8,
                type: "Toxic Pierce"
            },

            {
                level: 3,
                cost: 5000,
                damage: 26,
                cooldown: 2.2,
                range: 9,
                type: "Toxic Pierce"
            }

        ]
    },

// LEGENDARIES

    {
        name: "The Marionette",
        rarity: "Legendary",
        type: "Splash",
        image: "images/marionette.png",
        
        placement: 5000,
        maxLimit: 1,

        obtainment: "- 1% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 200,
                cooldown: 0.8,
                range: 23,
                type: "Splash"
            },

            {
                level: 2,
                cost: 10000,
                damage: 210,
                cooldown: 0.8,
                range: 23,
                type: "Splash"
            },

            {
                level: 3,
                cost: 20000,
                damage: 230,
                cooldown: 0.9,
                range: 24,
                type: "Splash"
            },

            {
                level: 4,
                cost: 30000,
                damage: 260,
                cooldown: 0.9,
                range: 24,
                type: "Splash"
            },

            {
                level: 5,
                cost: 65000,
                damage: 300,
                cooldown: 1,
                range: 25,
                type: "Splash"
            }

        ]
    },

    {
        name: "Shadow Freddy",
        rarity: "Legendary",
        type: "Cone",
        image: "images/shadowfreddy.png",
        
        placement: 2000,
        maxLimit: 3,

        obtainment: "- 1% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 100,
                cooldown: 1,
                range: 14,
                type: "Cone"
            },

            {
                level: 2,
                cost: 4000,
                damage: 115,
                cooldown: 16,
                range: 1.1,
                type: "Cone"
            },

            {
                level: 3,
                cost: 8500,
                damage: 135,
                cooldown: 1.2,
                range: 18,
                type: "Cone"
            },

            {
                level: 4,
                cost: 18000,
                damage: 160,
                cooldown: 1.2,
                range: 20,
                type: "Cone"
            }

        ]
    },

    {
        name: "Shadow Bonnie",
        rarity: "Legendary",
        type: "Single",
        image: "images/shadowbonnie.png",
        
        placement: 2500,
        maxLimit: 2,

        obtainment: "- Limited unit, 1% chance from daily rolls",

        stats: [

            {
                level: 1,
                damage: 105,
                cooldown: 2,
                range: 9,
                type: "Single"
            },

            {
                level: 2,
                cost: 6000,
                damage: 125,
                cooldown: 2.1,
                range: 10,
                type: "Single"
            },

            {
                level: 3,
                cost: 13500,
                damage: 150,
                cooldown: 2.2,
                range: 11,
                type: "Single"
            },

            {
                level: 4,
                cost: 35000,
                damage: 185,
                cooldown: 2.2,
                range: 12,
                type: "Single"
            }

        ]
    },

    {
        name: "Golden Freddy",
        rarity: "Legendary",
        type: "AOE",
        image: "images/goldenfreddy.png",
        
        placement: 5000,
        maxLimit: 1,

        obtainment: "- 1% Chance from summons",

        stats: [

            {
                level: 1,
                damage: 70,
                cooldown: 1.2,
                range: 20,
                type: "AOE"
            },

            {
                level: 2,
                cost: 10000,
                damage: 80,
                cooldown: 1.3,
                range: 21,
                type: "AOE"
            },

            {
                level: 3,
                cost: 25000,
                damage: 100,
                cooldown: 1.4,
                range: 22,
                type: "AOE"
            },

            {
                level: 4,
                cost: 50000,
                damage: 115,
                cooldown: 1.5,
                range: 22,
                type: "AOE"
            }

        ]
    },

    {
        name: "Chupcake",
        rarity: "Legendary",
        type: "Pierce",
        image: "images/chupcake.png",
        
        placement: 2000,
        maxLimit: 2,

        obtainment: "- Chance drop from Game 1 Endless",

        stats: [

            {
                level: 1,
                damage: 185,
                cooldown: 0.5,
                range: 8,
                type: "Pierce"
            },

            {
                level: 2,
                cost: 5000,
                damage: 225,
                cooldown: 9,
                range: 0.6,
                type: "Pierce"
            },

            {
                level: 3,
                cost: 12500,
                damage: 250,
                cooldown: 0.8,
                range: 10,
                type: "Pierce"
            }

        ]
    }

];

function isMissing(value) {
    return value === undefined || value === null || value === "";
}

function displayValue(value) {
    return isMissing(value) ? "-" : value;
}

function getUnitStatMode(unit) {
    const type = (unit.type || "").toLowerCase();

    if (type === "range buff") {
        return "rangeBuff";
    }

    if (type === "damage buff") {
        return "damageBuff";
    }

    if (
        type === "speed buff" ||
        type === "cd buff" ||
        type === "cooldown buff"
    ) {
        return "cooldownBuff";
    }

    if (type === "slower") {
        return "slow";
    }

    return "normal";
}
