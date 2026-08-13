// js/reportTab/evaluateRequirements.js

import { streamData } from '../constants.js';
import { updateJsonDebugArea } from '../debugTab/debugArea.js';

import { getCollegeGeReportText, formatCode } from './reportGeneration.js';
import { getEltuReportText } from './getEltuReportText.js';
import { getChltReportText } from './getChltReportText.js';
import { getLangReportText } from './getLangReportText.js';

export function evaluateRequirements(showAlert = true) {
  const courseManager = window.courseManager;
  const stream = document.getElementById("stream-select").value;
  const college = document.getElementById("college-select").value;

  // -------------------------------------------------------------
  // 1. CHECKS & ALLOCATIONS
  // -------------------------------------------------------------

  // Faculty Package Checks
  const stat1011Passed = courseManager.isCoursePassed('STAT1011');
  const scienceElectives = ['LSCI1001', 'LSCI1002', 'CHEM1070', 'CHEM1072', 'CHEM1280', 'PHYS1001', 'PHYS1002', 'PHYS1111', 'PHYS1113'];
  const passedScienceElectives = scienceElectives.filter(code => courseManager.isCoursePassed(code));
  const facultyUnitsCompleted = (stat1011Passed ? 3 : 0) + (passedScienceElectives.length > 0 ? 3 : 0);
  const facultyFulfilled = stat1011Passed && passedScienceElectives.length >= 1;

  // 1000-level Foundation Checks
  const math1010Passed = courseManager.isCoursePassed('MATH1010') || courseManager.isCoursePassed('MATH1018');
  const math1030Passed = courseManager.isCoursePassed('MATH1030') || courseManager.isCoursePassed('MATH1038');
  const math1050Passed = courseManager.isCoursePassed('MATH1050') || courseManager.isCoursePassed('MATH1058');
  const math1000UnitsCompleted = (math1010Passed ? 3 : 0) + (math1030Passed ? 3 : 0) + (math1050Passed ? 3 : 0);
  const math1000Fulfilled = math1010Passed && math1030Passed && math1050Passed;

  // College GE Checks & Data
  let collegeGeUnits = 0;
  const collegeGrid = document.getElementById('college-ge-grid');
  if (collegeGrid) {
    collegeGrid.querySelectorAll('.course-chk').forEach(chk => {
      if (courseManager.isCoursePassed(chk.value)) collegeGeUnits += courseManager.getCourseCredits(chk.value);
    });
  }
  const collegeGeFulfilled = collegeGeUnits >= 6;
  const rawCollegeData = getCollegeGeReportText(college);
  const collegeInfo = typeof rawCollegeData === 'object' && rawCollegeData !== null 
    ? rawCollegeData 
    : { name: college, text: rawCollegeData || '' };

  // University GE Foundation Checks
  const ugfhPassed = courseManager.isCoursePassed('UGFH1000');
  const ugfnPassed = courseManager.isCoursePassed('UGFN1000');
  const geFoundUnits = (ugfhPassed ? 3 : 0) + (ugfnPassed ? 3 : 0);
  const geFoundFulfilled = ugfhPassed && ugfnPassed;

  // Digital Literacy
  const digitalLiteracyPassed = courseManager.isCoursePassed('ENGG1003');
  const digitalLiteracyUnits = digitalLiteracyPassed ? 1 : 0;

  // UGCP Area
  const ugcp1Passed = courseManager.isCoursePassed('UGCP1001');
  const ugcp2Passed = courseManager.isCoursePassed('UGCP1002');
  const ugcpUnits = (ugcp1Passed ? 1 : 0) + (ugcp2Passed ? 1 : 0);
  const ugcpFulfilled = ugcp1Passed && ugcp2Passed;

  // UGE 4-Area
  const passedUge = courseManager.ugeCourses.filter(c => courseManager.isCustomCoursePassed(c));
  const ugeAUnits = passedUge.filter(c => c.area === 'UGEA').reduce((acc, c) => acc + c.credits, 0);
  const ugeCUnits = passedUge.filter(c => c.area === 'UGEC').reduce((acc, c) => acc + c.credits, 0);
  const ugeDUnits = passedUge.filter(c => c.area === 'UGED').reduce((acc, c) => acc + c.credits, 0);
  const ugeTotalUnits = ugeAUnits + ugeCUnits + ugeDUnits;
  const ugeFulfilled = (ugeTotalUnits >= 7) && (ugeAUnits > 0) && (ugeCUnits > 0) && (ugeDUnits > 0);

  const ugeaAllocated = passedUge.filter(c => c.area === 'UGEA').map(c => formatCode(c.code)).join(', ') || 'None';
  const ugecAllocated = passedUge.filter(c => c.area === 'UGEC').map(c => formatCode(c.code)).join(', ') || 'None';
  const ugedAllocated = passedUge.filter(c => c.area === 'UGED').map(c => formatCode(c.code)).join(', ') || 'None';

  // Physical Education
  const passedPhed = courseManager.phedCourses.filter(c => courseManager.isCustomCoursePassed(c));
  const phedUnits = passedPhed.reduce((acc, c) => acc + c.credits, 0);
  const phedFulfilled = phedUnits >= 2;
  const phedAllocated = passedPhed.map(c => formatCode(c.code)).join(', ') || 'None';

  // Languages
  const chltFulfilled = courseManager.exemptCHLT || (courseManager.isCoursePassed('CHLT1001') && courseManager.isCoursePassed('CHLT1002'));
  const eltu1Passed = courseManager.exemptELTU || courseManager.isCoursePassed('ELTU1001') || courseManager.isCoursePassed('ELTU1002');
  const eltu2Passed = courseManager.isCoursePassed('ELTU2018') || courseManager.isCoursePassed('ELTU2019');
  const eltu3Passed = courseManager.isCoursePassed('ELTU3018') || courseManager.isCoursePassed('ELTU3019');
  const eltuFulfilled = eltu1Passed && eltu2Passed && eltu3Passed;

  const langDebt = courseManager.getLangDebt();
  const langDebtUnitsCompleted = courseManager.langCourses.filter(c => courseManager.isCustomCoursePassed(c)).reduce((acc, c) => acc + c.credits, 0);
  const langDebtFulfilled = langDebtUnitsCompleted >= langDebt;
  const languageOverallFulfilled = chltFulfilled && eltuFulfilled && langDebtFulfilled;

  // Language course strings
  const chltReportText = getChltReportText(courseManager);
  const eltuReportText = getEltuReportText(courseManager);
  const langReportText = getLangReportText(courseManager);
	
  // Get the generator function for the selected stream (3b)
  const streamFn = streamData[stream];
  // Build accordion list for all streams
  const allStreamsHtml = streamData.map(st => {
    const isSelected = st.key === stream;
    return `
      <details style="margin-top: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; padding: 0.5rem 0.75rem; background-color: ${isSelected ? '#f0f9ff' : '#ffffff'};" ${isSelected ? 'open' : ''}>
        <summary style="font-weight: bold; cursor: pointer; color: ${isSelected ? '#0284c7' : '#374151'};">
          ${st.title} ${isSelected ? '<strong>(Selected Stream)</strong>' : ''}
        </summary>
        <div style="margin-top: 0.5rem; padding-left: 0.5rem; line-height: 1.5; color: #1f2937;">
          ${st.render(formatCode)}
        </div>
      </details>
  `  ;
  }).join('');

  // -------------------------------------------------------------
  // 2. SUMMARY PROGRESS TABLE
  // -------------------------------------------------------------
  const tbody = document.getElementById("progress-table-body");
  if (tbody) {
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
  }

  // -------------------------------------------------------------
  // 3. WORD DOCUMENT STYLE HTML REPORT
  // -------------------------------------------------------------
  const reportHtml = `
    <div style="font-family: 'Times New Roman', Times, serif; color: #000000; max-width: 800px; margin: 0 auto; line-height: 1.25; font-size: 1.05rem;">
      
      <!-- Document Header Outside Outer Box -->
      <div style="text-align: center; font-weight: bold; margin-bottom: 1.5rem;">
        <div style="font-size: 1.35rem;">Mathematics</div>
        <div style="font-size: 1.15rem; margin-top: 0.35rem;">Applicable to students admitted in 2024–25</div>
      </div>

      <!-- Outer Box Framing Document Body -->
      <div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
        
        <!-- SECTION 1: GENERAL EDUCATION & UNIVERSITY REQUIREMENTS -->
        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">General Education & University Requirements</div>
        
        <table style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem; margin-bottom: 1.75rem;">
          <colgroup>
            <col style="width: 70px !important;" />
            <col style="width: auto !important;" />
            <col style="width: 60px !important;" />
          </colgroup>

          <tr style="border: none;">
            <td style="border: none;"></td>
            <td style="border: none;"></td>
            <td style="text-align: right; font-weight: bold; vertical-align: top; padding-bottom: 0.5rem; border: none;">Units</td>
          </tr>

          <!-- GE Item 1 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">1.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>College GE Requirement (${collegeInfo.name || college}):</strong><br>
              ${collegeInfo.text || ''}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">6</td>
          </tr>

          <!-- GE Item 2 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">2.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>University GE Foundation:</strong> <br>
              ${formatCode('UGFH1000')} and ${formatCode('UGFN1000')}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">6</td>
          </tr>

          <!-- GE Item 3 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">3.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>Digital Literacy Course:</strong> <br>
              ${formatCode('ENGG1003')}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">1</td>
          </tr>

          <!-- GE Item 4 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">4.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>UGCP Area:</strong> <br>
              ${formatCode('UGCP1001')} and ${formatCode('UGCP1002')}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">2</td>
          </tr>

          <!-- GE Item 5 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">5.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>University GE 4-Area Courses:</strong><br>
              Group A (UGEA): ${ugeaAllocated}<br>
              Group C (UGEC): ${ugecAllocated}<br>
              Group D (UGED): ${ugedAllocated}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">7</td>
          </tr>

          <!-- GE Item 6 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">6.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>Physical Education:</strong> <br>
              ${phedAllocated}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">2</td>
          </tr>

          <!-- GE Item 7 -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none;">7.</td>
            <td style="vertical-align: top; padding-bottom: 0.5rem; border: none; line-height: 1.5;">
              <strong>Language Requirements:</strong><br>
              Chinese: <br>
			  ${chltReportText}<br>
              English: <br>
			  ${eltuReportText}<br>
              Language Enhancement Courses: <br>
			  ${langReportText}
            </td>
            <td style="text-align: right; vertical-align: top; padding-bottom: 0.5rem; border: none;">Required</td>
          </tr>
        </table>

        <!-- SECTION 2: MAJOR PROGRAMME REQUIREMENT -->
        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">Major Programme Requirement</div>
        
        <table style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
          <colgroup>
            <col style="width: 70px !important;" />
            <col style="width: auto !important;" />
            <col style="width: 60px !important;" />
          </colgroup>

          <!-- Top Subtitle Row -->
          <tr style="border: none;">
            <td colspan="2" style="vertical-align: top; padding-bottom: 0.75rem; border: none;">
              Students are required to complete a minimum of 71 units[a] of courses as follows:
            </td>
            <td style="text-align: right; font-weight: bold; vertical-align: top; padding-bottom: 0.75rem; border: none;">
              Units
            </td>
          </tr>
          
          <!-- Item 1 Header -->
          <tr style="border: none;">
            <td style="vertical-align: top; border: none;">1.</td>
            <td style="vertical-align: top; border: none;">Faculty Package:</td>
            <td style="text-align: right; vertical-align: top; border: none;">9</td>
          </tr>

          <!-- Item 1 Details -->
          <tr style="border: none;">
            <td style="border: none;"></td>
            <td style="vertical-align: top; padding-bottom: 1.25rem; border: none; line-height: 1.5;">
              <div>Group C: ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')} or ${formatCode('MATH1030', '1030')} or ${formatCode('MATH1038', '1038')}</div>
              <div>Group E: ${formatCode('STAT1011')}</div>
              <div>A course from the following:</div>
              <div>Group A: ${formatCode('LSCI1001')} or ${formatCode('LSCI1002', '1002')}</div>
              <div>Group B: ${formatCode('CHEM1070')} or ${formatCode('CHEM1072', '1072')} or ${formatCode('CHEM1280', '1280')}</div>
              <div>Group D: ${formatCode('PHYS1001')} or ${formatCode('PHYS1002', '1002')} or ${formatCode('PHYS1111', '1111')} or ${formatCode('PHYS1113', '1113')}</div>
            </td>
            <td style="border: none;"></td>
          </tr>

          <!-- Item 2 Header -->
          <tr style="border: none;">
            <td style="vertical-align: top; border: none;">2.</td>
            <td style="vertical-align: top; border: none;">Required Courses:</td>
            <td style="text-align: right; vertical-align: top; border: none;">35</td>
          </tr>

          <!-- Item 2(a) with Manual Line Breaks -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(a)</td>
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.65;">
              ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')},<br>
              ${formatCode('MATH1030')} or ${formatCode('MATH1038', '1038')},<br>
              ${formatCode('MATH1050')} or ${formatCode('MATH1058', '1058')} or ${formatCode('MATH1090', '1090')} or ${formatCode('MATH1098', '1098')},<br>
              ${formatCode('MATH2010')} or ${formatCode('MATH2018', '2018')},<br>
              ${formatCode('MATH2020')} or ${formatCode('MATH2028', '2028')},<br>
              ${formatCode('MATH2040')} or ${formatCode('MATH2048', '2048')},<br>
              ${formatCode('MATH2050')} or ${formatCode('MATH2058', '2058')},<br>
              ${formatCode('MATH2060')}[b] or ${formatCode('MATH2068', '2068')},<br>
              ${formatCode('MATH2070')} or ${formatCode('MATH2078', '2078')},<br>
              ${formatCode('MATH2221')},<br>
              ${formatCode('MATH2230')}
            </td>
            <td style="border: none;"></td>
          </tr>

          <!-- Item 2(b) -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(b)</td>
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.5;">
              At least one course from ${formatCode('MATH3060')}, ${formatCode('STAT2001')} or ${formatCode('STAT2006', '2006')}
            </td>
            <td style="border: none;"></td>
          </tr>

          <!-- Item 2(c) -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 1.25rem; border: none;">(c)</td>
            <td style="vertical-align: top; padding-bottom: 1.25rem; border: none; line-height: 1.5;">
              Capstone course[b]: Either ${formatCode('MATH4400')} or ${formatCode('MATH4900', '4900')}
            </td>
            <td style="border: none;"></td>
          </tr>

          <!-- Item 3 Header -->
          <tr style="border: none;">
            <td style="vertical-align: top; border: none;">3.</td>
            <td style="vertical-align: top; border: none;">Elective Courses:</td>
            <td style="text-align: right; vertical-align: top; border: none;">27</td>
          </tr>

          <!-- Item 3(a) -->
          <tr style="border: none;">
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(a)</td>
            <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.5;">
              9 units of MATH courses at 3000 or above level, and
            </td>
            <td style="border: none;"></td>
          </tr>

          <!-- Item 3(b) -->
          <tr style="border: none;">
            <td style="vertical-align: top; border: none;">(b)</td>
            <td style="vertical-align: top; border: none; line-height: 1.5;">
              18 units of courses chosen according to any one stream below:
              <div style="margin-top: 0.5rem;">${allStreamsHtml}</div>
            </td>
            <td style="border: none;"></td>
          </tr>
        </table>

      </div>
    </div>
  `;

  document.getElementById("highlighted-text").innerHTML = reportHtml.trim();
  document.getElementById("overall-summary-box").innerHTML = `
    Specialization Stream: <strong>${stream}</strong> | College: <strong>${college}</strong>
  `;

  document.getElementById("results-section").style.display = "block";
  updateJsonDebugArea();

  if (showAlert && typeof window.switchTab === 'function') {
    window.switchTab('report');
  }
}