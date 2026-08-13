// js/script.js 
// Entry point of the <script> tag.

import { CourseManager } from './classes/CourseManager.js';
import { 
  GRADE_OPTIONS, 
  LETTER_GRADE_OPTIONS, 
  PASS_FAIL_GRADE_OPTIONS, 
  coursesData, 
  streamDescriptions 
} from './constants.js';

import { toggleDevMode, loadJsonSettings, resetAll } from './debugTab/debugArea.js';
import { getCollegeGeReportText } from './reportTab/reportGeneration.js';
import { evaluateRequirements } from './reportTab/evaluateRequirements.js';

const courseManager = new CourseManager();
window.courseManager = courseManager;

// --- Helper Functions for Custom Adders ---

function generateCustomAdderTemplate(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { idPrefix = 'custom', isUge = false, isLang = false } = options;

  let flexFields = '';
  if (isUge) {
    flexFields = `
      <div class="field-group">
        <label for="${idPrefix}-area">Area</label>
        <select id="${idPrefix}-area">
          <option value="UGEA">Area A (UGEA)</option>
          <option value="UGEB">Area B (UGEB) [Excluded]</option>
          <option value="UGEC">Area C (UGEC)</option>
          <option value="UGED">Area D (UGED)</option>
        </select>
      </div>
      <div class="field-group">
        <label for="${idPrefix}-code-num">Code (number)</label>
        <input type="text" id="${idPrefix}-code-num" placeholder="e.g. 1110" style="width: 100px;">
      </div>
    `;
  } else {
    flexFields = `
      <div class="field-group">
        <label for="${idPrefix}-code">Course Code</label>
        <input type="text" id="${idPrefix}-code" placeholder="${isLang ? 'e.g. TRAN1001' : 'e.g. ECON2011'}" style="text-transform:uppercase;">
      </div>
    `;
  }

  const optionsForG1 = isUge ? LETTER_GRADE_OPTIONS : GRADE_OPTIONS;
  const gradeOptionsHtml = optionsForG1.map(g => `<option value="${g}">${g}</option>`).join('');

  let addFn = 'addCustomCourse()';
  if (isUge) addFn = 'addUgeCourse()';
  if (isLang) addFn = 'addLangCourse()';

  container.innerHTML = `
    <div class="custom-form">
      ${flexFields}
      <div class="field-group">
        <label for="${idPrefix}-credits">Units</label>
        <input type="number" id="${idPrefix}-credits" value="3" min="1" max="6" style="width: 70px;">
      </div>
      <div class="field-group">
        <label id="${idPrefix}-g1-label" for="${idPrefix}-grade1">Grade</label>
        <select id="${idPrefix}-grade1" onchange="onGrade1ChangeGeneric('${idPrefix}')">
          ${gradeOptionsHtml}
        </select>
      </div>
      <div class="field-group" id="${idPrefix}-retake-group" style="display:none;">
        <label for="${idPrefix}-grade2" style="color: var(--danger);">2nd Grade</label>
        <select id="${idPrefix}-grade2">
          <option value="">--Select--</option>
          ${gradeOptionsHtml}
        </select>
      </div>
      <button type="button" class="btn-add" onclick="${addFn}">+ Add Course</button>
    </div>
    <div class="custom-error" id="${idPrefix}-error"></div>
  `;
}

function onGrade1ChangeGeneric(idPrefix) {
  const g1 = document.getElementById(`${idPrefix}-grade1`).value;
  const retakeGrp = document.getElementById(`${idPrefix}-retake-group`);
  const label1 = document.getElementById(`${idPrefix}-g1-label`);
  const isFail = (g1 === 'F' || g1 === 'FF');
  if (label1) label1.textContent = isFail ? "1st Grade" : "Grade";
  if (retakeGrp) {
    retakeGrp.style.display = isFail ? 'flex' : 'none';
    if (!isFail) document.getElementById(`${idPrefix}-grade2`).value = '';
  }
}

// --- Physical Education (PHED) Handlers ---

function renderPhedAdderContainer() {
  const container = document.getElementById("phed-adder-container");
  if (!container) return;

  const gradeOptionsHtml = LETTER_GRADE_OPTIONS.map(g => `<option value="${g}">${g}</option>`).join('');

  container.innerHTML = `
    <div class="custom-form">
      <div class="field-group">
        <label for="phed-area">Area</label>
        <input type="text" id="phed-area" value="PHED" readonly style="width: 75px; background: #e2e8f0; color: #475569; font-weight: 600; cursor: not-allowed; text-align: center;">
      </div>
      <div class="field-group">
        <label for="phed-code-num">Course Number</label>
        <input type="text" id="phed-code-num" placeholder="e.g. 1001" maxlength="4" style="width: 100px;">
      </div>
      <div class="field-group">
        <label for="phed-credits">Units</label>
        <input type="number" id="phed-credits" value="1" readonly style="width: 70px; background: #e2e8f0; color: #475569; cursor: not-allowed; text-align: center;">
      </div>
      <div class="field-group">
        <label id="phed-g1-label" for="phed-grade1">Grade</label>
        <select id="phed-grade1" onchange="onGrade1ChangePhed()">
          ${gradeOptionsHtml}
        </select>
      </div>
      <div class="field-group" id="phed-retake-group" style="display:none;">
        <label for="phed-grade2" style="color: var(--danger);">2nd Grade</label>
        <select id="phed-grade2">
          <option value="">--Select--</option>
          ${gradeOptionsHtml}
        </select>
      </div>
      <button type="button" class="btn-add" onclick="addPhedCourse()">+ Add Course</button>
    </div>
    <div class="custom-error" id="phed-error"></div>
  `;
}

function onGrade1ChangePhed() {
  const g1 = document.getElementById("phed-grade1").value;
  const retakeGrp = document.getElementById("phed-retake-group");
  const label1 = document.getElementById("phed-g1-label");
  const isFail = (g1 === 'F');
  if (label1) label1.textContent = isFail ? "1st Grade" : "Grade";
  if (retakeGrp) {
    retakeGrp.style.display = isFail ? 'flex' : 'none';
    if (!isFail) document.getElementById("phed-grade2").value = '';
  }
}

function addPhedCourse() {
  const codeNumInput = document.getElementById("phed-code-num");
  const g1Select = document.getElementById("phed-grade1");
  const g2Select = document.getElementById("phed-grade2");
  const errBox = document.getElementById("phed-error");

  errBox.style.display = "none";

  if (!codeNumInput) return;

  const rawNum = codeNumInput.value.trim();
  if (!rawNum) {
    errBox.textContent = "Please enter a course number.";
    errBox.style.display = "block";
    return;
  }

  // Prepend "PHED" if the user entered only digits
  const fullCode = rawNum.toUpperCase().startsWith("PHED") ? rawNum.toUpperCase() : `PHED${rawNum}`;

  const result = courseManager.addPhedCourse(fullCode, g1Select.value, g2Select.value);

  if (!result.success) {
    errBox.textContent = result.error;
    errBox.style.display = "block";
    return;
  }

  codeNumInput.value = "";
  g1Select.value = "A";
  g2Select.value = "";
  document.getElementById("phed-retake-group").style.display = "none";
  if (document.getElementById("phed-g1-label")) {
    document.getElementById("phed-g1-label").textContent = "Grade";
  }

  renderPhedCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function removePhedCourse(id) {
  courseManager.removePhedCourse(id);
  renderPhedCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updatePhedCourseGrade(id, field, value) {
  courseManager.updatePhedCourseGrade(id, field, value);
  renderPhedCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function renderPhedCoursesTable() {
  const tbody = document.getElementById("phed-courses-tbody");
  if (!tbody) return;

  if (courseManager.phedCourses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No PHED courses added.</td></tr>';
    return;
  }

  tbody.innerHTML = courseManager.phedCourses.map(c => {
    const passed = courseManager.isCustomCoursePassed(c);
    const isFail1 = (c.grade1 === 'F');
    return `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>1</td>
        <td>
          <select onchange="updatePhedCourseGrade(${c.id}, 'grade1', this.value)">
            ${LETTER_GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade1 === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </td>
        <td>
          ${isFail1 ? `
            <select onchange="updatePhedCourseGrade(${c.id}, 'grade2', this.value)">
              <option value="">--Select--</option>
              ${LETTER_GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade2 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          ` : '<span style="color:#94a3b8;">N/A</span>'}
        </td>
        <td>
          ${passed ? '<span class="status-badge status-fulfilled">PASSED</span>' : '<span class="status-badge status-pending" style="background:#fee2e2;color:#991b1b;">FAILED</span>'}
        </td>
        <td>
          <button type="button" class="btn-small" style="background:#fee2e2; color:#991b1b;" onclick="removePhedCourse(${c.id})">Remove</button>
        </td>
      </tr>
    `;
  }).join('');
}

// --- Language Enhancement Debt Handlers ---

function addLangCourse() {
  const codeInput = document.getElementById("lang-code");
  const creditsInput = document.getElementById("lang-credits");
  const g1Select = document.getElementById("lang-grade1");
  const g2Select = document.getElementById("lang-grade2");
  const errBox = document.getElementById("lang-error");

  errBox.style.display = "none";

  const result = courseManager.addLangCourse(codeInput.value, creditsInput.value, g1Select.value, g2Select.value);
  if (!result.success) {
    errBox.textContent = result.error;
    errBox.style.display = "block";
    return;
  }

  codeInput.value = "";
  g1Select.value = "A";
  g2Select.value = "";
  if (document.getElementById("lang-retake-group")) document.getElementById("lang-retake-group").style.display = "none";
  if (document.getElementById("lang-g1-label")) document.getElementById("lang-g1-label").textContent = "Grade";

  renderLangCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function removeLangCourse(id) {
  courseManager.removeLangCourse(id);
  renderLangCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateLangCourseGrade(id, field, value) {
  courseManager.updateLangCourseGrade(id, field, value);
  renderLangCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateLangCourseCredits(id, credits) {
  courseManager.updateLangCourseCredits(id, credits);
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function renderLangCoursesTable() {
  const tbody = document.getElementById("lang-courses-tbody");
  if (!tbody) return;

  if (courseManager.langCourses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No Language Enhancement courses added.</td></tr>';
    return;
  }

  tbody.innerHTML = courseManager.langCourses.map(c => {
    const passed = courseManager.isCustomCoursePassed(c);
    const isFail1 = (c.grade1 === 'F' || c.grade1 === 'FF');
    return `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>
          <input type="number" min="1" max="6" value="${c.credits}" style="width:55px; padding:0.2rem 0.4rem; border:1px solid #cbd5e1; border-radius:4px;" onchange="updateLangCourseCredits(${c.id}, this.value)">
        </td>
        <td>
          <select onchange="updateLangCourseGrade(${c.id}, 'grade1', this.value)">
            ${GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade1 === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </td>
        <td>
          ${isFail1 ? `
            <select onchange="updateLangCourseGrade(${c.id}, 'grade2', this.value)">
              <option value="">--Select--</option>
              ${GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade2 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          ` : '<span style="color:#94a3b8;">N/A</span>'}
        </td>
        <td>
          ${passed ? '<span class="status-badge status-fulfilled">PASSED</span>' : '<span class="status-badge status-pending" style="background:#fee2e2;color:#991b1b;">FAILED</span>'}
        </td>
        <td>
          <button type="button" class="btn-small" style="background:#fee2e2; color:#991b1b;" onclick="removeLangCourse(${c.id})">Remove</button>
        </td>
      </tr>
    `;
  }).join('');
}

function onExemptionChange() {
  const exemptCHLT = document.getElementById("chk-exempt-chlt")?.checked || false;
  const exemptELTU = document.getElementById("chk-exempt-eltu")?.checked || false;

  courseManager.setExemptions(exemptCHLT, exemptELTU);
  const debt = courseManager.getLangDebt();

  const debtBox = document.getElementById("debt-info-box");
  if (debtBox) {
    debtBox.textContent = `Language Enhancement Course units: ${debt} unit${debt !== 1 ? 's' : ''} required`;
    debtBox.style.color = debt > 0 ? "var(--warning)" : "var(--primary)";
  }

  ['CHLT1001', 'CHLT1002'].forEach(code => {
    const chk = document.getElementById(`chk-${code}`);
    const itemBox = document.getElementById(`item-box-${code}`);
    if (chk && itemBox) {
      if (exemptCHLT) {
        chk.checked = false;
        chk.disabled = true;
        toggleItemCheck(code);
        itemBox.style.opacity = '0.5';
        itemBox.style.pointerEvents = 'none';
        itemBox.style.backgroundColor = '#e2e8f0';
      } else {
        chk.disabled = false;
        itemBox.style.opacity = '1';
        itemBox.style.pointerEvents = 'auto';
        itemBox.style.backgroundColor = '';
      }
    }
  });

  ['ELTU1001', 'ELTU1002'].forEach(code => {
    const chk = document.getElementById(`chk-${code}`);
    const itemBox = document.getElementById(`item-box-${code}`);
    if (chk && itemBox) {
      if (exemptELTU) {
        chk.checked = false;
        chk.disabled = true;
        toggleItemCheck(code);
        itemBox.style.opacity = '0.5';
        itemBox.style.pointerEvents = 'none';
        itemBox.style.backgroundColor = '#e2e8f0';
      } else {
        chk.disabled = false;
        itemBox.style.opacity = '1';
        itemBox.style.pointerEvents = 'auto';
        itemBox.style.backgroundColor = '';
      }
    }
  });

  const langAdderSection = document.getElementById("lang-adder-section");
  if (langAdderSection) {
    langAdderSection.style.display = debt > 0 ? "block" : "none";
  }

  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

// --- UI Rendering & Grid Creation ---

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const btn = document.getElementById(`tab-btn-${tabName}`);
  const content = document.getElementById(`tab-content-${tabName}`);
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}

function renderCheckboxes() {
  renderCollegeGeContent();
  createGrid("ge-foundation-grid", coursesData.ge_foundation);
  createGrid("chlt-eltu-grid", coursesData.chlt_eltu);
  createGrid("digital-literacy-grid", coursesData.digital_literacy);
  createGrid("ugcp-grid", coursesData.ugcp);

  createGrid("faculty-req-grid", coursesData.faculty_req);
  createGrid("faculty-elec-grid", coursesData.faculty_elec);

  createGrid("math1-grid", coursesData.math1);
  createGrid("math2-grid", coursesData.math2);
  createGrid("math3-pure-grid", coursesData.math3_pure);
  createGrid("math3-app-grid", coursesData.math3_app);
  createGrid("math4-pure-grid", coursesData.math4_pure);
  createGrid("math4-app-grid", coursesData.math4_app);
  createGrid("math-fyp-grid", coursesData.math_fyp);
  createGrid("math5-grid", coursesData.math5);
  createGrid("other-grid", coursesData.other);

  generateCustomAdderTemplate("uge-adder-container", { idPrefix: "uge", isUge: true });
  generateCustomAdderTemplate("lang-adder-container", { idPrefix: "lang", isLang: true });
  renderPhedAdderContainer();
  generateCustomAdderTemplate("custom-adder-container", { idPrefix: "custom", isUge: false });
  updateCategoryCounts();
}

function renderCollegeGeContent() {
  const college = document.getElementById("college-select").value;
  courseManager.selectedCollege = college;
  const container = document.getElementById("college-ge-content");

  if (college === "CC") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        Chung Chi College GE Requirements (6 Units):<br>
        (1) GECC1130 or 1230 (2u) + GECC1132 (1u) [3 units total]<br>
        (2) GECC3130 / 3230 / 3430 / 4130 [3 units]
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_cc);
  } else if (college === "NA") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        New Asia College GE Requirements (6 Units):<br>
        (1) GENA1112 (2u)<br>
        (2) GENA1113 (2u)<br>
        (3) One elective course from GENA1114-1117, 2112-2392, 3070 (2u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_na);
  } else if (college === "UC") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        United College GE Requirements (6 Units):<br>
        (1) GEUC1111 (1u)<br>
        (2) One course from GEUC2211, 2212, 2213, 2214, or 2215 (2u)<br>
        (3) GEUC4011 or GEUC4012 (3u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_uc);
  } else if (college === "SHAW") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        Shaw College GE Requirements (6 Units):<br>
        Complete two courses (6 units) from the Shaw College list.
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_shaw);
  } else if (college === "MC") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        Morningside College GE Requirements (6 Units):<br>
        GEMC1001 (3u) + GEMC3001 (3u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_mc);
  } else if (college === "SHHO") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        S.H. Ho College GE Requirements (6 Units):<br>
        GESH1010 (3u) + GESH2011 and GESH2012 (3u total)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_shho);
  } else if (college === "CWC") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        CW Chu College GE Requirements (6 Units):<br>
        (1) GECW1010 (3u)<br>
        (2) GECW4022 (or ELTU2008) OR (GECW4021 and GECW4030) (3u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_cwc);
  } else if (college === "WYS") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        Wu Yee Sun College GE Requirements (6 Units):<br>
        (1) GEYS1010 or ELTU2008 (3u)<br>
        (2) GEYS4010 or GEYS4011 (3u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_wys);
  } else if (college === "LWS") {
    container.innerHTML = `
      <p style="font-size:0.85rem; color:#1e3a8a; margin-bottom:0.75rem; font-weight:600;">
        Lee Woo Sing College GE Requirements (6 Units):<br>
        (1) GEWS1011 or GEWS1012 (3u)<br>
        (2) One course from GEWS2011-2171, UGEC1835, UGEC2631, UGEC2861, UGEC2905, UGED1571, UGED2314, UGED2663, UGED2933, UGED2980 (3u)
      </p>
      <div class="checkbox-grid" id="college-ge-grid"></div>
    `;
    createGrid("college-ge-grid", coursesData.ge_college_lws);
  }
  updateCategoryCounts();
}

function createGrid(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const facultyCodes = new Set(['STAT1011', 'LSCI1001', 'LSCI1002', 'CHEM1070', 'CHEM1072', 'CHEM1280', 'PHYS1001', 'PHYS1002', 'PHYS1111', 'PHYS1113']);

  container.innerHTML = list.map(item => {
    let optionsToUse = GRADE_OPTIONS;
    if (item.code === 'ENGG1003' || item.code.startsWith('UGCP')) {
      optionsToUse = PASS_FAIL_GRADE_OPTIONS;
    } else if (item.code.startsWith('MATH') || facultyCodes.has(item.code) || item.code.startsWith('UGFH') || item.code.startsWith('UGFN') || item.code.startsWith('PHED') || item.code.startsWith('CHLT') || item.code.startsWith('ELTU')) {
      optionsToUse = LETTER_GRADE_OPTIONS;
    }

    const state = courseManager.getGridCourseState(item.code);

    return `
      <div class="checkbox-item ${state.checked ? 'checked' : ''}" id="item-box-${item.code}">
        <div class="checkbox-top" onclick="handleContainerClick(event, '${item.code}')">
          <input type="checkbox" class="course-chk" id="chk-${item.code}" value="${item.code}" data-credits="${item.credits}" ${state.checked ? 'checked' : ''} onchange="toggleItemCheck('${item.code}')">
          <label for="chk-${item.code}">${item.code}</label>
          <span class="badge-unit">${item.credits} unit${item.credits !== 1 ? 's' : ''}</span>
        </div>
        <div class="grade-box" id="grade-box-${item.code}" style="display:${state.checked ? 'flex' : 'none'};">
          <div class="grade-row">
            <span id="label-grade1-${item.code}">Grade:</span>
            <select class="grade-select" id="grade1-${item.code}" onchange="onGradeChange('${item.code}')">
              ${optionsToUse.map(g => `<option value="${g}" ${state.grade1 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>
          <div class="retake-row" id="retake-row-${item.code}" style="display:${(state.grade1 === 'F' || state.grade1 === 'FF') ? 'flex' : 'none'};">
            <span style="color:var(--danger); font-weight:600;">2nd Grade:</span>
            <select class="retake-select" id="grade2-${item.code}" onchange="onGradeChange('${item.code}')">
              <option value="">--Select--</option>
              ${optionsToUse.map(g => `<option value="${g}" ${state.grade2 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleContainerClick(event, code) {
  if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'LABEL') {
    const chk = document.getElementById(`chk-${code}`);
    if (chk && !chk.disabled) {
      chk.checked = !chk.checked;
      toggleItemCheck(code);
    }
  }
}

function toggleItemCheck(code) {
  const chk = document.getElementById(`chk-${code}`);
  const gradeBox = document.getElementById(`grade-box-${code}`);
  if (chk && gradeBox) {
    gradeBox.style.display = chk.checked ? 'flex' : 'none';
    if (!chk.checked) {
      const g1 = document.getElementById(`grade1-${code}`);
      if (g1 && g1.options.length > 0) g1.selectedIndex = 0;
      document.getElementById(`grade2-${code}`).value = '';
      document.getElementById(`retake-row-${code}`).style.display = 'none';
    }
  }
  onGradeChange(code);
}

function onGradeChange(code) {
  const itemBox = document.getElementById(`item-box-${code}`);
  const chk = document.getElementById(`chk-${code}`);
  const g1 = document.getElementById(`grade1-${code}`)?.value || '';
  const retakeRow = document.getElementById(`retake-row-${code}`);
  const g2 = document.getElementById(`grade2-${code}`)?.value || '';
  const label1 = document.getElementById(`label-grade1-${code}`);

  const checked = chk ? chk.checked : false;
  courseManager.setGridCourseState(code, checked, g1, g2);

  if (!checked) {
    if (label1) label1.textContent = 'Grade:';
    itemBox?.classList.remove('checked', 'failed');
    updateCategoryCounts();
    if (document.getElementById('results-section').style.display === 'block') evaluateRequirements(false);
    return;
  }

  const isFail1 = (g1 === 'F' || g1 === 'FF');
  if (label1) {
    label1.textContent = isFail1 ? '1st Grade:' : 'Grade:';
  }

  if (isFail1) {
    if (retakeRow) retakeRow.style.display = 'flex';
    const isPass2 = g2 && g2 !== 'F' && g2 !== 'FF';
    if (isPass2) {
      itemBox?.classList.add('checked');
      itemBox?.classList.remove('failed');
    } else {
      itemBox?.classList.remove('checked');
      itemBox?.classList.add('failed');
    }
  } else {
    if (retakeRow) retakeRow.style.display = 'none';
    itemBox?.classList.add('checked');
    itemBox?.classList.remove('failed');
  }

  updateCategoryCounts();
  if (document.getElementById('results-section').style.display === 'block') evaluateRequirements(false);
}

function updateCategoryCounts() {
  const categories = [
    { gridId: "college-ge-grid", badgeId: "count-ge-college" },
    { gridId: "ge-foundation-grid", badgeId: "count-ge-foundation" },
    { gridId: "chlt-eltu-grid", badgeId: "count-chlt-eltu" },
    { gridId: "digital-literacy-grid", badgeId: "count-digital-literacy" },
    { gridId: "ugcp-grid", badgeId: "count-ugcp" },
    { gridId: "math1-grid", badgeId: "count-math1" },
    { gridId: "math2-grid", badgeId: "count-math2" },
    { gridId: "math3-pure-grid", badgeId: "count-math3-pure" },
    { gridId: "math3-app-grid", badgeId: "count-math3-app" },
    { gridId: "math4-pure-grid", badgeId: "count-math4-pure" },
    { gridId: "math4-app-grid", badgeId: "count-math4-app" },
    { gridId: "math-fyp-grid", badgeId: "count-math-fyp" },
    { gridId: "math5-grid", badgeId: "count-math5" },
    { gridId: "other-grid", badgeId: "count-other" }
  ];

  categories.forEach(cat => {
    const grid = document.getElementById(cat.gridId);
    const badge = document.getElementById(cat.badgeId);
    if (grid && badge) {
      let count = 0;
      grid.querySelectorAll('.course-chk').forEach(chk => {
        if (courseManager.isCoursePassed(chk.value)) count++;
      });
      if (cat.gridId === "chlt-eltu-grid") {
        count += courseManager.langCourses.filter(c => courseManager.isCustomCoursePassed(c)).length;
      }
      badge.textContent = `${count} passed`;
      badge.classList.toggle('active', count > 0);
    }
  });

  let facultyCount = 0;
  ['faculty-req-grid', 'faculty-elec-grid'].forEach(gridId => {
    const g = document.getElementById(gridId);
    if (g) {
      g.querySelectorAll('.course-chk').forEach(chk => {
        if (courseManager.isCoursePassed(chk.value)) facultyCount++;
      });
    }
  });
  const fBadge = document.getElementById("count-faculty");
  if (fBadge) {
    fBadge.textContent = `${facultyCount} passed`;
    fBadge.classList.toggle('active', facultyCount > 0);
  }

  const geBadge = document.getElementById("count-ge-areas");
  if (geBadge) {
    const ugePassedCount = courseManager.ugeCourses.filter(c => courseManager.isCustomCoursePassed(c)).length;
    geBadge.textContent = `${ugePassedCount} passed`;
    geBadge.classList.toggle('active', ugePassedCount > 0);
  }

  const phedBadge = document.getElementById("count-phed");
  if (phedBadge) {
    const phedPassedCount = courseManager.phedCourses.filter(c => courseManager.isCustomCoursePassed(c)).length;
    phedBadge.textContent = `${phedPassedCount} passed`;
    phedBadge.classList.toggle('active', phedPassedCount > 0);
  }
}

function onStreamChange() {
  courseManager.selectedStream = document.getElementById("stream-select").value;
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function onCollegeChange() {
  renderCollegeGeContent();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

// --- 4-Area UGE & Custom Course Handlers ---

function addUgeCourse() {
  const areaSelect = document.getElementById("uge-area");
  const codeNumInput = document.getElementById("uge-code-num");
  const creditsInput = document.getElementById("uge-credits");
  const g1Select = document.getElementById("uge-grade1");
  const g2Select = document.getElementById("uge-grade2");
  const errBox = document.getElementById("uge-error");

  errBox.style.display = "none";
  const result = courseManager.addUgeCourse(areaSelect.value, codeNumInput.value, creditsInput.value, g1Select.value, g2Select.value);

  if (!result.success) {
    errBox.textContent = result.error;
    errBox.style.display = "block";
    return;
  }

  codeNumInput.value = "";
  g1Select.value = "A";
  g2Select.value = "";
  document.getElementById("uge-retake-group").style.display = "none";
  if (document.getElementById("uge-g1-label")) document.getElementById("uge-g1-label").textContent = "Grade";

  renderUgeCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function removeUgeCourse(id) {
  courseManager.removeUgeCourse(id);
  renderUgeCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateUgeCourseGrade(id, field, value) {
  courseManager.updateUgeCourseGrade(id, field, value);
  renderUgeCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateUgeCourseCredits(id, credits) {
  courseManager.updateUgeCourseCredits(id, credits);
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function renderUgeCoursesTable() {
  const tbody = document.getElementById("uge-courses-tbody");
  if (!tbody) return;

  if (courseManager.ugeCourses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No 4-Area GE courses added.</td></tr>';
    return;
  }

  tbody.innerHTML = courseManager.ugeCourses.map(c => {
    const passed = courseManager.isCustomCoursePassed(c);
    const isFail1 = (c.grade1 === 'F' || c.grade1 === 'FF');
    return `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td><span class="allocated-badge">${c.area}</span></td>
        <td>
          <input type="number" min="1" max="6" value="${c.credits}" style="width:55px; padding:0.2rem 0.4rem; border:1px solid #cbd5e1; border-radius:4px;" onchange="updateUgeCourseCredits(${c.id}, this.value)">
        </td>
        <td>
          <select onchange="updateUgeCourseGrade(${c.id}, 'grade1', this.value)">
            ${LETTER_GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade1 === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </td>
        <td>
          ${isFail1 ? `
            <select onchange="updateUgeCourseGrade(${c.id}, 'grade2', this.value)">
              <option value="">--Select--</option>
              ${LETTER_GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade2 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          ` : '<span style="color:#94a3b8;">N/A</span>'}
        </td>
        <td>
          ${passed ? '<span class="status-badge status-fulfilled">PASSED</span>' : '<span class="status-badge status-pending" style="background:#fee2e2;color:#991b1b;">FAILED</span>'}
        </td>
        <td>
          <button type="button" class="btn-small" style="background:#fee2e2; color:#991b1b;" onclick="removeUgeCourse(${c.id})">Remove</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addCustomCourse() {
  const codeInput = document.getElementById("custom-code");
  const creditsInput = document.getElementById("custom-credits");
  const g1Select = document.getElementById("custom-grade1");
  const g2Select = document.getElementById("custom-grade2");
  const errBox = document.getElementById("custom-error");

  errBox.style.display = "none";
  const result = courseManager.addCustomCourse(codeInput.value, creditsInput.value, g1Select.value, g2Select.value);

  if (!result.success) {
    errBox.textContent = result.error;
    errBox.style.display = "block";
    return;
  }

  codeInput.value = "";
  g1Select.value = "A";
  g2Select.value = "";
  document.getElementById("custom-retake-group").style.display = "none";
  if (document.getElementById("custom-g1-label")) document.getElementById("custom-g1-label").textContent = "Grade";

  renderCustomCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function removeCustomCourse(id) {
  courseManager.removeCustomCourse(id);
  renderCustomCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateCustomCourseGrade(id, field, value) {
  courseManager.updateCustomCourseGrade(id, field, value);
  renderCustomCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function updateCustomCourseCredits(id, credits) {
  courseManager.updateCustomCourseCredits(id, credits);
  if (document.getElementById("results-section").style.display === "block") {
    evaluateRequirements(false);
  }
}

function renderCustomCoursesTable() {
  const tbody = document.getElementById("custom-courses-tbody");
  if (!tbody) return;

  if (courseManager.customCourses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No custom elective courses added.</td></tr>';
    return;
  }

  tbody.innerHTML = courseManager.customCourses.map(c => {
    const passed = courseManager.isCustomCoursePassed(c);
    const isFail1 = (c.grade1 === 'F' || c.grade1 === 'FF');
    return `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>
          <input type="number" min="1" max="6" value="${c.credits}" style="width:55px; padding:0.2rem 0.4rem; border:1px solid #cbd5e1; border-radius:4px;" onchange="updateCustomCourseCredits(${c.id}, this.value)">
        </td>
        <td>
          <select onchange="updateCustomCourseGrade(${c.id}, 'grade1', this.value)">
            ${GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade1 === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </td>
        <td>
          ${isFail1 ? `
            <select onchange="updateCustomCourseGrade(${c.id}, 'grade2', this.value)">
              <option value="">--Select--</option>
              ${GRADE_OPTIONS.map(g => `<option value="${g}" ${c.grade2 === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          ` : '<span style="color:#94a3b8;">N/A</span>'}
        </td>
        <td>
          ${passed ? '<span class="status-badge status-fulfilled">PASSED</span>' : '<span class="status-badge status-pending" style="background:#fee2e2;color:#991b1b;">FAILED</span>'}
        </td>
        <td>
          <button type="button" class="btn-small" style="background:#fee2e2; color:#991b1b;" onclick="removeCustomCourse(${c.id})">Remove</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Utility options

function toggleAllCategories(openState) {
  document.querySelectorAll('details.category-details').forEach(det => {
    det.open = openState;
  });
}

// --- Window Method Attachments for Inline Event Handlers ---
window.renderCheckboxes = renderCheckboxes;
window.renderCollegeGeContent = renderCollegeGeContent;
window.renderUgeCoursesTable = renderUgeCoursesTable;
window.renderLangCoursesTable = renderLangCoursesTable;
window.renderPhedCoursesTable = renderPhedCoursesTable;
window.renderCustomCoursesTable = renderCustomCoursesTable;
window.updateCategoryCounts = updateCategoryCounts;

window.onGrade1ChangeGeneric = onGrade1ChangeGeneric;
window.onGrade1ChangePhed = onGrade1ChangePhed;
window.addPhedCourse = addPhedCourse;
window.removePhedCourse = removePhedCourse;
window.updatePhedCourseGrade = updatePhedCourseGrade;
window.addLangCourse = addLangCourse;
window.removeLangCourse = removeLangCourse;
window.updateLangCourseGrade = updateLangCourseGrade;
window.updateLangCourseCredits = updateLangCourseCredits;
window.onExemptionChange = onExemptionChange;
window.switchTab = switchTab;
window.handleContainerClick = handleContainerClick;
window.toggleItemCheck = toggleItemCheck;
window.onGradeChange = onGradeChange;
window.onStreamChange = onStreamChange;
window.onCollegeChange = onCollegeChange;
window.addUgeCourse = addUgeCourse;
window.removeUgeCourse = removeUgeCourse;
window.updateUgeCourseGrade = updateUgeCourseGrade;
window.updateUgeCourseCredits = updateUgeCourseCredits;
window.addCustomCourse = addCustomCourse;
window.removeCustomCourse = removeCustomCourse;
window.updateCustomCourseGrade = updateCustomCourseGrade;
window.updateCustomCourseCredits = updateCustomCourseCredits;
window.toggleAllCategories = toggleAllCategories;
window.toggleDevMode = toggleDevMode;
window.loadJsonSettings = loadJsonSettings;
window.resetAll = resetAll;
window.evaluateRequirements = evaluateRequirements;

// Initialization on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  renderCheckboxes();
});