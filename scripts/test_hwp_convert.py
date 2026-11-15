import os
import sys
import win32com.client

test_input = os.path.abspath(r"docs\Efficiency_DB\02_노인복지\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.hwpx")
test_output = os.path.abspath(r"docs\Efficiency_DB\02_노인복지\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf")

print("Input file:", test_input)
print("Output file:", test_output)

try:
    hwp = win32com.client.gencache.EnsureDispatch("HWPFrame.HwpObject")
    hwp.XHwpWindows.Item(0).Visible = False
    
    # Try RegisterModule if registered in registry
    try:
        hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModule")
    except Exception as e:
        print("RegisterModule note:", e)
        
    print("Opening file...")
    res = hwp.Open(test_input)
    print("Open result:", res)
    
    print("Saving as PDF...")
    # In HWP, SaveAs with format "PDF"
    save_res = hwp.SaveAs(test_output, "PDF")
    print("SaveAs result:", save_res)
    
    hwp.Clear(1)
    hwp.Quit()
    
    if os.path.exists(test_output):
        print(f"SUCCESS! Created PDF ({os.path.getsize(test_output)} bytes)")
    else:
        print("PDF was not created.")
except Exception as e:
    print("Error during conversion:", e)
