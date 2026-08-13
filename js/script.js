// js/script.js 
// Entry point of the <script> tag.

import { CourseManager } from './classes/CourseManager.js';
import { 
  GRADE_OPTIONS, 
  LETTER_GRADE_OPTIONS, 
  PASS_FAIL_GRADE_OPTIONS, 
  coursesData
} from './constants.js';

import { toggleDevMode, loadJsonSettings, resetAll } from './debugTab/debugArea.js';

import { getCollegeGeReportText } from './reportTab/reportGeneration.js';
import { evaluateRequirements } from './reportTab/evaluateRequirements.js';

import { generateCustomAdderTemplate, onGrade1ChangeGeneric } from './handlers/customAdderHandler.js';

import {
  renderPhedAdderContainer,
  onGrade1ChangePhed,
  addPhedCourse,
  removePhedCourse,
  updatePhedCourseGrade,
  renderPhedCoursesTable
} from './handlers/phedHandler.js';

import {
  addLangCourse,
  removeLangCourse,
  updateLangCourseGrade,
  updateLangCourseCredits,
  renderLangCoursesTable,
  onExemptionChange
} from './handlers/langHandler.js';

import {
  addUgeCourse,
  removeUgeCourse,
  updateUgeCourseGrade,
  updateUgeCourseCredits,
  renderUgeCoursesTable
} from './handlers/ugeHandler.js';

import {
  addCustomCourse,
  removeCustomCourse,
  updateCustomCourseGrade,
  updateCustomCourseCredits,
  renderCustomCoursesTable
} from './handlers/customHandler.js';

const courseManager = new CourseManager();
window.courseManager = courseManager;

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

// Utility options
function toggleAllCategories(openState) {
  document.querySelectorAll('details.category-details').forEach(det => {
    det.open = openState;
  });
}

// --- Window Method Attachments for Inline Event Handlers ---
// UI Renderer
window.renderCheckboxes = renderCheckboxes;
window.renderCollegeGeContent = renderCollegeGeContent;
window.updateCategoryCounts = updateCategoryCounts;

// Generic Handler
window.onGrade1ChangeGeneric = onGrade1ChangeGeneric;

// PHED Handler
window.onGrade1ChangePhed = onGrade1ChangePhed;
window.renderPhedAdderContainer = renderPhedAdderContainer;
window.addPhedCourse = addPhedCourse;
window.removePhedCourse = removePhedCourse;
window.updatePhedCourseGrade = updatePhedCourseGrade;
window.renderPhedCoursesTable = renderPhedCoursesTable;

// Language course Handler
window.addLangCourse = addLangCourse;
window.removeLangCourse = removeLangCourse;
window.updateLangCourseGrade = updateLangCourseGrade;
window.updateLangCourseCredits = updateLangCourseCredits;
window.renderLangCoursesTable = renderLangCoursesTable;
window.onExemptionChange = onExemptionChange;

// UGEX Handler
window.addUgeCourse = addUgeCourse;
window.removeUgeCourse = removeUgeCourse;
window.updateUgeCourseGrade = updateUgeCourseGrade;
window.updateUgeCourseCredits = updateUgeCourseCredits;
window.renderUgeCoursesTable = renderUgeCoursesTable;

// Custom course handler
window.addCustomCourse = addCustomCourse;
window.removeCustomCourse = removeCustomCourse;
window.updateCustomCourseGrade = updateCustomCourseGrade;
window.updateCustomCourseCredits = updateCustomCourseCredits;
window.renderCustomCoursesTable = renderCustomCoursesTable;

// Utility
window.switchTab = switchTab;
window.handleContainerClick = handleContainerClick;
window.toggleItemCheck = toggleItemCheck;
window.onGradeChange = onGradeChange;
window.onStreamChange = onStreamChange;
window.onCollegeChange = onCollegeChange;
window.toggleAllCategories = toggleAllCategories;

// Debug Tab
window.toggleDevMode = toggleDevMode;
window.loadJsonSettings = loadJsonSettings;
window.resetAll = resetAll;

// Report Tab
window.evaluateRequirements = evaluateRequirements;

// Initialization on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  renderCheckboxes();
});