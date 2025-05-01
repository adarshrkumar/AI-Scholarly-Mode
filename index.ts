import 'dotenv/config';

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { z } from 'zod';

import { getSearchResults, getArticleData } from './springer.js';

// Create an MCP server
const server = new McpServer({
  name: 'Springer',
  version: '1.0.0'
});

// Add a calculator tool
server.tool('get_springer_search_results',
  'Get Springer search results',
  { query: z.string(), articles_per_page: z.number().optional() },
  async ({ query, articles_per_page }) => {
    const searchResults = await getSearchResults(query, articles_per_page);
    return {
      content: [{ type: 'text', text: JSON.stringify(searchResults) }]
    }
  }
);

server.tool('get_springer_article_data',
  'Get Springer article data',
  { id: z.string() },
  async ({ id }) => {
    const articleData = await getArticleData(id);
    return {
      content: articleData
    }
  }
);

// // Add a dynamic greeting resource that generates personalized greetings
// server.resource(
//   'greeting',
//   new ResourceTemplate('greeting://{name}', { list: undefined }),
//   async (uri, { name }) => ({
//     contents: [{
//       uri: uri.href,
//       text: `Hello, ${name}!`
//     }]
//   })
// );

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);