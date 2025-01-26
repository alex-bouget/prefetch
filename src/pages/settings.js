let current_browser = null;
if (window?.browser) {
    current_browser = window.browser;
} else if (window?.chrome) {
    current_browser = window.chrome;
}
if (!current_browser) {
    throw new Error("Browser API not found");
}

function saveSettings() {
    const settings = document.getElementById('prefetch-settings').value;
    try {
        JSON.parse(settings);
    } catch (e) {
        const message = 'Invalid JSON ' + e.message;
        console.error(message);
        alert(message);
        return;
    }
    current_browser.storage.local.set({prefetch_settings: settings});
}
document.getElementById('save-settings').addEventListener('click', saveSettings);