from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.styles = []
        self.assets = []
        self.ids = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
            self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet' and attrs.get('href'):
            self.styles.append(attrs['href'])
            self.assets.append(attrs['href'])
        if tag in ('img', 'source') and attrs.get('src'):
            self.assets.append(attrs['src'])


def local_path(asset):
    if asset.startswith(('https://', 'http://', 'data:', '//', '#')):
        return None
    return ROOT / asset.split('?', 1)[0].split('#', 1)[0].lstrip('/')


def validate():
    errors = []
    pages = sorted(ROOT.glob('*.html'))
    scripts = sorted((ROOT / 'js').rglob('*.js'))
    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding='utf-8'))
        for item, count in Counter(parser.scripts).items():
            if count > 1:
                errors.append(f'{page.name}: duplicate script {item}')
        for item, count in Counter(parser.ids).items():
            if count > 1:
                errors.append(f'{page.name}: duplicate ID {item}')
        for asset in parser.assets:
            target = local_path(asset)
            if target is not None and not target.is_file():
                errors.append(f'{page.name}: missing asset {asset}')
        if 'js/site.js' in parser.scripts:
            if 'js/config/navigation.js' not in parser.scripts:
                errors.append(f'{page.name}: missing navigation configuration')
            elif parser.scripts.index('js/config/navigation.js') > parser.scripts.index('js/site.js'):
                errors.append(f'{page.name}: navigation configuration loads after site.js')
        if page.name == 'teams.html':
            builder_order = [
                'js/pages/teams.js',
                'js/pages/team-builder/unit-picker.js',
                'js/pages/team-builder/slots-and-stats.js',
                'js/pages/team-builder/slot-actions.js',
                'js/pages/team-builder/saved-teams.js',
                'js/pages/team-builder/capture.js',
                'js/pages/team-builder/sharing.js',
                'js/pages/team-builder/accessibility.js',
            ]
            positions = [parser.scripts.index(script) if script in parser.scripts else -1 for script in builder_order]
            if -1 in positions or positions != list(range(positions[0], positions[0] + len(positions))):
                errors.append('teams.html: Team Builder scripts must load in the documented order')
        if 'js/meta/ranking-engine.js' in parser.scripts:
            required = ['js/data/units.js', 'js/config/meta-settings.js']
            if any(script not in parser.scripts or parser.scripts.index(script) > parser.scripts.index('js/meta/ranking-engine.js') for script in required):
                errors.append(f'{page.name}: units and META settings must load before the ranking engine')
        if 'css/arcade-theme.css' not in parser.styles:
            errors.append(f'{page.name}: missing arcade theme')
        elif parser.styles[-1] != 'css/arcade-theme.css':
            errors.append(f'{page.name}: arcade theme must load last')
    try:
        subprocess.run(['node', '--version'], check=True, capture_output=True)
        for script in scripts:
            result = subprocess.run(['node', '--check', str(script)], capture_output=True, text=True)
            if result.returncode:
                errors.append(f'{script.relative_to(ROOT)}: JavaScript syntax error: {result.stderr.strip()}')
    except FileNotFoundError:
        print('Node.js unavailable; JavaScript syntax checks skipped')
    print(f'Checked {len(pages)} HTML pages and {len(scripts)} JavaScript files')
    if errors:
        print('\n'.join(errors))
        return 1
    print('All automated checks passed')
    return 0

if __name__ == '__main__':
    sys.exit(validate())
