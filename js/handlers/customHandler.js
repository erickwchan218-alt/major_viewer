// js/handlers/customHandler.js

import { GRADE_OPTIONS } from '../constants.js';

export function addCustomCourse() {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  const codeInput = document.getElementById("custom-code");
  const creditsInput = document.getElementById("custom-credits");
  const g1Select = document.getElementById("custom-grade1");
  const g2Select = document.getElementById("custom-grade2");
  const errBox = document.getElementById("custom-error");

  if (errBox) errBox.style.display = "none";
  if (!codeInput || !creditsInput || !g1Select) return;

  const result = courseManager.addCustomCourse(
    codeInput.value,
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

  codeInput.value = "";
  g1Select.value = "A";
  if (g2Select) g2Select.value = "";

  const retakeGrp = document.getElementById("custom-retake-group");
  if (retakeGrp) retakeGrp.style.display = "none";

  const g1Label = document.getElementById("custom-g1-label");
  if (g1Label) g1Label.textContent = "Grade";

  renderCustomCoursesTable();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function removeCustomCourse(id) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.removeCustomCourse(id);
  renderCustomCoursesTable();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateCustomCourseGrade(id, field, value) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateCustomCourseGrade(id, field, value);
  renderCustomCoursesTable();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateCustomCourseCredits(id, credits) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateCustomCourseCredits(id, credits);

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function renderCustomCoursesTable() {
  const courseManager = window.courseManager;
  const tbody = document.getElementById("custom-courses-tbody");
  if (!tbody || !courseManager) return;

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