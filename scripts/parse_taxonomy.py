import re
import json

with open('src/data/welfare-taxonomy.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const WELFARE_FIELDS\s*=\s*(\[\s*\{.*?\}\s*\]);', text, re.DOTALL)
js_str = m.group(1)

def js_to_json(js):
    # remove single-line comments
    js = re.sub(r'//.*', '', js)
    # quote unquoted object keys
    js = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js)
    
    # replace single-quoted strings with double quotes
    def repl_sq(match):
        s = match.group(1)
        # escape double quotes and actual newlines inside
        s = s.replace('"', '\\"')
        s = s.replace('\n', '\\n').replace('\r', '\\r')
        return '"' + s + '"'
        
    js = re.sub(r"'((?:[^'\\]|\\.)*)'", repl_sq, js)
    # remove trailing commas before } or ]
    js = re.sub(r',\s*([}\]])', r'\1', js)
    return js

clean = js_to_json(js_str)
data = json.loads(clean)
print('Parsed successfully! Total fields:', len(data))
for d in data:
    print(' -', d['id'], '|', d['name'], '| 부처:', d.get('ministries'))
