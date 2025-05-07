#!/usr/bin/env node

import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from 'zod';

import {retrieveIssues} from './issues/retrieve-issues.js';

const server = new McpServer({
    name: "MCP Termoficare Bucuresti - detailed incident logs and real-time status updates for Bucharest central heating network",
    version: "0.0.1",
});

server.tool('get_central_heating_issues',
    'Retrieve detailed incident logs and real-time status updates for Bucharest central heating network via Termoficare’s online portal',
    async () => {
        const issues = await retrieveIssues();
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(issues)
                }
            ]
        }
    });

server.tool('get_central_heating_issues_for_sector', 'Retrieve detailed incident logs and real-time status updates for Bucharest central heating network via Termoficare’s online portal for a specific sector',
    {sector: z.number().min(1).max(6)},
    async ({sector}) => {
        const issues = await retrieveIssues();
        const filteredIssues = issues.filter(issue => issue.sector === sector);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredIssues)
                }
            ]
        }
    });

server.tool('get_central_heating_issues_for_street', 'Retrieve detailed incident logs and real-time status updates for Bucharest central heating network via Termoficare’s online portal for a specific street',
    {street: z.string()},
    async ({street}) => {
        const issues = await retrieveIssues();
        const filteredIssues = issues.filter(issue => issue.zonesAffected.some(zone => zone.toLowerCase().includes(street.toLowerCase())));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredIssues)
                }
            ]
        }
    });
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
