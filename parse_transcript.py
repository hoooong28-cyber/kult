import json
import os

log_path = '/Users/hoo__oong/.gemini/antigravity-ide/brain/22d8c70d-fcf2-4d55-a80d-140f82a6e51b/.system_generated/logs/transcript.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['name'] == 'view_file':
                        print(f"VIEWED: {call['args'].get('AbsolutePath', '')}")
                    elif call['name'] == 'write_to_file':
                        print(f"WROTE: {call['args'].get('TargetFile', '')}")
        except:
            pass
