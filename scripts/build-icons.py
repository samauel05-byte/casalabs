"""Package the approved circular artwork into standard browser/mobile icon files."""
from pathlib import Path
from PIL import Image
import base64
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets/casalabs-mobile-icon-v2.png'
artwork = Image.open(SOURCE).convert('RGB')

def png(path, size):
    image = artwork.resize((size, size), Image.Resampling.LANCZOS)
    image.save(ROOT / path, 'PNG', optimize=True)

for size in (16, 32, 48, 180, 192, 512):
    png(f'assets/casalabs-icon-v3-{size}.png', size)
# The opaque square iOS icon is allowed to fill its canvas. Android's
# separate maskable artwork keeps the entire circle inside the safe area.
maskable = Image.new('RGB', (512, 512), '#FFFFFF')
maskable.paste(artwork.resize((400, 400), Image.Resampling.LANCZOS), (56, 56))
maskable.save(ROOT / 'assets/casalabs-maskable-v3-512.png', optimize=True)
artwork.save(ROOT / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
for path,size in [('apple-touch-icon.png',180),('apple-touch-icon-precomposed.png',180),('favicon.png',48),('assets/favicon-32.png',32),('assets/favicon-logo.png',256),('assets/apple-touch-icon.png',180),('assets/logo-mark.png',256)]:
    png(path,size)
# Older releases and browser fallbacks may still request the SVG icon.
icon = base64.b64encode((ROOT/'assets/casalabs-icon-v3-48.png').read_bytes()).decode()
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><image width="48" height="48" href="data:image/png;base64,{icon}"/></svg>\n'
(ROOT/'favicon.svg').write_text(svg)
(ROOT/'assets/favicon.svg').write_text(svg)
manifest = json.loads((ROOT/'manifest.webmanifest').read_text())
manifest['icons'] = [
    {'src':f'/assets/casalabs-icon-v3-{size}.png','sizes':f'{size}x{size}','type':'image/png','purpose':'any'} for size in (192,512)
] + [{'src':'/assets/casalabs-maskable-v3-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]
for name in ('manifest.webmanifest','manifest-v2.webmanifest','manifest-v3.webmanifest'):
    (ROOT/name).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
links = '''<link rel="icon" href="/favicon.ico?v=3" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/casalabs-icon-v3-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/casalabs-icon-v3-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/casalabs-icon-v3-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/casalabs-icon-v3-180.png">
<link rel="manifest" href="/manifest-v3.webmanifest">
'''
for page in ROOT.glob('*.html'):
    text = page.read_text()
    text = re.sub(r'<link\b[^>]*rel="(?:icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>\s*','',text)
    page.write_text(text.replace('</head>',links+'</head>'))
