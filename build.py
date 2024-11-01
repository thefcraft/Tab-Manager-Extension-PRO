from typing import Optional
import subprocess
import shutil
import os

os.chdir(os.path.dirname(__file__))

def main()->Optional[bool]:
    try:
        os.chdir('source-code')
        print("Building source code...")
        if os.path.exists('out'): shutil.rmtree('out')
        if not os.path.exists('node_modules'): subprocess.call("npm i", shell=True)
        os.makedirs('out', exist_ok=True)
        subprocess.call("npm run build", shell=True)
        os.chdir('..')
    except Exception as e: 
        return print("Error:\n", e)
    
    try:
        os.chdir('scripts')
        print("Generating output...")
        subprocess.call("python build.py", shell=True)
        os.chdir('..')
    except Exception as e: 
        return print("Error:\n", e)
    
    return True
if __name__ == "__main__":
    if main() is None: print("Something went wrong...")        
    else: print("Build succeeded 🎉...")        