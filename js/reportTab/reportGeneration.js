// js/reportTab/reportGeneration.js

import { CourseManager } from '../classes/CourseManager.js';

// --- Report Generation & Evaluation ---

export function formatCode(code, label) {
  const displayText = label || code;
  
  const isPassed = window.courseManager?.hasPassedCourse(code);

  return isPassed 
    ? `<span class="highlight-taken">${displayText}</span>` 
    : displayText;
}

export function getCollegeGeReportText(college) {
  if (college === "SHHO") {
    return { name: "SHHO College", text: `${formatCode('GESH1010')}, ${formatCode('GESH2011')}, ${formatCode('GESH2012')}` };
  } else if (college === "CC") {
    return { name: "Chung Chi College", text: `${formatCode('GECC1130')} or ${formatCode('GECC1230', '1230')}, ${formatCode('GECC1132')}, ${formatCode('GECC3130')}, ${formatCode('GECC3230')}, ${formatCode('GECC3430')}, ${formatCode('GECC4130')}` };
  } else if (college === "NA") {
    return { name: "New Asia College", text: `${formatCode('GENA1112')}, ${formatCode('GENA1113')}, Elective from GENA1114-1117 / GENA2112-2392 / GENA3070` };
  } else if (college === "UC") {
    return { name: "United College", text: `${formatCode('GEUC1111')}, ${formatCode('GEUC2211')}/${formatCode('GEUC2212')}/${formatCode('GEUC2213')}/${formatCode('GEUC2214')}/${formatCode('GEUC2215')}, ${formatCode('GEUC4011')} or ${formatCode('GEUC4012', '4012')}` };
  } else if (college === "SHAW") {
    return { name: "Shaw College", text: `${formatCode('ELTU2008')}, ${formatCode('GESC1130')}, ${formatCode('GESC1160')}, ${formatCode('GESC1210')}, GESC Elective` };
  } else if (college === "MC") {
    return { name: "Morningside College", text: `${formatCode('GEMC1001')}, ${formatCode('GEMC3001')}` };
  } else if (college === "CWC") {
    return { name: "CW Chu College", text: `${formatCode('GECW1010')}, ${formatCode('GECW4022')} (or ${formatCode('GECW4021')} and ${formatCode('GECW4030')})` };
  } else if (college === "WYS") {
    return { name: "Wu Yee Sun College", text: `${formatCode('GEYS1010')}, ${formatCode('GEYS4010')} or ${formatCode('GEYS4011', '4011')}` };
  } else if (college === "LWS") {
    return { name: "Lee Woo Sing College", text: `${formatCode('GEWS1011')} or ${formatCode('GEWS1012', '1012')}, GEWS Elective` };
  }
  return { name: "Selected College", text: "College GE Courses" };
}
