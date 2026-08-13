// js/reportTab/htmlSection/majorHtml.js

import { formatCode } from '../reportGeneration.js';

export function majorHtmlHeader() {
  return `
    <!-- Top Subtitle Row -->
    <tr style="border: none;">
        <td colspan="2" style="vertical-align: top; padding-bottom: 0.75rem; border: none;">
        Students are required to complete a minimum of 71 units[a] of courses as follows:
        </td>
        <td style="text-align: right; font-weight: bold; vertical-align: top; padding-bottom: 0.75rem; border: none;">
        Units
        </td>
    </tr>
  `;
}

export function majorHtmlSection1() {
  return `
    <!-- Item 1 Header -->
    <tr style="border: none;">
        <td style="vertical-align: top; border: none;">1.</td>
        <td style="vertical-align: top; border: none;">Faculty Package:</td>
        <td style="text-align: right; vertical-align: top; border: none;">9</td>
    </tr>

    <!-- Item 1 Details -->
    <tr style="border: none;">
        <td style="border: none;"></td>
        <td style="vertical-align: top; padding-bottom: 1.25rem; border: none; line-height: 1.5;">
        <div>Group C: ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')} or ${formatCode('MATH1030', '1030')} or ${formatCode('MATH1038', '1038')}</div>
        <div>Group E: ${formatCode('STAT1011')}</div>
        <div>A course from the following:</div>
        <div>Group A: ${formatCode('LSCI1001')} or ${formatCode('LSCI1002', '1002')}</div>
        <div>Group B: ${formatCode('CHEM1070')} or ${formatCode('CHEM1072', '1072')} or ${formatCode('CHEM1280', '1280')}</div>
        <div>Group D: ${formatCode('PHYS1001')} or ${formatCode('PHYS1002', '1002')} or ${formatCode('PHYS1111', '1111')} or ${formatCode('PHYS1113', '1113')}</div>
        </td>
        <td style="border: none;"></td>
    </tr>
  `;
}

export function majorHtmlSection2() {
  return `
    <!-- Item 2 Header -->
    <tr style="border: none;">
        <td style="vertical-align: top; border: none;">2.</td>
        <td style="vertical-align: top; border: none;">Required Courses:</td>
        <td style="text-align: right; vertical-align: top; border: none;">35</td>
    </tr>

    <!-- Item 2(a) -->
    <tr style="border: none;">
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(a)</td>
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.65;">
        ${formatCode('MATH1010')} or ${formatCode('MATH1018', '1018')},<br>
        ${formatCode('MATH1030')} or ${formatCode('MATH1038', '1038')},<br>
        ${formatCode('MATH1050')} or ${formatCode('MATH1058', '1058')} or ${formatCode('MATH1090', '1090')} or ${formatCode('MATH1098', '1098')},<br>
        ${formatCode('MATH2010')} or ${formatCode('MATH2018', '2018')},<br>
        ${formatCode('MATH2020')} or ${formatCode('MATH2028', '2028')},<br>
        ${formatCode('MATH2040')} or ${formatCode('MATH2048', '2048')},<br>
        ${formatCode('MATH2050')} or ${formatCode('MATH2058', '2058')},<br>
        ${formatCode('MATH2060')}[b] or ${formatCode('MATH2068', '2068')},<br>
        ${formatCode('MATH2070')} or ${formatCode('MATH2078', '2078')},<br>
        ${formatCode('MATH2221')},<br>
        ${formatCode('MATH2230')}
        </td>
        <td style="border: none;"></td>
    </tr>

    <!-- Item 2(b) -->
    <tr style="border: none;">
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(b)</td>
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.5;">
        At least one course from ${formatCode('MATH3060')}, ${formatCode('STAT2001')} or ${formatCode('STAT2006', '2006')}
        </td>
        <td style="border: none;"></td>
    </tr>

    <!-- Item 2(c) -->
    <tr style="border: none;">
        <td style="vertical-align: top; padding-bottom: 1.25rem; border: none;">(c)</td>
        <td style="vertical-align: top; padding-bottom: 1.25rem; border: none; line-height: 1.5;">
        Capstone course[b]: Either ${formatCode('MATH4400')} or ${formatCode('MATH4900', '4900')}
        </td>
        <td style="border: none;"></td>
    </tr>
  `;
}

export function majorHtmlSection3(allStreamsHtml) {
  return `
    <!-- Item 3 Header -->
    <tr style="border: none;">
        <td style="vertical-align: top; border: none;">3.</td>
        <td style="vertical-align: top; border: none;">Elective Courses:</td>
        <td style="text-align: right; vertical-align: top; border: none;">27</td>
    </tr>

    <!-- Item 3(a) -->
    <tr style="border: none;">
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none;">(a)</td>
        <td style="vertical-align: top; padding-bottom: 0.3rem; border: none; line-height: 1.5;">
        9 units of MATH courses at 3000 or above level, and
        </td>
        <td style="border: none;"></td>
    </tr>

    <!-- Item 3(b) -->
    <tr style="border: none;">
        <td style="vertical-align: top; border: none;">(b)</td>
        <td style="vertical-align: top; border: none; line-height: 1.5;">
        18 units of courses chosen according to any one stream below:
        <div style="margin-top: 0.5rem;">${allStreamsHtml}</div>
        </td>
        <td style="border: none;"></td>
    </tr>
  `;
}