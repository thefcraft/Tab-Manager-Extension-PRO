// export interface Item {
//     title: string;
//     url: string;
//     image: string;
// }

// export interface ItemCollection {
//     [key: string]: Item[];
// }

// INFO: REDUCE IMAGE SIZE as we have 5 MB storage of localStorage...
// TODO: switch to IndexedDB which have hundreds of megabytes of storage...

class ItemStorage {
    static STORAGE_KEY = 'itemCollection';
    

    static getItems() {
        if (typeof localStorage !== "undefined") {
            // Client-side-only code
            const storedItems = localStorage.getItem(this.STORAGE_KEY);
            return storedItems ? JSON.parse(storedItems) : {};
        }
        return {};
    }

    static saveItems(items) {
        if (typeof localStorage !== "undefined") {
            // Client-side-only code
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        }
    }

    static addItem(key, item) {
        const items = this.getItems();
        if (!items[key]) items[key] = [];
        if (!item) {this.saveItems(items); return true;}
        if (items[key].some(existingItem => (existingItem.url === item.url))) return false;
        items[key].push(item);
        this.saveItems(items);
        return true;
    }

    static deleteItem(key, index) {
        const items = this.getItems();
        if (items[key] && index > -1 && index < items[key].length) {
            items[key].splice(index, 1);
            this.saveItems(items);
        }
    }

    static updateItem(key, index, newItem) {
        const items = this.getItems();
        if (items[key] && index > -1 && index < items[key].length) {
            items[key][index] = newItem;
            this.saveItems(items);
        }
    }

    static updateItemKey(oldKey, newKey) {
        const items = this.getItems();
        if (items[oldKey]) {
            items[newKey] = items[oldKey];
            delete items[oldKey];
            this.saveItems(items);
            return true;
        }
        return false;
    }

    static deleteItemKey(key) {
        const items = this.getItems();
        if (items[key]) {
            delete items[key];
            this.saveItems(items);
        }
    }
}   

const itemCollection = ItemStorage.getItems();
const workflows = (Object.keys(itemCollection).map((key) => ({
    name: key
})));

// Populate the dropdown with workflows
const workflowSelect = document.getElementById('workflow');
workflows.forEach(workflow => {
    const option = document.createElement('option');
    option.value = workflow.name;
    option.textContent = workflow.name;
    workflowSelect.appendChild(option);
});

// Get the current URL and set it
function getCurrentUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
            document.getElementById('current-url').textContent = activeTab.url || '';
        }
    });
}

// Function to capture a screenshot
function captureScreenshot() {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (image) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            alert("Error capturing screenshot: " + chrome.runtime.lastError.message);
            return;
        }
        

        // Create an image element
        const img = new Image();

        img.onload = () => {
            // Create a canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
  
            // Define maximum dimensions for the thumbnail
            const MAX_WIDTH = 480; // Maximum thumbnail width
            const MAX_HEIGHT = 480; // Maximum thumbnail height
  
            // Calculate the new dimensions maintaining the aspect ratio
            let width = img.width;
            let height = img.height;
  
            // Calculate aspect ratio
            const aspectRatio = width / height;
  
            if (width > height) {
              // If wider than tall
              if (width > MAX_WIDTH) {
                width = MAX_WIDTH;
                height = Math.round(width / aspectRatio);
              }
            } else {
              // If taller than wide
              if (height > MAX_HEIGHT) {
                height = MAX_HEIGHT;
                width = Math.round(height * aspectRatio);
              }
            }
  
            // Set canvas dimensions to the new thumbnail dimensions
            canvas.width = width;
            canvas.height = height;
            // canvas.width = img.width;
            // canvas.height = img.height;
  
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, width, height);
            // ctx.drawImage(img, 0, 0);
  
            // Compress the image by setting the quality (0 to 1)
            const quality = 0.7; // Adjust this value (0.7 is 70% quality)
            const compressedImageUrl = canvas.toDataURL("image/jpeg", quality);
            
            // Set the image preview immediately after capturing
            document.getElementById('image-preview').src = compressedImageUrl;
        };
        img.src = image;

    });
}

function getCurrentTitle() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        document.getElementById('current-title').textContent = activeTab.title || "No title found";
    });
}

// Event listener for the Open Dashboard button
document.getElementById('open-dashboard-button').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});


// Event listener for the Save button
document.getElementById('save-button').addEventListener('click', () => {
    const saveButton = document.getElementById('save-button');
    if(saveButton.disabled) return;
    const selectedWorkflow = workflowSelect.value;
    const currentUrl = document.getElementById('current-url').textContent;
    const currentTitle =document.getElementById('current-title').textContent;

    if (!selectedWorkflow) {
        document.getElementById('error-message').textContent = 'Please select a workflow.';
        return;
    }
    if (!currentUrl) {
        document.getElementById('error-message').textContent = 'No URL available to save.';
        return;
    }

    
    const isDone = ItemStorage.addItem(selectedWorkflow, {title: currentTitle, url: currentUrl, image: document.getElementById('image-preview').src});
    if(!isDone) return document.getElementById('error-message').textContent = `Url: ${currentUrl} already exists in workflows ${selectedWorkflow}`;
    
    // Clear the form
    workflowSelect.value = ""; // Reset the workflow dropdown
    // document.getElementById('current-url').textContent = ""; // Clear the URL display
    // document.getElementById('image-preview').src = "https://via.placeholder.com/150"; // Reset the image
    
    saveButton.disabled = true; // Disable the button
    // Display success message
    displayMessage('URL and screenshot saved successfully!', 'success');
});

// Function to display messages
function displayMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    document.body.insertBefore(messageContainer, document.querySelector('.container'));

    // Remove the message after a few seconds
    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// Function to update the enabled/disabled state of the Save button
function updateSaveButtonState() {
    const selectedWorkflow = workflowSelect.value;
    const saveButton = document.getElementById('save-button');

    // Disable the button if no workflow is selected
    saveButton.disabled = selectedWorkflow === "";
}

// Event listener for workflow selection change
workflowSelect.addEventListener('change', () => {
    updateSaveButtonState();
});

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTitle();
    getCurrentUrl(); // Get the current URL on load
    captureScreenshot(); // Capture screenshot when popup opens
    updateSaveButtonState(); // Initial call to update button state
});
