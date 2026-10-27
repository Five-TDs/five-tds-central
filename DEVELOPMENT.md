# Five TD’s Central — File Map

## Find what you need

| Task | Location |
| --- | --- |
| Edit navigation links | `js/config/navigation.js` |
| Edit shared colors and fonts | `css/arcade-theme.css` |
| Edit shared navigation styling | `css/site.css` |
| Edit navigation and back-to-top behavior | `js/site.js` |
| Edit a page’s layout | `css/pages/<page>.css` |
| Edit a page’s interactions | `js/pages/<page>.js` |
| Edit unit stats or game content | `js/data/` |
| Edit reusable calculations and formatting | `js/shared/` |
| Add or replace images | `images/` |

## Adding a page

1. Create `<page>.html`, `css/pages/<page>.css`, and optionally `js/pages/<page>.js`.
2. Include `css/site.css`, the page CSS, then `css/arcade-theme.css` last.
3. Include `js/config/navigation.js` immediately before `js/site.js`, using matching `defer` attributes if loaded in the document head.
4. Include any required `js/data/` and `js/shared/` scripts before the page script.
5. Add the page once in `js/config/navigation.js`.
6. Test mobile navigation and the page’s interactive features.

## Typography

Change `--arcade-pixel` and `--arcade-body` in `css/arcade-theme.css`. Google Fonts require an internet connection; fallback fonts are provided.

## Verification

Run `node --check` for JavaScript syntax. Confirm HTML asset references. In a browser, test the navigation, unit search and filters, unit details, Nights modes, tierlist, Best Towers, Team Builder save/load/share/PNG, Raw DPS, Stats Simulator, Updates, FAQ, and mobile layouts. Syntax and path checks do not verify interactions.

## Release

Refactor candidate. Public deployment has not been confirmed.

## Final overhaul maintenance checks

From the website root, run `python tools/check_site.py` to validate all HTML pages, linked local assets, unique script references, unique HTML IDs, shared navigation dependencies, and retro theme loading order. When Node.js is installed, it also checks JavaScript syntax.

Run `node tools/check_calculations.js` to verify the core HPS, DPS, rarity color, and formatting helpers with representative inputs.

The `tools/` folder is for development checks and does not need to be linked from any website page.

## Overhaul status

The final organization and consistency pass removed duplicate navigation configuration imports and standardized the shared CSS loading order. The game data, page behavior scripts, images, and saved-team storage formats remain untouched in this pass. Automated checks do not replace live browser tests of saved teams, URL sharing, capture/export, responsive layouts, and interactive page behavior. Public deployment has not been confirmed.
