// js/reportTab/evaluateRequirements.js

import { streamData } from '../constants.js';
import { updateJsonDebugArea } from '../debugTab/debugArea.js';

import { getCollegeGeReportText, formatCode } from './reportGeneration.js';
import { getEltuReportText } from './getEltuReportText.js';
import { getChltReportText } from './getChltReportText.js';
import { getLangReportText } from './getLangReportText.js';

import {
	geHtmlSection1,
	geHtmlSection2,
	geHtmlSection3,
	geHtmlSection4,
	geHtmlSection6,
	geHtmlSection7,
} from './htmlSection/geHtml.js';

import {
	majorHtmlHeader,
	majorHtmlSection1,
	majorHtmlSection2,
	majorHtmlSection3,
} from './htmlSection/majorHtml.js';

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
			
			<table style="width: 100%; border-collapse: collapse; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
			<colgroup>
				<col style="width: 45px;" />  <!-- Col 1: Index (1., (a), (b)) -->
				<col style="width: 35px;" />  <!-- Col 2: Sub-index ((i), (ii)) -->
				<col style="width: auto;" />  <!-- Col 3: Main Text Content -->
				<col style="width: 30px;" />  <!-- Col 4: Sub-Units (6, 7) -->
				<col style="width: 30px;" />  <!-- Col 5: Group Total Units (13) -->
			</colgroup>

			<!-- Table Header -->
			<tr>
				<td colspan="4"></td>
				<td style="text-align: right; vertical-align: bottom;">Units</td>
			</tr>

			${geHtmlSection1(ugeaAllocated, ugecAllocated, ugedAllocated)}
			${geHtmlSection2(college, rawCollegeData, collegeInfo)}
			${geHtmlSection3()}
			${geHtmlSection4()}
			${geHtmlSection6(phedAllocated)}
			${geHtmlSection7(chltReportText, eltuReportText, langReportText)}
			
			</table>
		</div>

		<div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
			<!-- SECTION 2: MAJOR PROGRAMME REQUIREMENT -->
			<div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">Major Programme Requirement</div>
			
			<table style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
			<colgroup>
				<col style="width: 70px !important;" />
				<col style="width: auto !important;" />
				<col style="width: 60px !important;" />
			</colgroup>

			${majorHtmlHeader()}
			${majorHtmlSection1()}
			${majorHtmlSection2()}
			${majorHtmlSection3(allStreamsHtml)}
			
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