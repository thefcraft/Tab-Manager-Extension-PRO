import os, shutil
import zipfile
os.chdir(os.path.dirname(__file__))

if os.path.exists(os.path.join('..', 'out-extension')): shutil.rmtree(os.path.join('..', 'out-extension'))
if os.path.exists(os.path.join('..', 'out-extension-firefox')): shutil.rmtree(os.path.join('..', 'out-extension-firefox'))
os.makedirs(os.path.join('..', 'out-extension'), exist_ok=True)
os.makedirs(os.path.join('..', 'out-extension-firefox'), exist_ok=True)

# build the source for manifest v3
shutil.copy(os.path.join('..', 'source-code', 'out', 'dashboard.html'), os.path.join('..', 'out-extension', 'dashboard.html'))
shutil.copytree(os.path.join('..', 'source-code', 'out', 'assets'), os.path.join('..', 'out-extension', 'assets'))
shutil.copytree(os.path.join('..', 'source-code', 'out', 'next'), os.path.join('..', 'out-extension', 'next'))
shutil.copy('manifest-v3.json', os.path.join('..', 'out-extension', 'manifest.json'))
shutil.copy('favicon.ico', os.path.join('..', 'out-extension', 'favicon.ico'))
shutil.copy('popup.html', os.path.join('..', 'out-extension', 'popup.html'))
shutil.copy('popup.js', os.path.join('..', 'out-extension', 'popup.js'))
shutil.copytree('images', os.path.join('..', 'out-extension', 'images'))

# build the source for manifest v2 aka firefox
shutil.copy(os.path.join('..', 'source-code', 'out', 'dashboard.html'), os.path.join('..', 'out-extension-firefox', 'dashboard.html'))
shutil.copytree(os.path.join('..', 'source-code', 'out', 'assets'), os.path.join('..', 'out-extension-firefox', 'assets'))
shutil.copytree(os.path.join('..', 'source-code', 'out', 'next'), os.path.join('..', 'out-extension-firefox', 'next'))
shutil.copy('manifest-v2.json', os.path.join('..', 'out-extension-firefox', 'manifest.json'))
shutil.copy('favicon.ico', os.path.join('..', 'out-extension-firefox', 'favicon.ico'))
shutil.copy('popup.html', os.path.join('..', 'out-extension-firefox', 'popup.html'))
shutil.copy('popup.js', os.path.join('..', 'out-extension-firefox', 'popup.js'))
shutil.copytree('images', os.path.join('..', 'out-extension-firefox', 'images'))

def zip_folder(folder_path: str, zip_path: str) -> None:
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)

zip_folder(os.path.join('..', 'out-extension'), os.path.join('..', 'out-extension-chrome.zip'))