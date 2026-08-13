// js/reportTab/getEltuReportText.js

import { formatCode } from '../reportGeneration.js';

/**
 * Generates the HTML report text for English Language (ELTU) requirements.
 * Groups courses by level (1000s/Exemption, 2000s, 3000s) on separate lines.
 * 
 * @param {Object} courseManager - The course manager instance
 * @returns {string} Formatted HTML string representing ELTU status
 */
export function getEltuReportText(courseManager) {
  if (!courseManager) return 'None';

  const eltuLines = [];

  // Exemption handling
  if (courseManager.exemptELTU) {
    eltuLines.push('<s>ELTU1001 or 1002</s> (Exempted),');
  } else {
    const line1000 = `${formatCode('ELTU1001')} or ${formatCode('ELTU1002', '1002')},`;
    eltuLines.push(line1000);
  }

  const line2000 = `${formatCode('ELTU2018')} or ${formatCode('ELTU2019', '2019')},`;
  eltuLines.push(line2000);

  const line3000 = `${formatCode('ELTU3018')} or ${formatCode('ELTU3019', '3019')}`;
  eltuLines.push(line3000);

  if (eltuLines.length > 0) {
    return eltuLines.join('<br>');
  } else {
    return 'None';
  }
}