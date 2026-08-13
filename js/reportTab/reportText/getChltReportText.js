// js/reportTab/getChltReportText.js

import { formatCode } from '../reportGeneration.js';

/**
 * Generates the HTML report text for CHLT requirements.
 * 
 * @param {Object} courseManager - The course manager instance
 * @returns {string} Formatted HTML string representing ELTU status
 */
export function getChltReportText(courseManager) {
    if (!courseManager) return 'None';

    if (courseManager.exemptCHLT) {
        return '<s>CHLT1001 and 1002</s> (Exempted),';
    } else {
        return `${formatCode('CHLT1001')} and ${formatCode('CHLT1002', '1002')}`;
    }
}