// js/reportTab/evaluateRequirements.js

import { updateJsonDebugArea } from '../debugTab/debugArea.js';

import {
	evaluateFacultyPackage,
	evaluateMajorRequired,
	evaluateMathElectives,
	evaluateGeneralEducation,
	evaluateLanguages,
} from './evaluationUtils.js';

import {
	renderProgressTable,
	renderReportDocument,
} from './renderer.js';

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