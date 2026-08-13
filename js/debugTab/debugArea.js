// js/debugTab/debugArea.js

// --- Debug Area ---

export function toggleDevMode() {
    const toggle = document.getElementById("dev-mode-toggle");
    const isChecked = toggle ? toggle.checked : false;
    const debugBtn = document.getElementById("tab-btn-debug");
    if (debugBtn) {
        debugBtn.style.display = isChecked ? "inline-block" : "none";
    }
    const debugTabContent = document.getElementById("tab-content-debug");
}

// Helper to apply imported data into state and UI
function applyImportedData(data) {
    const courseManager = window.courseManager;
    if (!courseManager) {
        alert("CourseManager is not initialized.");
        return;
    }

    courseManager.importState(data);

    if (data.selectedStream) {
        const streamSelect = document.getElementById("stream-select");
        if (streamSelect) streamSelect.value = data.selectedStream;
    }

    if (data.selectedCollege) {
        const collegeSelect = document.getElementById("college-select");
        if (collegeSelect) collegeSelect.value = data.selectedCollege;
        if (typeof window.renderCollegeGeContent === 'function') window.renderCollegeGeContent();
    }

    const chkChlt = document.getElementById("chk-exempt-chlt");
    if (chkChlt && data.exemptCHLT !== undefined) chkChlt.checked = !!data.exemptCHLT;

    const chkEltu = document.getElementById("chk-exempt-eltu");
    if (chkEltu && data.exemptELTU !== undefined) chkEltu.checked = !!data.exemptELTU;

    if (typeof window.onExemptionChange === 'function') window.onExemptionChange();
    if (typeof window.renderCheckboxes === 'function') window.renderCheckboxes();
    if (typeof window.renderUgeCoursesTable === 'function') window.renderUgeCoursesTable();
    if (typeof window.renderLangCoursesTable === 'function') window.renderLangCoursesTable();
    if (typeof window.renderPhedCoursesTable === 'function') window.renderPhedCoursesTable();
    if (typeof window.renderCustomCoursesTable === 'function') window.renderCustomCoursesTable();
    if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

    if (typeof window.evaluateRequirements === 'function') window.evaluateRequirements(false);
    if (typeof window.switchTab === 'function') window.switchTab('input');
}

export function loadJsonSettings() {
    const textarea = document.getElementById("json-debug-textarea");

    if (!textarea || !textarea.value.trim()) {
        alert("Please paste or generate a valid JSON configuration in the text area.");
        return;
    }

    let data;

    try {
        data = JSON.parse(textarea.value);
    } catch (parseError) {
        console.error("JSON Syntax Error:", parseError);
        alert(`Invalid JSON format:\n${parseError.message}`);
        return;
    }

    try {
        applyImportedData(data);
    } catch (runtimeError) {
        console.error("Runtime error inside applyImportedData():", runtimeError);

        alert(
            `Error executing settings:\n[${runtimeError.name}] ${runtimeError.message}\n\n` +
            `Open Browser Console (F12) to see the exact line number & stack trace...`
        );
    }
}

export async function loadDataJson() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data.json (HTTP status ${response.status})`);
        }
        const data = await response.json();

        // Optionally reflect the JSON in the debug textarea
        const textarea = document.getElementById("json-debug-textarea");
        if (textarea) {
            textarea.value = JSON.stringify(data, null, 2);
        }

        applyImportedData(data);
    } catch (e) {
        alert("Error loading data.json: " + e.message);
    }
}

export function resetAll() {
    const courseManager = window.courseManager;
    if (courseManager) {
        courseManager.resetAll();
    }

    const chkChlt = document.getElementById("chk-exempt-chlt");
    if (chkChlt) chkChlt.checked = false;

    const chkEltu = document.getElementById("chk-exempt-eltu");
    if (chkEltu) chkEltu.checked = false;

    if (typeof window.onExemptionChange === 'function') window.onExemptionChange();

    document.querySelectorAll('.course-chk').forEach(chk => {
        chk.checked = false;
        const code = chk.value;
        const gradeBox = document.getElementById(`grade-box-${code}`);
        if (gradeBox) gradeBox.style.display = 'none';
        const g1 = document.getElementById(`grade1-${code}`);
        if (g1 && g1.options.length > 0) g1.selectedIndex = 0;
        const g2 = document.getElementById(`grade2-${code}`);
        if (g2) g2.value = '';
        const retakeRow = document.getElementById(`retake-row-${code}`);
        if (retakeRow) retakeRow.style.display = 'none';
        const label1 = document.getElementById(`label-grade1-${code}`);
        if (label1) label1.textContent = 'Grade:';
        const itemBox = document.getElementById(`item-box-${code}`);
        if (itemBox) itemBox.classList.remove('checked', 'failed');
    });

    if (typeof window.renderCustomCoursesTable === 'function') window.renderCustomCoursesTable();
    if (typeof window.renderUgeCoursesTable === 'function') window.renderUgeCoursesTable();
    if (typeof window.renderLangCoursesTable === 'function') window.renderLangCoursesTable();
    if (typeof window.renderPhedCoursesTable === 'function') window.renderPhedCoursesTable();

    const streamSelect = document.getElementById("stream-select");
    if (streamSelect) streamSelect.value = "ENRICH";

    const collegeSelect = document.getElementById("college-select");
    if (collegeSelect) collegeSelect.value = "CC";

    if (typeof window.renderCollegeGeContent === 'function') window.renderCollegeGeContent();
    if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

    const resultsSec = document.getElementById("results-section");
    if (resultsSec) resultsSec.style.display = "none";

    if (typeof window.switchTab === 'function') window.switchTab('input');
}

export function updateJsonDebugArea() {
    const courseManager = window.courseManager;
    const textarea = document.getElementById("json-debug-textarea");
    if (textarea && courseManager) {
        textarea.value = JSON.stringify(courseManager.exportState(), null, 2);
    }
}