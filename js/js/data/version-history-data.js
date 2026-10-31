const WEBSITE_VERSION_HISTORY = [
    {
        version: "V2.9.1",
        date: "October 31, 2026",
        title: "Independent Tierlist Scoring and Night Views",
        description: "Rebuilt the Tierlist scoring model without changing Best Towers or Recommended Teams, adding dedicated views for overall strength, the selected Night, wave clearing, boss damage, and budget value.",
        changes: {
            "TIERLIST CALCULATIONS": [
                "Replaced the Tierlist's blended general-purpose ranking with an independent score based on modeled combat ceilings, attainable upgrades, same-level efficiency, and limited attack-path coverage.",
                "Separated wave clearing from boss damage and adjusted how line attacks, cone attacks, and broad-area attacks are modeled for the Tierlist without altering the shared game data or other META guides.",
                "Updated the tier thresholds to compare scores against the leading result rather than stretching all units between the highest and lowest scores.",
                "Retained a dedicated Utility tier for buffing and slowing units whose contributions cannot be measured by damage alone."
            ],
            "NIGHT-AWARE CONTROLS": [
                "Added Overall Strength, Selected Night, Wave Clearing, Boss Damage, and Budget Value views directly to the Tierlist's existing recommendation controls.",
                "Made selected-Night rankings respond to starting cash and enchantment-adjusted placement costs using explicitly hypothetical investment budgets, without claiming to know unrecorded wave income.",
                "Preserved the current selection between visits and added small-screen layout refinements and clearer score descriptions."
            ]
        }
    },
    {
        version: "V2.9.0",
        date: "October 31, 2026",
        title: "Advanced META Modeling and Team Optimization",
        description: "Expanded role-based META comparisons with more enemy-group scenarios, enchantment-aware performance, complete five-unit composition searches, dynamic tiers and an optional Night economy planner.",
        changes: {
            "META MODEL": [
                "Expanded modeled enemy groups to one, three, five, ten and twenty targets, with shape-dependent hit-likelihood assumptions for Pierce, Toxic, Splash, Cone and AOE attacks.",
                "Reduced overlapping range contributions in the matched-level scoring weights and kept theoretical attack coverage separate from measured in-game hits.",
                "Added unenchanted, recommended-enchantment and maximum-potential ranking modes, including enchantment-adjusted placement costs and upgrade-budget outcomes.",
                "Changed Tierlist assignment from fixed unit counts to differences in calculated scores while retaining a dedicated Utility tier."
            ],
            "RECOMMENDED TEAMS": [
                "Evaluated all 98,280 unique five-unit combinations for Solo, Endless, Crowd Control, Boss and Speedrun recommendations.",
                "Compared affordable starters, attack roles, selected enchantments, boss damage, wave potential and complementary support or control value.",
                "Reworked recommended substitutes using the full lineup score and flagged when a substitute requires more opening cash."
            ],
            "NIGHT PLANNING": [
                "Added an optional wave-by-wave spending planner using actual Night starting cash and wave count with player-provided income assumptions.",
                "Added model-confidence information to distinguish recorded game data from unverified target geometry, status effects and ability interactions."
            ]
        }
    },
    {
        version: "V2.8.6",
        date: "October 29, 2026",
        title: "Animated Enchantment Gradients",
        description: "Repaired the animated enchantment frames and labels in Best Towers and recommended Teams, matching the Stats Simulator colors and keeping Soul's gradient faster than the others.",
        changes: {
            "ENCHANTMENT APPEARANCE": [
                "Fixed a CSS background-position conflict that prevented enchantment borders from changing color over time.",
                "Matched the Stats Simulator gradients: Haywire cycles from purple to mint, Springlock from mint to red, and Soul from teal to pink.",
                "Animated matching text in the top-down enchantment hover labels, with a 1.2-second Soul cycle and 2.5-second Haywire and Springlock cycles.",
                "Kept labels visible on touch devices and respected reduced-motion settings while preserving solid frames for the other enchantments."
            ]
        }
    },
    {
        version: "V2.8.5",
        date: "October 29, 2026",
        title: "Enchantment Frames & Investment-Based META Review",
        description: "Restored the original animated enchantment appearance on strategy cards and refined the recommendations using per-level upgrade comparisons and attainable investment scenarios.",
        changes: {
            "ENCHANTMENT APPEARANCE": [
                "Restored colored enchantment borders and the top-down hover label on ranked Best Towers and recommended Teams cards.",
                "Restored animated gradient borders for Haywire, Springlock and Soul, while keeping keyboard and touch navigation usable.",
                "Kept enchant colors consistent between the two META guides and reduced redundant text under recommended team portraits."
            ],
            "META RECOMMENDATIONS": [
                "Rechecked every unit's recorded level statistics, placement and upgrade costs, maximum placements, attack types and documented support abilities.",
                "Added hypothetical investment-budget comparisons for early, mid and late stages, including how many copies and upgrades can fit within a budget.",
                "Weighted single-target and grouped-target usefulness separately, preserved Night-aware starters, and revisited close-cost alternatives when a stronger unit may be worth waiting for.",
                "Updated Tierlist, Best Towers and generated team compositions from the shared scoring model without modifying the source unit or Night data."
            ]
        }
    },
    {
        version: "V2.8.4",
        date: "October 29, 2026",
        title: "Unit Stat List, Graph Values & Enchantment Recommendations",
        description: "Restored role-based enchantment suggestions on META cards, rebuilt the stat listing and refined the simulator and unit-detail interactions.",
        changes: {
            "META GUIDES": [
                "Restored the currently generated best and alternative enchantment recommendations beneath ranked Best Towers cards.",
                "Restored recommended enchantments for each main unit and substitute in the recommended team compositions."
            ],
            "STATISTICS & GRAPHS": [
                "Renamed Raw DPS to Unit Stat List and included non-damaging support units in the directory.",
                "Added single-column ascending and descending sorting across unit names, rarity, attack type, costs, placements, level, HPS, range, damage, DPS and efficiency.",
                "Added point selection to upgrade performance graphs, displaying the exact plotted value on the graph and in an accessible text summary."
            ],
            "UNIT TOOLS & LAYOUT": [
                "Removed the META Links tab from database unit-detail modals while preserving the full unit and simulator links in the header.",
                "Made the entire Compare label on unit cards clickable without opening the unit page.",
                "Refreshed simulator panels, controls, statistic tables and mobile layout for clearer upgrade and enchantment comparisons."
            ]
        }
    },
    {
        version: "V2.8.3",
        date: "October 29, 2026",
        title: "META Clarity & Website Maintenance",
        description: "Simplified the strategy guides and reorganized their scoring setup, added configurable grouped-enemy comparisons, and consolidated the website maintenance documentation.",
        changes: {
            "META RANKINGS": [
                "Reviewed recorded unit upgrade stages using the current damage, HPS, range, investment, placement limits, attack type and listed abilities without changing source stats.",
                "Replaced fixed shape-weight damage proxies with transparent hypothetical one-, three- and five-target coverage scenarios and bounded range weighting.",
                "Kept the Night-aware starter filter, role-based tier assignments, boss and crowd recommendations, and generated recommended-team substitutes."
            ],
            "INTERFACE": [
                "Removed the separate public level-ranking table and 28-unit enchantment catalog from META pages to simplify the guide layout.",
                "Removed enchantment badges and recommendation labels from Best Towers and recommended-team cards while keeping enchantment controls in unit tools and Team Builder."
            ],
            "SITE MAINTENANCE": [
                "Created a single comprehensive README covering source files, editing workflows, data formulas, rankings, layout, Night settings, browser storage and troubleshooting.",
                "Moved editable META assumptions into one settings file and removed duplicated static ranked unit lists from guide data modules.",
                "Added an on-demand per-unit inspection utility so maintainers can review every recorded upgrade without storing stale audit reports."
            ]
        }
    },
    {
        version: "V2.8.2",
        date: "October 29, 2026",
        title: "Complete Unit-Level META & Enchantment Review",
        description: "Expanded the unit and enchantment rankings into directly comparable upgrade-level data, refined close-price alternatives, and added the new Early Access V0.6.1.2 game update.",
        changes: {
            "META & UPGRADE VALUE": [
                "Reassessed all 28 units at each numbered level where data exists, comparing damage, HPS, DPS, range, placement cost, upgrade cost, and total investment against units at the same level.",
                "Added per-level DPS divided by upgrade cost, incremental DPS gained per upgrade dollar, DPS multiplied by placement capacity, and a clearly labeled range-and-attack-shape damage-potential index.",
                "Accounted separately for Single, Pierce, Toxic Pierce, Splash, Cone and AOE attacks and for range-buff and slowing abilities, without treating unknown hit counts as measured DPS.",
                "Added a nearby-price comparison for units that can be replaced by meaningfully stronger alternatives costing up to $400 more to place.",
                "Updated Tierlist, Best Towers and recommended Teams to use the revised comparisons while retaining the selected Night's actual opening budget.",
                "Added an expandable, sortable all-unit level comparison on the Tierlist showing stats and costs at each available level."
            ],
            "ENCHANTMENT META": [
                "Revisited the best and alternative enchantments for every unit using the enchantment effects stored in the site data.",
                "Distinguished Eco's stronger early cost reduction from Soul's damage, HPS, range and cost bonuses, while recommending range coverage for support and slowing roles.",
                "Added a searchable 28-unit enchantment guide to Best Towers with role explanations and estimated before-and-after DPS or support reach."
            ],
            "GAME UPDATES": [
                "Published the supplied Early Access V0.6.1.2 change list covering enemy movement optimization, camera rotation, daily quest and AFK remnant rewards, and interface and lobby updates.",
                "Kept the game's release date unspecified because a publication date was not provided."
            ]
        }
    },
    {
        version: "V2.8.1",
        date: "October 29, 2026",
        title: "Owner-Informed META Review & Per-Level Rankings",
        description: "Reassessed the Tierlist, Best Towers and recommended Teams using owner gameplay feedback and same-level comparisons across all 28 units. Separate wave-clearing potential from listed single-target DPS.",
        changes: {
            "LEVEL-BY-LEVEL UNIT REVIEW": [
                "Compared each unit with other units at the same listed upgrade level using damage, HPS, DPS, range, cumulative investment and upgrade efficiency.",
                "Included Level 1 placement price as the initial investment and evaluated subsequent upgrade cost separately.",
                "Accounted for maximum placements and per-unit attack type when assessing damage potential across multiple placed units.",
                "Retained a separate evaluation for range buffs, slowing and toxic effects because their actual damage or control value is not fully quantified in the database."
            ],
            "TIERLIST & BEST TOWERS": [
                "Rebalanced overall, mid-game, late-game, crowd and damage rankings to recognize Shadow Freddy's cone attacks and three-placement capacity.",
                "Kept boss-damage recommendations separate so strong single-target units are not automatically displaced by area attacks.",
                "Reduced Chupcake's overall placement relative to the older guide while preserving its role in piercing-damage comparisons.",
                "Adjusted early-game scoring to emphasize lower placement costs and practical early-level upgrade value rather than expensive late-game strength.",
                "Retained starting-cash-based Best Starter filtering for each selected Night and difficulty."
            ],
            "RECOMMENDED TEAMS": [
                "Rebalanced team compositions around early affordability, Shadow Freddy's wave coverage, complementary single-target damage and support/control roles.",
                "Updated five-unit team substitutes and enchantment labels to follow the revised unit-role recommendations.",
                "Clarified that multi-target scoring represents qualitative coverage assumptions and does not claim measured hits per attack or unlisted enemy behavior."
            ]
        }
    },
    {
        version: "V2.8.0",
        date: "October 29, 2026",
        title: "Night-Aware META, Performance Graphs & Team Synergy",
        description: "Rebuilt the strategy guides around the complete unit upgrade paths and the starting cash recorded for each Night, and introduced interactive analysis tools with improved mobile layouts.",
        changes: {
            "META RANKINGS": [
                "Reviewed all 28 database units using their listed attack type, abilities, damage, HPS, DPS, range, level-by-level upgrade costs, placement cost, and placement limits.",
                "Separately evaluated direct-damage units, area attacks, slowing, toxic status, and range support rather than assigning fictional DPS to non-damaging units.",
                "Recalculated Tierlist and Best Towers categories using level-one strength, full upgrade progression, cumulative investment, efficiency, range, and total possible deployed damage.",
                "Added a Night and Normal/MAX selector to META pages, with starting cash read from the existing Nights database.",
                "Filtered Best Starter choices by what can actually be purchased with the selected Night's starting money; wave income is not assumed.",
                "Rebuilt recommended teams with opening affordability, distinct attack roles, damage coverage, control/support options, and role-matched substitutes in mind.",
                "Displayed the limits of the scoring model: multi-target hit counts, buffs, enemy defenses, and real match results are not in the database.",
            ],
            "UNIT PERFORMANCE GRAPHS": [
                "Introduced interactive graphs for damage, HPS, DPS, range, total investment, and DPS per $1,000 over each unit's listed upgrade levels.",
                "Integrated performance visualization into the Unit Database detail modal, full unit page, and Stats Simulator.",
                "Provided level-by-level numerical summaries, accessible data-point labels, range-buff and slow-strength graph options for support units, and clear missing-data states.",
            ],
            "TEAM SYNERGY": [
                "Replaced the Team Builder analysis source with the actual five selected slots, including saved and edited teams.",
                "Added role coverage checks for single-target damage, group attacks, buffs, slows, and status effects.",
                "Calculated combined placement cost, starting-budget affordability, base maximum DPS, and full-deployment DPS estimates.",
                "Added role-specific synergy explanations, potential weaknesses, suggested role fillers, and a richer comparison between recommended teams.",
                "Explained that DPS totals do not include enchantments, unlisted multi-target hits, or quantified support-buff effects.",
            ],
            "MOBILE EXPERIENCE": [
                "Redesigned upgrade statistics inside unit modals as readable stacked cards on small screens, avoiding wide horizontal tables.",
                "Made performance graphs, META Night controls, team analysis, builder slots, and simulator actions responsive to narrow screens.",
                "Reworked the Stats Simulator and full unit-page upgrade tables into vertically stacked stat cards on phones.",
                "Improved tap targets, mobile dialog sizing, readable typography, and comparison-table behavior.",
            ],
            "DATA & ORGANIZATION": [
                "Moved the existing Nights data into a shared data script so the Nights page and META tools use identical starting-cash values.",
                "Preserved all original unit stats, documented abilities, Night rewards, and existing saved-team functionality.",
                "Displayed placement cost as the Level 1 cost on full unit pages and aligned enchantment attack-speed previews with the Stats Simulator calculation.",
            ],
        },
    },
    {
        version: "V2.7.4",
        date: "October 28, 2026",
        title: "Mobile Navigation & Version History Refinements",
        description: "Prevented mobile navigation from scrolling the page underneath it and made the website timeline more detailed and consistent.",
        changes: {
            "MOBILE NAVIGATION": [
                "Locked the background document at its existing scroll position while the mobile menu is open.",
                "Kept the navigation bar anchored to the top of the viewport to eliminate the blank strip that could appear above it.",
                "Allowed the menu itself to scroll independently, including expanded dropdown sections and safe-area padding on mobile devices.",
                "Restored the original page scroll position when the menu closes or switches to the desktop navigation layout.",
            ],
            "VERSION HISTORY": [
                "Standardized every timeline date to the Month Day, Year format.",
                "Kept version dates consistently formatted and separated from release descriptions for easier browsing.",
                "Expanded the recent feature entries into specific user-facing changes, grouped by website area.",
                "Preserved the earlier historical version entries and their original dates.",
                "Removed temporary build-status labels so the timeline focuses on versions, dates, and detailed changes.",
            ],
        }
    },
    {
        version: "V2.7.3",
        date: "October 28, 2026",
        title: "Recommended Teams & Version History Links",
        description: "Connected META review links with the homepage version history and refined the recommended team layout.",
        changes: {
            "TEAMS": [
                "Aligned each recommended substitute beneath its corresponding primary team slot in a shared five-column layout.",
                "Adjusted substitute card sizing and spacing to keep portraits visually centered across desktop and smaller screens.",
            ],
            "NAVIGATION": [
                "Changed META review links to open the homepage version-history experience rather than sending visitors to the Updates page.",
                "Added the recent development milestones to the existing website version timeline.",
            ],
        }
    },
    {
        version: "V2.7.2",
        date: "October 28, 2026",
        title: "META Rankings, Enchantments & Comparison Refinements",
        description: "Improved stat-driven recommendations, unit comparison, enchantment previews, and several responsive layouts.",
        changes: {
            "META": [
                "Recalculated rankings from the unit database using level-by-level damage, HPS, DPS, range, investment costs, placement limits, and attack types.",
                "Included documented support, crowd-control, and other ability roles where the available unit data allows.",
                "Kept stat-based recommendations separate from claims of verified live competitive rankings.",
                "Added fallback enchantment recommendations for newly ranked Best Towers units.",
            ],
            "UNIT COMPARISON": [
                "Added independent upgrade-level selectors for compared units.",
                "Updated damage, HPS, DPS, range, and attack-type displays to follow the selected upgrade levels.",
                "Highlighted stronger numeric results in comparison columns, treating lower placement cost as favorable.",
            ],
            "UNIT MODALS": [
                "Corrected DPS estimates to multiply damage by HPS rather than treating HPS as cooldown time.",
                "Loaded the enchantment data on the Unit Database page so the enchantment dropdown contains actual choices.",
                "Added enchantment previews showing modified damage, HPS, DPS, range, cost effects, and differences from base values.",
                "Reworked upgrade table spacing and responsive column widths to reduce horizontal scrolling.",
            ],
            "INTERFACE": [
                "Aligned Team Builder slots, labels, enchantments, and placement counts.",
                "Reorganized simulator comparison controls and improved the layout of saved configurations.",
                "Reduced repeated META notices and improved tooltip and modal sizing.",
                "Moved Website Settings to the bottom-left and removed the recently visited section.",
            ],
        }
    },
    {
        version: "V2.7.1",
        date: "October 28, 2026",
        title: "Shared Code & Interface Organization",
        description: "Consolidated website calculations and shared presentation behavior while preserving the existing unit data.",
        changes: {
            "SHARED FEATURES": [
                "Extended reusable unit-detail, modal, navigation, and stat-display helpers.",
                "Kept unit database values separate from presentation and ranking logic.",
                "Reused shared calculation conventions across unit information, team tools, and simulator previews.",
            ],
            "CONSISTENCY": [
                "Standardized common interface controls and layouts across the site.",
                "Maintained existing saved teams, links, and unit data while reorganizing shared behavior.",
            ],
        }
    },
    {
        version: "V2.7.0",
        date: "October 28, 2026",
        title: "Unit Details & Upgrade Modal",
        description: "Made more unit information available without leaving the Unit Database.",
        changes: {
            "UNIT DETAILS": [
                "Added a unit detail modal accessible directly from database cards.",
                "Included unit portraits, rarity, attack type, placement cost, placement limit, obtainment, and abilities.",
                "Displayed each upgrade level with its investment cost and damage, HPS, DPS, and range.",
            ],
            "ENCHANTMENTS & LINKS": [
                "Added an enchantment comparison tab with stat previews based on the configured enchantment data.",
                "Included shortcuts to the full unit page, simulator, Tierlist, Best Towers, and Teams.",
                "Kept unit review and confidence information visible alongside unit details.",
            ],
        }
    },
    {
        version: "V2.6.5",
        date: "October 28, 2026",
        title: "Team Templates & Analysis",
        description: "Expanded the existing Team Builder with recommendations and lineup analysis.",
        changes: {
            "TEAM TEMPLATES": [
                "Added the ability to load a recommended five-unit team into the active builder.",
                "Connected recommended team compositions with existing builder selection and saving behavior.",
            ],
            "TEAM ANALYSIS": [
                "Added lineup checks for coverage, investment, and missing statistics.",
                "Added side-by-side comparisons of recommended compositions.",
                "Retained saved teams, enchantment selections, team captures, and share/import links.",
            ],
        }
    },
    {
        version: "V2.5.8",
        date: "October 28, 2026",
        title: "META Guides & Stat-Based Rankings",
        description: "Made Tierlist, Best Towers, and recommended team selections respond to the available unit database.",
        changes: {
            "TIERLIST & BEST TOWERS": [
                "Introduced database-derived ranking logic for unit roles and progression stages.",
                "Considered damage output, speed, range, investment, placement constraints, and attack coverage.",
                "Added clearer descriptions distinguishing estimated rankings from verified in-game performance.",
            ],
            "RECOMMENDED TEAMS": [
                "Generated role-balanced team suggestions and corresponding substitutes from available units.",
                "Considered early defense, single-target damage, group coverage, and support/control where represented in the data.",
            ],
        }
    },
    {
        version: "V2.5.6",
        date: "October 28, 2026",
        title: "Stats Simulator Upgrade Comparisons",
        description: "Added ways to compare upgrade paths and save simulator selections.",
        changes: {
            "UPGRADE COMPARISON": [
                "Added two upgrade-level selectors for the active unit.",
                "Displayed differences in damage, HPS, DPS, range, and total investment.",
                "Calculated additional upgrade investment and estimated DPS gained per extra currency spent.",
            ],
            "CONFIGURATIONS": [
                "Added local saving and loading of simulator configurations.",
                "Added share links containing the selected unit, enchantment, and comparison levels.",
                "Improved comparison controls and readable statistic tables.",
            ],
        }
    },
    {
        version: "V2.5.4",
        date: "October 28, 2026",
        title: "Unit Database Sorting & Comparison",
        description: "Expanded database tools for comparing units and keeping track of favorites.",
        changes: {
            "DATABASE CONTROLS": [
                "Added sorting by available unit statistics and cost-related fields.",
                "Added favorite units with local browser persistence and a favorites filter.",
                "Improved combinations of rarity, attack type, and search filters.",
            ],
            "UNIT COMPARISON": [
                "Added a multi-unit comparison modal with rarity, attack type, placement cost, damage, HPS, DPS, range, and placement limit.",
                "Added independent level selection and best-value indicators for numeric comparison fields.",
            ],
        }
    },
    {
        version: "V2.5.2",
        date: "October 28, 2026",
        title: "Website-Wide Navigation & Preferences",
        description: "Improved shared navigation, searching, and persistent interface preferences.",
        changes: {
            "NAVIGATION & SEARCH": [
                "Refined shared desktop and mobile navigation and dropdown behavior.",
                "Added website-wide search for site pages and available unit information.",
                "Improved navigation visibility, focus states, and access to frequently used site areas.",
            ],
            "WEBSITE PREFERENCES": [
                "Added settings for page transitions and compact layout, saved locally on the device.",
                "Introduced consistent loading and motion behavior with reduced-motion support.",
                "Improved common responsive controls and page-level interface spacing.",
            ],
        }
    },
    {
        version: "V2.5.0",
        date: "October 26, 2026",
        title: "Code & Visual Overhaul",
        changes: [
            {
                type: "major",
                text: "Redesigned the website with a retro arcade-inspired visual style."
            },
            {
                type: "visual",
                text: "Introduced pixel-style fonts across the website, including headings, navigation, buttons, and statistics."
            },
            {
                type: "visual",
                text: "Refined panels, borders, cards, and interface elements while preserving the original color scheme."
            },
            {
                type: "visual",
                text: "Improved unit rarity frames, card hover effects, and unit detail layouts."
            },
            {
                type: "visual",
                text: "Enhanced statistics tables with clearer level indicators, alternating rows, and improved readability."
            },
            {
                type: "feature",
                text: "Added dynamic unit counts to rarity categories in the Unit Database."
            },
            {
                type: "improvement",
                text: "Reorganized website code to make files easier to navigate and future updates easier to implement."
            },
            {
                type: "improvement",
                text: "Centralized navigation configuration and standardized shared styling across all pages."
            },
            {
                type: "improvement",
                text: "Cleaned up duplicate imports and improved code consistency."
            },
            {
                type: "fix",
                text: "Fixed duplicate HTML element IDs and other minor structural issues."
            }
        ]
    },
    {
        version: "V2.4.0",
        title: "The Team Builder Update",
        date: "October 25, 2026",
        description: "Introducing the Custom Team Builder! Create, customize, " +
            "save, capture, and share your own teams. This update " +
            "adds powerful team management tools, automatic stat " +
            "calculations, and major quality-of-life improvements.",
        changes: {
            "NEW — CUSTOM TEAM BUILDER": [
                "Added a brand-new five-slot Custom Team Builder.",
                "Added a searchable Unit Picker.",
                "Added rarity and unit type filters.",
                "Prevented duplicate units within the same team.",
                "Added individual unit enchantment customization.",
                "Added options to replace, remove, move, and swap units.",
                "Team slots now display unit images, names, enchantments, and placement limits.",
                "Unit calculations automatically use maximum-level stats.",
                "Added separate Team Builder and Recommended Teams tabs."
            ],
            "NEW — ENCHANTMENT CUSTOMIZATION": [
                "Added support for Battery, Hunt, Hook, Eco, Haywire, Springlock, and Soul.",
                "Each unit can have its own selected enchantment.",
                "Enchantment bonuses are included in team calculations.",
                "Added animated gradient styling for special enchantments.",
                "Selected enchantments are preserved when saving and sharing teams."
            ],
            "NEW — TEAM STATISTICS": [
                "Added automatically calculated Team DPS.",
                "Added Total Upgrade Cost.",
                "Added Total Placements.",
                "Added Max Deployed DPS.",
                "Added Max Deployed Cost.",
                "Statistics automatically update when teams change.",
                "Added customizable statistic visibility settings.",
                "Stat display preferences are saved between visits.",
                "Improved handling of units with incomplete statistics."
            ],
            "NEW — SAVED TEAMS": [
                "Added the MY TEAMS management system.",
                "Create and name multiple custom teams.",
                "Automatically save team changes in browser storage.",
                "Switch between previously saved teams.",
                "Rename existing teams.",
                "Duplicate teams with their units and enchantments.",
                "Delete unwanted teams.",
                "Added active-team information and save status indicators.",
                "Added error feedback when saving fails."
            ],
            "NEW — CAPTURE TEAM": [
                "Added the CAPTURE TEAM button.",
                "Export custom teams as PNG images.",
                "Captured images include all five team slots.",
                "Unit images, names, enchantments, and placement counts appear in captures.",
                "Supports complete and partially filled teams.",
                "PNG filenames are generated from the team name."
            ],
            "NEW — SHAREABLE TEAM LINKS": [
                "Added the SHARE TEAM button.",
                "Generate shareable links containing custom team configurations.",
                "Added a preview window for incoming shared teams.",
                "Shared-team previews display units and enchantments.",
                "Import shared teams directly into MY TEAMS.",
                "Importing does not replace existing saved teams.",
                "Added validation for invalid units and enchantments.",
                "Prevented duplicate units in imported teams.",
                "Improved handling of invalid and unsupported share links."
            ],
            "IMPROVEMENTS & QUALITY OF LIFE": [
                "Added dedicated configuration and team management dialogs.",
                "Improved unit selection and enchantment controls.",
                "Added keyboard focus trapping inside Team Builder modals.",
                "Improved Escape-key and modal closing behavior.",
                "Added responsive layouts for team cards and dialogs.",
                "Preserved the original Recommended Teams section.",
                "Improved visual consistency across the Teams page."
            ],
            "BUG FIXES": [
                "Fixed dismissed share links reopening after refreshing.",
                "Fixed invalid share links repeatedly displaying errors.",
                "Improved saved-team error reporting.",
                "Improved handling of incomplete unit statistics.",
                "Verified saved-team creation, renaming, duplication, deletion, and switching.",
                "Verified PNG capture and shared-team importing.",
                "Verified existing Recommended Teams functionality."
            ]
        }
    },
    {
        version: "V2.3.5",
        date: "October 25, 2026",
        title: "Unit Information, Links & QOL",
        description: "Improved unit information transparency, introduced shareable unit links, and added quality-of-life features to make the Unit Database easier to navigate.",
        changes: {
            "UNIT INFORMATION": [
                "Added Last Updated dates to individual unit pages, showing when each unit's information was last reviewed.",
                "Added Reviewed and Data Uncertain indicators based on existing unit warning data.",
                "Units without a valid Last Updated date automatically hide the date and confidence row.",
                "Added a Last Updated tooltip explaining what the review date represents.",
                "Added contextual Data Confidence tooltips explaining Reviewed and Data Uncertain statuses.",
                "Centered the Data Confidence tooltip beneath its indicator for improved readability."
            ],
            "UNIT LINK SHARING": [
                "Added Copy Unit Link buttons to individual unit pages.",
                "Added Copy Link buttons to Unit Database cards for quick sharing.",
                "Added confirmation messages when a link is successfully copied.",
                "Added error feedback when a link cannot be copied.",
                "Refined database copy-link buttons with a smaller, centered design that fits better on mobile."
            ],
            "UNIT DATABASE": [
                "Added a dynamic result counter showing how many units match the current search and filters.",
                "Added a Clear All Filters button that resets the search bar, rarity filters, and attack-type filters.",
                "Made the Clear All Filters button appear only when a search or filter is active.",
                "Kept result counts synchronized with search and filter changes."
            ],
            "QUALITY OF LIFE": [
                "Added hover, keyboard-focus, and tap interactions to unit information tooltips.",
                "Added Escape-key and outside-click dismissal for information tooltips.",
                "Improved accessibility with descriptive labels, focus indicators, and result announcements.",
                "Preserved existing unit statistics, warning messages, calculations, and database navigation."
            ]
        }
    },
    {
        version: "V2.3.1",
        date: "October 25, 2026",
        title: "Mobile Navigation & Quality of Life",
        description: "A website-wide mobile optimization update focused on improving navigation, touchscreen usability, responsive layouts, and accessibility across Five TD's Central.",
        changes: {
            "MOBILE NAVIGATION": [
                "Improved mobile navigation with smoother expandable sections.",
                "Automatically expands the navigation section containing the current page.",
                "Improved active-page highlighting throughout the mobile menu.",
                "Mobile navigation now closes correctly when switching to desktop layouts.",
                "Improved keyboard accessibility and reduced-motion support."
            ],
            "QUALITY OF LIFE": [
                "Added a shared back-to-top button across the website.",
                "Back-to-top button appears automatically when scrolling down.",
                "Back-to-top button stays hidden while the mobile navigation menu is open.",
                "Improved touchscreen interaction and button sizing across multiple pages."
            ],
            "MOBILE RESPONSIVENESS": [
                "Improved mobile layouts for the Unit Database and individual Unit pages.",
                "Optimized Nights, Tierlist, Best Towers, and Teams pages for smaller screens.",
                "Improved Stats Simulator controls, unit selection, and enchantment modal.",
                "Improved Raw DPS Chart readability with horizontal table scrolling.",
                "Updated the Updates page with more responsive cards, articles, and image galleries.",
                "Improved FAQ readability, accordion controls, and suggestion form usability."
            ],
            "ACCESSIBILITY": [
                "Improved keyboard focus indicators on interactive elements.",
                "Improved readability and text wrapping on smaller screens.",
                "Added or improved reduced-motion support across multiple pages.",
                "Improved mobile scrolling behavior for tables, filters, and modals."
            ],
            "WEBSITE": [
                "Completed a website-wide mobile responsiveness pass.",
                "Preserved existing desktop layouts, game data, and calculations.",
                "Updated the website version to V2.3.1."
            ]
        }
    },
    {
        version: "V2.3.0",
        date: "October 25, 2026",
        title: "Code Reorganization & Optimization",
        description: "A major behind-the-scenes update focused on reorganizing " +
            "website files, centralizing shared functionality, and " +
            "improving overall code maintainability.",
        changes: {
            "CODE ORGANIZATION": [
                "Reorganized CSS and JavaScript into dedicated folders.",
                "Separated website data, shared utilities, and page-specific scripts.",
                "Separated Tierlist, Best Towers, and Teams data from their page logic.",
                "Centralized website version history functionality.",
                "Improved file organization for easier future development."
            ],
            "SHARED UTILITIES": [
                "Centralized unit lookup and warning handling.",
                "Standardized rarity colors across supported pages.",
                "Centralized HPS and DPS calculations.",
                "Introduced shared number, currency, and multiplier formatting.",
                "Consolidated enchantment display utilities."
            ],
            "STATS SIMULATOR": [
                "Standardized enchantment properties, including range and attackSpeed.",
                "Corrected attack-speed enchantment calculations.",
                "Improved consistency between HPS and DPS calculations.",
                "Updated enchantment effect labels for better clarity.",
                "Removed obsolete enchantment property handling."
            ],
            "BUG FIXES": [
                "Fixed Raw DPS Chart issues encountered during code reorganization.",
                "Standardized script loading order across updated pages.",
                "Removed unused legacy helper functions.",
                "Removed duplicate rarity color definitions.",
                "Removed outdated enchantment property checks."
            ],
            "WEBSITE": [
                "Cleaned up duplicate number-formatting functions.",
                "Improved code readability and maintainability.",
                "Preserved existing unit data and META rankings.",
                "Maintained the existing website design, colors, and animations.",
                "Prepared the website for future features and improvements."
            ]
        }
    },
    {
        version: "V2.2.0",
        date: "October 24, 2026",
        title: "Enchant Recommendations + Version History",
        description: "Expanded the website's META guides with enchant recommendations " +
            "and introduced an interactive version history.",
        changes: {
            "BEST TOWERS": [
                "Added recommended Best Enchants for ranked units.",
                "Added Alternative Enchant recommendations.",
                "Added enchant-colored borders around unit images.",
                "Introduced animated Soul, Haywire, and Springlock gradients.",
                "Synchronized enchant border and text animations.",
                "Improved enchant information layouts for mobile devices."
            ],
            "TEAMS": [
                "Added recommended enchants to team compositions.",
                "Added enchant recommendations for substitute units.",
                "Added enchant-colored borders and hover labels.",
                "Improved the presentation of team enchant information."
            ],
            "WEBSITE": [
                "Added an interactive Version History modal.",
                "Made the footer version number clickable.",
                "Added a version selector and detailed changelog.",
                "Added responsive version history navigation."
            ]
        }
    },
    {
        version: "V2.1.1",
        date: "October 23, 2026",
        title: "Visual Polish + Mobile Improvements",
        description: "A small polish update focused on the presentation of " +
            "website components and mobile usability.",
        changes: {
            "VISUAL IMPROVEMENTS": [
                "Refined spacing between content sections.",
                "Adjusted card borders and hover transitions.",
                "Improved text alignment and readability."
            ],
            "MOBILE": [
                "Refined layouts for smaller screens.",
                "Improved spacing around buttons and interactive elements.",
                "Adjusted responsive content widths."
            ]
        }
    },
    {
        version: "V2.1.0",
        date: "October 22, 2026",
        title: "FAQ & Suggestions + QOL",
        description: "Introduced a dedicated FAQ and suggestions section " +
            "alongside additional usability improvements.",
        changes: {
            "FAQ & SUGGESTIONS": [
                "Added the FAQ & Suggestions page.",
                "Added a section for frequently asked questions.",
                "Added a suggestion submission interface.",
                "Organized frequently requested information."
            ],
            "QUALITY OF LIFE": [
                "Improved access to important website pages.",
                "Refined navigation consistency.",
                "Improved content organization and readability."
            ],
            "UNITS": [
                "Added Sparky."
            ]
        }
    },
    {
        version: "V2.0.5",
        date: "October 21, 2026",
        title: "META Navigation + Best Towers",
        description: "Expanded the META section with new recommendations " +
            "and easier access to ranking guides.",
        changes: {
            "BEST TOWERS": [
                "Added the Best Towers page.",
                "Added Best Starter rankings.",
                "Added Best Early Game and Best Mid Game rankings.",
                "Added Best Late Game rankings.",
                "Added Best 5th Unit recommendations.",
                "Added Best Damage and Best Overall rankings.",
                "Introduced ranked unit cards with featured placements."
            ],
            "NAVIGATION": [
                "Expanded the META navigation section.",
                "Added direct access to Tierlist and Best Towers.",
                "Improved navigation between META guides."
            ],
            "UPDATES": [
                "Improved access to website update information."
            ]
        }
    },
    {
        version: "V2.0.4",
        date: "October 20, 2026",
        title: "Teams Guide + Compositions",
        description: "Expanded the META guides with team compositions " +
            "designed for different gameplay situations.",
        changes: {
            "TEAMS": [
                "Added the Teams page.",
                "Added Best Solo Team recommendations.",
                "Added Best Endless Team recommendations.",
                "Added Best Crowd Control Team recommendations.",
                "Added Best Boss Killer Team recommendations.",
                "Added Best Speedrun Team recommendations.",
                "Added substitute units for team compositions."
            ],
            "INTERFACE": [
                "Added team composition cards.",
                "Improved the organization of team recommendations.",
                "Adjusted team layouts for different screen sizes."
            ]
        }
    },
    {
        version: "V2.0.3",
        date: "October 19, 2026",
        title: "Tierlist Improvements",
        description: "Expanded and refined the unit tierlist following " +
            "the major website redesign.",
        changes: {
            "TIERLIST": [
                "Refined the presentation of unit rankings.",
                "Improved spacing between tier sections.",
                "Adjusted unit card layouts.",
                "Improved the visibility of unit names and images.",
                "Included warning indicators for uncertain unit data."
            ],
            "QUALITY OF LIFE": [
                "Improved readability across ranking sections.",
                "Refined responsive tierlist layouts."
            ]
        }
    },
    {
        version: "V2.0.2",
        date: "October 18, 2026",
        title: "Stats Simulator Improvements",
        description: "A focused update to improve the presentation " +
            "and usability of the website's calculation tools.",
        changes: {
            "STATS SIMULATOR": [
                "Refined the simulator interface.",
                "Improved the organization of unit statistics.",
                "Adjusted calculation result presentation.",
                "Improved input and output readability."
            ],
            "TOOLS": [
                "Improved visual consistency between tools.",
                "Refined tool layouts for smaller screens."
            ],
            "UNITS": [
                "Added Animdude."
            ]
        }
    },
    {
        version: "V2.0.1",
        date: "October 17, 2026",
        title: "Post-Overhaul Fixes",
        description: "A follow-up maintenance release focused on " +
            "polishing the redesigned website.",
        changes: {
            "BUG FIXES": [
                "Addressed minor layout inconsistencies.",
                "Refined navigation behavior.",
                "Improved spacing around page content."
            ],
            "QUALITY OF LIFE": [
                "Adjusted hover and focus effects.",
                "Improved mobile content presentation.",
                "Refined responsive styling."
            ]
        }
    },
    {
        version: "V2.0.0",
        date: "October 16, 2026",
        title: "Complete Website UI + QOL Overhaul",
        description: "A major overhaul of Five TD's Central, featuring " +
            "a redesigned interface, improved navigation, " +
            "and extensive quality-of-life improvements.",
        changes: {
            "COMPLETE UI REDESIGN": [
                "Reworked the overall website appearance.",
                "Unified fonts and colors across all pages.",
                "Redesigned the website navigation system.",
                "Improved page layouts, spacing, and alignment.",
                "Refined unit cards, buttons, and content panels.",
                "Introduced more consistent hover effects and transitions.",
                "Improved the website's dark-themed visual identity."
            ],
            "QUALITY OF LIFE": [
                "Improved mobile navigation and usability.",
                "Made important pages and tools easier to access.",
                "Improved the organization of website information.",
                "Standardized interactions between pages.",
                "Improved readability throughout the website.",
                "Refined responsive layouts for different screen sizes."
            ],
            "WEBSITE STRUCTURE": [
                "Consolidated shared website styling.",
                "Improved shared JavaScript functionality.",
                "Standardized navigation across website pages.",
                "Reduced inconsistencies between page designs.",
                "Improved overall website organization."
            ],
            "META": [
                "Expanded the website's unit-ranking features.",
                "Introduced the Tierlist system.",
                "Added tier rankings from S through F.",
                "Improved the presentation of unit comparisons."
            ]
        }
    },
    {
        version: "V1.5.0",
        date: "October 15, 2026",
        title: "Website Tools Expansion",
        description: "Expanded and organized the website's collection " +
            "of useful tools and resources.",
        changes: {
            "TOOLS": [
                "Improved access to the Stats Simulator.",
                "Improved access to the Raw DPS Chart.",
                "Refined tool navigation links.",
                "Improved consistency between tool pages."
            ],
            "QUALITY OF LIFE": [
                "Improved organization of website tools.",
                "Refined tool page descriptions."
            ]
        }
    },
    {
        version: "V1.4.2",
        date: "October 14, 2026",
        title: "Mobile Layout Fixes",
        description: "A maintenance update focused on improving " +
            "the website experience on smaller devices.",
        changes: {
            "MOBILE": [
                "Adjusted responsive navigation spacing.",
                "Improved card sizing on mobile screens.",
                "Refined mobile content alignment.",
                "Improved readability on narrow displays."
            ],
            "FIXES": [
                "Addressed minor responsive layout issues.",
                "Adjusted overflow behavior in content sections."
            ]
        }
    },
    {
        version: "V1.4.1",
        date: "October 13, 2026",
        title: "Unit Database Improvements",
        description: "Improved the presentation and organization " +
            "of the Unit Database.",
        changes: {
            "UNIT DATABASE": [
                "Refined unit information layouts.",
                "Improved rarity color presentation.",
                "Adjusted unit statistic labels.",
                "Improved readability of unit upgrade information."
            ],
            "QUALITY OF LIFE": [
                "Refined unit image presentation.",
                "Improved spacing within unit information panels."
            ],
            "UNITS": [
                "Added Bear5"
            ]
        }
    },
    {
        version: "V1.4.0",
        date: "October 12, 2026",
        title: "Nights Database Improvements",
        description: "Expanded and refined the presentation " +
            "of the Nights database.",
        changes: {
            "NIGHTS": [
                "Improved night information cards.",
                "Refined the night details modal.",
                "Improved the presentation of wave information.",
                "Organized starting cash, rewards, and boss details.",
                "Refined filtering controls.",
                "Improved the Max Mode interface."
            ],
            "MOBILE": [
                "Adjusted night grid layouts.",
                "Improved modal sizing on smaller screens."
            ],
            "UNITS": [
                "Added Fastbear."
            ]
        }
    },
    {
        version: "V1.3.1",
        date: "October 11, 2026",
        title: "Navigation + Bug Fixes",
        description: "A smaller maintenance update focused on " +
            "navigation reliability and page consistency.",
        changes: {
            "NAVIGATION": [
                "Refined desktop dropdown behavior.",
                "Improved mobile navigation interactions.",
                "Adjusted navigation spacing and alignment."
            ],
            "FIXES": [
                "Addressed inconsistent navigation styling.",
                "Refined page transition behavior."
            ]
        }
    },
    {
        version: "V1.3.0",
        date: "October 10, 2026",
        title: "Website Content Expansion",
        description: "Expanded the website's informational content " +
            "and improved the organization of existing pages.",
        changes: {
            "CONTENT": [
                "Expanded unit information presentation.",
                "Improved the organization of game-related information.",
                "Refined page descriptions and headings.",
                "Improved access to existing website resources."
            ],
            "WEBSITE": [
                "Refined footer navigation links.",
                "Improved consistency between informational pages."
            ]
        }
    },
    {
        version: "V1.2.1",
        date: "October 9, 2026",
        title: "Navigation Maintenance",
        description: "A maintenance update focused on improving " +
            "navigation consistency across the website.",
        changes: {
            "NAVIGATION": [
                "Continued improvements to shared navigation.",
                "Refined links between database and tool pages.",
                "Improved mobile menu consistency."
            ],
            "QUALITY OF LIFE": [
                "Adjusted navigation spacing.",
                "Refined interactive menu behavior."
            ]
        }
    },
    {
        version: "V1.2.0",
        date: "October 8, 2026",
        title: "Database + DPS Improvements",
        description: "Improved unit statistic terminology and consistency " +
            "between the Unit Database and Raw DPS Chart.",
        changes: {
            "UNIT DATABASE": [
                "Standardized unit statistic terminology.",
                "Corrected the CD label to HPS.",
                "Improved the presentation of unit statistics.",
                "Preserved existing unit data."
            ],
            "RAW DPS": [
                "Updated displayed statistics to use HPS.",
                "Standardized DPS calculations using damage and HPS.",
                "Improved consistency with the Unit Database."
            ],
            "NAVIGATION": [
                "Improved navigation between tools and databases.",
                "Refined mobile menu behavior."
            ]
        }
    },
    {
        version: "V1.1.0",
        date: "October 7, 2026",
        title: "Website Styling + Navigation",
        description: "An early improvement update focused on creating " +
            "a more consistent website experience.",
        changes: {
            "DESIGN": [
                "Improved website fonts and colors.",
                "Refined page backgrounds and content panels.",
                "Improved visual consistency across pages."
            ],
            "NAVIGATION": [
                "Introduced shared navigation components.",
                "Improved desktop dropdown menus.",
                "Improved mobile navigation layouts."
            ],
            "QUALITY OF LIFE": [
                "Refined page spacing and alignment.",
                "Improved responsive styling."
            ]
        }
    },
    {
        version: "V1.0.0",
        date: "October 6, 2026",
        title: "Initial Website Launch",
        description: "The beginning of Five TD's Central, an unofficial " +
            "information hub for Five TD's players.",
        changes: {
            "CORE WEBSITE": [
                "Launched the Five TD's Central Home page.",
                "Introduced the Unit Database.",
                "Added unit images, rarities, and statistics.",
                "Added unit searching and filtering."
            ],
            "GAME INFORMATION": [
                "Introduced the Nights database.",
                "Added game night and wave information."
            ],
            "TOOLS": [
                "Introduced the Stats Simulator.",
                "Introduced the Raw DPS Chart."
            ],
            "WEBSITE": [
                "Added basic website navigation.",
                "Introduced the original website design."
            ],
            "UNITS": [
                "Added all summons units.",
                "Added Shadow Bonnie.",
                "Added Radioactive Foxy."
            ]
        }
    }
];
