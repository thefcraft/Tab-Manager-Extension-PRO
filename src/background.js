// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.action.setPopup({popup: 'popup.html'});
  });