// js/reportTab/evaluateRequirements.js

import { streamDescriptions } from '../constants.js';
import { getCollegeGeReportText, formatCode } from './reportGeneration.js';
import { updateJsonDebugArea } from '../debugTab/debugArea.js';

export function evaluateRequirements(showAlert = true) {
  const courseManager = window.courseManager;
  const stream = document.getElementById("stream-select").value;
  const college = document.getElementById("college-select").value;

  const stat1011Passed = courseManager.isCoursePassed('STAT1011');
  const scienceElectives = ['LSCI1001', 'LSCI1002', 'CHEM1070', 'CHEM1072', 'CHEM1280', 'PHYS1001', 'PHYS1002', 'PHYS1111', 'PHYS1113'];
  const passedScienceElectives = scienceElectives.filter(code => courseManager.isCoursePassed(code));
  const facultyUnitsCompleted = (stat1011Passed ? 3 : 0) + (passedScienceElectives.length > 0 ? 3 : 0);
  const facultyFulfilled = stat1011Passed && passedScienceElectives.length >= 1;

  const math1010Passed = courseManager.isCoursePassed('MATH1010') || courseManager.isCoursePassed('MATH1018');
  const math1030Passed = courseManager.isCoursePassed('MATH1030') || courseManager.isCoursePassed('MATH1038');
  const math1050Passed = courseManager.isCoursePassed('MATH1050') || courseManager.isCoursePassed('MATH1058');
  const math1000UnitsCompleted = (math1010Passed ? 3 : 0) + (math1030Passed ? 3 : 0) + (math1050Passed ? 3 : 0);
  const math1000Fulfilled = math1010Passed && math1030Passed && math1050Passed;

  let collegeGeUnits = 0;
  const collegeGrid = document.getElementById('college-ge-grid');
  if (collegeGrid) {
    collegeGrid.querySelectorAll('.course-chk').forEach(chk => {
      if (courseManager.isCoursePassed(chk.value)) collegeGeUnits += courseManager.getCourseCredits(chk.value);
    });
  }
  const collegeGeFulfilled = collegeGeUnits >= 6;

  const ugfhPassed = courseManager.isCoursePassed('UGFH1000');
  const ugfnPassed = courseManager.isCoursePassed('UGFN1000');
  const geFoundUnits = (ugfhPassed ? 3 : 0) + (ugfnPassed ? 3 : 0);
  const geFoundFulfilled = ugfhPassed && ugfnPassed;

  const digitalLiteracyPassed = courseManager.isCoursePassed('ENGG1003');
  const digitalLiteracyUnits = digitalLiteracyPassed ? 1 : 0;

  const ugcp1Passed = courseManager.isCoursePassed('UGCP1001');
  const ugcp2Passed = courseManager.isCoursePassed('UGCP1002');
  const ugcpUnits = (ugcp1Passed ? 1 : 0) + (ugcp2Passed ? 1 : 0);
  const ugcpFulfilled = ugcp1Passed && ugcp2Passed;

  const passedUge = courseManager.ugeCourses.filter(c => courseManager.isCustomCoursePassed(c));
  const ugeAUnits = passedUge.filter(c => c.area === 'UGEA').reduce((acc, c) => acc + c.credits, 0);
  const ugeCUnits = passedUge.filter(c => c.area === 'UGEC').reduce((acc, c) => acc + c.credits, 0);
  const ugeDUnits = passedUge.filter(c => c.area === 'UGED').reduce((acc, c) => acc + c.credits, 0);
  const ugeTotalUnits = ugeAUnits + ugeCUnits + ugeDUnits;
  const ugeFulfilled = (ugeTotalUnits >= 7) && (ugeAUnits > 0) && (ugeCUnits > 0) && (ugeDUnits > 0);

  const passedPhed = courseManager.phedCourses.filter(c => courseManager.isCustomCoursePassed(c));
  const phedUnits = passedPhed.reduce((acc, c) => acc + c.credits, 0);
  const phedFulfilled = phedUnits >= 2;

  const chltFulfilled = courseManager.exemptCHLT || (courseManager.isCoursePassed('CHLT1001') && courseManager.isCoursePassed('CHLT1002'));
  const eltu1Passed = courseManager.exemptELTU || courseManager.isCoursePassed('ELTU1001') || courseManager.isCoursePassed('ELTU1002');
  const eltu2Passed = courseManager.isCoursePassed('ELTU2018') || courseManager.isCoursePassed('ELTU2019');
  const eltu3Passed = courseManager.isCoursePassed('ELTU3018') || courseManager.isCoursePassed('ELTU3019');
  const eltuFulfilled = eltu1Passed && eltu2Passed && eltu3Passed;

  const langDebt = courseManager.getLangDebt();
  const langDebtUnitsCompleted = courseManager.langCourses.filter(c => courseManager.isCustomCoursePassed(c)).reduce((acc, c) => acc + c.credits, 0);
  const langDebtFulfilled = langDebtUnitsCompleted >= langDebt;

  const languageOverallFulfilled = chltFulfilled && eltuFulfilled && langDebtFulfilled;

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

  const collegeInfo = getCollegeGeReportText(college);
  const ugeaAllocated = passedUge.filter(c => c.area === 'UGEA').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
  const ugecAllocated = passedUge.filter(c => c.area === 'UGEC').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
  const ugedAllocated = passedUge.filter(c => c.area === 'UGED').map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';
  const phedAllocated = passedPhed.map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';

  const chltReportText = courseManager.exemptCHLT
    ? `<del>CHLT1001, CHLT1002</del> (Exempted)`
    : `${formatCode('CHLT1001')}, ${formatCode('CHLT1002')}`;

  const eltuReportText = courseManager.exemptELTU
    ? `<del>ELTU1001, ELTU1002</del> (Exempted), ${formatCode('ELTU2018')}, ${formatCode('ELTU2019')}, ${formatCode('ELTU3018')}, ${formatCode('ELTU3019')}`
    : `${formatCode('ELTU1001')}, ${formatCode('ELTU1002')}, ${formatCode('ELTU2018')}, ${formatCode('ELTU2019')}, ${formatCode('ELTU3018')}, ${formatCode('ELTU3019')}`;

  const langAllocated = courseManager.langCourses.filter(c => courseManager.isCustomCoursePassed(c)).map(c => `<span class="highlight-taken">${c.code}</span>`).join(', ') || '';

  const reportHtml = `
GENERAL EDUCATION & UNIVERSITY REQUIREMENTS
- College GE Requirement (${collegeInfo.name}, 6 Units):
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

==============================================================

Major Programme Requirement
Students are required to complete a minimum of 71 units of courses as follows:

1. Faculty Package
- Group C: ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')} or ${formatCode('MATH1030', '1030')} or ${formatCode('MATH1038', '1038')}
- Group E: ${formatCode('STAT1011')}
- A course from the following:
 Group A: ${formatCode('LSCI1001')} or ${formatCode('LSCI1002', '1002')},
 Group B: ${formatCode('CHEM1070')} or ${formatCode('CHEM1072', '1072')}, ${formatCode('CHEM1280', '1280')},
 Group D: ${formatCode('PHYS1001')} or ${formatCode('PHYS1002', '1002')} or ${formatCode('PHYS1111', '1111')} or ${formatCode('PHYS1113', '1113')}

2. Required Courses
(a)
   ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')}, 
   ${formatCode('MATH1030')} or ${formatCode('MATH1038', '1038')}, 
   ${formatCode('MATH1050')} or ${formatCode('MATH1058', '1058')} or ${formatCode('MATH1090', '1090')} or ${formatCode('MATH1098', '1098')}

   ${formatCode('MATH2010')} or ${formatCode('MATH2018', '2018')},
   ${formatCode('MATH2020')} or ${formatCode('MATH2028', '2028')},
   ${formatCode('MATH2040')} or ${formatCode('MATH2048', '2048')},
   ${formatCode('MATH2050')} or ${formatCode('MATH2058', '2058')},
   ${formatCode('MATH2060')} or ${formatCode('MATH2068', '2068')},
   ${formatCode('MATH2070')} or ${formatCode('MATH2078', '2078')},
   ${formatCode('MATH2221')},
   ${formatCode('MATH2230')}

(b) At least one course from ${formatCode('MATH3060')}, ${formatCode('STAT2001')} or ${formatCode('STAT2006', '2006')}
(c) Capstone course: Either ${formatCode('MATH4400')} or ${formatCode('MATH4900', '4900')}

3. Stream Requirements (${stream}):
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
