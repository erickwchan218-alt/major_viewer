// js/script.js 
// Entry point of the <script> tag.

import { CourseManager } from './classes/CourseManager.js';

import {
	toggleDevMode,
	loadJsonSettings,
	resetAll,
	loadDataJson
} from './debugTab/debugArea.js';

import { evaluateRequirements } from './reportTab/evaluateRequirements.js';

import { onGrade1ChangeGeneric } from './handlers/customAdderHandler.js';

import {
	switchTab,
	renderCheckboxes,
	renderCollegeGeContent,
	createGrid,
	handleContainerClick,
	toggleItemCheck,
	onGradeChange,
	updateCategoryCounts,
	onStreamChange,
	onCollegeChange,
	toggleAllCategories
} from './ui/userInterface.js';

import {
	renderPhedAdderContainer,
	onGrade1ChangePhed,
	addPhedCourse,
	removePhedCourse,
	updatePhedCourseGrade,
	renderPhedCoursesTable
} from './handlers/phedHandler.js';

import {
	addLangCourse,
	removeLangCourse,
	updateLangCourseGrade,
	updateLangCourseCredits,
	renderLangCoursesTable,
	onExemptionChange
} from './handlers/langHandler.js';

import {
	addUgeCourse,
	removeUgeCourse,
	updateUgeCourseGrade,
	updateUgeCourseCredits,
	renderUgeCoursesTable
} from './handlers/ugeHandler.js';

import {
	addCustomCourse,
	removeCustomCourse,
	updateCustomCourseGrade,
	updateCustomCourseCredits,
	renderCustomCoursesTable
} from './handlers/customHandler.js';

import { runDeveloperAction } from './dev/developerAction.js';

const courseManager = new CourseManager();
window.courseManager = courseManager;

// --- Window Method Attachments for Inline Event Handlers ---

// UI Renderer & Utilities
window.switchTab = switchTab;
window.renderCheckboxes = renderCheckboxes;
window.renderCollegeGeContent = renderCollegeGeContent;
window.createGrid = createGrid;
window.handleContainerClick = handleContainerClick;
window.toggleItemCheck = toggleItemCheck;
window.onGradeChange = onGradeChange;
window.updateCategoryCounts = updateCategoryCounts;
window.onStreamChange = onStreamChange;
window.onCollegeChange = onCollegeChange;
window.toggleAllCategories = toggleAllCategories;

// Generic Handler
window.onGrade1ChangeGeneric = onGrade1ChangeGeneric;

// PHED Handler
window.onGrade1ChangePhed = onGrade1ChangePhed;
window.renderPhedAdderContainer = renderPhedAdderContainer;
window.addPhedCourse = addPhedCourse;
window.removePhedCourse = removePhedCourse;
window.updatePhedCourseGrade = updatePhedCourseGrade;
window.renderPhedCoursesTable = renderPhedCoursesTable;

// Language Course Handler
window.addLangCourse = addLangCourse;
window.removeLangCourse = removeLangCourse;
window.updateLangCourseGrade = updateLangCourseGrade;
window.updateLangCourseCredits = updateLangCourseCredits;
window.renderLangCoursesTable = renderLangCoursesTable;
window.onExemptionChange = onExemptionChange;

// UGE Handler
window.addUgeCourse = addUgeCourse;
window.removeUgeCourse = removeUgeCourse;
window.updateUgeCourseGrade = updateUgeCourseGrade;
window.updateUgeCourseCredits = updateUgeCourseCredits;
window.renderUgeCoursesTable = renderUgeCoursesTable;

// Custom Course Handler
window.addCustomCourse = addCustomCourse;
window.removeCustomCourse = removeCustomCourse;
window.updateCustomCourseGrade = updateCustomCourseGrade;
window.updateCustomCourseCredits = updateCustomCourseCredits;
window.renderCustomCoursesTable = renderCustomCoursesTable;

// Debug Tab
window.toggleDevMode = toggleDevMode;
window.loadDataJson = loadDataJson;
window.loadJsonSettings = loadJsonSettings;
window.resetAll = resetAll;

// Report Tab
window.evaluateRequirements = evaluateRequirements;

// Initialization on DOM Load
window.addEventListener('DOMContentLoaded', () => {
	renderCheckboxes();
});

export const IS_DEVELOPER = true;

if (IS_DEVELOPER) {
    // Ensure the DOM is ready before running if your action touches UI elements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDeveloperAction);
    } else {
        runDeveloperAction();
    }
}
