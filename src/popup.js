// popup.js
document.addEventListener('DOMContentLoaded', function() {
    loadWorkspaces();
    document.getElementById('addWorkspaceBtn').addEventListener('click', addWorkspace);
});

function loadWorkspaces() {
    chrome.storage.sync.get('workspaces', function(data) {
        const workspaces = data.workspaces || {};
        const container = document.getElementById('workspaceContainer');
        container.innerHTML = '';

        for (const [name, tabs] of Object.entries(workspaces)) {
            const workspaceElement = createWorkspaceElement(name, tabs);
            container.appendChild(workspaceElement);
        }
    });
}

function createWorkspaceElement(name, tabs) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-md p-4 workspace-card';
    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold text-gray-800">${name}</h2>
            <button class="text-red-500 hover:text-red-700 deleteWorkspaceBtn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <ul class="space-y-2 mb-2">
            ${tabs.map((tab, index) => `
                <li class="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <a href="#" class="text-blue-600 hover:text-blue-800 truncate flex-grow openTabBtn" data-url="${tab.url}">
                        <i class="fas fa-globe mr-2"></i>${tab.title || tab.url}
                    </a>
                    <button class="text-red-500 hover:text-red-700 ml-2 deleteTabBtn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `).join('')}
        </ul>
        <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 w-full mb-2 addCurrentTabBtn">
            Add Current Tab
        </button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full openAllTabsBtn">
            Open All Tabs
        </button>
    `;

    div.querySelector('.deleteWorkspaceBtn').addEventListener('click', () => deleteWorkspace(name));
    div.querySelector('.addCurrentTabBtn').addEventListener('click', () => addCurrentTab(name));
    div.querySelector('.openAllTabsBtn').addEventListener('click', () => openAllTabs(tabs));
    div.querySelectorAll('.openTabBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: btn.dataset.url });
        });
    });
    div.querySelectorAll('.deleteTabBtn').forEach(btn => {
        btn.addEventListener('click', () => deleteTab(name, parseInt(btn.dataset.index)));
    });

    return div;
}

function addWorkspace() {
    const nameInput = document.getElementById('newWorkspaceName');
    const name = nameInput.value.trim();
    if (name) {
        chrome.storage.sync.get('workspaces', function(data) {
            const workspaces = data.workspaces || {};
            workspaces[name] = [];
            chrome.storage.sync.set({ workspaces }, loadWorkspaces);
        });
        nameInput.value = '';
    }
}

function deleteWorkspace(name) {
    chrome.storage.sync.get('workspaces', function(data) {
        const workspaces = data.workspaces || {};
        delete workspaces[name];
        chrome.storage.sync.set({ workspaces }, loadWorkspaces);
    });
}

function addCurrentTab(workspaceName) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        chrome.storage.sync.get('workspaces', function(data) {
            const workspaces = data.workspaces || {};
            workspaces[workspaceName].push({ url: currentTab.url, title: currentTab.title });
            chrome.storage.sync.set({ workspaces }, loadWorkspaces);
        });
    });
}

function deleteTab(workspaceName, tabIndex) {
    chrome.storage.sync.get('workspaces', function(data) {
        const workspaces = data.workspaces || {};
        workspaces[workspaceName].splice(tabIndex, 1);
        chrome.storage.sync.set({ workspaces }, loadWorkspaces);
    });
}

// function openAllTabs(tabs) {
//     tabs.forEach(tab => {
//         chrome.tabs.create({ url: tab.url });
//     });
// }
// function openAllTabsInNewWindow(tabs) {
function openAllTabs(tabs) {
    chrome.windows.create({ url: tabs[0].url }, (newWindow) => {
        tabs.slice(1).forEach(tab => {
            chrome.tabs.create({ windowId: newWindow.id, url: tab.url });
        });
    });
}