// js/handlers/ugeHandler.js

import { LETTER_GRADE_OPTIONS } from '../constants.js';

export function addUgeCourse() {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  const areaSelect = document.getElementById("uge-area");
  const codeNumInput = document.getElementById("uge-code-num");
  const creditsInput = document.getElementById("uge-credits");
  const g1Select = document.getElementById("uge-grade1");
  const g2Select = document.getElementById("uge-grade2");
  const errBox = document.getElementById("uge-error");

  if (errBox) errBox.style.display = "none";
  if (!areaSelect || !codeNumInput || !creditsInput || !g1Select) return;

  const result = courseManager.addUgeCourse(
    areaSelect.value,
    codeNumInput.value,
    creditsInput.value,
    g1Select.value,
    g2Select ? g2Select.value : ''
  );

  if (!result.success) {
    if (errBox) {
      errBox.textContent = result.error;
      errBox.style.display = "block";
    }
    return;
  }

  codeNumInput.value = "";
  g1Select.value = "A";
  if (g2Select) g2Select.value = "";

  const retakeGrp = document.getElementById("uge-retake-group");
  if (retakeGrp) retakeGrp.style.display = "none";

  const g1Label = document.getElementById("uge-g1-label");
  if (g1Label) g1Label.textContent = "Grade";

  renderUgeCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function removeUgeCourse(id) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.removeUgeCourse(id);
  renderUgeCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateUgeCourseGrade(id, field, value) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateUgeCourseGrade(id, field, value);
  renderUgeCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateUgeCourseCredits(id, credits) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateUgeCourseCredits(id, credits);
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function renderUgeCoursesTable() {
  const courseManager = window.courseManager;
  const tbody = document.getElementById("uge-courses-tbody");
  if (!tbody || !courseManager) return;

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