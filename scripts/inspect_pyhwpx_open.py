import inspect
from pyhwpx import Hwp

hwp = Hwp(visible=False)
print("open method doc/signature:")
print(inspect.getsource(hwp.open))
hwp.quit()
