// State Management
let customCourses = [];  // Custom Elective Courses
let ugeCourses = [];     // 4-Area GE Custom Courses
let phedCourses = [];    // Physical Education Courses
let langCourses = [];    // Language Enhancement Debt Custom Courses

// Helper Function for Template Generator for Custom Course Adder
function generateCustomAdderTemplate(containerId, options = {}) {
const container = document.getElementById(containerId);
if (!container) return;

const {
  idPrefix = 'custom',
  isUge = false,
  isLang = false
} = options;

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

// Physical Education Adder
function renderPhedAdderContainer() {
const container = document.getElementById("phed-adder-container");
if (!container) return;

const gradeOptionsHtml = LETTER_GRADE_OPTIONS.map(g => `<option value="${g}">${g}</option>`).join('');

container.innerHTML = `
  <div class="custom-form">
	<div class="field-group">
	  <label for="phed-code">Course Code</label>
	  <input type="text" id="phed-code" placeholder="e.g. PHED1001" style="text-transform:uppercase;">
	</div>
	<div class="field-group">
	  <label for="phed-credits">Units</label>
	  <input type="number" id="phed-credits" value="1" readonly style="width: 70px; background:#e2e8f0;">
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
	<button type="button" class="btn-add" onclick="addPhedCourse()">+ Add PHED Course</button>
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
const codeInput = document.getElementById("phed-code");
const g1Select = document.getElementById("phed-grade1");
const g2Select = document.getElementById("phed-grade2");
const errBox = document.getElementById("phed-error");

let rawCode = codeInput.value.trim().toUpperCase();
errBox.style.display = "none";

if (/^\d{4}$/.test(rawCode)) {
  rawCode = "PHED" + rawCode;
}

if (!/^PHED\d{4}$/.test(rawCode)) {
  errBox.textContent = "Invalid PHED course code! Must start with PHED followed by 4 digits (e.g., PHED1001).";
  errBox.style.display = "block";
  return;
}

const code = rawCode;
if (phedCourses.some(c => c.code === code)) {
  errBox.textContent = `Course ${code} is already added in Physical Education list!`;
  errBox.style.display = "block";
  return;
}

const grade1 = g1Select.value;
const grade2 = g2Select.value;

phedCourses.push({
  id: Date.now(),
  code,
  credits: 1,
  grade1,
  grade2: (grade1 === 'F') ? grade2 : ''
});

codeInput.value = "";
g1Select.value = "A";
g2Select.value = "";
document.getElementById("phed-retake-group").style.display = "none";
if (document.getElementById("phed-g1-label")) document.getElementById("phed-g1-label").textContent = "Grade";

renderPhedCoursesTable();
updateCategoryCounts();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function removePhedCourse(id) {
phedCourses = phedCourses.filter(c => c.id !== id);
renderPhedCoursesTable();
updateCategoryCounts();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function updatePhedCourseGrade(id, field, value) {
const course = phedCourses.find(c => c.id === id);
if (course) {
  course[field] = value;
  if (field === 'grade1' && value !== 'F') course.grade2 = '';
  renderPhedCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function renderPhedCoursesTable() {
const tbody = document.getElementById("phed-courses-tbody");
if (!tbody) return;

if (phedCourses.length === 0) {
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No PHED courses added.</td></tr>';
  return;
}

tbody.innerHTML = phedCourses.map(c => {
  const passed = isCustomCoursePassed(c);
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

/* Language Enhancement Debt Adder Functions */
function addLangCourse() {
const codeInput = document.getElementById("lang-code");
const creditsInput = document.getElementById("lang-credits");
const g1Select = document.getElementById("lang-grade1");
const g2Select = document.getElementById("lang-grade2");
const errBox = document.getElementById("lang-error");

const code = codeInput.value.trim().toUpperCase();
const credits = parseInt(creditsInput.value, 10) || 3;
const grade1 = g1Select.value;
const grade2 = g2Select.value;

errBox.style.display = "none";

const match = code.match(/^([A-Z]{3,4})(\d{4})$/);
if (!match) {
  errBox.textContent = "Invalid course code format! Must be 3-4 uppercase letters followed by 4 digits (e.g., TRAN1001).";
  errBox.style.display = "block";
  return;
}

const prefix = match[1];
if (!ALLOWED_LANG_PREFIXES.has(prefix)) {
  errBox.textContent = `Invalid course area "${prefix}"! Allowed areas are: CHLT, CLCE, CLCP, ELTU, ENGE, TRAN, CURE, JASP, ARAB, FREN, GERM, ITAL, KORE, RUSS, SPAN, THAI, HKSL.`;
  errBox.style.display = "block";
  return;
}

if (langCourses.some(c => c.code === code)) {
  errBox.textContent = `Course ${code} is already added in Language Enhancement Courses list!`;
  errBox.style.display = "block";
  return;
}

langCourses.push({
  id: Date.now(),
  code,
  credits,
  grade1,
  grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
});

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
langCourses = langCourses.filter(c => c.id !== id);
renderLangCoursesTable();
updateCategoryCounts();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function updateLangCourseGrade(id, field, value) {
const course = langCourses.find(c => c.id === id);
if (course) {
  course[field] = value;
  if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
  renderLangCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function updateLangCourseCredits(id, credits) {
const course = langCourses.find(c => c.id === id);
if (course) {
  course.credits = Math.max(0, parseInt(credits, 10) || 0);
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function renderLangCoursesTable() {
const tbody = document.getElementById("lang-courses-tbody");
if (!tbody) return;

if (langCourses.length === 0) {
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No Language Enhancement courses added.</td></tr>';
  return;
}

tbody.innerHTML = langCourses.map(c => {
  const passed = isCustomCoursePassed(c);
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

const debt = (exemptCHLT ? 2 : 0) + (exemptELTU ? 1 : 0);

const debtBox = document.getElementById("debt-info-box");
if (debtBox) {
  debtBox.textContent = `Language Enhancement Course units: ${debt} unit${debt !== 1 ? 's' : ''} required`;
  debtBox.style.color = debt > 0 ? "var(--warning)" : "var(--primary)";
}

// Gray out relevant courses for CHLT exemption
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

// Gray out relevant courses for ELTU exemption
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

// Show/Hide custom adder for debt
const langAdderSection = document.getElementById("lang-adder-section");
if (langAdderSection) {
  langAdderSection.style.display = debt > 0 ? "block" : "none";
}

updateCategoryCounts();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function getCourseCredits(code) {
if (code === 'MATH2221' || code === 'CHLT1002' || code === 'ELTU3018' || code === 'ELTU3019') return 2;
if (code === 'GECC1130' || code === 'GECC1230' || code.startsWith('GENA')) return 2;
if (code === 'GECC1132' || code === 'GEUC1111' || code === 'ENGG1003' || code.startsWith('UGCP') || code.startsWith('PHED')) return 1;
if (code === 'GESH2011' || code === 'GESH2012' || code === 'GECW4021' || code === 'GECW4030') return 1.5;
if (code === 'GEUC4011' || code === 'GEUC4012') return 3;

const uge = ugeCourses.find(c => c.code === code);
if (uge) return uge.credits;

const lang = langCourses.find(c => c.code === code);
if (lang) return lang.credits;

const custom = customCourses.find(c => c.code === code);
if (custom) return custom.credits;

const phed = phedCourses.find(c => c.code === code);
if (phed) return phed.credits;

return 3;
}

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

// Faculty Package split into Required and Elective grids
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

  return `
  <div class="checkbox-item" id="item-box-${item.code}">
	<div class="checkbox-top" onclick="handleContainerClick(event, '${item.code}')">
	  <input type="checkbox" class="course-chk" id="chk-${item.code}" value="${item.code}" data-credits="${item.credits}" onchange="toggleItemCheck('${item.code}')">
	  <label for="chk-${item.code}">${item.code}</label>
	  <span class="badge-unit">${item.credits} unit${item.credits !== 1 ? 's' : ''}</span>
	</div>
	<div class="grade-box" id="grade-box-${item.code}" style="display:none;">
	  <div class="grade-row">
		<span id="label-grade1-${item.code}">Grade:</span>
		<select class="grade-select" id="grade1-${item.code}" onchange="onGradeChange('${item.code}')">
		  ${optionsToUse.map(g => `<option value="${g}">${g}</option>`).join('')}
		</select>
	  </div>
	  <div class="retake-row" id="retake-row-${item.code}" style="display:none;">
		<span style="color:var(--danger); font-weight:600;">2nd Grade:</span>
		<select class="retake-select" id="grade2-${item.code}" onchange="onGradeChange('${item.code}')">
		  <option value="">--Select--</option>
		  ${optionsToUse.map(g => `<option value="${g}">${g}</option>`).join('')}
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
const g1 = document.getElementById(`grade1-${code}`)?.value;
const retakeRow = document.getElementById(`retake-row-${code}`);
const g2 = document.getElementById(`grade2-${code}`)?.value;
const label1 = document.getElementById(`label-grade1-${code}`);

if (!chk || !chk.checked) {
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

function isCoursePassed(code) {
const chk = document.getElementById(`chk-${code}`);
if (!chk || !chk.checked) return false;

const g1 = document.getElementById(`grade1-${code}`)?.value;
if (g1 === 'PP') return true;
if (g1 !== 'F' && g1 !== 'FF') return true;

const g2 = document.getElementById(`grade2-${code}`)?.value;
if (g2 === 'PP') return true;
return !!(g2 && g2 !== 'F' && g2 !== 'FF');
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
	  if (isCoursePassed(chk.value)) count++;
	});
	if (cat.gridId === "chlt-eltu-grid") {
	  count += langCourses.filter(isCustomCoursePassed).length;
	}
	badge.textContent = `${count} passed`;
	badge.classList.toggle('active', count > 0);
  }
});

// Faculty Package badge calculation across both req and elec grids
let facultyCount = 0;
['faculty-req-grid', 'faculty-elec-grid'].forEach(gridId => {
  const g = document.getElementById(gridId);
  if (g) {
	g.querySelectorAll('.course-chk').forEach(chk => {
	  if (isCoursePassed(chk.value)) facultyCount++;
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
  const ugePassedCount = ugeCourses.filter(isCustomCoursePassed).length;
  geBadge.textContent = `${ugePassedCount} passed`;
  geBadge.classList.toggle('active', ugePassedCount > 0);
}

const phedBadge = document.getElementById("count-phed");
if (phedBadge) {
  const phedPassedCount = phedCourses.filter(isCustomCoursePassed).length;
  phedBadge.textContent = `${phedPassedCount} passed`;
  phedBadge.classList.toggle('active', phedPassedCount > 0);
}
}

function onStreamChange() {
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

/* UGE 4-Area Custom Course Adder Logic */
function addUgeCourse() {
const areaSelect = document.getElementById("uge-area");
const codeNumInput = document.getElementById("uge-code-num");
const creditsInput = document.getElementById("uge-credits");
const g1Select = document.getElementById("uge-grade1");
const g2Select = document.getElementById("uge-grade2");
const errBox = document.getElementById("uge-error");

const area = areaSelect.value;
const codeNum = codeNumInput.value.trim();
const credits = parseInt(creditsInput.value, 10) || 3;
const grade1 = g1Select.value;
const grade2 = g2Select.value;

errBox.style.display = "none";

if (!/^\d{4}$/.test(codeNum)) {
  errBox.textContent = "Invalid course code number! Must be exactly 4 digits (e.g., 1110).";
  errBox.style.display = "block";
  return;
}

const code = `${area}${codeNum}`;

if (ugeCourses.some(c => c.code === code)) {
  errBox.textContent = `Course ${code} is already added in 4-Area GE courses list!`;
  errBox.style.display = "block";
  return;
}

ugeCourses.push({
  id: Date.now(),
  code,
  area,
  credits,
  grade1,
  grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
});

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
ugeCourses = ugeCourses.filter(c => c.id !== id);
renderUgeCoursesTable();
updateCategoryCounts();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function updateUgeCourseGrade(id, field, value) {
const course = ugeCourses.find(c => c.id === id);
if (course) {
  course[field] = value;
  if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
  renderUgeCoursesTable();
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function updateUgeCourseCredits(id, credits) {
const course = ugeCourses.find(c => c.id === id);
if (course) {
  course.credits = Math.max(0, parseInt(credits, 10) || 0);
  updateCategoryCounts();
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function renderUgeCoursesTable() {
const tbody = document.getElementById("uge-courses-tbody");
if (!tbody) return;

if (ugeCourses.length === 0) {
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No 4-Area GE courses added.</td></tr>';
  return;
}

tbody.innerHTML = ugeCourses.map(c => {
  const passed = isCustomCoursePassed(c);
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

/* Custom Elective Course Logic */
function addCustomCourse() {
const codeInput = document.getElementById("custom-code");
const creditsInput = document.getElementById("custom-credits");
const g1Select = document.getElementById("custom-grade1");
const g2Select = document.getElementById("custom-grade2");
const errBox = document.getElementById("custom-error");

const code = codeInput.value.trim().toUpperCase();
const credits = parseInt(creditsInput.value, 10) || 3;
const grade1 = g1Select.value;
const grade2 = g2Select.value;

errBox.style.display = "none";

const match = code.match(/^([A-Z]{3,4})(\d{4})$/);
if (!match) {
  errBox.textContent = "Invalid format! Course code must be 3-4 uppercase letters followed by 4 digits (e.g., ECON2011).";
  errBox.style.display = "block";
  return;
}

const prefix = match[1];
if (!ALLOWED_PREFIXES.has(prefix)) {
  errBox.textContent = `Invalid prefix "${prefix}"! Allowed prefixes are Science, Engineering, Economics/Finance, MATH, BMED, GE, UGCP, Language, or PHED.`;
  errBox.style.display = "block";
  return;
}

if (customCourses.some(c => c.code === code)) {
  errBox.textContent = `Course ${code} is already added in Custom Elective Courses list!`;
  errBox.style.display = "block";
  return;
}

customCourses.push({
  id: Date.now(),
  code,
  credits,
  grade1,
  grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
});

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
customCourses = customCourses.filter(c => c.id !== id);
renderCustomCoursesTable();
if (document.getElementById("results-section").style.display === "block") {
  evaluateRequirements(false);
}
}

function updateCustomCourseGrade(id, field, value) {
const course = customCourses.find(c => c.id === id);
if (course) {
  course[field] = value;
  if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
  renderCustomCoursesTable();
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function updateCustomCourseCredits(id, credits) {
const course = customCourses.find(c => c.id === id);
if (course) {
  course.credits = Math.max(0, parseInt(credits, 10) || 0);
  if (document.getElementById("results-section").style.display === "block") {
	evaluateRequirements(false);
  }
}
}

function isCustomCoursePassed(course) {
if (course.grade1 === 'PP') return true;
if (course.grade1 !== 'F' && course.grade1 !== 'FF') return true;
if (course.grade2 === 'PP') return true;
return !!(course.grade2 && course.grade2 !== 'F' && course.grade2 !== 'FF');
}

function renderCustomCoursesTable() {
const tbody = document.getElementById("custom-courses-tbody");
if (!tbody) return;

if (customCourses.length === 0) {
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No custom elective courses added.</td></tr>';
  return;
}

tbody.innerHTML = customCourses.map(c => {
  const passed = isCustomCoursePassed(c);
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

function toggleAllCategories(openState) {
document.querySelectorAll('details.category-details').forEach(det => {
  det.open = openState;
});
}

function toggleDevMode() {
const isChecked = document.getElementById("dev-mode-toggle").checked;
const debugBtn = document.getElementById("tab-btn-debug");
if (debugBtn) {
  debugBtn.style.display = isChecked ? "inline-block" : "none";
}
if (!isChecked && document.getElementById("tab-content-debug").classList.contains("active")) {
  switchTab('input');
}
}

function loadJsonSettings() {
const textarea = document.getElementById("json-debug-textarea");
if (!textarea || !textarea.value.trim()) {
  alert("Please paste or generate a valid JSON configuration in the text area.");
  return;
}

try {
  const data = JSON.parse(textarea.value);

  if (data.selectedStream) {
	document.getElementById("stream-select").value = data.selectedStream;
  }
  if (data.selectedCollege) {
	document.getElementById("college-select").value = data.selectedCollege;
	renderCollegeGeContent();
  }

  if (data.exemptCHLT !== undefined) {
	document.getElementById("chk-exempt-chlt").checked = !!data.exemptCHLT;
  }
  if (data.exemptELTU !== undefined) {
	document.getElementById("chk-exempt-eltu").checked = !!data.exemptELTU;
  }
  onExemptionChange();

  // Clear current check states
  document.querySelectorAll('.course-chk').forEach(chk => {
	if (!chk.disabled) {
	  chk.checked = false;
	  toggleItemCheck(chk.value);
	}
  });

  // Restore checked courses and grades from structured object
  if (data.courses && typeof data.courses === 'object') {
	Object.keys(data.courses).forEach(code => {
	  const item = data.courses[code];
	  const chk = document.getElementById(`chk-${code}`);
	  if (chk && !chk.disabled) {
		chk.checked = !!item.checked;
		const g1 = document.getElementById(`grade1-${code}`);
		if (g1 && item.grade1) g1.value = item.grade1;
		const g2 = document.getElementById(`grade2-${code}`);
		if (g2 && item.grade2) g2.value = item.grade2;
		toggleItemCheck(code);
	  }
	});
  } else if (Array.isArray(data.takenPassedCourses)) {
	// Fallback for older JSON formats
	data.takenPassedCourses.forEach(code => {
	  const chk = document.getElementById(`chk-${code}`);
	  if (chk && !chk.disabled) {
		chk.checked = true;
		toggleItemCheck(code);
	  }
	});
  }

  if (Array.isArray(data.ugeCoursesAdded)) {
	ugeCourses = data.ugeCoursesAdded;
  } else {
	ugeCourses = [];
  }

  if (Array.isArray(data.phedCoursesAdded)) {
	phedCourses = data.phedCoursesAdded;
  } else {
	phedCourses = [];
  }

  if (Array.isArray(data.langCoursesAdded)) {
	langCourses = data.langCoursesAdded;
  } else {
	langCourses = [];
  }

  if (Array.isArray(data.customCoursesAdded)) {
	customCourses = data.customCoursesAdded;
  } else {
	customCourses = [];
  }

  renderUgeCoursesTable();
  renderLangCoursesTable();
  renderPhedCoursesTable();
  renderCustomCoursesTable();
  updateCategoryCounts();

  evaluateRequirements(false);
  switchTab('input');
  alert("Settings loaded successfully into Course Input page!");
} catch (e) {
  alert("Error loading JSON settings: " + e.message);
}
}

function resetAll() {
document.getElementById("chk-exempt-chlt").checked = false;
document.getElementById("chk-exempt-eltu").checked = false;
onExemptionChange();

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

customCourses = [];
ugeCourses = [];
phedCourses = [];
langCourses = [];
renderCustomCoursesTable();
renderUgeCoursesTable();
renderLangCoursesTable();
renderPhedCoursesTable();
document.getElementById("stream-select").value = "ENRICH";
document.getElementById("college-select").value = "CC";
renderCollegeGeContent();
updateCategoryCounts();

document.getElementById("results-section").style.display = "none";
switchTab('input');
}

// Formatting Helper for Course Highlighting in Report
function formatCode(code, label) {
const displayText = label || code;
return isCoursePassed(code) ? `<span class="highlight-taken">${displayText}</span>` : displayText;
}

// College Display Names and GE Courses List Generator
function getCollegeGeReportText(college) {
if (college === "SHHO") {
  return {
	name: "SHHO College",
	text: `${formatCode('GESH1010')}, ${formatCode('GESH2011')}, ${formatCode('GESH2012')}`
  };
} else if (college === "CC") {
  return {
	name: "Chung Chi College",
	text: `${formatCode('GECC1130')} or ${formatCode('GECC1230', '1230')}, ${formatCode('GECC1132')}, ${formatCode('GECC3130')}, ${formatCode('GECC3230')}, ${formatCode('GECC3430')}, ${formatCode('GECC4130')}`
  };
} else if (college === "NA") {
  return {
	name: "New Asia College",
	text: `${formatCode('GENA1112')}, ${formatCode('GENA1113')}, Elective from GENA1114-1117 / GENA2112-2392 / GENA3070`
  };
} else if (college === "UC") {
  return {
	name: "United College",
	text: `${formatCode('GEUC1111')}, ${formatCode('GEUC2211')}/${formatCode('GEUC2212')}/${formatCode('GEUC2213')}/${formatCode('GEUC2214')}/${formatCode('GEUC2215')}, ${formatCode('GEUC4011')} or ${formatCode('GEUC4012', '4012')}`
  };
} else if (college === "SHAW") {
  return {
	name: "Shaw College",
	text: `${formatCode('ELTU2008')}, ${formatCode('GESC1130')}, ${formatCode('GESC1160')}, ${formatCode('GESC1210')}, GESC Elective`
  };
} else if (college === "MC") {
  return {
	name: "Morningside College",
	text: `${formatCode('GEMC1001')}, ${formatCode('GEMC3001')}`
  };
} else if (college === "CWC") {
  return {
	name: "CW Chu College",
	text: `${formatCode('GECW1010')}, ${formatCode('GECW4022')} (or ${formatCode('GECW4021')} and ${formatCode('GECW4030')})`
  };
} else if (college === "WYS") {
  return {
	name: "Wu Yee Sun College",
	text: `${formatCode('GEYS1010')}, ${formatCode('GEYS4010')} or ${formatCode('GEYS4011', '4011')}`
  };
} else if (college === "LWS") {
  return {
	name: "Lee Woo Sing College",
	text: `${formatCode('GEWS1011')} or ${formatCode('GEWS1012', '1012')}, GEWS Elective`
  };
}
return { name: "Selected College", text: "College GE Courses" };
}

function evaluateRequirements(showAlert = true) {
const stream = document.getElementById("stream-select").value;
const college = document.getElementById("college-select").value;

const exemptCHLT = document.getElementById("chk-exempt-chlt")?.checked || false;
const exemptELTU = document.getElementById("chk-exempt-eltu")?.checked || false;

// --- 1. FACULTY PACKAGE EVALUATION (Requirement 1: STAT1011 REQUIRED + 1 Science) ---
const stat1011Passed = isCoursePassed('STAT1011');
const scienceElectives = ['LSCI1001', 'LSCI1002', 'CHEM1070', 'CHEM1072', 'CHEM1280', 'PHYS1001', 'PHYS1002', 'PHYS1111', 'PHYS1113'];
const passedScienceElectives = scienceElectives.filter(isCoursePassed);
const facultyUnitsCompleted = (stat1011Passed ? 3 : 0) + (passedScienceElectives.length > 0 ? 3 : 0);
const facultyFulfilled = stat1011Passed && passedScienceElectives.length >= 1;

// --- 2. MAJOR 1000-LEVEL FOUNDATION EVALUATION ---
const math1010Passed = isCoursePassed('MATH1010') || isCoursePassed('MATH1018');
const math1030Passed = isCoursePassed('MATH1030') || isCoursePassed('MATH1038');
const math1050Passed = isCoursePassed('MATH1050') || isCoursePassed('MATH1058');
const math1000UnitsCompleted = (math1010Passed ? 3 : 0) + (math1030Passed ? 3 : 0) + (math1050Passed ? 3 : 0);
const math1000Fulfilled = math1010Passed && math1030Passed && math1050Passed;

// --- 3. GE & UNIVERSITY REQUIREMENTS EVALUATION ---
// College GE
let collegeGeUnits = 0;
const collegeGrid = document.getElementById('college-ge-grid');
if (collegeGrid) {
  collegeGrid.querySelectorAll('.course-chk').forEach(chk => {
	if (isCoursePassed(chk.value)) collegeGeUnits += getCourseCredits(chk.value);
  });
}
const collegeGeFulfilled = collegeGeUnits >= 6;

// GE Foundation
const ugfhPassed = isCoursePassed('UGFH1000');
const ugfnPassed = isCoursePassed('UGFN1000');
const geFoundUnits = (ugfhPassed ? 3 : 0) + (ugfnPassed ? 3 : 0);
const geFoundFulfilled = ugfhPassed && ugfnPassed;

// Digital Literacy
const digitalLiteracyPassed = isCoursePassed('ENGG1003');
const digitalLiteracyUnits = digitalLiteracyPassed ? 1 : 0;

// UGCP Area
const ugcp1Passed = isCoursePassed('UGCP1001');
const ugcp2Passed = isCoursePassed('UGCP1002');
const ugcpUnits = (ugcp1Passed ? 1 : 0) + (ugcp2Passed ? 1 : 0);
const ugcpFulfilled = ugcp1Passed && ugcp2Passed;

// UGE 4-Area Courses
const passedUge = ugeCourses.filter(isCustomCoursePassed);
const ugeAUnits = passedUge.filter(c => c.area === 'UGEA').reduce((acc, c) => acc + c.credits, 0);
const ugeCUnits = passedUge.filter(c => c.area === 'UGEC').reduce((acc, c) => acc + c.credits, 0);
const ugeDUnits = passedUge.filter(c => c.area === 'UGED').reduce((acc, c) => acc + c.credits, 0);
const ugeTotalUnits = ugeAUnits + ugeCUnits + ugeDUnits;
const ugeFulfilled = (ugeTotalUnits >= 7) && (ugeAUnits > 0) && (ugeCUnits > 0) && (ugeDUnits > 0);

// PE Requirements
const passedPhed = phedCourses.filter(isCustomCoursePassed);
const phedUnits = passedPhed.reduce((acc, c) => acc + c.credits, 0);
const phedFulfilled = phedUnits >= 2;

// Language Requirements
const chltFulfilled = exemptCHLT || (isCoursePassed('CHLT1001') && isCoursePassed('CHLT1002'));
const eltu1Passed = exemptELTU || isCoursePassed('ELTU1001') || isCoursePassed('ELTU1002');
const eltu2Passed = isCoursePassed('ELTU2018') || isCoursePassed('ELTU2019');
const eltu3Passed = isCoursePassed('ELTU3018') || isCoursePassed('ELTU3019');
const eltuFulfilled = eltu1Passed && eltu2Passed && eltu3Passed;

const langDebt = (exemptCHLT ? 2 : 0) + (exemptELTU ? 1 : 0);
const langDebtUnitsCompleted = langCourses.filter(isCustomCoursePassed).reduce((acc, c) => acc + c.credits, 0);
const langDebtFulfilled = langDebtUnitsCompleted >= langDebt;

const languageOverallFulfilled = chltFulfilled && eltuFulfilled && langDebtFulfilled;

// Update Progress Summary Table
const tbody = document.getElementById("progress-table-body");
tbody.innerHTML = `
  <tr>
	<td>College GE Requirement</td>
	<td>${collegeGeUnits} / 6</td>
	<td>6 Units</td>
	<td>${collegeGeFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>University GE Foundation</td>
	<td>${geFoundUnits} / 6</td>
	<td>6 Units</td>
	<td>${geFoundFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>Digital Literacy Course</td>
	<td>${digitalLiteracyUnits} / 1</td>
	<td>1 Unit</td>
	<td>${digitalLiteracyPassed ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>UGCP Area</td>
	<td>${ugcpUnits} / 2</td>
	<td>2 Units</td>
	<td>${ugcpFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>University GE 4-Area Courses</td>
	<td>${ugeTotalUnits} / 7</td>
	<td>7 Units</td>
	<td>${ugeFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>Physical Education</td>
	<td>${phedUnits} / 2</td>
	<td>2 Units</td>
	<td>${phedFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>Language Requirements</td>
	<td>-</td>
	<td>Required Courses</td>
	<td>${languageOverallFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>Faculty Package Requirement</td>
	<td>${facultyUnitsCompleted} / 6</td>
	<td>6 Units</td>
	<td>${facultyFulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
  <tr>
	<td>1000-level Major Foundation</td>
	<td>${math1000UnitsCompleted} / 9</td>
	<td>9 Units</td>
	<td>${math1000Fulfilled ? '<span class="status-badge status-fulfilled">FULFILLED</span>' : '<span class="status-badge status-pending">PENDING</span>'}</td>
  </tr>
`;

// --- REPORT SPECIFICATION FORMATTING (Requirements 2 and 3) ---
const collegeInfo = getCollegeGeReportText(college);

const ugeaAllocated = passedUge.filter(c => c.area === 'UGEA').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
const ugecAllocated = passedUge.filter(c => c.area === 'UGEC').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
const ugedAllocated = passedUge.filter(c => c.area === 'UGED').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
const phedAllocated = passedPhed.map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';

const chltReportText = exemptCHLT 
  ? `<del>CHLT1001, CHLT1002</del> (Exempted)` 
  : `${formatCode('CHLT1001')}, ${formatCode('CHLT1002')}`;

const eltuReportText = exemptELTU 
  ? `<del>ELTU1001, ELTU1002</del> (Exempted), ${formatCode('ELTU2018')}, ${formatCode('ELTU2019')}, ${formatCode('ELTU3018')}, ${formatCode('ELTU3019')}` 
  : `${formatCode('ELTU1001')}, ${formatCode('ELTU1002')}, ${formatCode('ELTU2018')}, ${formatCode('ELTU2019')}, ${formatCode('ELTU3018')}, ${formatCode('ELTU3019')}`;

const langAllocated = langCourses.filter(isCustomCoursePassed).map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';

const reportHtml = `
GENERAL EDUCATION & UNIVERSITY REQUIREMENTS
- College GE Requirement (6 Units): ${collegeInfo.name} -
 ${collegeInfo.text}
- University GE Foundation (6 Units): 
 ${formatCode('UGFH1000')} and ${formatCode('UGFN1000')}
- Digital Literacy Course (1 Unit): 
 ${formatCode('ENGG1003')}
- UGCP Area (2 Units): 
  ${formatCode('UGCP1001')} and ${formatCode('UGCP1002')}
- University GE 4-Area Courses (7 Units): 
 Area A (UGEA) Courses allocated: ${ugeaAllocated}
 Area C (UGEC) Courses allocated: ${ugecAllocated}
 Area D (UGED) Courses allocated: ${ugedAllocated}
- Physical Education (2 Units): 
 Courses allocated: ${phedAllocated}
- Language Requirements:
 Chinese: ${chltReportText}
 English: ${eltuReportText}
 * Language Enhancement Course units: 
	Courses allocated: ${langAllocated}

FACULTY PACKAGE REQUIREMENTS (6 Units)
- STAT1011 (Required): ${formatCode('STAT1011')}
- Faculty Elective (1 Course Required):
 ${formatCode('LSCI1001')}, ${formatCode('LSCI1002')}, ${formatCode('CHEM1070')}, ${formatCode('CHEM1072')}, ${formatCode('CHEM1280')}, ${formatCode('PHYS1001')}, ${formatCode('PHYS1002')}, ${formatCode('PHYS1111')}, ${formatCode('PHYS1113')}

MAJOR REQUIREMENTS
(a) 1000-level Foundation:
   ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')}, 
   ${formatCode('MATH1030')} or ${formatCode('MATH1038', '1038')}, 
   ${formatCode('MATH1050')} or ${formatCode('MATH1058', '1058')}

(b) Required Courses:
   ${formatCode('MATH2010')} or ${formatCode('MATH2018', '2018')}, ${formatCode('MATH2020')} or ${formatCode('MATH2028', '2028')}, ${formatCode('MATH2040')} or ${formatCode('MATH2048', '2048')}, ${formatCode('MATH2050')} or ${formatCode('MATH2058', '2058')}, ${formatCode('MATH2060')} or ${formatCode('MATH2068', '2068')}, ${formatCode('MATH2070')} or ${formatCode('MATH2078', '2078')}

(c) Stream Requirements (${stream}):
${streamDescriptions[stream] || ''}
`;

document.getElementById("highlighted-text").innerHTML = reportHtml.trim();
document.getElementById("overall-summary-box").innerHTML = `
  Specialization Stream: <strong>${stream}</strong> | College: <strong>${college}</strong>
`;

document.getElementById("results-section").style.display = "block";
updateJsonDebugArea();

if (showAlert) {
  switchTab('report');
}
}

function updateJsonDebugArea() {
const stream = document.getElementById("stream-select").value;
const college = document.getElementById("college-select").value;

const exemptCHLT = document.getElementById("chk-exempt-chlt")?.checked || false;
const exemptELTU = document.getElementById("chk-exempt-eltu")?.checked || false;

const courseMap = {};
document.querySelectorAll('.checkbox-grid .course-chk').forEach(chk => {
  const code = chk.value;
  const g1 = document.getElementById(`grade1-${code}`)?.value || '';
  const g2 = document.getElementById(`grade2-${code}`)?.value || '';
  courseMap[code] = {
	checked: chk.checked,
	grade1: g1,
	grade2: g2
  };
});

const debugObj = {
  selectedStream: stream,
  selectedCollege: college,
  exemptCHLT,
  exemptELTU,
  courses: courseMap,
  ugeCoursesAdded: ugeCourses,
  phedCoursesAdded: phedCourses,
  langCoursesAdded: langCourses,
  customCoursesAdded: customCourses
};

const textarea = document.getElementById("json-debug-textarea");
if (textarea) {
  textarea.value = JSON.stringify(debugObj, null, 2);
}
}

// Initialize Interface on DOM Load
window.addEventListener('DOMContentLoaded', () => {
renderCheckboxes();
});