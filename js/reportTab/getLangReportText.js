// js/reportTab/getLangReportText.js

import { formatCode } from './reportGeneration.js';

/**
 * Returns a formatted, comma-separated string of passed language courses,
 * or 'None' if no courses are passed.
 * 
 * @param {Object} courseManager - The global course manager instance.
 * @returns {string} Formatted HTML string.
 */
export function getLangReportText(courseManager) {
  if (!courseManager?.langCourses?.length) return 'None';

  const formattedCourses = courseManager.langCourses
    .filter(course => courseManager.isCustomCoursePassed(course))
    .map(course => formatCode(course.code));

  return formattedCourses.length > 0 ? formattedCourses.join(', ') : 'None';
}