import re

with open('src/js/hierarchy.js', 'r', encoding='utf-8') as f:
    text = f.read()

# remove multi-line comments
text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
# remove single-line comments
text = re.sub(r'//.*', '', text)

# Let's check with js parser or python
# Let's count parens outside strings
in_backtick = False
in_single = False
in_double = False
escape = False

p_open = []
c_open = []
s_open = []

for idx, ch in enumerate(text):
    if escape:
        escape = False
        continue
    if ch == '\\':
        escape = True
        continue
    if in_backtick:
        if ch == '`':
            in_backtick = False
        continue
    if in_single:
        if ch == "'":
            in_single = False
        continue
    if in_double:
        if ch == '"':
            in_double = False
        continue

    if ch == '`':
        in_backtick = True
    elif ch == "'":
        in_single = True
    elif ch == '"':
        in_double = True
    elif ch == '(':
        p_open.append(idx)
    elif ch == ')':
        if p_open:
            p_open.pop()
        else:
            print(f"Extra ) at {idx}")
    elif ch == '{':
        c_open.append(idx)
    elif ch == '}':
        if c_open:
            c_open.pop()
        else:
            print(f"Extra }} at {idx}")
    elif ch == '[':
        s_open.append(idx)
    elif ch == ']':
        if s_open:
            s_open.pop()
        else:
            print(f"Extra ] at {idx}")

print(f"Unclosed (: {len(p_open)}, unclosed {{: {len(c_open)}, unclosed [: {len(s_open)}")
if p_open or c_open or s_open:
    for pos in p_open:
        line_no = text[:pos].count('\n') + 1
        print(f"Unclosed ( around line {line_no}: {text[pos:pos+50]}")
    for pos in c_open:
        line_no = text[:pos].count('\n') + 1
        print(f"Unclosed {{ around line {line_no}: {text[pos:pos+50]}")
