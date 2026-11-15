import win32gui

def enum_cb(hwnd, extra):
    if win32gui.IsWindowVisible(hwnd):
        t = win32gui.GetWindowText(hwnd)
        c = win32gui.GetClassName(hwnd)
        if t:
            extra.append((hwnd, c, t))

all_wins = []
win32gui.EnumWindows(enum_cb, all_wins)
for h, c, t in all_wins:
    if any(k in t.lower() for k in ['상위', '버전', '한글', 'hnc', 'office', '경고', '확인', 'error', 'hwp']):
        print(f"Match: HWND={h}, Class={c}, Title='{t}'")
