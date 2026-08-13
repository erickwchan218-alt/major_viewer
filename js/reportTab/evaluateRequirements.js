// js/reportTab/evaluateRequirements.js

import { streamData } from '../constants.js';
import { updateJsonDebugArea } from '../debugTab/debugArea.js';
import { formatCode } from './reportGeneration.js';

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

import {
    evaluateFacultyPackage,
    evaluateMajorRequired,
    evaluateMathElectives,
    evaluateGeneralEducation,
    evaluateLanguages
} from './evaluationUtils.js';

/* ==========================================================================
   2. DOM RENDERING HELPERS
   ========================================================================== */

function renderProgressTable(data) {
	const tbody = document.getElementById("progress-table-body");
	if (!tbody) return;

	const statusBadge = (fulfilled) => fulfilled 
		? '<span class="status-badge status-fulfilled">FULFILLED</span>' 
		: '<span class="status-badge status-pending">PENDING</span>';

	tbody.innerHTML = `
		<tr class="section-header-row">
			<td colspan="4" style="font-weight: bold; background-color: #f3f4f6; text-align: left;">
				General Education & University Requirements
			</td>
		</tr>
		<tr>
			<td>1(a). University GE Foundation</td>
			<td>${data.ge.foundation.units} / 6</td>
			<td>6 Units</td>
			<td>${statusBadge(data.ge.foundation.fulfilled)}</td>
		</tr>
		<tr>
			<td>1(b). University GE 4-Area Courses</td>
			<td>${data.ge.uge.totalUnits} / 7</td>
			<td>7 Units</td>
			<td>${statusBadge(data.ge.uge.fulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">Area A</td>
			<td>${data.ge.uge.ugeAUnits} / 2</td>
			<td>2 Units</td>
			<td>${statusBadge(data.ge.uge.ugeAFulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">Area C</td>
			<td>${data.ge.uge.ugeCUnits} / 2</td>
			<td>2 Units</td>
			<td>${statusBadge(data.ge.uge.ugeCFulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">Area D</td>
			<td>${data.ge.uge.ugeDUnits} / 2</td>
			<td>2 Units</td>
			<td>${statusBadge(data.ge.uge.ugeDFulfilled)}</td>
		</tr>
		<tr>
			<td>2. College GE Requirement</td>
			<td>${data.ge.college.units} / 6</td>
			<td>6 Units</td>
			<td>${statusBadge(data.ge.college.fulfilled)}</td>
		</tr>
		<tr>
			<td>3. Digital Literacy Course</td>
			<td>${data.ge.digitalLiteracy.units} / 1</td>
			<td>1 Unit</td>
			<td>${statusBadge(data.ge.digitalLiteracy.fulfilled)}</td>
		</tr>
		<tr>
			<td>4. UGCP Area</td>
			<td>${data.ge.ugcp.units} / 2</td>
			<td>2 Units</td>
			<td>${statusBadge(data.ge.ugcp.fulfilled)}</td>
		</tr>
		<tr>
			<td>5. Physical Education</td>
			<td>${data.ge.phed.units} / 2</td>
			<td>2 Units</td>
			<td>${statusBadge(data.ge.phed.fulfilled)}</td>
		</tr>
		<tr>
			<td>6. Language Requirements</td>
			<td>-</td>
			<td>Required Courses</td>
			<td>${statusBadge(data.lang.fulfilled)}</td>
		</tr>

		<tr class="section-header-row">
			<td colspan="4" style="font-weight: bold; background-color: #f3f4f6; text-align: left;">
				Major Programme Requirement
			</td>
		</tr>
		<tr>
			<td>1. Faculty Package Requirement</td>
			<td>${data.faculty.unitsCompleted} / 9</td>
			<td>9 Units</td>
			<td>${statusBadge(data.faculty.fulfilled)}</td>
		</tr>
		
		<tr style="background-color: #f9fafb; font-weight: bold;">
			<td>2. Required Courses</td>
			<td>${data.majorReq.totalUnits} / 35</td>
			<td>35 Units</td>
			<td>${statusBadge(data.majorReq.fulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">(a) Major Foundation & Core Courses</td>
			<td>${data.majorReq.req2a.units} / 29</td>
			<td>29 Units</td>
			<td>${statusBadge(data.majorReq.req2a.fulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">(b) MATH3060 / STAT2001 / 2006</td>
			<td>${data.majorReq.req2b.units} / 3</td>
			<td>3 Units</td>
			<td>${statusBadge(data.majorReq.req2b.fulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">(c) Capstone Course</td>
			<td>${data.majorReq.req2c.units} / 3</td>
			<td>3 Units</td>
			<td>${statusBadge(data.majorReq.req2c.fulfilled)}</td>
		</tr>

		<tr style="background-color: #f9fafb; font-weight: bold;">
			<td>3. Elective Courses</td>
			<td>-</td>
			<td>27 Units</td>
			<td>${statusBadge(false)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">(a) MATH 3000+ Level Electives</td>
			<td>${data.mathElectives.units} / 9</td>
			<td>9 Units</td>
			<td>${statusBadge(data.mathElectives.fulfilled)}</td>
		</tr>
		<tr>
			<td style="padding-left: 3rem;">(b) Stream Electives</td>
			<td>-</td>
			<td>18 Units</td>
			<td>${statusBadge(false)}</td>
		</tr>
	`;
}

function renderReportDocument(data, stream, college) {
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
		</details>`;
	}).join('');

	const reportHtml = `
		<div style="font-family: 'Times New Roman', Times, serif; color: #000000; max-width: 800px; margin: 0 auto; line-height: 1.25; font-size: 1.05rem;">
			<div style="text-align: center; font-weight: bold; margin-bottom: 1.5rem;">
				<div style="font-size: 1.35rem;">Mathematics</div>
				<div style="font-size: 1.15rem; margin-top: 0.35rem;">Applicable to students admitted in 2024–25</div>
			</div>

			<div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
				<div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">General Education & University Requirements</div>
				
				<table style="width: 100%; border-collapse: collapse; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
				<colgroup>
					<col style="width: 45px;" />
					<col style="width: 35px;" />
					<col style="width: auto;" />
					<col style="width: 30px;" />
					<col style="width: 30px;" />
				</colgroup>
				<tr>
					<td colspan="4"></td>
					<td style="text-align: right; vertical-align: bottom;">Units</td>
				</tr>

				${geHtmlSection1(data.ge.uge.ugeaAllocated, data.ge.uge.ugecAllocated, data.ge.uge.ugedAllocated)}
				${geHtmlSection2(college, data.ge.college.rawData, data.ge.college.info)}
				${geHtmlSection3()}
				${geHtmlSection4()}
				${geHtmlSection6(data.ge.phed.allocated)}
				${geHtmlSection7(data.lang.chltReportText, data.lang.eltuReportText, data.lang.langReportText)}
				</table>
			</div>

			<div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
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
}

/* ==========================================================================
   3. MAIN ENTRY POINT
   ========================================================================== */

export function evaluateRequirements(showAlert = true) {
	const courseManager = window.courseManager;
	const stream = document.getElementById("stream-select")?.value || '';
	const college = document.getElementById("college-select")?.value || '';

	// 1. Evaluate Sub-requirements
	const faculty = evaluateFacultyPackage(courseManager);
	const majorReq = evaluateMajorRequired(courseManager);

	const usedReq2Courses = new Set([
		majorReq.req2b.passedCourse, 
		majorReq.req2c.passedCourse
	].filter(Boolean));
	
	const mathElectives = evaluateMathElectives(courseManager, usedReq2Courses);
	const ge = evaluateGeneralEducation(courseManager, college);
	const lang = evaluateLanguages(courseManager);

	const evalData = { faculty, majorReq, mathElectives, ge, lang };

	// 2. Render UI
	renderProgressTable(evalData);
	renderReportDocument(evalData, stream, college);

	// 3. Post-evaluation tasks
	updateJsonDebugArea();

	if (showAlert && typeof window.switchTab === 'function') {
		window.switchTab('report');
	}
}