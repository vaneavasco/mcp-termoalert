import {parseIssuesTable} from './retrieve-issues.js';
import {Issue} from './types.js';

describe('retrieve-issues', () => {
        describe('parseIssuesTable', () => {
            it('should parse issues correctly from valid HTML', () => {
                const mockHtml = `
                <table>
                    <tbody>
                        <tr>
                            <th>Sector</th>
                            <th>Zone afectate</th>
                            <th>Agentul termic afectat</th>
                            <th>Cauza / Descrierea intervenției</th>
                            <th>Data/ora estimării punerii în funcțiune</th>
                        </tr>
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
                expect(issues).toEqual<Issue[]>([
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
