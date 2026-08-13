import { getCollegeGeReportText, formatCode } from './reportGeneration.js';
import { getEltuReportText } from './reportText/getEltuReportText.js';
import { getChltReportText } from './reportText/getChltReportText.js';
import { getLangReportText } from './reportText/getLangReportText.js';

// Safe conversion helper for Arrays, Sets, Maps, or Key-Value Objects
function toIterableArray(target) {
	if (!target) return [];
	if (Array.isArray(target)) return target;
	if (target instanceof Set) return Array.from(target);
	if (target instanceof Map) return Array.from(target.values());
	if (typeof target === 'object') {
		return Object.entries(target).map(([key, val]) => {
			if (typeof val === 'object' && val !== null) {
				return { code: key, ...val };
			}
			return { code: key, passed: Boolean(val) };
		});
	}
	return [];
}

export function evaluateFacultyPackage(courseManager) {
    const stat1011Passed = courseManager.isCoursePassed('STAT1011');
    const scienceElectives = ['LSCI1001', 'LSCI1002', 'CHEM1070', 'CHEM1072', 'CHEM1280', 'PHYS1001', 'PHYS1002', 'PHYS1111', 'PHYS1113'];
    const passedScienceElectives = scienceElectives.filter(code => courseManager.isCoursePassed(code));

    const mathGroupCPassed = ['MATH1010', 'MATH1018', 'MATH1030', 'MATH1038']
        .some(code => courseManager.isCoursePassed(code));

    const unitsCompleted = 
        (mathGroupCPassed ? 3 : 0) + 
        (stat1011Passed ? 3 : 0) + 
        (passedScienceElectives.length > 0 ? 3 : 0);

    const fulfilled = mathGroupCPassed && stat1011Passed && passedScienceElectives.length >= 1;

    return { unitsCompleted, fulfilled };
}

export function evaluateMajorRequired(courseManager) {
    // 2(a) Major Foundation & Core Courses
    const req2aGroups = [
        ['MATH1010', 'MATH1018'],
        ['MATH1030', 'MATH1038'],
        ['MATH1050', 'MATH1058', 'MATH1090', 'MATH1098'],
        ['MATH2010', 'MATH2018'],
        ['MATH2020', 'MATH2028'],
        ['MATH2040', 'MATH2048'],
        ['MATH2050', 'MATH2058'],
        ['MATH2060', 'MATH2068'],
        ['MATH2070', 'MATH2078'],
        ['MATH2221'],
        ['MATH2230']
    ];

    let req2aUnits = 0;
    let req2aFulfilledCount = 0;

    req2aGroups.forEach(group => {
        const passedCourse = group.find(code => courseManager.isCoursePassed(code));
        if (passedCourse) {
            const credits = courseManager.getCourseCredits ? courseManager.getCourseCredits(passedCourse) : 3;
            req2aUnits += credits;
            req2aFulfilledCount++;
        }
    });
    req2aUnits = Math.min(req2aUnits, 29);
    const req2aFulfilled = req2aFulfilledCount === req2aGroups.length;

    // 2(b) MATH3060 / STAT Course
    const req2bCourses = ['MATH3060', 'STAT2001', 'STAT2006'];
    const req2bPassedCourse = req2bCourses.find(code => courseManager.isCoursePassed(code));
    const req2bUnits = req2bPassedCourse ? (courseManager.getCourseCredits ? courseManager.getCourseCredits(req2bPassedCourse) : 3) : 0;
    const req2bFulfilled = req2bPassedCourse !== undefined;

    // 2(c) Capstone Course
    const req2cCourses = ['MATH4400', 'MATH4900'];
    const req2cPassedCourse = req2cCourses.find(code => courseManager.isCoursePassed(code));
    const req2cUnits = req2cPassedCourse ? (courseManager.getCourseCredits ? courseManager.getCourseCredits(req2cPassedCourse) : 3) : 0;
    const req2cFulfilled = req2cPassedCourse !== undefined;

    // Overall Section 2
    const totalUnits = req2aUnits + req2bUnits + req2cUnits;
    const fulfilled = req2aFulfilled && req2bFulfilled && req2cFulfilled;

    return {
        req2a: { units: req2aUnits, fulfilled: req2aFulfilled },
        req2b: { units: req2bUnits, fulfilled: req2bFulfilled, passedCourse: req2bPassedCourse },
        req2c: { units: req2cUnits, fulfilled: req2cFulfilled, passedCourse: req2cPassedCourse },
        totalUnits,
        fulfilled
    };
}

export function evaluateMathElectives(courseManager, usedCoursesSet) {
    const candidateCourses = [
        ...toIterableArray(courseManager.gridCourses),
        ...toIterableArray(courseManager.customCourses)
    ];

    const seenMathCodes = new Set();
    let units = 0;

    candidateCourses.forEach(c => {
        const code = (typeof c === 'string' ? c : (c.code || c.id || '')).trim().toUpperCase();
        if (!code || seenMathCodes.has(code) || usedCoursesSet.has(code)) return;

        const match = code.match(/^MATH(\d{4})$/);
        if (!match) return;

        const courseNum = parseInt(match[1], 10);
        if (courseNum < 3000) return;

        const isPassed = (typeof c === 'object' && c.passed) ||
            courseManager.isCoursePassed(code) ||
            (typeof courseManager.isCustomCoursePassed === 'function' && courseManager.isCustomCoursePassed(c));

        if (isPassed) {
            seenMathCodes.add(code);
            const credits = (typeof c === 'object' && c.credits != null)
                ? Number(c.credits)
                : (typeof courseManager.getCourseCredits === 'function' ? courseManager.getCourseCredits(code) : 3);
            units += credits;
        }
    });

    return { units, fulfilled: units >= 9 };
}

export function evaluateGeneralEducation(courseManager, college) {
    // College GE
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

    // UG Foundation
    const ugfhPassed = courseManager.isCoursePassed('UGFH1000');
    const ugfnPassed = courseManager.isCoursePassed('UGFN1000');
    const geFoundUnits = (ugfhPassed ? 3 : 0) + (ugfnPassed ? 3 : 0);

    // Digital Literacy & UGCP
    const digitalLiteracyPassed = courseManager.isCoursePassed('ENGG1003');
    const ugcp1Passed = courseManager.isCoursePassed('UGCP1001');
    const ugcp2Passed = courseManager.isCoursePassed('UGCP1002');

    // UGE 4-Area
    const ugeList = toIterableArray(courseManager.ugeCourses);
    const passedUge = ugeList.filter(c => courseManager.isCustomCoursePassed ? courseManager.isCustomCoursePassed(c) : c.passed);
    const ugeAUnits = passedUge.filter(c => c.area === 'UGEA').reduce((acc, c) => acc + (c.credits || 3), 0);
    const ugeCUnits = passedUge.filter(c => c.area === 'UGEC').reduce((acc, c) => acc + (c.credits || 3), 0);
    const ugeDUnits = passedUge.filter(c => c.area === 'UGED').reduce((acc, c) => acc + (c.credits || 3), 0);
    const ugeTotalUnits = ugeAUnits + ugeCUnits + ugeDUnits;

    const ugeaFulfilled = ugeAUnits >= 2;
    const ugecFulfilled = ugeCUnits >= 2;
    const ugedFulfilled = ugeDUnits >= 2;

    // Physical Education
    const phedList = toIterableArray(courseManager.phedCourses);
    const passedPhed = phedList.filter(c => courseManager.isCustomCoursePassed ? courseManager.isCustomCoursePassed(c) : c.passed);
    const phedUnits = passedPhed.reduce((acc, c) => acc + (c.credits || 1), 0);

    return {
        foundation: { units: geFoundUnits, fulfilled: ugfhPassed && ugfnPassed },
        digitalLiteracy: { units: digitalLiteracyPassed ? 1 : 0, fulfilled: digitalLiteracyPassed },
        ugcp: { units: (ugcp1Passed ? 1 : 0) + (ugcp2Passed ? 1 : 0), fulfilled: ugcp1Passed && ugcp2Passed },
        uge: {
            totalUnits: ugeTotalUnits,
            ugeAUnits,
            ugeCUnits,
            ugeDUnits,
            ugeaFulfilled,
            ugecFulfilled,
            ugedFulfilled,
            fulfilled: (ugeTotalUnits >= 7) && ugeaFulfilled && ugecFulfilled && ugedFulfilled,
            ugeaAllocated: passedUge.filter(c => c.area === 'UGEA').map(c => formatCode(c.code)).join(', ') || 'None',
            ugecAllocated: passedUge.filter(c => c.area === 'UGEC').map(c => formatCode(c.code)).join(', ') || 'None',
            ugedAllocated: passedUge.filter(c => c.area === 'UGED').map(c => formatCode(c.code)).join(', ') || 'None',
        },
        college: { units: collegeGeUnits, fulfilled: collegeGeFulfilled, rawData: rawCollegeData, info: collegeInfo },
        phed: { units: phedUnits, fulfilled: phedUnits >= 2, allocated: passedPhed.map(c => formatCode(c.code)).join(', ') || 'None' }
    };
}

// js/reportTab/evaluationUtils.js

export function evaluateLanguages(courseManager) {
    // -------------------------------------------------------------
    // (a) Chinese Language (CHLT) - Standard 3 Units
    // -------------------------------------------------------------
    const chlt1Passed = courseManager.isCoursePassed('CHLT1001');
    const chlt2Passed = courseManager.isCoursePassed('CHLT1002');
    const chltFulfilled = Boolean(courseManager.exemptCHLT || (chlt1Passed && chlt2Passed));
    
    const chineseRequiredUnits = 3;
    let chineseUnits = 0;

    if (courseManager.exemptCHLT) {
        chineseUnits = 3;
    } else {
        if (chlt1Passed) chineseUnits += (courseManager.getCourseCredits ? courseManager.getCourseCredits('CHLT1001') : 1.5);
        if (chlt2Passed) chineseUnits += (courseManager.getCourseCredits ? courseManager.getCourseCredits('CHLT1002') : 1.5);
    }

    // -------------------------------------------------------------
    // (b) English Language (ELTU) - Standard 9 Units (3 Tiers x 3 Units)
    // -------------------------------------------------------------
    const eltu1Passed = Boolean(courseManager.exemptELTU || courseManager.isCoursePassed('ELTU1001') || courseManager.isCoursePassed('ELTU1002'));
    const eltu2Passed = Boolean(courseManager.isCoursePassed('ELTU2018') || courseManager.isCoursePassed('ELTU2019'));
    const eltu3Passed = Boolean(courseManager.isCoursePassed('ELTU3018') || courseManager.isCoursePassed('ELTU3019'));
    const eltuFulfilled = eltu1Passed && eltu2Passed && eltu3Passed;

    const englishRequiredUnits = 9;
    let englishUnits = 0;

    if (eltu1Passed) englishUnits += 3;
    if (eltu2Passed) englishUnits += 3;
    if (eltu3Passed) englishUnits += 3;

    // -------------------------------------------------------------
    // (c) Language Enhancement Course (Lang Debt)
    // -------------------------------------------------------------
    const langDebt = typeof courseManager.getLangDebt === 'function' ? courseManager.getLangDebt() : 0;
    const langList = toIterableArray(courseManager.langCourses);
    const langDebtUnitsCompleted = langList
        .filter(c => courseManager.isCustomCoursePassed ? courseManager.isCustomCoursePassed(c) : c.passed)
        .reduce((acc, c) => acc + (c.credits || 3), 0);
    const langDebtFulfilled = langDebtUnitsCompleted >= langDebt;

    const enhancementRequiredUnits = langDebt;
    const enhancementUnits = langDebtUnitsCompleted;

    // -------------------------------------------------------------
    // Section Totals
    // -------------------------------------------------------------
    const totalUnits = chineseUnits + englishUnits + enhancementUnits;
    const totalRequiredUnits = chineseRequiredUnits + englishRequiredUnits + enhancementRequiredUnits;
    const fulfilled = chltFulfilled && eltuFulfilled && langDebtFulfilled;

    return {
        fulfilled,
        totalUnits,
        totalRequiredUnits,
        chinese: {
            units: chineseUnits,
            requiredUnits: chineseRequiredUnits,
            fulfilled: chltFulfilled
        },
        english: {
            units: englishUnits,
            requiredUnits: englishRequiredUnits,
            fulfilled: eltuFulfilled
        },
        enhancement: {
            units: enhancementUnits,
            requiredUnits: enhancementRequiredUnits,
            fulfilled: langDebtFulfilled
        },
        chltReportText: getChltReportText(courseManager),
        eltuReportText: getEltuReportText(courseManager),
        langReportText: getLangReportText(courseManager)
    };
}