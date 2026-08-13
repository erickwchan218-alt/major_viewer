// js/constants.js

// Valid Course Prefixes for Custom Courses
export const ALLOWED_PREFIXES = new Set([
	'BCHE', 'BIOL', 'CHEM', 'CMBI', 'EESC', 'ENSC', 'ESSC', 'FNSC', 'LSCI', 'MBTE', 'PHYS', 'RMSC', 'STAT',
	'AIST', 'BMEG', 'CENG', 'CSCI', 'EEEN', 'ELEG', 'ENER', 'ENGG', 'ESTR', 'FTEC', 'IERG', 'MAEG', 'SEEM',
	'DOTE', 'ECON', 'FINA', 'GLEF',
	'MATH', 'BMED', 'UGFH', 'UGFN', 'UGEA', 'UGEB', 'UGEC', 'UGED', 'GECC', 'GENA', 'GEUC', 'GESC', 'GEJC',
	'GEMC', 'GESH', 'GECW', 'GEYS', 'GEWS', 'UGEX', 'ELTU', 'UGCP', 'PHED',
	'CHLT', 'CLCE', 'CLCP', 'ENGE', 'TRAN', 'CURE', 'JASP', 'ARAB', 'FREN', 'GERM', 'ITAL', 'KORE', 'RUSS', 'SPAN', 'THAI', 'HKSL'
]);

// Allowed Prefixes for Language Enhancement Debt Custom Adder
export const ALLOWED_LANG_PREFIXES = new Set([
	'CHLT', 'CLCE', 'CLCP', 'ELTU', 'ENGE', 'TRAN', 'CURE', 'JASP', 'ARAB', 'FREN', 'GERM', 'ITAL', 'KORE', 'RUSS', 'SPAN', 'THAI', 'HKSL'
]);

export const GRADE_OPTIONS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'PP', 'FF'];
export const LETTER_GRADE_OPTIONS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
export const PASS_FAIL_GRADE_OPTIONS = ['PP', 'FF'];

export const GRADE_POINTS = {
	'A': 4.0, 'A-': 3.7,
	'B+': 3.3, 'B': 3.0, 'B-': 2.7,
	'C+': 2.3, 'C': 2.0, 'C-': 1.7,
	'D+': 1.3, 'D': 1.0, 'F': 0.0
};

// Predefined Course Data
export const coursesData = {
	ge_college_cc: [
	  { code: "GECC1130", name: "Idea of a University", credits: 2 },
	  { code: "GECC1230", name: "Idea of a University (Alternative)", credits: 2 },
	  { code: "GECC1132", name: "College Senior Seminar / Experience", credits: 1 },
	  { code: "GECC3130", name: "Upper Level CC GE", credits: 3 },
	  { code: "GECC3230", name: "Upper Level CC GE", credits: 3 },
	  { code: "GECC3430", name: "Upper Level CC GE", credits: 3 },
	  { code: "GECC4130", name: "Senior Seminar", credits: 3 }
	],
	ge_college_na: [
	  { code: "GENA1112", credits: 2 },
	  { code: "GENA1113", credits: 2 },
	  { code: "GENA1114", credits: 2 },
	  { code: "GENA1115", credits: 2 },
	  { code: "GENA1116", credits: 2 },
	  { code: "GENA1117", credits: 2 },
	  { code: "GENA2112", credits: 2 },
	  { code: "GENA2122", credits: 2 },
	  { code: "GENA2142", credits: 2 },
	  { code: "GENA2152", credits: 2 },
	  { code: "GENA2192", credits: 2 },
	  { code: "GENA2212", credits: 2 },
	  { code: "GENA2232", credits: 2 },
	  { code: "GENA2262", credits: 2 },
	  { code: "GENA2272", credits: 2 },
	  { code: "GENA2292", credits: 2 },
	  { code: "GENA2322", credits: 2 },
	  { code: "GENA2332", credits: 2 },
	  { code: "GENA2342", credits: 2 },
	  { code: "GENA2352", credits: 2 },
	  { code: "GENA2362", credits: 2 },
	  { code: "GENA2372", credits: 2 },
	  { code: "GENA2392", credits: 2 },
	  { code: "GENA3070", credits: 2 }
	],
	ge_college_uc: [
	  { code: "GEUC1111", credits: 1 },
	  { code: "GEUC2211", credits: 2 },
	  { code: "GEUC2212", credits: 2 },
	  { code: "GEUC2213", credits: 2 },
	  { code: "GEUC2214", credits: 2 },
	  { code: "GEUC2215", credits: 2 },
	  { code: "GEUC4011", credits: 3 },
	  { code: "GEUC4012", credits: 3 }
	],
	ge_college_shaw: [
	  { code: "ELTU2008", credits: 3 },
	  { code: "GESC1130", credits: 3 },
	  { code: "GESC1160", credits: 3 },
	  { code: "GESC1210", credits: 3 },
	  { code: "GESC1230", credits: 3 },
	  { code: "GESC1240", credits: 3 },
	  { code: "GESC1250", credits: 3 },
	  { code: "GEJC1020/GESC1260", credits: 3 },
	  { code: "GESC2010", credits: 3 },
	  { code: "GESC2060", credits: 3 },
	  { code: "GESC2070", credits: 3 },
	  { code: "GESC2080", credits: 3 },
	  { code: "GESC2090", credits: 3 },
	  { code: "GESC2111", credits: 3 },
	  { code: "GESC2114", credits: 3 },
	  { code: "GESC2117", credits: 3 },
	  { code: "GESC2118", credits: 3 },
	  { code: "GESC2120", credits: 3 },
	  { code: "GESC2131", credits: 3 },
	  { code: "GESC2140", credits: 3 },
	  { code: "GESC2150", credits: 3 },
	  { code: "GESC2151", credits: 3 },
	  { code: "GESC2160", credits: 3 },
	  { code: "GESC2170", credits: 3 },
	  { code: "GESC2190", credits: 3 },
	  { code: "GESC2210", credits: 3 },
	  { code: "GESC2220", credits: 3 },
	  { code: "GESC2240", credits: 3 },
	  { code: "GESC2290", credits: 3 },
	  { code: "GESC2320", credits: 3 },
	  { code: "GESC2330", credits: 3 },
	  { code: "GESC2340", credits: 3 },
	  { code: "GESC2350", credits: 3 },
	  { code: "GESC2360", credits: 3 },
	  { code: "GESC2380", credits: 3 },
	  { code: "GESC2390", credits: 3 },
	  { code: "GESC2400", credits: 3 },
	  { code: "GESC2410", credits: 3 },
	  { code: "GESC2420", credits: 3 },
	  { code: "GESC2430", credits: 3 },
	  { code: "GESC2440", credits: 3 },
	  { code: "GESC2450", credits: 3 },
	  { code: "GESC2470", credits: 3 },
	  { code: "GESC2480", credits: 3 }
	],
	ge_college_mc: [
	  { code: "GEMC1001", credits: 3 },
	  { code: "GEMC3001", credits: 3 }
	],
	ge_college_shho: [
	  { code: "GESH1010", credits: 3 },
	  { code: "GESH2011", credits: 1 },
	  { code: "GESH2012", credits: 2 }
	],
	ge_college_cwc: [
	  { code: "GECW1010", credits: 3 },
	  { code: "GECW4022", credits: 3 },
	  { code: "ELTU2008", credits: 3 },
	  { code: "GECW4021", credits: 3 },
	  { code: "GECW4030", credits: 0 }
	],
	ge_college_wys: [
	  { code: "GEYS1010", credits: 3 },
	  { code: "ELTU2008", credits: 3 },
	  { code: "GEYS4010", credits: 3 },
	  { code: "GEYS4011", credits: 3 }
	],
	ge_college_lws: [
	  { code: "GEWS1011", credits: 3 },
	  { code: "GEWS1012", credits: 3 },
	  { code: "GEWS2011", credits: 3 },
	  { code: "GEWS2021", credits: 3 },
	  { code: "GEWS2031", credits: 3 },
	  { code: "GEWS2041", credits: 3 },
	  { code: "GEWS2051", credits: 3 },
	  { code: "GEWS2061", credits: 3 },
	  { code: "GEWS2071", credits: 3 },
	  { code: "GEWS2081", credits: 3 },
	  { code: "GEWS2091", credits: 3 },
	  { code: "GEWS2101", credits: 3 },
	  { code: "GEWS2111", credits: 3 },
	  { code: "GEWS2121", credits: 3 },
	  { code: "GEWS2131", credits: 3 },
	  { code: "GEWS2141", credits: 3 },
	  { code: "GEWS2151", credits: 3 },
	  { code: "GEWS2161", credits: 3 },
	  { code: "GEWS2171", credits: 3 },
	  { code: "UGEC1835", credits: 3 },
	  { code: "UGEC2631", credits: 3 },
	  { code: "UGEC2861", credits: 3 },
	  { code: "UGEC2905", credits: 3 },
	  { code: "UGED1571", credits: 3 },
	  { code: "UGED2314", credits: 3 },
	  { code: "UGED2663", credits: 3 },
	  { code: "UGED2933", credits: 3 },
	  { code: "UGED2980", credits: 3 }
	],
	ge_foundation: [
	  { code: "UGFH1000", credits: 3 },
	  { code: "UGFN1000", credits: 3 }
	],
	chlt_eltu: [
	  { code: "CHLT1001", credits: 3 },
	  { code: "CHLT1002", credits: 2 },
	  { code: "ELTU1001", credits: 3 },
	  { code: "ELTU1002", credits: 3 },
	  { code: "ELTU2018", credits: 3 },
	  { code: "ELTU2019", credits: 3 },
	  { code: "ELTU3018", credits: 2 },
	  { code: "ELTU3019", credits: 2 }
	],
	digital_literacy: [
	  { code: "ENGG1003", credits: 1 }
	],
	ugcp: [
	  { code: "UGCP1001", credits: 1 },
	  { code: "UGCP1002", credits: 1 }
	],
	faculty_req: [
	  { code: "STAT1011", credits: 3 }
	],
	faculty_elec: [
	  { code: "LSCI1001", credits: 3 },
	  { code: "LSCI1002", credits: 3 },
	  { code: "CHEM1070", credits: 3 },
	  { code: "CHEM1072", credits: 3 },
	  { code: "CHEM1280", credits: 3 },
	  { code: "PHYS1001", credits: 3 },
	  { code: "PHYS1002", credits: 3 },
	  { code: "PHYS1111", credits: 3 },
	  { code: "PHYS1113", credits: 3 }
	],
	math1: [
	  { code: "MATH1010", credits: 3 },
	  { code: "MATH1018", credits: 3 },
	  { code: "MATH1030", credits: 3 },
	  { code: "MATH1038", credits: 3 },
	  { code: "MATH1020", credits: 3 },
	  { code: "MATH1025", credits: 3 },
	  { code: "MATH1028", credits: 3 },
	  { code: "MATH1050", credits: 3 },
	  { code: "MATH1058", credits: 3 },
	  { code: "MATH1090", credits: 3 },
	  { code: "MATH1098", credits: 3 }
	],
	math2: [
	  { code: "MATH2010", credits: 3 },
	  { code: "MATH2018", credits: 3 },
	  { code: "MATH2020", credits: 3 },
	  { code: "MATH2028", credits: 3 },
	  { code: "MATH2040", credits: 3 },
	  { code: "MATH2048", credits: 3 },
	  { code: "MATH2050", credits: 3 },
	  { code: "MATH2058", credits: 3 },
	  { code: "MATH2060", credits: 3 },
	  { code: "MATH2068", credits: 3 },
	  { code: "MATH2070", credits: 3 },
	  { code: "MATH2078", credits: 3 },
	  { code: "MATH2221", credits: 2 },
	  { code: "MATH2230", credits: 3 }
	],
	math3_pure: [
	  { code: "MATH3020", credits: 3 },
	  { code: "MATH3030", credits: 3 },
	  { code: "MATH3040", credits: 3 },
	  { code: "MATH3060", credits: 3 },
	  { code: "MATH3070", credits: 3 },
	  { code: "MATH3080", credits: 3 },
	  { code: "MATH3093", credits: 3 }
	],
	math3_app: [
	  { code: "MATH3215", credits: 3 },
	  { code: "MATH3230", credits: 3 },
	  { code: "MATH3240", credits: 3 },
	  { code: "MATH3250", credits: 3 },
	  { code: "MATH3260", credits: 3 },
	  { code: "MATH3270", credits: 3 },
	  { code: "MATH3280", credits: 3 },
	  { code: "MATH3290", credits: 3 },
	  { code: "MATH3310", credits: 3 },
	  { code: "MATH3320", credits: 3 },
	  { code: "MATH3330", credits: 3 },
	  { code: "MATH3340", credits: 3 },
	  { code: "MATH3360", credits: 3 }
	],
	math4_pure: [
	  { code: "MATH4010", credits: 3 },
	  { code: "MATH4030", credits: 3 },
	  { code: "MATH4050", credits: 3 },
	  { code: "MATH4060", credits: 3 },
	  { code: "MATH4080", credits: 3 }
	],
	math4_app: [
	  { code: "MATH4210", credits: 3 },
	  { code: "MATH4220", credits: 3 },
	  { code: "MATH4230", credits: 3 },
	  { code: "MATH4240", credits: 3 },
	  { code: "MATH4250", credits: 3 },
	  { code: "MATH4260", credits: 3 },
	  { code: "MATH4280", credits: 3 }
	],
	math_fyp: [
	  { code: "MATH4400", credits: 3 },
	  { code: "MATH4900", credits: 3 }
	],
	math5: [
	  { code: "MATH5011", credits: 3 },
	  { code: "MATH5012", credits: 3 },
	  { code: "MATH5021", credits: 3 },
	  { code: "MATH5022", credits: 3 },
	  { code: "MATH5031", credits: 3 },
	  { code: "MATH5032", credits: 3 },
	  { code: "MATH5051", credits: 3 },
	  { code: "MATH5052", credits: 3 },
	  { code: "MATH5061", credits: 3 },
	  { code: "MATH5062", credits: 3 },
	  { code: "MATH5070", credits: 3 }
	],
	other: [
	  { code: "STAT2001", credits: 3 },
	  { code: "STAT2006", credits: 3 },
	  { code: "CSCI1540", credits: 3 },
	  { code: "IERG5124", credits: 3 },
	  { code: "SEEM3550", credits: 3 },
	  { code: "ESTR3506", credits: 3 },
	  { code: "SEEM3570", credits: 3 },
	  { code: "ESTR3508", credits: 3 },
	  { code: "STAT4005", credits: 3 },
	  { code: "BMED3010", credits: 3 },
	  { code: "BMED3020", credits: 3 },
	  { code: "BMED3030", credits: 3 },
	  { code: "BMED4010", credits: 3 }
	]
};

export const streamDescriptions = {
	ENRICH: `For students who specialize in Enrichment Stream[c]:

	12-18 units from MATH3030, 3040, 3060, 3070, 3093,
	MATH 3230, 3270, 3340,
	MATH 4010, 4030, 4050, 4060, 4080, 4220,
	MATH 5011, 5012, 5021, 5022, 5031, 5032, 5051, 5052, 5061, 5062, 5070;
	and 0-3 units from MATH3240, 4280;
	and 0-3 units from MATH3320, 4230`,

	CAM: `For students who specialize in Computational and Applied Mathematics Stream:

	CSCI1540# and MATH3230; and 9-12 units from MATH3093, 32xx, 33xx, 42xx, 43xx, in which 0-3 units may be chosen from IERG5124#, SEEM3550#/ESTR3506#, SEEM3570#/ESTR3508#`,

	CBDA: `For students who specialize in Computational Big Data Analytics Stream:

	9-12 units from MATH3320, 3330, 3340, 4280; and 3-9 units from MATH3215, 3230, 3280, 3290, 3310, 3360, 4230, 4240, in which 0-3 units may be chosen from IERG5124#, SEEM3550#/ESTR3506#, STAT4005#`,

	MATH_STREAM: `For students in the Mathematics Stream:

	MATH courses at 3000 or above level, and/or courses at 2000 or above level of one other subject area[d] offered by the Faculties/Departments of Science, Engineering, Economics and Finance, with at least 12 units of MATH courses at 3000 or above level.`,

	MATH_EDU: `For students who specialize in Mathematics-Education Stream:

	MATH and BMED courses at 3000 or above level, with at least 9 units of BMED courses.`,

	MULTI: `For students who specialize in Mathematics-Multidisciplinary Stream:

	MATH courses at 3000 or above level, and/or courses at 2000 or above level of at most two other subject areas[d] offered by the Faculties/Departments of Science, Engineering, Economics, and Finance, with at least 9 units of non-MATH courses. The specific subject area codes are given in explanatory note[e].`,

	EMATH_CAM: `For students specializing in EMath + CAM (Enrichment + Computational Applied Math):

	Must satisfy BOTH requirements:
	(1) Enrichment Stream: 12-18 units from List A; 0-3 units from List B; 0-3 units from List C
	(2) CAM Stream: CSCI1540 and MATH3230; plus 9-12 units from CAM electives`
};