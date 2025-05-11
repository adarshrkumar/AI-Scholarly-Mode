// import 'dotenv/config';

// import fs from 'fs';

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { z } from 'zod';

import { getSearchResults, getArticleData } from './springer.js';

// Create an MCP server
const server = new McpServer({
  name: 'Springer',
  version: '1.0.0'
});

/**
 * Tool: /scholarly-mode start
 * Activates scholarly mode and provides instructions for the AI to follow
 * This tool sets up the AI to use only the scholarly article search tools
 * and enables article-based conversations
 */
server.tool('scholarly-mode-start',
  'Start scholarly mode. This tool returns a systemPrompt for you to use while you are in scholarly mode.',
  async () => {
    return {
      content: [{ type: 'text', text: 'Please use the two other scholarly mode tools to search for articles and get article data. PLEASE ALLOW THE USER TO CHAT WITH ARTICLES THAT YOU RECIEVE. YOU ARE NOT ALLOWED TO USE ANY OTHER TOOLS THAN THE TWO PROVIDED TO YOU.' }]
    }
  }
);

/**
 * Tool: /scholarly-mode stop
 * Deactivates scholarly mode and resets the AI's behavior
 * This tool removes the scholarly mode restrictions and allows
 * the AI to use its full range of capabilities
 */
server.tool('scholarly-mode-stop',
  'Stop scholarly mode. This tool returns a systemPrompt for you to use while you are not in scholarly mode.',
  async () => {
    return {
      content: [{ type: 'text', text: 'You are now in normal mode. You are not allowed to use the two scholarly mode tools. You are allowed to use any other tools than the two provided to you. PLEASE ALSO DISREGARD ALL PREVIOUS INSTRUCTION PROVIDED TO YOU ABOUT SCHOLARLY MODE.' }]
    }
  }
);

/**
 * Tool: get_articles_list
 * Searches for articles in Springer based on a query string
 * @param query - The search query string
 * @param articles_per_page - Optional number of results per page
 * @returns Search results as JSON string
 */
server.tool('get_articles_list',
  'Get articles list',
  { query: z.string(), articles_per_page: z.number().optional() },
  async ({ query, articles_per_page }) => {
    const searchResults = await getSearchResults(query, articles_per_page);
    
    if (!searchResults || typeof searchResults !== 'object') {
      return {
        content: [{ type: 'text', text: searchResults ?? JSON.stringify({type: 'error', text: {type: 'error', text: 'No results found' } }) }]
      }
    }

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
        
    if (!articleData) {
      return {
        content: [{ type: 'text', text: JSON.stringify({type: 'error', text: 'No article data found' }) }]
      }
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(articleData) }]
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