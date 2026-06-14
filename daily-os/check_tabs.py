import re
content = open(r'f:\Claude Space\soma-daily-os\daily-os\app\index.html', 'r', encoding='utf-8').read()
tabs = re.findall(r'id="tab-([a-z]+)"', content)
print('Tab content divs:', tabs)

# Check all JS files for encoding
import os
js_dir = r'f:\Claude Space\soma-daily-os\daily-os\app\js\dashboard'
for fn in os.listdir(js_dir):
    if fn.endswith('.js'):
        with open(os.path.join(js_dir, fn), 'rb') as f:
            head = f.read(4)
        enc = 'UTF-16' if head[:2] in (b'\xff\xfe', b'\xfe\xff') else 'UTF-8'
        print(f'{fn}: {enc} (first bytes: {head})')
