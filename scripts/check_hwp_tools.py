import sys
import subprocess
import shutil

print("Python executable:", sys.executable)

# Check libreoffice / soffice
soffice = shutil.which("soffice") or shutil.which("libreoffice")
print("soffice found:", soffice)

# Check win32com
try:
    import win32com.client
    print("win32com is available!")
    try:
        hwp = win32com.client.gencache.EnsureDispatch("HWPFrame.HwpObject")
        print("HWP COM object created successfully!")
        hwp.Quit()
    except Exception as e:
        print("HWP COM object failed:", e)
except ImportError:
    print("win32com is NOT installed.")

# Check pip list
try:
    res = subprocess.run([sys.executable, "-m", "pip", "list"], capture_output=True, text=True)
    pkgs = [line for line in res.stdout.splitlines() if any(k in line.lower() for k in ['hwp', 'pdf', 'win32', 'office', 'com'])]
    print("Relevant packages installed:", pkgs)
except Exception as e:
    print("pip list failed:", e)
