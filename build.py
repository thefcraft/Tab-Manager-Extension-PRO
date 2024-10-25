from typing import Optional
import subprocess
import os
os.chdir(os.path.dirname(__file__))

def main()->Optional[bool]:
    try:
        os.chdir('source-code')
        print("Building source code...")
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