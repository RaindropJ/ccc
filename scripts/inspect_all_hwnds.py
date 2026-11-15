import win32gui
import win32process

hwnds = []
def enum_windows_callback(hwnd, extra):
    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    if pid == 193520:
        extra.append(hwnd)

win32gui.EnumWindows(enum_windows_callback, hwnds)
print("Top-level HWNDs for PID 193520:", hwnds)

for h in hwnds:
    print(f"HWND {h}: Text='{win32gui.GetWindowText(h)}', Class='{win32gui.GetClassName(h)}', Visible={win32gui.IsWindowVisible(h)}")
    # Find child windows
    child_hwnds = []
    def enum_child_callback(chwnd, extra):
        extra.append(chwnd)
    try:
        win32gui.EnumChildWindows(h, enum_child_callback, child_hwnds)
        for ch in child_hwnds:
            ctext = win32gui.GetWindowText(ch)
            ccls = win32gui.GetClassName(ch)
            if ctext or win32gui.IsWindowVisible(ch):
                print(f"   Child {ch}: Text='{ctext}', Class='{ccls}'")
    except Exception as e:
        print("   Child error:", e)
