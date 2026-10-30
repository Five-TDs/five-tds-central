# Five TD's Central — Website Editing Handbook

> **Start here.** This is the single guide for maintaining the website. You can edit the HTML, CSS and JavaScript directly; no build process or account is required. The game data has been reorganized for readability, **not changed**.

## Jump to what you need

**Frequently used:** [Quick start](#quick-start) · [Find the right file](#find-the-right-file) · [Unit data](#unit-data) · [Nights data](#nights-data) · [META rankings](#meta-rankings) · [Team Builder](#team-builder) · [Game updates](#game-updates-and-website-versions) · [Testing](#checking-your-changes)

**Everything else:** [Folders](#project-map) · [Enchantments](#enchantment-data) · [Page scripts](#page-script-reference) · [Shared scripts](#shared-scripts) · [Design and mobile](#design-navigation-and-mobile) · [Adding content](#common-editing-recipes) · [Data safety](#keeping-the-game-data-safe) · [Publishing](#publishing) · [Troubleshooting](#troubleshooting) · [Known META limits](#what-meta-scoring-can-and-cannot-predict)

---

## Quick start

1. Unzip the site. Open the **`Five-TDs-Central`** folder in VS Code or your preferred editor.
2. Use the table below to find the **single file that owns what you want to change**.
3. Edit that file, save, and preview the site locally. Use a small server so URLs and browser storage behave consistently:

   ```bash
   python -m http.server 8000
   ```

4. Open `http://localhost:8000/` in your browser.
5. After a data edit, run `node tools/verify_data.js`, plus the checks in [Checking your changes](#checking-your-changes).
6. Review the changed pages at desktop and phone widths; then publish.

**Editing conventions:** JavaScript uses four spaces and consistent UTF-8/LF line endings, defined in [`.editorconfig`](.editorconfig). The scripts are classic browser JavaScript; the site does **not** require a bundler. Keep script loading order in the HTML, especially on the Teams and META pages. Don't replace the existing `<script>` tags with `type="module"` unless you intentionally convert their shared state.

**If your edit doesn't show up:** hard reload (often `Ctrl+Shift+R`) and confirm the browser is serving the file you edited. Deployed sites can cache JavaScript.

## Find the right file

| I want to change… | Edit this first | Usually don't edit |
|---|---|---|
| Unit names, rarity, image paths, stats, placement costs, abilities | [`js/data/units.js`](js/data/units.js) | META score formulas |
| Night waves, rewards, starting cash | [`js/data/nights-data.js`](js/data/nights-data.js) | Night page renderer |
| Enchant names and percent modifiers | [`js/data/enchantments.js`](js/data/enchantments.js) | Unit modal UI |
| Ranking priorities, group-size assumptions, team role patterns | [`js/config/meta-settings.js`](js/config/meta-settings.js) | Original unit stats |
| Ranking calculations | [`js/meta/ranking-engine.js`](js/meta/ranking-engine.js) | Separate hard-coded ranked lists |
| Tier names and descriptions | [`js/data/tierlist-data.js`](js/data/tierlist-data.js) | Ranking algorithm |
| Best Towers categories | [`js/config/meta-settings.js`](js/config/meta-settings.js) | Unit stat values |
| Team template names/categories | [`js/data/teams-data.js`](js/data/teams-data.js) | Saved teams in browsers |
| Navigation buttons or categories | [`js/config/navigation.js`](js/config/navigation.js) | Every page's HTML |
| Font and theme colors | [`css/arcade-theme.css`](css/arcade-theme.css) | Data scripts |
| Shared navigation and mobile menu | [`js/site.js`](js/site.js), [`css/site.css`](css/site.css) | Individual page CSS first |
| Team Builder unit picker | [`js/pages/team-builder/unit-picker.js`](js/pages/team-builder/unit-picker.js) | Recommended team renderer |
| Team Builder stats or slot display | [`js/pages/team-builder/slots-and-stats.js`](js/pages/team-builder/slots-and-stats.js) | META data |
| Saved teams / rename / duplicate | [`js/pages/team-builder/saved-teams.js`](js/pages/team-builder/saved-teams.js) | Local-storage keys |
| Sharing / importing a team | [`js/pages/team-builder/sharing.js`](js/pages/team-builder/sharing.js) | Unit names and saved schemas |
| Team image export | [`js/pages/team-builder/capture.js`](js/pages/team-builder/capture.js) | Stats calculations |
| Team synergy analysis | [`js/shared/team-synergy.js`](js/shared/team-synergy.js) | Original unit data |
| Unit detail modal / extra simulator tools | [`js/shared/interactive-tools.js`](js/shared/interactive-tools.js) | Page's main data |
| Performance graphs | [`js/shared/performance-graphs.js`](js/shared/performance-graphs.js) | Unit stats |
| Unit Stat List columns, single-column sorting, unit row display | [`js/pages/raw-dps.js`](js/pages/raw-dps.js) | Original unit statistics |
| Enchantment borders, gradients and hover labels | [`css/arcade-theme.css`](css/arcade-theme.css), [`js/shared/enchant-ui.js`](js/shared/enchant-ui.js) | Game-data enchant values |
| Clickable graph values and metric choices | [`js/shared/performance-graphs.js`](js/shared/performance-graphs.js) | Individual game data records |
| A specific page's layout | `css/pages/<page>.css` | Global site styles |
| Game patch notes | [`js/data/updates.js`](js/data/updates.js) | Website version history |
| Website version history | [`js/data/version-history-data.js`](js/data/version-history-data.js) | Game patch notes |
| Validate a formatting-only refactor | `node tools/verify_data.js` | Game values |

**Search tip:** Use VS Code's **Ctrl+P** to open a file by name, **Ctrl+Shift+O** to jump to functions in that file, and **Ctrl+Shift+F** to search the whole project for a unit name, CSS class, or function. This is much faster than scrolling through one very large script.

---

## Project map

```text
Five-TDs-Central/
  README.md                      You are here
  .editorconfig                  Shared editor formatting rules
  index.html                     Homepage
  units.html                     Unit database
  unit.html                      Individual unit page
  nights.html                    Nights database
  tierlist.html                  Tierlist
  best-towers.html               Best Towers
  teams.html                     Recommended teams + team builder
  stats-simulator.html           Stats and enchantment simulator
  raw-dps.html                   Sortable all-unit statistics
  updates.html                   Game updates
  faq.html                       FAQ
  css/
    site.css                     Navigation and common layout
    arcade-theme.css             Theme and shared visual styling
    ftc-roadmap-features.css     Extra tools, modals and graphs
    pages/                       One stylesheet per page
  js/
    site.js                      Site-wide navigation and preferences
    config/                      Editable navigation and META settings
    data/                        Source game data and page definitions
    meta/
      ranking-engine.js          Scoring, tiers, best units and templates
    pages/                       Page-specific behavior
      team-builder/              Small, separately editable builder features
    shared/                      Reusable UI, calculations, charts and tools
  images/                        All image assets
  tools/                         Validation and META inspection scripts
```

### Updating the Unit Stat List

The page is still named `raw-dps.html` for existing links and bookmarks, but visitors see **Unit Stat List**. To add a sortable statistic, edit the `columns` list and `summarizeUnit()` in `js/pages/raw-dps.js`. Every header is generated from that list, and only one column can be the active sort. The `sortRecords()` function controls ascending and descending ordering and places missing values last. Non-damaging support units remain listed, with missing damage values shown as **—**.

### Restoring or changing enchantment frames

Ranked Best Towers and recommended Team cards use the enchantment returned by `enchantFor()` in `js/meta/ranking-engine.js`. The page renderers add the shared `enchant-frame` and `enchant-frame-<enchant>` classes. Frame colors, animated Haywire/Springlock/Soul gradients, and the top-down enchantment label live together at the end of `css/arcade-theme.css`. `js/shared/enchant-ui.js` supplies the named colors. Update the CSS classes and color map together if you add an enchantment. On touchscreens the top label stays visible; on desktop it slides down on hover or keyboard focus. Reduced-motion mode disables the animated gradients.

### Updating META stage-budget scoring

The rankings compare every recorded upgrade level against units at the same level, then model how many copies of a single unit can be placed and upgraded under example investment budgets. The model allows different upgrade levels on separate copies of that unit and respects the maximum placement limit. Adjust the early, mid and late budget ranges and their relative weights in `js/config/meta-settings.js`, under `phaseInvestmentBudgets` and `phaseBudgetWeights`. The model evaluates both single-target DPS and a separately labeled grouped-target estimate. Its total DPS assumes attacks are in range and ignores wave income timing, enemies' actual positions, target resistances, buff stacking, and unrecorded toxic damage. These are ranking scenarios, not measured battle outcomes. Night starter recommendations still use starting cash from `js/data/nights-data.js`.

To see the current rankings and level-by-level audit, run `node tools/inspect_meta.js`. To check the scenario math and original data, run `node tools/check_meta_scenarios.js` and `node tools/verify_data.js`. Waiting for a nearby-cost unit is considered for any role with meaningfully better first-level DPS and either group or deployed DPS potential, not solely matching attack shapes.

### Updating META enchant recommendations

The source enchantment percentages live in `js/data/enchantments.js`; do not duplicate them in page scripts. The recommended best and alternative enchants are computed by `enchantFor()` in `js/meta/ranking-engine.js` and exposed through `BEST_UNIT_ENCHANTS`. Recommended team enchantments are generated from the same system as `team.enchants` and `team.substituteEnchants`. Best Towers and recommended Teams now render these recommendations directly, using colors from `js/shared/enchant-ui.js`.

### Changing the interactive graphs

`js/shared/performance-graphs.js` renders all shared upgrade performance graphs. The `metrics` array defines selectable statistics; `levelsOf()` produces plotted level values. Clicking or keyboard-activating a point shows its exact Y-coordinate in the chart and in an accessible text summary. Visual styling is shared in `css/arcade-theme.css`.

**Where data stops and calculations begin:** Data files describe the game. `js/meta/ranking-engine.js` *reads* those files and generates current Tierlist, Best Towers and team recommendations. Changing a scoring assumption must not silently rewrite unit data.

## Keeping the game data safe

The source values in this refactor were checked against the previous build: the original **unit records, Night rewards/cash, enchantments, patch notes and version records remain identical**, including the order of records and all optional fields. Code formatting and file locations changed, not the gameplay information.

### Verify nothing changed

```bash
node tools/verify_data.js
```

This compares evaluated data against compact fingerprints in [`tools/data-reference.json`](tools/data-reference.json). It also verifies the derived META outputs, so a formatting-only change to the ranking engine can be checked.

- **Refactoring or formatting only?** This command should pass **without** updating the reference.
- **Intentionally changing game balance or records later?** Make and verify that deliberate change, then run `node tools/verify_data.js --refresh` to approve the new reference. Don't refresh just to make an unexplained mismatch disappear.
- **Changing META weights on purpose?** The generated-ranking fingerprint will change. Inspect the rankings and then refresh the reference after confirming the new behavior is intentional.
- **Before a large edit:** Keep a copy of the previous ZIP. The fingerprint confirms equivalence but is **not a backup** of the underlying data.

The original values are **not** duplicated into an alternate JSON database. `units.js`, `nights-data.js`, `enchantments.js` and the existing update files remain the sources of truth, so no two copies can drift out of sync.

### Don't rename these fields casually

Some old field names are part of the site's contract: `units`, `nights`, `enchants`, `name`, `placement`, `maxLimit`, `stats`, `stats[].cost`, `stats[].cooldown`, `stats[].level` and `stats[].type`. Saved teams, shared URLs and calculations rely on them.

**Important: `stats[].cooldown` really stores HPS (hits per second).** Keep the source field name for compatibility. Actual listed DPS is:

```text
DPS = damage × cooldown
```

Here, `cooldown` is HPS, **not** seconds between attacks. Never divide damage by this field.

**Level 1 cost equals placement cost.** Later `stats[].cost` values are upgrade prices, and investment through a level is placement plus every prior upgrade.

---

## Unit data

**Primary source:** [`js/data/units.js`](js/data/units.js). Search for `name: "Unit Name"` to find the specific unit. Units are listed as records in one `const units = [...]` array. Each `stats` array contains that unit's recorded upgrade levels in order.

### Field dictionary

| Property | Meaning | Remember |
|---|---|---|
| `name` | The unit's exact identifier/display name | Used by saved teams, share links and META matching |
| `rarity` | Rarity label | Rarity styling depends on the spelling |
| `type` | General attack or support type | Per-level `stats[].type` can differ |
| `image` | Relative image file | Check that the image exists |
| `lastUpd` | Unit data review date | Keep existing value unless knowingly reviewed |
| `placement` | Cost to put down Level 1 | This **is** Level 1's cost |
| `maxLimit` | Maximum simultaneous placements | Used in deployed-DPS estimates |
| `obtainment` | How the unit is obtained | Preserve exact text |
| `passives` | Documented abilities/effects | Preserve structured ability information |
| `warn` | Data warning (if present) | Keep warning accuracy |
| `stats[].level` | The numbered upgrade level | Match the same level when comparing units |
| `stats[].cost` | Price for that upgrade | Typically absent at Level 1 |
| `stats[].damage` | Damage per hit | Some utility units don't have ordinary damage |
| `stats[].cooldown` | **HPS** | Used in `DPS = damage × HPS` |
| `stats[].range` | Range | May vary at each level |
| `stats[].type` | Attack type at that level | Can change during progression |
| `stats[].slow` / `rangeBuff` | Listed utility effects | Don't invent missing buff or tick values |

### Adding or editing a unit

1. Copy the shape of a **similar existing unit** in `units.js`, keeping the key names exact.
2. Enter the exact unit name, image, rarity, type, obtainment, placement price, and max placements.
3. Enter **each recorded level separately**. Use `cost` only for actual upgrades; don't add a second Level 1 cost.
4. Preserve any abilities and warnings from the source. Do not replace missing information with made-up numbers.
5. Confirm every image path and inspect the Unit Database, full unit page, modal, simulator, graph, Tierlist and Team Builder.
6. If adding a genuinely new unit, intentionally refresh the reference fingerprint after reviewing the data change.

### Attack types and practical differences

- **Single** targets one enemy per listed attack.
- **Pierce** can strike enemies along a line.
- **Toxic Pierce** also applies an ongoing effect; its tick damage/duration must come from real source data to be simulated precisely.
- **Splash** hits the target plus nearby enemies.
- **Cone** can affect enemies in a frontal sector.
- **AOE** can affect enemies inside its area.
- **Support / Slower** offers effects not captured by ordinary single-target DPS.

These attack types do not automatically provide a known enemy hit count. The META model uses **hypothetical grouped-target scenarios**, not guaranteed in-game hits.

## Nights data

**Primary source:** [`js/data/nights-data.js`](js/data/nights-data.js). Find `game: ...`, then the `number` of the Night. Every Night may have a `normal` and a `max` object with separate properties.

| Field | What to update |
|---|---|
| `game` | Which game/chapter contains the Night |
| `number` | The Night's number |
| `normal.alias`, `max.alias` | Display name for the mode |
| `coinReward` | Coin reward |
| `remnantReward` | Remnant reward; preserve numbers/ranges as supplied |
| `waveCount` | Total number of waves |
| `startingCash` | Cash available at the start of that mode |

If adding a Night, provide **both modes** when known and check the Night page and the Night selector on META pages. Don't infer cash from rewards; starting cash is its own field.

## Enchantment data

**Primary source:** [`js/data/enchantments.js`](js/data/enchantments.js). Find the enchantment name (`Battery`, `Eco`, `Soul`, etc.) and edit only confirmed properties.

| Field | Meaning |
|---|---|
| `name` | Display label |
| `damage` | Percentage damage modifier |
| `range` | Percentage range modifier |
| `attackSpeed` | Percentage attack-interval change; a **negative** value attacks faster |
| `cost` | Percentage change to prices |
| `prob` | Listed roll probability |
| `colorClass` | Optional visual style hook |

For a negative `attackSpeed` value, the expected preview calculation is `modified HPS = base HPS / (1 + attackSpeed / 100)` when the denominator is positive. This preserves the site's interpretation of the source modifier.

The unit modal, Stats Simulator and Team Builder all read these values. Changes should be checked in all three places. Enchantment recommendations are derived by the META engine; the public META cards do not need a separate enchantment badge list.

---

## META rankings

**Config:** [`js/config/meta-settings.js`](js/config/meta-settings.js)  
**Engine:** [`js/meta/ranking-engine.js`](js/meta/ranking-engine.js)  
**Views:** [`js/pages/tierlist.js`](js/pages/tierlist.js), [`js/pages/best-towers.js`](js/pages/best-towers.js), [`js/pages/teams.js`](js/pages/teams.js)

### If you want to rebalance the guides

1. Check the **actual unit stats** in `js/data/units.js`, including upgrades at every level and placement limits.
2. Adjust the **editable assumptions** in `js/config/meta-settings.js`. That's the preferred way to tune tiers and recommendations.
3. Use `node tools/inspect_meta.js` to inspect the generated comparison and rankings.
4. Verify starter affordability for each Night/mode and check boss, crowd, utility and overall rankings separately.
5. Check the 28-unit tier coverage and the generated recommended teams.
6. Only change `js/meta/ranking-engine.js` when modifying **how the calculation works**, not simply which priorities matter.

### Configuration you can edit safely

| Setting | What it changes |
|---|---|
| `referenceRange` | Reference used by the range-weighting model |
| `rangeWeightMin`, `rangeWeightMax` | Bounds on reach contributions |
| `groupedTargetCounts` | Assumed grouped-enemy scenarios (currently 1, 3, 5) |
| `targetCountWeights` | Relative weighting for those scenarios; should sum to 1 |
| `estimatedHitLimits` | Assumed upper bounds by attack role |
| `closePlacementGap` | How close two opening costs must be for a worthwhile wait comparison |
| `minimumBetterOpeningDps` | Opening DPS improvement threshold |
| `minimumBetterWavePotential` | Wave-damage improvement threshold |
| `tierWidths` | How many units fall into successive tiers |
| `levelWeights` | Relative contributions of stats and efficiency; should sum to 1 |
| `teamRoles` | Which functional roles the generated teams try to fill |
| `rankingModes` | Which categories appear on Best Towers |

`js/data/tierlist-data.js`, `best-towers-data.js` and `teams-data.js` define **category names and empty UI structures**. The engine fills them at runtime. Don't hand-edit the generated unit names into three separate lists; they'd drift out of sync.

### Inspect what the engine did

```bash
node tools/inspect_meta.js
```

To put the output into an optional local report **outside** the website folder:

```bash
node tools/inspect_meta.js > ../meta-review.md
```

The rankings compare matched upgrade levels, placement cost, upgrades, HPS, damage, DPS, range, max placements and known abilities. Group damage uses estimated coverage, not invented exact cone angles or poison ticks.

## Team Builder

The Team Builder has been split from one large file into focused features. **Keep these scripts loaded in order on [`teams.html`](teams.html):**

| Order | File | What it handles |
|---|---|---|
| 1 | [`js/pages/teams.js`](js/pages/teams.js) | Recommended team cards, substitutes, page tabs |
| 2 | [`unit-picker.js`](js/pages/team-builder/unit-picker.js) | Unit search, filters, picker and unit configuration |
| 3 | [`slots-and-stats.js`](js/pages/team-builder/slots-and-stats.js) | Slot display, upgrade totals and team statistics |
| 4 | [`slot-actions.js`](js/pages/team-builder/slot-actions.js) | Slot movement, replacing/removing, display preferences |
| 5 | [`saved-teams.js`](js/pages/team-builder/saved-teams.js) | Create, rename, copy, delete, save/load and active-team feedback |
| 6 | [`capture.js`](js/pages/team-builder/capture.js) | Export team as an image |
| 7 | [`sharing.js`](js/pages/team-builder/sharing.js) | Encode, decode, validate, share and import team links |
| 8 | [`accessibility.js`](js/pages/team-builder/accessibility.js) | Focus management and keyboard modal navigation |

The scripts remain plain JavaScript and intentionally share the same page scope. **Do not reorder them or load them with `async`**. If you add another builder feature, use a focused file in `js/pages/team-builder/` and load it after the declarations it depends on.

**Saved teams live in each visitor's browser**, not a server. Their saved-team key is `fivetds-saved-teams-v1`; saved schema, unit names and share-link formats must remain compatible. Do not clear local storage just to fix a UI issue.

**Synergy calculations:** [`js/shared/team-synergy.js`](js/shared/team-synergy.js) reads the actual selected team, not only recommended cards. It estimates opening affordability, damage coverage, crowd control, support and investment. These are advisory, not guarantees of beating a specific Night.

## Page script reference

| Page | Script | Main responsibilities |
|---|---|---|
| Home | [`home.js`](js/pages/home.js) | Homepage behavior |
| Unit Database | [`units.js`](js/pages/units.js) | Unit cards, filters, favorites and comparison |
| Full unit details | [`unit.js`](js/pages/unit.js) | Upgrade tables and unit detail |
| Nights | [`nights.js`](js/pages/nights.js) | Night filters and modal display |
| Tierlist | [`tierlist.js`](js/pages/tierlist.js) | Display ranked tiers |
| Best Towers | [`best-towers.js`](js/pages/best-towers.js) | Display category recommendations |
| Recommended Teams | [`teams.js`](js/pages/teams.js) | Recommended teams and tab switching |
| Stats Simulator | [`stats-simulator.js`](js/pages/stats-simulator.js) | Unit/enchant selection and simulated stats |
| Unit Stat List | [`raw-dps.js`](js/pages/raw-dps.js) | All-unit statistic tables, column sorting and filters |
| Game updates | [`updates.js`](js/pages/updates.js) | Patch notes rendering |
| FAQ | [`faq.js`](js/pages/faq.js) | FAQ interactions |

Each page's layout lives in `css/pages/<matching-page>.css`. Shared UI and responsive tweaks live in `css/site.css`, `css/arcade-theme.css` and `css/ftc-roadmap-features.css`.

## Shared scripts

| File | Used for |
|---|---|
| [`js/site.js`](js/site.js) | Navigation, mobile menu, settings and search |
| [`js/shared/interactive-tools.js`](js/shared/interactive-tools.js) | Unit modal, enchantment preview, simulator extras and Team Builder extensions |
| [`js/shared/performance-graphs.js`](js/shared/performance-graphs.js) | Unit progression and performance graphs |
| [`js/shared/team-synergy.js`](js/shared/team-synergy.js) | Role coverage and team investment analysis |
| [`js/shared/stat-utils.js`](js/shared/stat-utils.js) | Shared stat and DPS helpers |
| [`js/shared/unit-utils.js`](js/shared/unit-utils.js) | Finding units and warning handling |
| [`js/shared/format-utils.js`](js/shared/format-utils.js) | Display formatting |
| [`js/shared/enchant-ui.js`](js/shared/enchant-ui.js) | Enchantment colors and labels |
| [`js/shared/meta-night-controls.js`](js/shared/meta-night-controls.js) | Night selectors on META pages |
| [`js/shared/version-history.js`](js/shared/version-history.js) | Website version-history modal |

These files contain **shared behavior**, not another copy of the game data. Keep a calculation in a shared helper if multiple pages need it.

## Game updates and website versions

The website has two unrelated timelines. Keep them separate:

- **Game patch notes:** [`js/data/updates.js`](js/data/updates.js), shown at [`updates.html`](updates.html). Each `UPDATES` entry includes its name, supplied date (or empty if unknown), banner and sections. Use the existing `updateList` helper. Preserve the game's wording and never guess a release date.
- **Website releases:** [`js/data/version-history-data.js`](js/data/version-history-data.js), shown by the modal from [`js/shared/version-history.js`](js/shared/version-history.js). Keep newest first, and use dates like `October 29, 2026`. Add detailed, implemented changes under categories such as UI, META, Database and Fixes.

The README is for **maintenance**, not a duplicate changelog. The version-history script is the place for release-by-release information.

## Enchantment frame gradients

The animated enchantment borders and top-down hover labels on Best Towers and Recommended Teams are managed in [`css/arcade-theme.css`](css/arcade-theme.css). They share the same colors and timing as the text effects in the Stats Simulator.

- **Haywire:** purple (`#8b5cf6`) to mint (`#98ffcc`), cycling every **2.5 seconds**.
- **Springlock:** mint (`#98ffcc`) to red (`#ff3b3b`), cycling every **2.5 seconds**.
- **Soul:** teal (`#14b8a6`) to pink (`#ff69b4`), cycling every **1.2 seconds**.

To edit the colors, change `--enchant-frame-gradient` in the matching `.enchant-frame-*` rule. To change animation speeds, edit `--enchant-cycle` on the base `.enchant-frame` rule or the Soul override. The label text uses the same gradient as the border. Other enchantments keep their existing solid-color frames. Hover reveals the label on desktop, and it stays visible on touchscreens. Reduced-motion preferences pause gradient animations.

## Design, navigation and mobile

- The shared navigation entries are declared **once** in [`js/config/navigation.js`](js/config/navigation.js). The menu rendering and settings button are in [`js/site.js`](js/site.js).
- The body font, pixel headings, colors and panel appearance come from [`css/arcade-theme.css`](css/arcade-theme.css).
- Shared layout, mobile menu locking and floating buttons are in [`css/site.css`](css/site.css).
- Page-specific layouts are in `css/pages/`. Extra modal and tool visuals are in [`css/ftc-roadmap-features.css`](css/ftc-roadmap-features.css).
- **Stylesheet order matters:** load `css/arcade-theme.css` **last** in each page. The site validator checks this.
- Prefer wrapping grids, `minmax(0, 1fr)`, reasonable `clamp()` sizes and stacked mobile layouts. Avoid fixed-width modals or clipped controls.
- Keep keyboard navigation, focus outlines, modal close buttons, menu scroll-lock, and reduced-motion support working.
- Keep recommended-team portraits and substitutes centered in matching columns.

### Adding a new page

1. Create `<page>.html`, its `css/pages/<page>.css`, and optionally `js/pages/<page>.js`.
2. Load `css/site.css`, the page's styles and any shared feature styles, with `css/arcade-theme.css` **last**.
3. Include `js/config/navigation.js` before `js/site.js`.
4. Load required unit/data/settings scripts before page renderers; META pages need `js/config/meta-settings.js` before `js/meta/ranking-engine.js`.
5. Add a link to [`js/config/navigation.js`](js/config/navigation.js).
6. Run the checks and test mouse, keyboard and touch layouts.

## Common editing recipes

### I want to make one unit stronger or cheaper

Update the **verified game values** in `js/data/units.js`. The engine recalculates recommendations, graph inputs, Team Builder and simulator values from that record. Double-check per-level `cost`, `damage`, `cooldown` (HPS) and `range`. Then inspect META behavior and explicitly refresh data fingerprints.

### I want the META to prioritize crowds more

Edit `js/config/meta-settings.js`, adjusting grouped-target weighting or the mode settings. Avoid changing game stats. Inspect the effect with `node tools/inspect_meta.js`. Do not pretend that scenario estimates are exact measured hits.

### I want a new Night to appear

Add it under the right game in `js/data/nights-data.js`, including correct starting cash and mode rewards, then check `nights.html` and the META Night selector.

### I want to update the Team Builder UI

Find the responsible file in the ordered table above. Don't alter unrelated saved-team schema fields or URLs. Confirm selecting/editing a slot, saving/loading an existing team, comparing stats and sharing still work.

### I want to add a new enchantment

Add the exact modifier record in `js/data/enchantments.js`, then test the Unit Database modal, Stats Simulator and Team Builder. Do not introduce damage ticks or attack properties absent from the actual game data.

### I want a new website version listed

Add an entry at the top of `WEBSITE_VERSION_HISTORY` in `js/data/version-history-data.js`. Preserve the existing shape and date style. Verify the homepage modal can display every change group.

---

## Checking your changes

From the `Five-TDs-Central` folder, run:

```bash
node tools/verify_data.js
python tools/check_site.py
node tools/check_calculations.js
node tools/check_meta.js
node tools/check_owner_meta.js
node tools/check_meta_level_and_enchants.js
node tools/check_meta_scenarios.js
```

**`verify_data.js` is special:** it confirms that all current source data and derived META output still match the preserved reference. A deliberate balance change will need review and then `--refresh`.

**Browser checklist:** homepage and menu; mobile navigation opening and closing without background scrolling; Unit Database favorites, filtering and comparison; unit modal tabs and enchantments; level/HPS/DPS displays; Night Normal/MAX cash; Tierlist, Best Towers and Teams recommendations; Team Builder selection, saved teams and share links; simulator graphs; game updates and website version modal. Try narrow phone and wide desktop sizes.

**Automated checks cannot tell you whether exact gameplay behavior or every responsive pixel is correct.** The META model is an aid to planning, and missing game mechanics should stay explicitly uncertain.

## Troubleshooting

| Problem | What to check first |
|---|---|
| The browser shows old code | Hard refresh, caching, deployed path |
| A unit has disappeared | Exact `name`, level array, filters and rarity |
| DPS looks wrong | `cooldown` is HPS: **multiply** damage by it |
| Total investment is wrong | Level 1 equals placement; later costs accumulate |
| META page shows no rankings | Load settings, data, `js/meta/ranking-engine.js`, then page script—in that order |
| Team Builder stops loading after a refactor | Ensure all eight Teams scripts are loaded in order, with no missing files |
| Saved teams disappear | Browser origin/storage and unchanged `fivetds-saved-teams-v1` schema |
| Enchantment dropdown is empty | Confirm `js/data/enchantments.js` loads before the modal UI |
| Wrong Night starter recommendation | Check `startingCash`, game/Night/mode choice and `placement` |
| A rank seems surprising | Run `node tools/inspect_meta.js`; inspect stage-by-stage stats and group assumptions |
| Buttons or tables overlap on mobile | Look at the page CSS, shared modal CSS and grid minimum widths |
| Mobile menu leaves a top gap | Check fixed nav height, body scroll lock and viewport sizing |
| `verify_data.js` reports differences | Compare against the original source; don't automatically accept unexplained changes |
| A photo or stylesheet is missing | Check exact filename casing and relative asset paths |

## What META scoring can and cannot predict

The database provides damage, HPS, range, prices, placements, attack types and documented abilities. It does **not** record every enemy's HP, speed, pathing, targeting, splash size, cone angle, poison tick, buff stacking or actual enemies hit. It also cannot reproduce a complete Night's income from starting cash alone.

Consequently the META engine compares **recorded per-level values** and models **hypothetical enemy group sizes**, not real-time match damage. Utility units must be assessed for their abilities instead of made-up DPS. Balance changes should be justified by source stats and in-game tests when available.

## Publishing

1. Keep an archive of the previous working site and data.
2. Verify that all game values are intentional and run the checks.
3. Test the site on a local server and a preview host at phone/desktop sizes.
4. Update website version history only when preparing a real release.
5. Upload the **contents** of the site folder, preserving `js/`, `css/`, `images/` and relative paths.
6. Verify pages and scripts load without cached older files.
7. Test an already-saved Team Builder lineup and share link. Browser-local saved teams are not included in ZIP backups.

---

**Maintenance rule:** Keep one source of truth for game data; keep calculations in shared tools; keep page renderers focused; and preserve names, storage keys, and load order. This README tells you where each part lives so future updates are simpler, safer and quicker.
