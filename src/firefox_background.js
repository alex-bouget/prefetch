browser.browserAction.onClicked.addListener(async () => {
    await browser.tabs.create({
        url: browser.runtime.getURL('pages/settings.html')
    })
})