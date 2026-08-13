// js/reportTab/htmlSection/geHtml.js

import { getCollegeGeReportText, formatCode } from '../reportGeneration.js';

export function geHtmlSection1(
  ugeaAllocated,
  ugecAllocated,
  ugedAllocated,
  ugeaFulfilled = true,
  ugecFulfilled = true,
  ugedFulfilled = true,
  ugfhPassed = window.courseManager?.hasPassedCourse('UGFH1000') ?? false,
  ugfnPassed = window.courseManager?.hasPassedCourse('UGFN1000') ?? false
) {
  // Full-width background style applied when unfulfilled/not passed
  const getRowStyle = (passed) => passed
    ? ''
    : 'background-color: #fee2e2; color: #b91c1c; font-weight: bold;';

  return /* html */`
    <!-- 1. University GE Requirement Heading -->
    <tr>
        <td style="vertical-align: top;">1.</td>
        <td colspan="2" style="font-weight: bold; vertical-align: top;">
            University GE Requirement
        </td>
        <td></td>
        <td style="text-align: right; vertical-align: top;">13</td>
    </tr>

    <!-- (a) GE Foundation Header -->
    <tr>
        <td style="vertical-align: top;">(a)</td>
        <td colspan="2" style="vertical-align: top; line-height: 1.4;">
            General Education Foundation (GE Foundation) Programme
        </td>
        <td style="text-align: right; vertical-align: top;">6</td>
        <td></td>
    </tr>

    <!-- UGFH1000 Row -->
    <tr style="${getRowStyle(ugfhPassed)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>${formatCode('UGFH1000', 'UGFH1000 In Dialogue with Humanity')}</li>
            </ul>
        </td>
    </tr>

    <!-- UGFN1000 Row -->
    <tr style="${getRowStyle(ugfnPassed)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>${formatCode('UGFN1000', 'UGFN1000 In Dialogue with Nature')}</li>
            </ul>
        </td>
    </tr>

    <!-- (b) The Four Areas Header -->
    <tr>
        <td style="vertical-align: top; padding-top: 1rem;">(b)</td>
        <td colspan="2" style="vertical-align: top; padding-top: 1rem;">
            The Four Areas
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 1rem;">7</td>
        <td style="padding-top: 1rem;"></td>
    </tr>

    <!-- Area A Row -->
    <tr style="${getRowStyle(ugeaFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Area A: ${ugeaAllocated}</li>
            </ul>
        </td>
    </tr>

    <!-- Area C Row -->
    <tr style="${getRowStyle(ugecFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Area C: ${ugecAllocated}</li>
            </ul>
        </td>
    </tr>

    <!-- Area D Row -->
    <tr style="${getRowStyle(ugedFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Area D: ${ugedAllocated}</li>
            </ul>
        </td>
    </tr>
    `;
}

export function geHtmlSection2(college, rawCollegeData, collegeInfo) {
  // College GE
  return `
    <tr>
        <td style="vertical-align: top; padding-top: 0.75rem;">2.</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.75rem; line-height: 1.5;">
            <strong>College GE Requirement</strong> (${collegeInfo.name || college})<br>
            ${collegeInfo.text || ''}
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.75rem;">6</td>
        <td></td>
    </tr>
    `;
}

export function geHtmlSection3() {
  return `
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">3.</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.5;">
            <strong>Digital Literacy Course:</strong><br>
            ${formatCode('ENGG1003')}
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.5rem;">1</td>
        <td></td>
    </tr>
    `;
}

export function geHtmlSection4() {
  return `
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">4.</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.5;">
            <strong>UGCP Area:</strong><br>
            ${formatCode('UGCP1001')} and ${formatCode('UGCP1002')}
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.5rem;">2</td>
        <td></td>
    </tr>
    `;
}

export function geHtmlSection6(phedAllocated) {
  return `
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">6.</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.5;">
            <strong>Physical Education:</strong><br>
            ${phedAllocated}
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.5rem;">2</td>
        <td></td>
    </tr>
    `;
}

export function geHtmlSection7(langData = {}) {
  const {
    chltReportText = '',
    eltuReportText = '',
    langReportText = '',
    chltFulfilled = true,
    eltuFulfilled = true,
    langFulfilled = true,
  } = langData;

  // Full-width background style applied when a subsection is unfulfilled
  const getRowStyle = (fulfilled) => fulfilled
    ? ''
    : 'background-color: #fee2e2; color: #b91c1c; font-weight: bold;';

  return /* html */`
    <!-- 7. Language Requirements Main Heading -->
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">7.</td>
        <td colspan="2" style="font-weight: bold; vertical-align: top; padding-top: 0.5rem;">
            Language Requirements
        </td>
        <td></td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.5rem;">Req.</td>
    </tr>

    <!-- (a) Chinese Language Header -->
    <tr>
        <td style="vertical-align: top;">(a)</td>
        <td colspan="2" style="vertical-align: top; line-height: 1.4;">
            Chinese Language
        </td>
        <td></td>
        <td></td>
    </tr>

    <!-- (a) Chinese Language Content Row -->
    <tr style="${getRowStyle(chltFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <div style="padding-left: 1.2rem; line-height: 1.4;">
                ${chltReportText}
            </div>
        </td>
    </tr>

    <!-- (b) English Language Header -->
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">(b)</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.4;">
            English Language
        </td>
        <td style="padding-top: 0.5rem;"></td>
        <td style="padding-top: 0.5rem;"></td>
    </tr>

    <!-- (b) English Language Content Row -->
    <tr style="${getRowStyle(eltuFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <div style="padding-left: 1.2rem; line-height: 1.4;">
                ${eltuReportText}
            </div>
        </td>
    </tr>

    <!-- (c) Language Enhancement Courses Header -->
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">(c)</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.4;">
            Language Enhancement Courses
        </td>
        <td style="padding-top: 0.5rem;"></td>
        <td style="padding-top: 0.5rem;"></td>
    </tr>

    <!-- (c) Language Enhancement Content Row -->
    <tr style="${getRowStyle(langFulfilled)}">
        <td></td>
        <td colspan="4" style="vertical-align: middle; padding: 2px 0;">
            <div style="padding-left: 1.2rem; line-height: 1.4;">
                ${langReportText}
            </div>
        </td>
    </tr>
    `;
}