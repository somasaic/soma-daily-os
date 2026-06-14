import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

JS_DIR = r'f:\Claude Space\soma-daily-os\daily-os\app\js\dashboard'
COMMON_DIR = r'f:\Claude Space\soma-daily-os\daily-os\app\js\common'

exports = {}
for d in [JS_DIR, COMMON_DIR]:
    for fn in os.listdir(d):
        if not fn.endswith('.js'): continue
        path = os.path.join(d, fn)
        content = open(path, 'r', encoding='utf-8').read()
        named = re.findall(r'export\s+(?:function|const|let|var|class)\s+(\w+)', content)
        exports[fn] = set(named)

print("\n=== CHECKING IMPORTS ===")
errors = []
for d in [JS_DIR, COMMON_DIR]:
    for fn in os.listdir(d):
        if not fn.endswith('.js'): continue
        path = os.path.join(d, fn)
        content = open(path, 'r', encoding='utf-8').read()
        for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]", content):
            names_raw = m.group(1)
            source = m.group(2)
            source_fn = source.split('/')[-1]
            if source_fn in exports:
                for name in names_raw.split(','):
                    name = name.strip()
                    if not name: continue
                    if name not in exports[source_fn]:
                        msg = f"  ERROR: {fn} imports '{name}' from {source_fn} - NOT exported! Available: {sorted(exports[source_fn])}"
                        errors.append(msg)
                        print(msg)

if not errors:
    print("  ALL IMPORTS VERIFIED OK!")
else:
    print(f"\n  {len(errors)} import error(s) found!")

# Also check: notes.js, log.js, weekly.js don't have export on functions used by dashboard.js
print("\n=== CHECKING DASHBOARD IMPORTS ===")
dash = open(os.path.join(JS_DIR, 'dashboard.js'), 'r', encoding='utf-8').read()
for m in re.finditer(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]", dash):
    names_raw = m.group(1)
    source = m.group(2)
    source_fn = source.split('/')[-1]
    if source_fn in exports:
        for name in names_raw.split(','):
            name = name.strip()
            if not name: continue
            if name not in exports[source_fn]:
                print(f"  DASHBOARD ERROR: '{name}' not exported from {source_fn}")
                print(f"    Exports: {sorted(exports[source_fn])}")
            else:
                print(f"  OK: '{name}' from {source_fn}")
