// js/models/CourseManager.js

import { ALLOWED_PREFIXES, ALLOWED_LANG_PREFIXES } from '../constants.js';

export class CourseManager {
  constructor() {
    this.customCourses = [];
    this.ugeCourses = [];
    this.phedCourses = [];
    this.langCourses = [];
    
    this.exemptCHLT = false;
    this.exemptELTU = false;
    
    this.selectedStream = 'ENRICH';
    this.selectedCollege = 'CC';
    
    // Tracks state for static/grid courses: { [code]: { checked: boolean, grade1: string, grade2: string } }
    this.gridCourses = {};
  }

  // --- Grade & Pass Determination Helpers ---

	isGradePassed(grade1, grade2) {
	  if (grade1 === 'PP') return true;
	  if (grade1 && grade1 !== 'F' && grade1 !== 'FF') return true;
	  if (grade2 === 'PP') return true;
	  return !!(grade2 && grade2 !== 'F' && grade2 !== 'FF');
	}

	isCoursePassed(code) {
	  const courseState = this.gridCourses[code];
	  if (!courseState || !courseState.checked) return false;
	  return this.isGradePassed(courseState.grade1, courseState.grade2);
	}

	isCustomCoursePassed(course) {
    if (!course) return false;
	  return this.isGradePassed(course.grade1, course.grade2);
	}

  hasPassedCourse(code) {
    if (!code) return false;

    // 1. Check standard grid courses
    if (this.isCoursePassed(code)) return true;

    // 2. Check custom course collections (langCourses, ugeCourses, phedCourses, customCourses, etc.)
    const customLists = [
      this.langCourses,
      this.ugeCourses,
      this.phedCourses,
      this.customCourses
    ];

    for (const list of customLists) {
      if (!Array.isArray(list)) continue;
      const match = list.find(c => c.code === code);
      if (match && this.isCustomCoursePassed(match)) {
        return true;
      }
    }

    return false;
  }

  getCourseCredits(code) {
    if (code === 'MATH2221' || code === 'CHLT1002' || code === 'ELTU3018' || code === 'ELTU3019') return 2;
    if (code === 'GECC1130' || code === 'GECC1230' || code.startsWith('GENA')) return 2;
    if (code === 'GECC1132' || code === 'GEUC1111' || code === 'ENGG1003' || code.startsWith('UGCP') || code.startsWith('PHED')) return 1;
    if (code === 'GESH2011' || code === 'GESH2012' || code === 'GECW4021' || code === 'GECW4030') return 1.5;
    if (code === 'GEUC4011' || code === 'GEUC4012') return 3;

    const uge = this.ugeCourses.find(c => c.code === code);
    if (uge) return uge.credits;

    const lang = this.langCourses.find(c => c.code === code);
    if (lang) return lang.credits;

    const custom = this.customCourses.find(c => c.code === code);
    if (custom) return custom.credits;

    const phed = this.phedCourses.find(c => c.code === code);
    if (phed) return phed.credits;

    return 3;
  }

  // --- Grid Course Management ---

  setGridCourseState(code, checked, grade1 = '', grade2 = '') {
    this.gridCourses[code] = { checked, grade1, grade2 };
  }

  getGridCourseState(code) {
    return this.gridCourses[code] || { checked: false, grade1: '', grade2: '' };
  }

  // --- Physical Education (PHED) Courses ---

  addPhedCourse(rawCodeInput, grade1, grade2) {
    let rawCode = rawCodeInput.trim().toUpperCase();

    if (/^\d{4}$/.test(rawCode)) {
      rawCode = "PHED" + rawCode;
    }

    if (!/^PHED\d{4}$/.test(rawCode)) {
      return { success: false, error: "Invalid PHED course code! Must start with PHED followed by 4 digits (e.g., PHED1001)." };
    }

    if (this.phedCourses.some(c => c.code === rawCode)) {
      return { success: false, error: `Course ${rawCode} is already added in Physical Education list!` };
    }

    const course = {
      id: Date.now(),
      code: rawCode,
      credits: 1,
      grade1,
      grade2: (grade1 === 'F') ? grade2 : ''
    };

    this.phedCourses.push(course);
    return { success: true, course };
  }

  removePhedCourse(id) {
    this.phedCourses = this.phedCourses.filter(c => c.id !== id);
  }

  updatePhedCourseGrade(id, field, value) {
    const course = this.phedCourses.find(c => c.id === id);
    if (course) {
      course[field] = value;
      if (field === 'grade1' && value !== 'F') course.grade2 = '';
    }
  }

  // --- Language Enhancement Debt Courses ---

  addLangCourse(codeRaw, creditsRaw, grade1, grade2) {
    const code = codeRaw.trim().toUpperCase();
    const credits = parseInt(creditsRaw, 10) || 3;

    const match = code.match(/^([A-Z]{3,4})(\d{4})$/);
    if (!match) {
      return { success: false, error: "Invalid course code format! Must be 3-4 uppercase letters followed by 4 digits (e.g., TRAN1001)." };
    }

    const prefix = match[1];
    if (!ALLOWED_LANG_PREFIXES.has(prefix)) {
      return { success: false, error: `Invalid course area "${prefix}"! Allowed areas are: CHLT, CLCE, CLCP, ELTU, ENGE, TRAN, CURE, JASP, ARAB, FREN, GERM, ITAL, KORE, RUSS, SPAN, THAI, HKSL.` };
    }

    if (this.langCourses.some(c => c.code === code)) {
      return { success: false, error: `Course ${code} is already added in Language Enhancement Courses list!` };
    }

    const course = {
      id: Date.now(),
      code,
      credits,
      grade1,
      grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
    };

    this.langCourses.push(course);
    return { success: true, course };
  }

  removeLangCourse(id) {
    this.langCourses = this.langCourses.filter(c => c.id !== id);
  }

  updateLangCourseGrade(id, field, value) {
    const course = this.langCourses.find(c => c.id === id);
    if (course) {
      course[field] = value;
      if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
    }
  }

  updateLangCourseCredits(id, credits) {
    const course = this.langCourses.find(c => c.id === id);
    if (course) {
      course.credits = Math.max(0, parseInt(credits, 10) || 0);
    }
  }

  // --- UGE 4-Area Courses ---

  addUgeCourse(area, codeNumRaw, creditsRaw, grade1, grade2) {
    const codeNum = codeNumRaw.trim();
    const credits = parseInt(creditsRaw, 10) || 3;

    if (!/^\d{4}$/.test(codeNum)) {
      return { success: false, error: "Invalid course code number! Must be exactly 4 digits (e.g., 1110)." };
    }

    const code = `${area}${codeNum}`;

    if (this.ugeCourses.some(c => c.code === code)) {
      return { success: false, error: `Course ${code} is already added in 4-Area GE courses list!` };
    }

    const course = {
      id: Date.now(),
      code,
      area,
      credits,
      grade1,
      grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
    };

    this.ugeCourses.push(course);
    return { success: true, course };
  }

  removeUgeCourse(id) {
    this.ugeCourses = this.ugeCourses.filter(c => c.id !== id);
  }

  updateUgeCourseGrade(id, field, value) {
    const course = this.ugeCourses.find(c => c.id === id);
    if (course) {
      course[field] = value;
      if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
    }
  }

  updateUgeCourseCredits(id, credits) {
    const course = this.ugeCourses.find(c => c.id === id);
    if (course) {
      course.credits = Math.max(0, parseInt(credits, 10) || 0);
    }
  }

  // --- Custom Elective Courses ---

  addCustomCourse(codeRaw, creditsRaw, grade1, grade2) {
    const code = codeRaw.trim().toUpperCase();
    const credits = parseInt(creditsRaw, 10) || 3;

    const match = code.match(/^([A-Z]{3,4})(\d{4})$/);
    if (!match) {
      return { success: false, error: "Invalid format! Course code must be 3-4 uppercase letters followed by 4 digits (e.g., ECON2011)." };
    }

    const prefix = match[1];
    if (!ALLOWED_PREFIXES.has(prefix)) {
      return { success: false, error: `Invalid prefix "${prefix}"! Allowed prefixes are Science, Engineering, Economics/Finance, MATH, BMED, GE, UGCP, Language, or PHED.` };
    }

    if (this.customCourses.some(c => c.code === code)) {
      return { success: false, error: `Course ${code} is already added in Custom Elective Courses list!` };
    }

    const course = {
      id: Date.now(),
      code,
      credits,
      grade1,
      grade2: (grade1 === 'F' || grade1 === 'FF') ? grade2 : ''
    };

    this.customCourses.push(course);
    return { success: true, course };
  }

  removeCustomCourse(id) {
    this.customCourses = this.customCourses.filter(c => c.id !== id);
  }

  updateCustomCourseGrade(id, field, value) {
    const course = this.customCourses.find(c => c.id === id);
    if (course) {
      course[field] = value;
      if (field === 'grade1' && value !== 'F' && value !== 'FF') course.grade2 = '';
    }
  }

  updateCustomCourseCredits(id, credits) {
    const course = this.customCourses.find(c => c.id === id);
    if (course) {
      course.credits = Math.max(0, parseInt(credits, 10) || 0);
    }
  }

  // --- Language Exemptions & Debt ---

  setExemptions(exemptCHLT, exemptELTU) {
    this.exemptCHLT = !!exemptCHLT;
    this.exemptELTU = !!exemptELTU;
  }

  getLangDebt() {
    return (this.exemptCHLT ? 2 : 0) + (this.exemptELTU ? 1 : 0);
  }

  // --- State Reset & Import/Export ---

  resetAll() {
    this.customCourses = [];
    this.ugeCourses = [];
    this.phedCourses = [];
    this.langCourses = [];
    this.exemptCHLT = false;
    this.exemptELTU = false;
    this.selectedStream = 'ENRICH';
    this.selectedCollege = 'CC';
    this.gridCourses = {};
  }

  exportState() {
    return {
      selectedStream: this.selectedStream,
      selectedCollege: this.selectedCollege,
      exemptCHLT: this.exemptCHLT,
      exemptELTU: this.exemptELTU,
      courses: this.gridCourses,
      ugeCoursesAdded: this.ugeCourses,
      phedCoursesAdded: this.phedCourses,
      langCoursesAdded: this.langCourses,
      customCoursesAdded: this.customCourses
    };
  }

  importState(data) {
    if (!data || typeof data !== 'object') return;

    if (data.selectedStream) this.selectedStream = data.selectedStream;
    if (data.selectedCollege) this.selectedCollege = data.selectedCollege;
    if (data.exemptCHLT !== undefined) this.exemptCHLT = !!data.exemptCHLT;
    if (data.exemptELTU !== undefined) this.exemptELTU = !!data.exemptELTU;

    if (data.courses && typeof data.courses === 'object') {
      this.gridCourses = data.courses;
    } else if (Array.isArray(data.takenPassedCourses)) {
      // Fallback conversion for legacy data structure
      this.gridCourses = {};
      data.takenPassedCourses.forEach(code => {
        this.gridCourses[code] = { checked: true, grade1: 'A', grade2: '' };
      });
    }

    this.ugeCourses = Array.isArray(data.ugeCoursesAdded) ? data.ugeCoursesAdded : [];
    this.phedCourses = Array.isArray(data.phedCoursesAdded) ? data.phedCoursesAdded : [];
    this.langCourses = Array.isArray(data.langCoursesAdded) ? data.langCoursesAdded : [];
    this.customCourses = Array.isArray(data.customCoursesAdded) ? data.customCoursesAdded : [];
  }
}