// js/reportTab/htmlSection/progTable.js

/**
 * Helper to render status badges
 */
const statusBadge = (fulfilled) => fulfilled 
    ? '<span class="status-badge status-fulfilled">FULFILLED</span>' 
    : '<span class="status-badge status-pending">PENDING</span>';

/**
 * Section 1: General Education & University Requirements
 */
export function progTableGE(data) {
    return /* HTML */ `
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
            <td>${statusBadge(data.ge.uge.ugeaFulfilled)}</td>
        </tr>
        <tr>
            <td style="padding-left: 3rem;">Area C</td>
            <td>${data.ge.uge.ugeCUnits} / 2</td>
            <td>2 Units</td>
            <td>${statusBadge(data.ge.uge.ugecFulfilled)}</td>
        </tr>
        <tr>
            <td style="padding-left: 3rem;">Area D</td>
            <td>${data.ge.uge.ugeDUnits} / 2</td>
            <td>2 Units</td>
            <td>${statusBadge(data.ge.uge.ugedFulfilled)}</td>
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

        <tr style="background-color: #f9fafb; font-weight: bold;">
            <td>6. Language Requirements</td>
            <td>${data.lang?.totalUnits ?? 0} / ${data.lang?.totalRequiredUnits ?? 12}</td>
            <td>${data.lang?.totalRequiredUnits ?? 12} Units</td>
            <td>${statusBadge(data.lang?.fulfilled ?? false)}</td>
        </tr>
        <tr>
            <td style="padding-left: 3rem;">(a) Chinese Language</td>
            <td>${data.lang?.chinese?.units ?? 0} / ${data.lang?.chinese?.requiredUnits ?? 3}</td>
            <td>${data.lang?.chinese?.requiredUnits ?? 3} Units</td>
            <td>${statusBadge(data.lang?.chinese?.fulfilled ?? false)}</td>
        </tr>
        <tr>
            <td style="padding-left: 3rem;">(b) English Language</td>
            <td>${data.lang?.english?.units ?? 0} / ${data.lang?.english?.requiredUnits ?? 9}</td>
            <td>${data.lang?.english?.requiredUnits ?? 9} Units</td>
            <td>${statusBadge(data.lang?.english?.fulfilled ?? false)}</td>
        </tr>
        <tr>
            <td style="padding-left: 3rem;">(c) Language Enhancement Course</td>
            <td>${data.lang?.enhancement?.units ?? 0} / ${data.lang?.enhancement?.requiredUnits ?? 0}</td>
            <td>${data.lang?.enhancement?.requiredUnits ?? 0} Units</td>
            <td>${statusBadge(data.lang?.enhancement?.fulfilled ?? false)}</td>
        </tr>
    `;
}

/**
 * Major Requirement 1: Section Header & Faculty Package Requirement
 */
export function progTableMajor1(data) {
    return /* HTML */ `
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
    `;
}

/**
 * Major Requirement 2: Required Courses
 */
export function progTableMajor2(data) {
    return /* HTML */ `
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
    `;
}

/**
 * Major Requirement 3: Elective Courses
 */
export function progTableMajor3(data) {
    return /* HTML */ `
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