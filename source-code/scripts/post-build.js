// scripts/post-build.js
const fs = require('fs');
const path = require('path');

function updateHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updateHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\/_next\//g, '/next/');
      fs.writeFileSync(filePath, content);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace('{d.forEach(e=>window.open(e.url,"_blank"))}', '{const ur=d.map((url)=>url.url);chrome.windows.create({url:ur})}');
      content = content.replace(/\/_next\//g, '/next/');
      fs.writeFileSync(filePath, content);
    }else if (file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\/_next\//g, '/next/');
      fs.writeFileSync(filePath, content);
    }
  });
}

// Run the post-build script
const outDir = path.join(process.cwd(), 'out');
updateHtmlFiles(outDir);

console.log('Post-build processing completed');