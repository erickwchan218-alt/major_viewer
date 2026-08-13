// js/reportTab/htmlSection/geHtml.js

import { getCollegeGeReportText, formatCode } from '../reportGeneration.js';

export function geHtmlSection1(ugeaAllocated, ugecAllocated, ugedAllocated) {
  return `
    <!-- 1. University GE Requirement Heading -->
    <tr>
        <td style="vertical-align: top;">1.</td>
        <td colspan="2" style="font-weight: bold; vertical-align: top;">
            University GE Requirement
        </td>
        <td></td>
        <td style="text-align: right; vertical-align: top;">13</td>
    </tr>

    <!-- (a) GE Foundation -->
    <tr>
        <td style="vertical-align: top;">(a)</td>
        <td colspan="2" style="vertical-align: top; line-height: 1.4;">
            General Education Foundation (GE Foundation) Programme<br>
            <ul style="padding-left: 1.2rem;">
                <li>${formatCode('UGFH1000', 'UGFH1000 In Dialogue with Humanity')} </li>
                <li>${formatCode('UGFN1000', 'UGFN1000 In Dialogue with Nature')} </li>
            </ul>
        </td>
        <td style="text-align: right; vertical-align: top;">6</td>
        <td></td>
    </tr>

    <!-- (b) The Four Areas -->
    <tr>
        <td style="vertical-align: top; padding-top: 1rem;">(b)</td>
        <td colspan="2" style="vertical-align: top; padding-top: 1rem;">
            The Four Areas
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 1rem;">7</td>
        <td style="padding-top: 1rem;"></td>
    </tr>

    <tr>
        <td style="vertical-align: top;"></td>
        <td colspan="2" style="vertical-align: top; line-height: 1.4;">
            <ul style="padding-left: 1.2rem;">
                <li>Area A: ${ugeaAllocated} </li>
                <li>Area C: ${ugecAllocated} </li>
                <li>Area D: ${ugedAllocated} </li>
            </ul>
        </td>
        <td></td>
        <td></td>
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

export function geHtmlSection7(chltReportText, eltuReportText, langReportText) {
  return `
    <tr>
        <td style="vertical-align: top; padding-top: 0.5rem;">7.</td>
        <td colspan="2" style="vertical-align: top; padding-top: 0.5rem; line-height: 1.5;">
            <strong>Language Requirements:</strong><br>
            Chinese:<br>
            ${chltReportText}<br>
            English:<br>
            ${eltuReportText}<br>
            Language Enhancement Courses:<br>
            ${langReportText}
        </td>
        <td style="text-align: right; vertical-align: top; padding-top: 0.5rem;">Req.</td>
        <td></td>
    </tr>
    `;
}