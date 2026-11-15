import json

log_path = r'C:/Users/ks011/.gemini/antigravity/brain/3acc3efa-6733-44cb-9b64-bea73592d3fb/.system_generated/logs/transcript.jsonl'
with open(log_path, encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') == 2005:
            print(data.get('content'))
