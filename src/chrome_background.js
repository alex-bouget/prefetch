chrome.action.onClicked.addListener(async () => {
    await chrome.tabs.create({
        url: chrome.runtime.getURL('pages/settings.html')
    })
})