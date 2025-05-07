import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import { ro } from 'date-fns/locale';

import { Issue } from './types.js';
import { config } from '../config.js';

const EXPECTED_HEADERS = [
    'Sector',
    'Zone afectate',
    'Agentul termic afectat',
    "Cauza / Descrierea intervenției",
    'Data/ora estimării punerii în funcțiune'
];

/**
 * Fetches the HTML content of the issues page.
 * @param url - The URL to fetch the issues page from.
 * @returns A promise resolving to the HTML content as a string.
 * @throws Error if the fetch fails.
 */
export async function fetchIssuesPage(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch issues page. HTTP Status: ${res.status} - ${res.statusText}`);
    }
    return res.text();
}

/**
 * Parses the HTML content to extract issues.
 * @param html - The HTML content of the issues page.
 * @returns An array of parsed issues.
 * @throws Error if the table structure is invalid or data is malformed.
 */
export function parseIssuesTable(html: string): Issue[] {
    const $ = cheerio.load(html);

    // Locate the table with the expected headers
    const table = $('table').filter((_, tbl) => {
        const headers = $(tbl).find('th').map((_, th) => $(th).text().trim()).get();
        return headers.length === EXPECTED_HEADERS.length
            && headers.every((h, i) => h === EXPECTED_HEADERS[i]);
    }).first();

    if (!table.length) {
        throw new Error('No table found with the expected headers. Ensure the page structure has not changed.');
    }

    // Parse the rows of the table (skipping the header row)
    const issues: Issue[] = [];
    table.find('tbody > tr').slice(1).each((_, tr) => {
        const cells = $(tr).find('td');
        if (cells.length < 5) {
            console.warn('Skipping row due to insufficient columns:', $.html(tr));
            return; // Skip rows with fewer than 5 columns
        }

        try {
            // Extract and validate the sector
            const sectorText = $(cells[0]).text().trim();
            const sector = Number(sectorText);
            if (Number.isNaN(sector)) {
                throw new Error(`Invalid sector value: "${sectorText}"`);
            }

            // Extract and clean the affected zones
            const rawZonesHtml = $(cells[1]).html() || '';
            const zonesAffected = rawZonesHtml
                .split(/<br\s*\/?>/i)
                .map(z => cheerio.load(z).text().trim())
                .filter(z => z.length > 0);

            // Extract other fields
            const thermalAgent = $(cells[2]).text().trim();
            const description = $(cells[3]).text().trim();

            // Parse and validate the estimated restart date
            const dateStr = $(cells[4]).text().trim();
            const estimatedRestart = parse(dateStr, 'dd.MM.yyyy HH:mm', new Date(), { locale: ro });
            if (isNaN(estimatedRestart.getTime())) {
                throw new Error(`Invalid date format: "${dateStr}"`);
            }

            // Add the issue to the list
            issues.push({ sector, zonesAffected, thermalAgent, description, estimatedRestart });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.warn(`Skipping row due to parsing error: ${errorMessage}`, $.html(tr));
        }
    });

    if (issues.length === 0) {
        throw new Error('No valid issues found in the table. Ensure the data is correctly formatted.');
    }

    return issues;
}

/**
 * Retrieves issues by fetching and parsing the issues page.
 * @returns A promise resolving to an array of issues.
 */
export async function retrieveIssues(): Promise<Issue[]> {
    const html = await fetchIssuesPage(config.issuesPageURL);
    return parseIssuesTable(html);
}

// Make sure exports are explicitly defined for ESM compatibility
export default {
    fetchIssuesPage,
    parseIssuesTable,
    retrieveIssues
};

