// js/handlers/langHandler.js

import { GRADE_OPTIONS } from '../constants.js';

export function addLangCourse() {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  const codeInput = document.getElementById("lang-code");
  const creditsInput = document.getElementById("lang-credits");
  const g1Select = document.getElementById("lang-grade1");
  const g2Select = document.getElementById("lang-grade2");
  const errBox = document.getElementById("lang-error");

  if (errBox) errBox.style.display = "none";
  if (!codeInput || !creditsInput || !g1Select || !g2Select) return;

  const result = courseManager.addLangCourse(
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

  const retakeGrp = document.getElementById("lang-retake-group");
  if (retakeGrp) retakeGrp.style.display = "none";

  const g1Label = document.getElementById("lang-g1-label");
  if (g1Label) g1Label.textContent = "Grade";

  renderLangCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function removeLangCourse(id) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.removeLangCourse(id);
  renderLangCoursesTable();
  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateLangCourseGrade(id, field, value) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateLangCourseGrade(id, field, value);
  renderLangCoursesTable();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function updateLangCourseCredits(id, credits) {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  courseManager.updateLangCourseCredits(id, credits);

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}

export function renderLangCoursesTable() {
  const courseManager = window.courseManager;
  const tbody = document.getElementById("lang-courses-tbody");
  if (!tbody || !courseManager) return;

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

export function onExemptionChange() {
  const courseManager = window.courseManager;
  if (!courseManager) return;

  const chkChlt = document.getElementById("chk-exempt-chlt");
  const chkEltu = document.getElementById("chk-exempt-eltu");

  const exemptCHLT = chkChlt ? chkChlt.checked : false;
  const exemptELTU = chkEltu ? chkEltu.checked : false;

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
        if (typeof window.toggleItemCheck === 'function') window.toggleItemCheck(code);
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
        if (typeof window.toggleItemCheck === 'function') window.toggleItemCheck(code);
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

  if (typeof window.updateCategoryCounts === 'function') window.updateCategoryCounts();

  const resultsSec = document.getElementById("results-section");
  if (resultsSec && resultsSec.style.display === "block" && typeof window.evaluateRequirements === 'function') {
    window.evaluateRequirements(false);
  }
}