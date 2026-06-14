import json
import re

log_path = '/Users/hoo__oong/.gemini/antigravity-ide/brain/22d8c70d-fcf2-4d55-a80d-140f82a6e51b/.system_generated/logs/transcript.jsonl'
files_to_recover = [
    '/Users/hoo__oong/Desktop/kult/src/App.jsx',
    '/Users/hoo__oong/Desktop/kult/src/pages/CreditCheckout.jsx',
    '/Users/hoo__oong/Desktop/kult/src/pages/SpaceDetail.jsx',
    '/Users/hoo__oong/Desktop/kult/src/pages/Home.jsx',
    '/Users/hoo__oong/Desktop/kult/src/components/Header.jsx',
    '/Users/hoo__oong/Desktop/kult/src/index.css',
    '/Users/hoo__oong/Desktop/kult/index.html',
    '/Users/hoo__oong/Desktop/kult/src/pages/Join.jsx',
    '/Users/hoo__oong/Desktop/kult/src/pages/Admin.jsx',
    '/Users/hoo__oong/Desktop/kult/src/components/Footer.jsx'
]

recovered_contents = {path: None for path in files_to_recover}

with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get('content', '')
            for path in files_to_recover:
                # ONLY grab the FIRST occurrence
                if f'File Path: `file://{path}`' in content and recovered_contents[path] is None:
                    recovered_contents[path] = content
        except Exception as e:
            pass

for path, raw_content in recovered_contents.items():
    if not raw_content:
        print(f"Could not find view_file output for {path}")
        continue
    
    lines = raw_content.split('\n')
    extracted_lines = []
    start_parsing = False
    for line in lines:
        if 'Please note that any changes targeting the original code should remove the line number, colon, and leading space.' in line:
            start_parsing = True
            continue
        if start_parsing:
            if line == 'The above content shows the entire, complete file contents of the requested file.' or line.startswith('The above content does NOT show the entire file'):
                break
            match = re.match(r'^\d+:\s?(.*)$', line)
            if match:
                extracted_lines.append(match.group(1))
            else:
                extracted_lines.append(line)
    
    with open(path, 'w') as f:
        f.write('\n'.join(extracted_lines))
    print(f"Recovered {path}!")
