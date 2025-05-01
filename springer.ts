// import 'dotenv/config';
import fs from 'fs';

import { Sucess, Info, Warning, Alert, Error } from './ConsoleManagement.js'

import { xml2json } from 'xml-js';
import { parse } from 'path';

/**
 * Fetches search results from Springer API
 * @param query - The search query string
 * @param articlesPerPage - The number of articles to fetch per page
 * @returns Array of search results or error message
 */
async function getSearchResults(query: string, articlesPerPage: number = 20) {
    const url = `https://api.springernature.com/openaccess/json?api_key=${process.env.SPRINGER_API_KEY || ''}&callback=&s=1&p=${articlesPerPage}&q=${encodeURIComponent(query)}`

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return Error('Error fetching article data: ' + response.statusText);;;
        }

        const data = await response.text();
        
        if (!parseJSON(data)) {
            return Error('Invalid JSON response');
        }
        
        const parsedData = JSON.parse(data);
        Info('Parsed data structure: ' + JSON.stringify(Object.keys(parsedData)));
        
        if (!parsedData?.records) {
            return Error('No records found in response');
        }
        
        const records = parsedData.records;
        Info('Number of records found: ' + records.length);
        fs.writeFileSync('C:\\Users\\Adi\\OneDrive\\Code\\Playlab\\Springer-API-MCP-Integration\\searchResults.json', JSON.stringify(records, null, 2) ?? '');

        return records;
    } catch (error) {
        return false;
    }
}

/**
 * Fetches and processes article data from Google Scholar
 * @param query - The search query string
 * @param result_id - The ID of the specific article to fetch
 * @returns Article data with content or error message
 */
async function getArticleData(id: string) {
    const url = `https://api.springernature.com/openaccess/jats?api_key=${process.env.SPRINGER_API_KEY}&callback=&s=1&q=${encodeURIComponent(id)}`

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return Error('Error fetching article data: ' + response.statusText);
        }

        const xml = await response.text();
        Info('Raw XML response: ' + xml.substring(0, 200) + '...');

        // Convert XML to JSON
        const myJson = xml2json(xml, {
            compact: true,
            spaces: 0,
            ignoreComment: true,
            ignoreDeclaration: true
        });

        Info('Converted XML to JSON: ' + myJson.substring(0, 200) + '...');

        if (!parseJSON(myJson)) {
            return Error('Invalid JSON after XML conversion');
        }

        const parsedJson = JSON.parse(myJson);
        Info('Parsed JSON structure: ' + JSON.stringify(Object.keys(parsedJson)));

        if (!parsedJson?.response?.records) {
            return Error('No records found in response');
        }

        const records = parsedJson.response.records;
        Info('Number of records found: ' + records.length);

        return records;
    } catch (error) {
        return false;
    }
}

function parseJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

export { getSearchResults, getArticleData };