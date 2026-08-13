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
        return { 
            name: "SHHO College", 
            text: `
			1. ${formatCode('GESH1010')}, <br> 
			2. ${formatCode('GESH2011')} and ${formatCode('GESH2012', '2012')}
			` 
		};
    } else if (college === "CC") {
      	return { 
			name: "Chung Chi College", 
			text: `
			1. ${formatCode('GECC1130')}/${formatCode('GECC1230', '1230')} and ${formatCode('GECC1132')}, <br>
			2. ${formatCode('GECC3130')} or ${formatCode('GECC3230', '3230')}, ${formatCode('GECC3430', '3430')}, ${formatCode('GECC4130', '4130')}
			` 
		};
    } else if (college === "NA") {
      	return { 
			name: "New Asia College", 
			text: `
            1. ${formatCode('GENA1112')} <br>
            2. ${formatCode('GENA1113')} <br>
            3. Complete one elective course from the following: <br>
            ${formatCode('GENA1114')}, ${formatCode('GENA1115', '1115')}, ${formatCode('GENA1116', '1116')}, ${formatCode('GENA1117', '1117')}, 
            ${formatCode('GENA2112', '2112')}, ${formatCode('GENA2122', '2122')}, ${formatCode('GENA2142', '2142')}, ${formatCode('GENA2152', '2152')}, ${formatCode('GENA2192', '2192')}, 
            ${formatCode('GENA2212', '2212')}, ${formatCode('GENA2232', '2232')}, ${formatCode('GENA2262', '2262')}, ${formatCode('GENA2272', '2272')}, ${formatCode('GENA2292', '2292')}, 
            ${formatCode('GENA2322', '2322')}, ${formatCode('GENA2332', '2332')}, ${formatCode('GENA2342', '2342')}, ${formatCode('GENA2352', '2352')}, ${formatCode('GENA2362', '2362')}, 
            ${formatCode('GENA2372', '2372')}, ${formatCode('GENA2392', '2392')}, ${formatCode('GENA3070', '3070')}
            `
		};
    } else if (college === "UC") {
      	return { 
			name: "United College", 
			text: `
            1. ${formatCode('GEUC1111')} <br>
            2. Complete one course from the following: <br>
            ${formatCode('GEUC2211')}, ${formatCode('GEUC2212', '2212')}, ${formatCode('GEUC2213', '2213')}, ${formatCode('GEUC2214', '2214')}, or ${formatCode('GEUC2215', '2215')} <br>
            3. ${formatCode('GEUC4011')} or ${formatCode('GEUC4012', '4012')}
            `
		};
    } else if (college === "SHAW") {
      	return { 
			name: "Shaw College", 
			text: `
            1. Complete two courses from the following: <br>
            ${formatCode('ELTU2008')}, ${formatCode('GESC1130')}, ${formatCode('GESC1160', '1160')}, ${formatCode('GESC1210', '1210')}, ${formatCode('GESC1230', '1230')}, ${formatCode('GESC1240', '1240')}, ${formatCode('GESC1250', '1250')}, ${formatCode('GESC1260', '1260')}, 
            ${formatCode('GESC2010', '2010')}, ${formatCode('GESC2060', '2060')}, ${formatCode('GESC2070', '2070')}, ${formatCode('GESC2080', '2080')}, ${formatCode('GESC2090', '2090')}, ${formatCode('GESC2111', '2111')}, ${formatCode('GESC2114', '2114')}, ${formatCode('GESC2117', '2117')}, 
            ${formatCode('GESC2118', '2118')}, ${formatCode('GESC2120', '2120')}, ${formatCode('GESC2131', '2131')}, ${formatCode('GESC2140', '2140')}, ${formatCode('GESC2150', '2150')}, ${formatCode('GESC2151', '2151')}, ${formatCode('GESC2160', '2160')}, ${formatCode('GESC2170', '2170')}, 
            ${formatCode('GESC2190', '2190')}, ${formatCode('GESC2210', '2210')}, ${formatCode('GESC2220', '2220')}, ${formatCode('GESC2240', '2240')}, ${formatCode('GESC2290', '2290')}, ${formatCode('GESC2320', '2320')}, ${formatCode('GESC2330', '2330')}, ${formatCode('GESC2340', '2340')}, 
            ${formatCode('GESC2350', '2350')}, ${formatCode('GESC2360', '2360')}, ${formatCode('GESC2380', '2380')}, ${formatCode('GESC2390', '2390')}, ${formatCode('GESC2400', '2400')}, ${formatCode('GESC2410', '2410')}, ${formatCode('GESC2420', '2420')}, ${formatCode('GESC2430', '2430')}, 
            ${formatCode('GESC2440', '2440')}, ${formatCode('GESC2450', '2450')}, ${formatCode('GESC2470', '2470')}, ${formatCode('GESC2480', '2480')}
            `
		};
    } else if (college === "MC") {
      	return { 
			name: "Morningside College", 
			text: `
			1. ${formatCode('GEMC1001')} <br>
			2. ${formatCode('GEMC3001')}
			` 
		};
    } else if (college === "CWC") {
      	return { 
			name: "CW Chu College", 
			text: `
            1. ${formatCode('GECW1010')} <br>
            2. ${formatCode('GECW4022')}[a][b] or (${formatCode('GECW4021')}[a] and ${formatCode('GECW4030', '4030')}[c]) <br><br>
            Explanatory Notes: <br>
            [a] Students should pre-register for ${formatCode('GECW4021')} or ${formatCode('GECW4022', '4022')} with the College in the preceding term, and conduct most of the required project in the summer. <br>
            [b] Non-local students, with prior notification and permission from the College, have the option to take ${formatCode('ELTU2008')}, which under certain conditions will be regarded as equivalent to ${formatCode('GECW4022')}. <br>
            [c] Students who take ${formatCode('GECW4030')} are required to take a pre-requisite course ${formatCode('SOWK2100')}.
            `
		};
    } else if (college === "WYS") {
      	return { 
			name: "Wu Yee Sun College", 
			text: `
            1. ${formatCode('GEYS1010')} or ${formatCode('ELTU2008')} <br>
            2. ${formatCode('GEYS4010')}[a] or ${formatCode('GEYS4011', '4011')} <br><br>
            Explanatory Notes: <br>
            [a] For students who have taken ${formatCode('ELTU2008')} only.
            `
		};
    } else if (college === "LWS") {
      	return { 
			name: "Lee Woo Sing College", 
			text: `
            1. ${formatCode('GEWS1011')} or ${formatCode('GEWS1012', '1012')} <br>
            2. Complete one elective course from the following: <br>
            ${formatCode('GEWS2011')}, ${formatCode('GEWS2021', '2021')}, ${formatCode('GEWS2031', '2031')}, ${formatCode('GEWS2041', '2041')}, ${formatCode('GEWS2051', '2051')}, ${formatCode('GEWS2061', '2061')}, ${formatCode('GEWS2071', '2071')}, ${formatCode('GEWS2081', '2081')}, 
            ${formatCode('GEWS2091', '2091')}, ${formatCode('GEWS2101', '2101')}, ${formatCode('GEWS2111', '2111')}, ${formatCode('GEWS2121', '2121')}, ${formatCode('GEWS2131', '2131')}, ${formatCode('GEWS2141', '2141')}, ${formatCode('GEWS2151', '2151')}, ${formatCode('GEWS2161', '2161')}, 
            ${formatCode('GEWS2171', '2171')}, ${formatCode('UGEC1835')}[a], ${formatCode('UGEC2631', '2631')}[a], ${formatCode('UGEC2861', '2861')}[a], ${formatCode('UGEC2905', '2905')}[a], ${formatCode('UGED1571')}[a], ${formatCode('UGED2314', '2314')}[a], ${formatCode('UGED2663', '2663')}[a], 
            ${formatCode('UGED2933', '2933')}[a], ${formatCode('UGED2980', '2980')}[a] <br><br>
            Explanatory Notes: <br>
            [a] Students are allowed to take these University GE courses and apply to count the units earned towards the College GE requirement.
            `
		};
    }
    return { 
		name: "Selected College", 
		text: "College GE Courses" 
	};
}
