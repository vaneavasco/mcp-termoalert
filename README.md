# MCP-TermoAlert-Bucharest

MCP-TermoAlert is a Model Context Protocol server that provides real-time information about thermal agent issues in Bucharest by parsing data from Termoenergetica's website. It allows AI assistants to access up-to-date information about heating system outages in different sectors of Bucharest.

## Features

- Fetches and parses thermal issue reports from Termoenergetica's official website
- Provides structured data through MCP tools, making it accessible to AI assistants
- Filters issues by sector or street name
- Written in TypeScript for type safety and maintainability

## Usage as MCP Server

This package is designed to be used as an MCP server with stdio transport, which can be connected to AI assistants like Claude or other MCP-compatible clients. When run, it starts an MCP server that listens for tool calls through stdin/stdout.

To start the server:

```bash
npx mcp-termoalert-bucharest
```

## Usage in Claude Desktop

To use this package in Claude Desktop, you need to configure the `claude_desktop_config.json` file as follows:

```json
{
  "mcpServers": {
    "central-heating-issues-bucharest": {
      "command": "npx",
      "args": ["-y", "mcp-termoalert-bucharest"]
    }
  }
}
```

This configuration allows Claude Desktop to call the MCP server for retrieving information about central heating issues in Bucharest.

## Available MCP Tools

The server provides the following MCP tools:

### `get_central_heating_issues`

Retrieves all current thermal issues across all sectors of Bucharest.

**Parameters:** None

**Returns:** JSON array of issue objects containing:
- `sector`: The sector number (1-6)
- `zonesAffected`: Array of affected locations
- `thermalAgent`: Type of thermal agent affected
- `description`: Description of the issue
- `estimatedRestart`: Estimated date and time of service restoration

### `get_central_heating_issues_for_sector`

Retrieves thermal issues for a specific sector in Bucharest.

**Parameters:**
- `sector`: Number (1-6) representing the sector of Bucharest

**Returns:** JSON array of issue objects filtered by the specified sector

### `get_central_heating_issues_for_street`

Retrieves thermal issues affecting a specific street.

**Parameters:**
- `street`: String representing the street name (case-insensitive)

**Returns:** JSON array of issue objects where the affected zones include the specified street name

## Data Structure

Each issue is represented as an object with the following structure:

```typescript
interface Issue {
    sector: number;             // The sector number (1-6 for Bucharest)
    zonesAffected: string[];    // Array of affected zones
    thermalAgent: string;       // Type of thermal agent affected
    description: string;        // Description of the issue
    estimatedRestart: Date;     // Estimated date and time when service will be restored
}
```

## Development

### Prerequisites

- Node.js v22 or higher
- npm or yarn

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/vaneavasco/mcp-termoalert.git
   cd mcp-termoalert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Scripts

- `npm run build`: Compiles the TypeScript code to JavaScript and makes the index.js file executable.
- `npm run test`: Runs the test suite using Jest.
- `npm run watch`: Watches for changes and recompiles the code.
- `npm run run`: Runs the main script using `tsx`.

### Running Tests

Run the test suite with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed by [Vanea Vasco](https://github.com/vaneavasco).
`