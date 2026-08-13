// js/dev/developerAction.js

import { toggleDevMode } from "../debugTab/debugArea.js";

export async function runDeveloperAction() {
    console.log("Executing developer startup action...");

    // 1. Explicitly check the checkbox DOM element first
    const toggle = document.getElementById("dev-mode-toggle");
    if (toggle) {
        toggle.checked = true;
    }

    // 2. Update UI visibility for dev mode
    if (typeof window.toggleDevMode === 'function') {
        window.toggleDevMode();
    }

    // 3. Await the async data load so it finishes importing completely
    if (typeof window.loadDataJson === 'function') {
        await window.loadDataJson();
    }

    // 4. Switch to report tab AFTER data importing has finished
    if (typeof window.switchTab === 'function') {
        window.switchTab('report');
    }
}