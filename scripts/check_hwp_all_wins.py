import subprocess
import win32gui
import win32process

res = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq Hwp.exe', '/FO', 'CSV'], capture_output=True, text=True)
pids = []
for line in res.stdout.splitlines()[1:]:
    parts = line.split(',')
    if len(parts) >= 2:
        try:
            pids.append(int(parts[1].strip('"')))
        except:
            pass

print("HWP PIDs:", pids)

wins = []
def enum_cb(hwnd, extra):
    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    if pid in pids:
        title = win32gui.GetWindowText(hwnd)
        cls = win32gui.GetClassName(hwnd)
        visible = win32gui.IsWindowVisible(hwnd)
        extra.append((pid, hwnd, visible, cls, title))

win32gui.EnumWindows(enum_cb, wins)
for p, h, v, c, t in wins:
    print(f"PID={p}, HWND={h}, Visible={v}, Class={c}, Title='{t}'")
