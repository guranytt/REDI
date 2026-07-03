import os
import shutil

os.makedirs(r"src\app\browse", exist_ok=True)
if os.path.exists(r"src\app\page.tsx") and not os.path.exists(r"src\app\browse\page.tsx"):
    shutil.move(r"src\app\page.tsx", r"src\app\browse\page.tsx")

if os.path.exists(r"src\app\landing\page.tsx"):
    shutil.move(r"src\app\landing\page.tsx", r"src\app\page.tsx")

try:
    if os.path.exists(r"src\app\landing"):
        os.rmdir(r"src\app\landing")
except:
    pass

print("Swapped successfully")
