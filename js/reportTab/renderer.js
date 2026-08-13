// js/reportTab/renderer.js

import { streamData } from '../constants.js';
import { formatCode } from './reportGeneration.js';

import {
	geHtmlSection1,
	geHtmlSection2,
	geHtmlSection3,
	geHtmlSection4,
	geHtmlSection6,
	geHtmlSection7,
} from './htmlSection/geHtml.js';

import {
	majorHtmlHeader,
	majorHtmlSection1,
	majorHtmlSection2,
	majorHtmlSection3,
} from './htmlSection/majorHtml.js';

import { 
    progTableGE,
    progTableMajor1,
    progTableMajor2,
    progTableMajor3
} from './htmlSection/progTable.js';

export function renderProgressTable(data) {
    const tbody = document.getElementById("progress-table-body");
    if (!tbody) return;

    tbody.innerHTML = `
        ${progTableGE(data)}
        ${progTableMajor1(data)}
        ${progTableMajor2(data)}
        ${progTableMajor3(data)}
    `;
}

export function renderReportDocument(data, stream, college) {
    const allStreamsHtml = streamData.map(st => {
        const isSelected = st.key === stream;
        return `
        <details style="margin-top: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; padding: 0.5rem 0.75rem; background-color: ${isSelected ? '#f0f9ff' : '#ffffff'};" ${isSelected ? 'open' : ''}>
            <summary style="font-weight: bold; cursor: pointer; color: ${isSelected ? '#0284c7' : '#374151'};">
            ${st.title} ${isSelected ? '<strong>(Selected Stream)</strong>' : ''}
            </summary>
            <div style="margin-top: 0.5rem; padding-left: 0.5rem; line-height: 1.5; color: #1f2937;">
            ${st.render(formatCode)}
            </div>
        </details>`;
    }).join('');

    const reportHtml = /* HTML */`
        <div style="font-family: 'Times New Roman', Times, serif; color: #000000; max-width: 800px; margin: 0 auto; line-height: 1.25; font-size: 1.05rem;">
            <div style="text-align: center; font-weight: bold; margin-bottom: 1.5rem;">
                <div style="font-size: 1.35rem;">Mathematics</div>
                <div style="font-size: 1.15rem; margin-top: 0.35rem;">Applicable to students admitted in 2024–25</div>
            </div>

            <div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
                <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">General Education & University Requirements</div>
                
                <table style="width: 100%; border-collapse: collapse; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
                <colgroup>
                    <col style="width: 45px;" />
                    <col style="width: 35px;" />
                    <col style="width: auto;" />
                    <col style="width: 30px;" />
                    <col style="width: 30px;" />
                </colgroup>
                <tr>
                    <td colspan="4"></td>
                    <td style="text-align: right; vertical-align: bottom;">Units</td>
                </tr>

                ${geHtmlSection1(
                    data.ge.uge.ugeaAllocated,
                    data.ge.uge.ugecAllocated,
                    data.ge.uge.ugedAllocated,
                    data.ge.uge.ugeaFulfilled,
                    data.ge.uge.ugecFulfilled,
                    data.ge.uge.ugedFulfilled,
                    window.courseManager?.hasPassedCourse('UGFH1000'),
                    window.courseManager?.hasPassedCourse('UGFN1000')
                )}

                ${geHtmlSection2(college, data.ge.college.rawData, data.ge.college.info)}
                ${geHtmlSection3()}
                ${geHtmlSection4()}
                ${geHtmlSection6(data.ge.phed.allocated)}
                ${geHtmlSection7(data.lang)}
                </table>
            </div>

            <div class="doc-outer-box" style="border: 1px solid #000000; padding: 2rem 2.2rem; background: #ffffff;">
                <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.75rem;">Major Programme Requirement</div>
                
                <table style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed; font-family: 'Times New Roman', Times, serif; font-size: 1.05rem;">
                <colgroup>
                    <col style="width: 70px !important;" />
                    <col style="width: auto !important;" />
                    <col style="width: 60px !important;" />
                </colgroup>

                ${majorHtmlHeader()}
                ${majorHtmlSection1()}
                ${majorHtmlSection2()}
                ${majorHtmlSection3(allStreamsHtml)}
                </table>
            </div>
        </div>
    `;

    document.getElementById("highlighted-text").innerHTML = reportHtml.trim();
    document.getElementById("overall-summary-box").innerHTML = `
        Specialization Stream: <strong>${stream}</strong> | College: <strong>${college}</strong>
    `;
    document.getElementById("results-section").style.display = "block";
}