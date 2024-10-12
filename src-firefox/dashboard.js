document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard');

    // Fetch saved workflows from storage
    chrome.storage.local.get(null, (data) => {
        // Check if there are any saved workflows
        if (Object.keys(data).length === 0) {
            dashboardContainer.innerHTML = '<p>No saved workflows found.</p>';
            return;
        }

        // Create elements for each workflow
        Object.keys(data).forEach(workflow => {
            const { url, image } = data[workflow];

            const workflowDiv = document.createElement('div');
            workflowDiv.className = 'workflow';

            const title = document.createElement('div');
            title.className = 'workflow-title';
            title.textContent = workflow;

            const urlElement = document.createElement('div');
            urlElement.className = 'url';
            urlElement.textContent = `URL: ${url}`;

            const imagePreview = document.createElement('img');
            imagePreview.src = image;
            imagePreview.alt = 'Page Thumbnail';
            imagePreview.className = 'image-preview';

            // Append elements to the workflow div
            workflowDiv.appendChild(title);
            workflowDiv.appendChild(urlElement);
            workflowDiv.appendChild(imagePreview);

            // Append the workflow div to the dashboard container
            dashboardContainer.appendChild(workflowDiv);
        });
    });
});
