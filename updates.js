
/* =========================================
   UPDATES DATABASE

   Add new updates at the TOP of this array.
   All image paths are relative to updates.html.
========================================= */


//// =========================================
// EXAMPLE UPDATE TEMPLATE
// ALL 6 SECTION TYPES
// =========================================
//
// {
//     // BASIC UPDATE INFORMATION
//
//     id: "example-update",
//     name: "EXAMPLE UPDATE",
//     alias: "All Features Showcase!",
//     date: "2026-10-24",
//
//     // Optional banner image
//     // Leave empty ("") for no banner
//     banner: "images/example-banner.png",
//
//     sections: [
//
//         // =========================================
//         // TYPE 1: FEATURES
//         // New features with tags and descriptions
//         // =========================================
//
//         {
//             title: "NEW FEATURES!",
//             type: "features",
//
//             items: [
//                 {
//                     tag: "NEW",
//                     title: "New Game Feature!",
//                     description: "Explain the new feature here."
//                 },
//                 {
//                     tag: "EVENT",
//                     title: "New Event!",
//                     description: "Explain the event here."
//                 },
//                 {
//                     tag: "UI",
//                     title: "Interface Overhaul!",
//                     description: "Describe the UI changes here."
//                 },
//                 {
//                     tag: "QOL",
//                     title: "Quality of Life Improvements!",
//                     description: "Describe the improvements here."
//                 }
//             ]
//         },
//
//         // =========================================
//         // TYPE 2: GALLERY
//         // Multiple images with captions
//         // =========================================
//
//         {
//             title: "NEW LOBBY!",
//             type: "gallery",
//
//             images: [
//                 {
//                     src: "images/example-lobby-1.png",
//                     caption: "Outside the New Lobby"
//                 },
//                 {
//                     src: "images/example-lobby-2.png",
//                     caption: "Inside the New Lobby"
//                 },
//                 {
//                     src: "images/example-lobby-3.png",
//                     caption: "New Event Area"
//                 },
//                 {
//                     src: "images/example-lobby-4.png",
//                     caption: "New Shop"
//                 }
//             ]
//         },
//
//         // =========================================
//         // TYPE 3: SPLIT
//         // Image on left, text on right
//         // =========================================
//
//         {
//             title: "NEW INVENTORY SYSTEM!",
//             type: "split",
//
//             image: "images/example-inventory.png",
//             caption: "New Inventory Interface",
//
//             paragraphs: [
//                 "The inventory has received a complete redesign!",
//                 "Players can now access units and items through separate tabs.",
//                 "New filtering and sorting options have been added.",
//                 "Additional improvements have been made."
//             ]
//         },
//
//         // =========================================
//         // TYPE 4: TEXT
//         // Regular paragraphs without images
//         // =========================================
//
//         {
//             title: "DEVELOPER ANNOUNCEMENT!",
//             type: "text",
//
//             paragraphs: [
//                 "Welcome to the latest update!",
//                 "This update focuses on improving gameplay.",
//                 "Several new features have been introduced.",
//                 "Thank you for playing Five TD's!"
//             ]
//         },
//
//         // =========================================
//         // TYPE 5: LIST
//         // Balancing, bug fixes, and QoL
//         // =========================================
//
//         {
//             title: "BALANCING CHANGES!",
//             type: "list",
//             marker: "✿",
//
//             items: [
//                 "Example Unit A: Damage increased from 100 to 125.",
//                 "Example Unit B: Placement cost reduced from $500 to $400.",
//                 "Example Unit C: Attack range increased by 10%.",
//                 "Example Unit D: Placement limit increased from 2 to 3."
//             ]
//         },
//
//         // Another LIST example
//
//         {
//             title: "BUG FIXES!",
//             type: "list",
//             marker: "⚙",
//
//             items: [
//                 "Fixed units occasionally stopping their attacks.",
//                 "Fixed an inventory display issue.",
//                 "Fixed several mobile interface bugs.",
//                 "Fixed certain enemy animations."
//             ]
//         },
//
//         // Another LIST example
//
//         {
//             title: "QUALITY OF LIFE IMPROVEMENTS!",
//             type: "list",
//             marker: "★",
//
//             items: [
//                 "Improved loading times.",
//                 "Added new sorting options.",
//                 "Improved mobile controls.",
//                 "Added additional interface settings."
//             ]
//         },
//
//         // =========================================
//         // TYPE 6: CODES
//         // Redeemable codes and requirements
//         // =========================================
//
//         {
//             title: "NEW CODES!",
//             type: "codes",
//
//             items: [
//                 {
//                     code: "EXAMPLECODE1",
//                     rewards: "25,000 Tokens and 2,500 Souls",
//                     requirement: "None"
//                 },
//                 {
//                     code: "EXAMPLECODE2",
//                     rewards: "50,000 Tokens and 5,000 Souls",
//                     requirement: "10,000 Faz-Rating"
//                 },
//                 {
//                     code: "EXAMPLECODE3",
//                     rewards: "100,000 Tokens and 10,000 Souls",
//                     requirement: "20,000 Faz-Rating"
//                 }
//             ]
//         }
//
//     ]
// },
//
// =========================================
// END OF EXAMPLE UPDATE TEMPLATE
// =========================================



/* =========================================
   FIVE TD'S CENTRAL — UPDATES DATABASE
   Historical updates: August–October 2026
========================================= */

// Change this to your actual game logo filename.
const GAME_LOGO = "images/fntd-game.png";

// Creates a standard update section.
const updateList = (title, items, marker = "★") => ({
    title,
    type: "list",
    marker,
    items
});

// Creates an update with the game logo.
const makeUpdate = (id, name, alias, sections) => ({
    id,
    name,
    alias,
    date: id.substring(0, 10),
    banner: GAME_LOGO,
    sections
});

const UPDATES = [

    // =========================================
    // OCTOBER 16, 2026
    // =========================================

    makeUpdate(
        "2026-10-16",
        "EARLY ACCESS V0.6.1.2",
        "Minor Update",
        [
            updateList("NEW FEATURES & IMPROVEMENTS!", [
                "Added enemy movement optimizations to the main game.",
                "Added more camera rotation randomization when starting levels.",
                "Added Remnant rewards to Daily Quests.",
                "Added Remnant rewards to the Daily Case.",
                "Added Remnant rewards to the AFK Area.",
                "Reworked AFK rewards.",
                "Updated the AFK UI.",
                "Updated the opening menu UI.",
                "Updated the lobby slightly."
            ]),
            updateList("BALANCING!", [
                "Buffed Daily Quest rewards."
            ], "✿")
        ]
    ),

    // =========================================
    // OCTOBER 12, 2026 — HOTFIX
    // =========================================

    makeUpdate(
        "2026-10-12-hotfix",
        "EARLY ACCESS V0.6.1.1",
        "Workshop Hotfix",
        [
            updateList("CHANGES!", [
                "Sped up Auto Skip Mod cooldown.",
                "Updated Ambassador nametags."
            ]),
            updateList("BALANCING!", [
                "Increased Soul Mod chance from 0.1 to 0.2."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed an issue where the Mod UI could desync and skip over mods."
            ], "⚙"),
            {
                title: "NEW CODE!",
                type: "codes",
                items: [
                    {
                        code: "Workshop"
                    }
                ]
            }
        ]
    ),

    // =========================================
    // OCTOBER 12, 2026 — MAJOR
    // =========================================

    makeUpdate(
        "2026-10-12-workshop",
        "EARLY ACCESS V0.6.1.0",
        "Workshop Update — Part 2/2",
        [
            {
                title: "WORKSHOP UPDATE!",
                type: "features",
                items: [
                    {
                        tag: "NEW",
                        title: "Mod Station",
                        description: "A new station for the Mod system."
                    },
                    {
                        tag: "NEW",
                        title: "Mods",
                        description: "Mods have been added to the game."
                    },
                    {
                        tag: "NEW",
                        title: "Remnant",
                        description: "A new currency has been introduced."
                    }
                ]
            },
            updateList("NEW CONTENT & CHANGES!", [
                "Updated the lobby.",
                "Updated the Level Selection UI.",
                "Added new fan art.",
                "Added new teasers.",
                "Added new Vote Board options.",
                "Changed Endless scaling difficulty.",
                "Reset the Endless leaderboards."
            ]),
            updateList("BALANCING!", [
                "Buffed Endo 02.",
                "Raised the maximum price of Exclusives from 4,000 to 5,000."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed support units incorrectly having DPS.",
                "Fixed upgraded range not working for support units."
            ], "⚙"),
            {
                title: "ENDLESS LEADERBOARD RESET",
                type: "text",
                paragraphs: [
                    "Endless difficulty was changed, so the developer reset the Endless leaderboards.",
                    "The developer apologized to players who appeared on the previous leaderboard and said photos would be preserved to recognize them."
                ]
            }
        ]
    ),

    // =========================================
    // OCTOBER 7, 2026
    // =========================================

    makeUpdate(
        "2026-10-07",
        "EARLY ACCESS V0.6.0",
        "Workshop Update — Part 1/2",
        [
            {
                title: "NEW CONTENT!",
                type: "features",
                items: [
                    {
                        tag: "UNITS",
                        title: "6 New Summon Units",
                        description: "Six new summonable units were added."
                    },
                    {
                        tag: "QUEST",
                        title: "New Quest Unit",
                        description: "One new quest unit was added, with a credit to Adamix, modeler of OMC."
                    },
                    {
                        tag: "EXCLUSIVE",
                        title: "New Exclusive Unit",
                        description: "One new exclusive unit was added."
                    },
                    {
                        tag: "NEW",
                        title: "4 New Unit Types",
                        description: "Four new unit types were introduced."
                    }
                ]
            },
            updateList("BALANCING!", [
                "Purple Guy: Upgrade 4 cost increased from 10,000 to 12,500.",
                "Toy Chica: Upgrade 1 cost reduced from 1,000 to 750.",
                "Toy Chica: Capacity increased from 2 to 3.",
                "Toy Chica: Type changed from Splash to Cone."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed Crying Child facing the wrong direction while attacking.",
                "Fixed Sparky's lobby stats not matching in-game stats.",
                "Fixed Bonnie's lobby stats not matching in-game stats.",
                "Fixed Toy Chica's lobby stats not matching in-game stats.",
                "Fixed grass clipping in the lobby."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "Part 2 of the Workshop Update was announced as coming soon. The developer released Part 1 first so players could enjoy the new units."
                ]
            }
        ]
    ),

    // =========================================
    // SEPTEMBER 24, 2026
    // =========================================

    makeUpdate(
        "2026-09-24",
        "EARLY ACCESS V0.5.3",
        "Minor Update",
        [
            updateList("CHANGES!", [
                "Updated credits.",
                "Updated the Inventory Equip UI.",
                "Updated the AFK UI.",
                "Added an Ambassador tag for content creators with 1,000 subscribers.",
                "Added new fan art."
            ]),
            updateList("BALANCING!", [
                "Toy Chica damage: Level 1 increased from 23 to 25.",
                "Toy Chica damage: Level 2 increased from 26 to 27.",
                "Toy Chica damage: Level 3 increased from 30 to 31.",
                "Toy Chica range: Level 1 increased from 8 to 9.",
                "Toy Chica range: Level 2 increased from 8 to 9.",
                "Toy Chica range: Level 3 increased from 9 to 10.",
                "Toy Chica range: Level 4 increased from 10 to 11.",
                "Bonnie damage: Level 3 reduced from 26 to 25.",
                "Bonnie damage: Level 4 reduced from 29 to 28."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed not being able to scroll all the way down in the Index UI."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 23, 2026
    // =========================================

    makeUpdate(
        "2026-09-23",
        "EARLY ACCESS V0.5.2",
        "Minor Update",
        [
            updateList("NEW EFFECTS!", [
                "Added a new projectile effect to Shadow Bonnie."
            ]),
            updateList("BALANCING!", [
                "Crying Child damage: Level 1 increased from 12 to 14.",
                "Crying Child damage: Level 2 increased from 20 to 25.",
                "Crying Child cost: Level 2 increased from 1,000 to 1,500.",
                "Bear5 damage: Level 1 increased from 17 to 19.",
                "Bear5 damage: Level 2 increased from 19 to 20.",
                "Bear5 damage: Level 3 increased from 21 to 22.",
                "Bear5 damage: Level 4 increased from 23 to 24.",
                "Bear5 range: Level 1 increased from 7 to 8.",
                "Bear5 range: Level 2 increased from 8 to 9.",
                "Bear5 range: Level 3 increased from 8 to 9.",
                "Bear5 range: Level 4 increased from 9 to 10."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed Fastbear displaying the wrong rarity in the main game."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 22, 2026 — MINOR
    // =========================================

    makeUpdate(
        "2026-09-22-minor",
        "EARLY ACCESS V0.5.1",
        "Shadow Bonnie Update",
        [
            updateList("NEW FEATURES!", [
                "Added a new Shadow Bonnie attack animation.",
                "Updated the UI to the current version."
            ]),
            updateList("BALANCING!", [
                "Shadow Bonnie damage: Level 1 increased from 50 to 105.",
                "Shadow Bonnie damage: Level 2 increased from 70 to 125.",
                "Shadow Bonnie damage: Level 3 increased from 90 to 150.",
                "Shadow Bonnie damage: Level 4 increased from 120 to 185."
            ], "✿"),
            {
                title: "NEW CODE!",
                type: "codes",
                items: [
                    {
                        code: "DinozPlays"
                    }
                ]
            }
        ]
    ),

    // =========================================
    // SEPTEMBER 22, 2026 — MAJOR
    // =========================================

    makeUpdate(
        "2026-09-22-quests",
        "EARLY ACCESS V0.5.0",
        "Quests Update",
        [
            {
                title: "QUESTS UPDATE!",
                type: "features",
                items: [
                    {
                        tag: "NEW",
                        title: "Unit Quests",
                        description: "Added Unit Quests."
                    },
                    {
                        tag: "DAILY",
                        title: "Daily Quests",
                        description: "Added Daily Quests and a Daily Case."
                    },
                    {
                        tag: "UNITS",
                        title: "New Quest Units",
                        description: "Added 2 Quest Units and 1 Daily Unit."
                    },
                    {
                        tag: "EXCLUSIVE",
                        title: "New Exclusive Unit",
                        description: "Added one new Exclusive Unit."
                    },
                    {
                        tag: "SUMMON",
                        title: "Summon Pity System",
                        description: "Added a pity system for summoning."
                    },
                    {
                        tag: "CODES",
                        title: "Code Redemption",
                        description: "Added codes to the Settings menu."
                    }
                ]
            },
            updateList("ADDITIONAL CONTENT!", [
                "Added a new lobby area.",
                "Added Daily Level reward boosts.",
                "Added Discord fan art to the lobby.",
                "Added new lobby music.",
                "Added a new tower placement UI.",
                "Added an Exclusive rarity, which is cosmetic only.",
                "Added a notification when AFK money is received.",
                "Changed Chupcake's projectile to a Chica head.",
                "Updated teasers.",
                "Added new Vote Board options."
            ]),
            updateList("BALANCING!", [
                "Level 1-7 base reward reduced from 60 to 55."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed a saving bug after selling units.",
                "Fixed inaccurate unit placement radius.",
                "Fixed First targeting prioritizing distance traveled rather than shortest distance to the end.",
                "Attempted to fix unit placement occasionally not working at game startup by retrying UI loading."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "The developer was unable to reproduce the startup placement issue and asked players to report whether the attempted fix worked."
                ]
            }
        ]
    ),

    // =========================================
    // SEPTEMBER 17, 2026
    // =========================================

    makeUpdate(
        "2026-09-17",
        "EARLY ACCESS V0.4.6",
        "Minor Update",
        [
            updateList("CHANGES!", [
                "Updated game saving again to improve reward reliability.",
                "Added level spawn location randomization to make macros less effective."
            ]),
            updateList("BALANCING!", [
                "Buffed Endless rewards slightly.",
                "Level 1-11 base reward increased from 95 to 100."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed 2X Speed sometimes not being toggleable.",
                "Fixed tutorial text scaling incorrectly on different screens."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 16, 2026
    // =========================================

    makeUpdate(
        "2026-09-16",
        "EARLY ACCESS V0.4.5",
        "Saving Hotfix",
        [
            updateList("SAVING SYSTEM UPDATE!", [
                "Updated how the game loads and saves to try to prevent progress loss."
            ]),
            {
                title: "DEVELOPER ANNOUNCEMENT",
                type: "text",
                paragraphs: [
                    "The developer asked players who had lost their saves to open a support ticket and said lost saves would be restored as requests were processed."
                ]
            }
        ]
    ),

    // =========================================
    // SEPTEMBER 13, 2026
    // =========================================

    makeUpdate(
        "2026-09-13",
        "EARLY ACCESS V0.4.4",
        "2X Speed Update",
        [
            {
                title: "NEW FEATURE!",
                type: "features",
                items: [
                    {
                        tag: "NEW",
                        title: "2X Speed",
                        description: "Added a toggle for 2X game speed."
                    }
                ]
            },
            updateList("BALANCING!", [
                "Chupcake range: Level 1 increased from 7 to 8.",
                "Chupcake range: Level 2 increased from 8 to 9.",
                "Chupcake range: Level 3 increased from 9 to 10.",
                "Bonnie damage: Level 1 reduced from 22 to 20.",
                "Bonnie damage: Level 2 reduced from 25 to 23.",
                "Bonnie damage: Level 3 reduced from 27 to 26.",
                "Bonnie damage: Level 4 reduced from 30 to 29.",
                "Toy Chica speed: Level 1 increased from 0.5 to 0.6.",
                "Toy Chica speed: Level 2 increased from 0.6 to 0.7.",
                "Toy Chica speed: Level 3 increased from 0.7 to 0.8.",
                "Toy Chica speed: Level 4 increased from 0.7 to 0.9.",
                "Toy Chica cost: Level 4 increased from 4,000 to 4,500."
            ], "✿"),
            updateList("OTHER CHANGES!", [
                "Added more lobby spawn locations."
            ])
        ]
    ),

    // =========================================
    // SEPTEMBER 12, 2026 — V0.4.3
    // =========================================

    makeUpdate(
        "2026-09-12-v043",
        "EARLY ACCESS V0.4.3",
        "Settings Update",
        [
            updateList("NEW SETTINGS!", [
                "Added a setting to toggle range circles while placing units.",
                "Added a setting to toggle the new unit DPS UI.",
                "Added a setting to toggle enemy health numbers.",
                "Updated teasers."
            ]),
            updateList("BUG FIXES!", [
                "Fixed Sparky not being usable in the main game.",
                "Fixed units being placeable inside objects in the Kitchen level."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 12, 2026 — V0.4.2
    // =========================================

    makeUpdate(
        "2026-09-12-v042",
        "EARLY ACCESS V0.4.2",
        "Minor Update",
        [
            updateList("NEW FEATURES!", [
                "Added keyboard keybinds 1-5 for placing towers.",
                "Added Last targeting mode.",
                "Updated credits."
            ]),
            updateList("BALANCING!", [
                "Level 1-11 base reward increased from 90 to 95."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed unit stats overflowing the UI in Endless.",
                "Improved First targeting so it better targets the first enemy."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 11, 2026 — MINOR
    // =========================================

    makeUpdate(
        "2026-09-11-minor",
        "EARLY ACCESS V0.4.1",
        "Minor Update",
        [
            updateList("NEW FEATURES & CHANGES!", [
                "Changed early Endless spawn locations to closer positions.",
                "Added new lobby spawn locations.",
                "Added a New sign to the Summons sign."
            ]),
            updateList("BALANCING!", [
                "Reduced overall early Endless difficulty.",
                "Buffed Endless rewards for later waves."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed the game sometimes not saving when entering the AFK Area.",
                "Fixed the AFK UI scaling incorrectly on different screens."
            ], "⚙")
        ]
    ),

    // =========================================
    // SEPTEMBER 11, 2026 — MAJOR
    // =========================================

    makeUpdate(
        "2026-09-11-summons",
        "EARLY ACCESS V0.4.0",
        "Summons Update",
        [
            {
                title: "SUMMONS UPDATE!",
                type: "features",
                items: [
                    {
                        tag: "UNITS",
                        title: "7 New Units",
                        description: "Seven new units were added."
                    },
                    {
                        tag: "SUMMON",
                        title: "Summon Randomization",
                        description: "Added summon randomization."
                    },
                    {
                        tag: "EXCLUSIVE",
                        title: "New Exclusive Unit",
                        description: "One new exclusive unit was added."
                    },
                    {
                        tag: "SHOP",
                        title: "New Robux Purchasables",
                        description: "Added new Robux purchase options."
                    }
                ]
            },
            updateList("OTHER CHANGES!", [
                "Updated the Summon UI.",
                "Added new Vote Board options."
            ]),
            updateList("BALANCING!", [
                "Splash damage range reduced from 6.5 to 6."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed tower placement preview range and placement disks moving up and down."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "The developer described this as Part 1 of the update and announced plans for additional bug fixes, balance changes, and smaller improvements."
                ]
            }
        ]
    ),

    // =========================================
    // AUGUST 29, 2026
    // =========================================

    makeUpdate(
        "2026-08-29",
        "EARLY ACCESS V0.3.2",
        "Minor Update",
        [
            updateList("CHANGES!", [
                "Moved the chosen Endless modifier UI to the top-left of the screen."
            ]),
            updateList("BALANCING!", [
                "Foxy damage: Level 3 increased from 16 to 17."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed the Endless modifier UI being too large on mobile."
            ], "⚙")
        ]
    ),

    // =========================================
    // AUGUST 27, 2026
    // =========================================

    makeUpdate(
        "2026-08-27",
        "EARLY ACCESS V0.3.1",
        "Endless Balancing Update",
        [
            updateList("NEW FEATURES!", [
                "Added a new Endless UI showing active modifiers.",
                "Added a Settings button indicator when Auto Skip Wave is enabled."
            ]),
            updateList("BALANCING!", [
                "Golden Freddy Endless Boss health multiplier reduced from 1.15 to 1.",
                "Endless Boss health increase per 60-wave cycle reduced from 1.25 to 1.2.",
                "Endless enemy increase interval changed from every 5 waves to every 6 waves.",
                "Endless enemy amount-per-group increase interval changed from every 5 waves to every 7 waves.",
                "Chupcake damage: Level 1 increased from 150 to 185.",
                "Chupcake damage: Level 2 increased from 185 to 225.",
                "Chupcake damage: Level 3 increased from 225 to 250."
            ], "✿")
        ]
    ),

    // =========================================
    // AUGUST 26, 2026
    // =========================================

    makeUpdate(
        "2026-08-26",
        "EARLY ACCESS V0.3.0",
        "Endless Update",
        [
            {
                title: "ENDLESS UPDATE!",
                type: "features",
                items: [
                    {
                        tag: "MODE",
                        title: "Endless Mode",
                        description: "The new Endless game mode has arrived."
                    },
                    {
                        tag: "LEADERBOARD",
                        title: "Endless Leaderboards",
                        description: "New leaderboards for Endless Mode."
                    },
                    {
                        tag: "UNITS",
                        title: "New Endless Unit",
                        description: "One new Endless unit was added."
                    },
                    {
                        tag: "EXCLUSIVE",
                        title: "New Exclusive Unit",
                        description: "One new exclusive unit was added."
                    }
                ]
            },
            updateList("OTHER CHANGES!", [
                "Updated End Game UI animations.",
                "Updated player nametag tower UI.",
                "Added new teasers.",
                "Added new Vote Board options."
            ])
        ]
    ),

    // =========================================
    // AUGUST 23, 2026
    // =========================================

    makeUpdate(
        "2026-08-23",
        "EARLY ACCESS V0.2.2",
        "Minor Update",
        [
            updateList("NEW FEATURES & CHANGES!", [
                "Added a Teasers Station to the lobby.",
                "Slightly changed the Create Lobby UI."
            ]),
            updateList("BUG FIXES!", [
                "Fixed UI overlapping in the Workshop.",
                "Fixed summons always displaying Unlocked even when a unit was already unlocked."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "The developer reassured players that Endless Mode was still coming."
                ]
            }
        ]
    ),

    // =========================================
    // AUGUST 12, 2026 — HOTFIX
    // =========================================

    makeUpdate(
        "2026-08-12-hotfix",
        "EARLY ACCESS V0.2.1",
        "Exclusive Update Hotfix",
        [
            updateList("CHANGES!", [
                "Updated the Update Board.",
                "Changed the Tutorial UI.",
                "Changed the first three Playtime Rewards.",
                "Changed Playtime Rewards UI coin colors.",
                "Changed the Create Lobby UI.",
                "Changed the Exclusive Unit enter radius and camera."
            ]),
            updateList("BUG FIXES!", [
                "Fixed the Playtime Rewards button appearing over the Workshop UI."
            ], "⚙")
        ]
    ),

    // =========================================
    // AUGUST 12, 2026 — MAJOR
    // =========================================

    makeUpdate(
        "2026-08-12-exclusive",
        "EARLY ACCESS V0.2.0",
        "Exclusive Update",
        [
            {
                title: "EXCLUSIVE UPDATE!",
                type: "features",
                items: [
                    {
                        tag: "NEW",
                        title: "Exclusive Unit Station",
                        description: "Added a station for Exclusive Units."
                    },
                    {
                        tag: "UNIT",
                        title: "New Exclusive Animatronic",
                        description: "One new exclusive animatronic was added."
                    },
                    {
                        tag: "AFK",
                        title: "AFK Area",
                        description: "Added an AFK Area."
                    },
                    {
                        tag: "REWARDS",
                        title: "Playtime Rewards",
                        description: "Added rewards for playtime."
                    }
                ]
            },
            updateList("ADDITIONAL FEATURES!", [
                "Added chat announcements for summoned animatronics.",
                "Added gold rewards when completing waves.",
                "Updated Summon Unit highlight colors.",
                "Added new Vote Board options."
            ]),
            updateList("BALANCING!", [
                "Max Mode speed multiplier increased from 1.15 to 1.2."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed players replaying directly after a game sometimes missing the Waiting For Players screen and loading before other players."
            ], "⚙")
        ]
    ),

    // =========================================
    // AUGUST 10, 2026
    // =========================================

    makeUpdate(
        "2026-08-10",
        "EARLY ACCESS V0.1.1",
        "Launch Hotfix",
        [
            updateList("CHANGES!", [
                "Added Returning to Lobby text to the Showtime cutscene.",
                "Changed Tutorial UI text.",
                "Made the Vote Board easier to read."
            ]),
            updateList("BUG FIXES!", [
                "Fixed a rare issue where new players could spawn without a starting animatronic.",
                "Fixed Endo disappearing from players' hotbars.",
                "Fixed players being sent to the same Tutorial server."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "Players were asked to report if they still did not receive Endo when starting."
                ]
            }
        ]
    ),

    // =========================================
    // AUGUST 9, 2026
    // =========================================

    makeUpdate(
        "2026-08-09",
        "EARLY ACCESS V0.1.0",
        "Launch Version",
        [
            updateList("NEW FEATURES & CHANGES!", [
                "Added names and thumbnails to loading screens.",
                "Updated credits and nametags.",
                "Cleaned up the Summon UI animation.",
                "Reworked animatronic selection hitboxes, with further improvements still planned."
            ]),
            updateList("BALANCING!", [
                "Level 1-11 base reward increased from 80 to 90."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Attempted to fix multiplayer games starting before every player had loaded.",
                "Fixed players walking out of bounds before maps loaded.",
                "Fixed animatronic Upgrade UI borders randomly changing colors.",
                "Fixed selecting another animatronic while placing one causing the placed animatronic to float.",
                "Fixed placed animatronics sometimes not showing their placement radius if they loaded too slowly."
            ], "⚙"),
            {
                title: "DEVELOPER NOTE",
                type: "text",
                paragraphs: [
                    "The developer was unable to fully test the multiplayer loading fix before publishing and noted that the issue might still occur.",
                    "Nathan was credited for reporting the floating placement issue."
                ]
            }
        ]
    ),

    // =========================================
    // AUGUST 5, 2026
    // =========================================

    makeUpdate(
        "2026-08-05",
        "BETA V0.0.1",
        "Beta Update",
        [
            updateList("NEW FEATURES & CHANGES!", [
                "Changed Start Game UI to only show Yes.",
                "Added health text to the Health UI.",
                "Matched Upgrade UI animatronic button colors to their levels.",
                "Added an Auto Upgrade indicator.",
                "Added a Leave button to Settings.",
                "Added a coins counter in Level Selection.",
                "Removed the closet door on Level 1-5.",
                "Renamed Floor Endo to Flendo.",
                "Renamed Headless Freddy to Heddy.",
                "Added the Workshop animatronic image to nametags.",
                "Added a light source to the Summon cinematic."
            ]),
            updateList("BALANCING!", [
                "Max Mode speed multiplier reduced from 1.25 to 1.15.",
                "Freddy Level 1 damage increased from 100 to 120.",
                "Golden Freddy placement radius reduced from 4 to 3.5.",
                "Endo capacity increased from 3 to 4."
            ], "✿"),
            updateList("BUG FIXES!", [
                "Fixed players entering the Workshop when exiting one of the lobbies."
            ], "⚙")
        ]
    )

];