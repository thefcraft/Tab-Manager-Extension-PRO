# Tab Manager Chrome Extension PRO

**Are You Tired of Having Millions of Open Tabs? Manage Your Tabs in Workspaces!**

Tab Manager is a Chrome extension designed to bring order to your browsing chaos. It helps you organize and manage your browser tabs efficiently by allowing you to create workspaces, save tabs, and quickly access them later. Say goodbye to cluttered browser windows and hello to a more organized, productive browsing experience!

[Install on Firefox](https://addons.mozilla.org/en-US/firefox/addon/tab-manager-extension/)

## TODO

- [ ] switch to IndexedDB insted of localStorage So we can improve image quality a little bit.
- [ ] add darktheme support to popup window.
- [x] add nextJs source code for dashboard.
- [x] add support for export json and load json for saved tabs...
- [ ] add support for publishing tabs/workspaces with others...
- [ ] save data to server with support for firebase to login and logout...
- [ ] add option to edit workspace name for given url/item in a workspace maybe add a selector item at popup dialog window
- [ ] Optional: add feature to add comments + tags on an given url/item.
- [ ] Optional: add feature to add tags + description on workflow.
- [ ] make it more responsive by adding collapsible sidebar

## Build

just run `python build.py` it will generate out-extension and out-extension-firefox

## Features

- Create multiple workspaces to organize your tabs
- Add current tabs to workspaces with a single click
- Open all tabs in a workspace simultaneously
- Delete individual tabs or entire workspaces as needed
- Clean and intuitive user interface for easy tab management

## Why Tab Manager?

- **Reduce Clutter**: Keep your browser tidy by organizing tabs into themed workspaces
- **Boost Productivity**: Quickly switch between different projects or contexts
- **Save Resources**: Close tabs you don't need right now, but keep them easily accessible
- **Never Lose Important Tabs**: Save and categorize important tabs for future reference


![dashboard](/dashboard.png)

![popup](/popup.png)

## Installation

1. Clone this repository or download the source code:
   ```
   git clone https://github.com/thefcraft/tab-manager-chrome-extension.git
   ```

2. Open Google Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the directory containing the extension files i.e., `src folder`

5. The Tab Manager extension should now appear in your Chrome toolbar

## Usage

1. Click on the Tab Manager icon in your Chrome toolbar to open the popup

2. Create a new workspace by entering a name and clicking "Add"

3. Use the "Add Current Tab" button to save the active tab to a workspace

4. Click on a tab's name to open it in a new tab

5. Use the "Open All Tabs" button to open all tabs in a workspace in a new window

6. Delete individual tabs or entire workspaces using the respective delete buttons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt) file for details.
