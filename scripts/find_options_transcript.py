import json

log_path = r'C:/Users/ks011/.gemini/antigravity/brain/3acc3efa-6733-44cb-9b64-bea73592d3fb/.system_generated/logs/transcript.jsonl'
with open(log_path, encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = data.get('content', '')
        if '옵션 a' in content.lower() or '옵션 b' in content.lower() or '옵션 A' in content or '옵션 B' in content:
            print(f"Step {data.get('step_index')} ({data.get('source')}):")
            print(content[:500])
            print("="*60)
