import subprocess

res = subprocess.run(['tasklist', '/FI', 'PID eq 193520', '/V', '/FO', 'LIST'], capture_output=True, text=True)
print(res.stdout)
