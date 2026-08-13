// js/handlers/phedHandler.js

import { LETTER_GRADE_OPTIONS } from '../constants.js';

export function renderPhedAdderContainer() {
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

export function onGrade1ChangePhed() {
  const g1Select = document.getElementById("phed-grade1");
  if (!g1Select) return;

  const g1 = g1Select.value;
  const retakeGrp = document.getElementById("phed-retake-group");
  const label1 = document.getElementById("phed-g1-label");
  const isFail = (g1 === 'F');

  if (label1) label1.textContent = isFail ? "1st Grade" : "Grade";
  if (retakeGrp) {
    retakeGrp.style.display = isFail ? 'flex' : 'none';
    if (!isFail) {
      const g2Select = document.getElementById("phed-grade2");
      if (g2Select) g2Select.value = '';
    }
  }
}

export function addPhedCourse() {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  const codeNumInput = document.getElementById("phed-code-num");
  const g1Select = document.getElementById("phed-grade1");
  const g2Select = document.getElementById("phed-grade2");
  const errBox = document.getElementById("phed-error");

  if (errBox) errBox.style.display = "none";
  if (!codeNumInput) return;

  const rawNum = codeNumInput.value.trim();
  if (!rawNum) {
    if (errBox) {
      errBox.textContent = "Please enter a course number.";
      errBox.style.display = "block";
    }
    return;
  }

  const fullCode = rawNum.toUpperCase().startsWith("PHED") ? rawNum.toUpperCase() : `PHED${rawNum}`;
  const result = courseManager.addPhedCourse(fullCode, g1Select.value, g2Select.value);

  if (!result.success) {
    if (errBox) {
      errBox.textContent = result.error;
      errBox.style.display = "block";
    }
    return;
  }

  codeNumInput.value = "";
  g1Select.value = "A";
  g2Select.value = "";

  const retakeGrp = document.getElementById("phed-retake-group");
  if (retakeGrp) retakeGrp.style.display = "none";

  const g1Label = document.getElementById("phed-g1-label");
  if (g1Label) g1Label.textContent = "Grade";

  renderPhedCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function removePhedCourse(id) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.removePhedCourse(id);
  renderPhedCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updatePhedCourseGrade(id, field, value) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updatePhedCourseGrade(id, field, value);
  renderPhedCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function renderPhedCoursesTable() {
  const courseManager = window.courseManager;
  const tbody = document.getElementById("phed-courses-tbody");
  if (!tbody || !courseManager) return;

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