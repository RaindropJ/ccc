import inspect
from pyhwpx import Hwp

hwp = Hwp(visible=False)
print("save_as method doc/signature:")
print(inspect.getsource(hwp.save_as))
hwp.quit()
