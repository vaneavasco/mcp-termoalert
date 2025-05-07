import { fetchIssuesPage, parseIssuesTable } from './retrieve-issues.js';
import fetch from 'node-fetch';

// Mock node-fetch
jest.mock('node-fetch');

describe('retrieve-issues', () => {
    describe('fetchIssuesPage', () => {
        it('should fetch the HTML content successfully', async () => {
            const mockHtml = '<html><body>Mock Page</body></html>';
            fetch.mockResolvedValue({
                ok: true,
                text: () => Promise.resolve(mockHtml)
            });

            const html = await fetchIssuesPage('http://example.com');
            expect(html).toBe(mockHtml);
        });

        it('should throw an error if the fetch fails', async () => {
            fetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            });

            await expect(fetchIssuesPage('http://example.com')).rejects.toThrow('Failed to fetch issues page. HTTP Status: 500 - Internal Server Error');
        });
    });

    describe('parseIssuesTable', () => {
        it('should parse issues correctly from valid HTML', () => {
            const mockHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Sector</th>
                            <th>Zone afectate</th>
                            <th>Agentul termic afectat</th>
                            <th>Cauza / Descrierea intervenției</th>
                            <th>Data/ora estimării punerii în funcțiune</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Punct termic: <strong>Nicolae Racotă</strong></td>
                            <td>Oprire ACC</td>
                            <td>Remediere avarie</td>
                            <td>08.05.2025 23:30</td>
                        </tr>
                    </tbody>
                </table>
            `;

            const issues = parseIssuesTable(mockHtml);
            expect(issues).toEqual([
                {
                    sector: 1,
                    zonesAffected: ['Punct termic: Nicolae Racotă'],
                    thermalAgent: 'Oprire ACC',
                    description: 'Remediere avarie',
                    estimatedRestart: new Date(2025, 4, 8, 23, 30)
                }
            ]);
        });

        it('should throw an error if the table structure is invalid', () => {
            const mockHtml = '<html><body>No valid table here</body></html>';
            expect(() => parseIssuesTable(mockHtml)).toThrow('No table found with the expected headers. Ensure the page structure has not changed.');
        });
    });
});
