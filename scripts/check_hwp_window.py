import win32gui
import win32process

def find_hwp_windows():
    hwp_windows = []
    def enum_cb(hwnd, extra):
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            if title:
                extra.append((pid, title, hwnd))
    
    win32gui.EnumWindows(enum_cb, hwp_windows)
    for pid, title, hwnd in hwp_windows:
        if '한글' in title or 'hwp' in title.lower() or '경고' in title or '확인' in title or 'office' in title.lower():
            print(f"Window: PID={pid}, HWND={hwnd}, Title='{title}'")

if __name__ == '__main__':
    find_hwp_windows()
