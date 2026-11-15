import os
import sys
from pyhwpx import Hwp

test_input = os.path.abspath(r"docs\Efficiency_DB\02_노인복지\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.hwpx")
test_output = os.path.abspath(r"docs\Efficiency_DB\02_노인복지\03_노인맞춤돌봄서비스_사업안내_2026_첨부1.pdf")

print("Initializing Hwp via pyhwpx...")
try:
    hwp = Hwp(visible=False)
    print("Hwp initialized successfully!")
    print("Opening:", test_input)
    hwp.open(test_input)
    print("Saving as PDF:", test_output)
    hwp.save_as(test_output, "PDF")
    hwp.quit()
    
    if os.path.exists(test_output):
        print(f"SUCCESS: Created PDF ({os.path.getsize(test_output)} bytes)")
    else:
        print("FAILED: Output not found")
except Exception as e:
    print("Error:", e)
