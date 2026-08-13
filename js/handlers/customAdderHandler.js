// js/handlers/customAdderHandler.js

import { GRADE_OPTIONS, LETTER_GRADE_OPTIONS } from '../constants.js';

/**
 * Generates dynamic form HTML for custom course adders (UGE, Language, or General Elective).
 */
export function generateCustomAdderTemplate(containerId, options = {}) {
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

/**
 * Handles UI toggling for retake options when a primary grade selection changes.
 */
export function onGrade1ChangeGeneric(idPrefix) {
  const g1Select = document.getElementById(`${idPrefix}-grade1`);
  if (!g1Select) return;

  const g1 = g1Select.value;
  const retakeGrp = document.getElementById(`${idPrefix}-retake-group`);
  const label1 = document.getElementById(`${idPrefix}-g1-label`);
  const isFail = (g1 === 'F' || g1 === 'FF');

  if (label1) label1.textContent = isFail ? "1st Grade" : "Grade";
  if (retakeGrp) {
    retakeGrp.style.display = isFail ? 'flex' : 'none';
    if (!isFail) {
      const g2Select = document.getElementById(`${idPrefix}-grade2`);
      if (g2Select) g2Select.value = '';
    }
  }
}