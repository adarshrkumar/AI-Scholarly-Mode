# AI-Scholarly-Mode

A Model Context Protocol (MCP) Server that enables AI assistants to operate in a specialized "scholarly mode," restricting them to exclusively use scholarly article search and retrieval tools powered by Springer Nature's Open Access API.

## Overview

This MCP server allows users to engage in research-driven conversations with AI assistants (like Claude) while ensuring the AI only accesses peer-reviewed academic articles from Springer Nature's open access collection.

## Features

- **Scholarly Mode Toggle** - Enable/disable scholarly-only mode for AI conversations
- **Article Search** - Search Springer Nature's open access collection with custom queries
- **Article Retrieval** - Fetch full article content in structured JSON format (converted from JATS XML)
- **MCP Protocol** - Seamless integration with Claude and other MCP-compatible AI assistants

## Installation

```bash
# Clone the repository
git clone https://github.com/adarshrkumar/AI-Scholarly-Mode.git
cd AI-Scholarly-Mode

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### API Key Setup

You need a Springer Nature API key to use this server.

1. Obtain an API key from [Springer Nature Developer Portal](https://dev.springernature.com/)
2. Create a `.env` file in the project root:

   ```env
   SPRINGER_API_KEY=your_api_key_here
   ```

## Usage

### Running the Server

```bash
# Production
npm start

# Development
npm run dev
```

### MCP Client Configuration

Add this server to your MCP client configuration. For Claude Desktop, add to your config:

```json
{
  "mcpServers": {
    "scholarly-mode": {
      "command": "node",
      "args": ["path/to/AI-Scholarly-Mode/dist/index.js"]
    }
  }
}
```

## Available Tools

| Tool | Description |
| ------ | ------------- |
| `scholarly-mode-start` | Activates scholarly mode, restricting AI to use only Springer search tools |
| `scholarly-mode-stop` | Deactivates scholarly mode, returning AI to normal operation |
| `get_articles_list` | Searches Springer for articles matching a query. Parameters: `query` (required), `articles_per_page` (optional) |
| `get_springer_article_data` | Retrieves full article content by ID. Parameters: `id` (required) |

## Tech Stack

- **TypeScript** - Type-safe development
- **@modelcontextprotocol/sdk** - MCP server framework
- **xml-js** - JATS XML to JSON conversion
- **Zod** - Schema validation
- **dotenv** - Environment variable management

## Project Structure

```text
AI-Scholarly-Mode/
├── index.ts              # Main MCP server implementation
├── springer.ts           # Springer API integration
├── ConsoleManagement.ts  # Console output utilities
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── dist/                 # Compiled output
```

## Author

Created by adarshrkumar for [Playlab.ai](https://playlab.ai)

## License

ISC
