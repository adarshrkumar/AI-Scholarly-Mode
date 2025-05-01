import 'dotenv/config';

import { Sucess, Info, Warning, Alert, Error } from './ConsoleManagement.js'

import { xml2json } from 'xml-js';


/**
 * Fetches search results from Springer API
 * @param query - The search query string
 * @param articlesPerPage - The number of articles to fetch per page
 * @returns Array of search results or error message
 */
async function getSearchResults(query: string, articlesPerPage: number = 20) {
    const url = `https://api.springernature.com/openaccess/json?api_key=${process.env.SPRINGER_API_KEY}&callback=&s=1&p=${articlesPerPage}&q=${encodeURIComponent(query)}`

    const response = await fetch(url);

    if (!response.ok) {
        return Error('Error fetching article data: ' + response.statusText);
    }
    let data: string | { records: any[] } = await response.text();

    if (parseJSON(data)) {
        data = JSON.parse(data) as { records: any[] };
    }
    else return data


    const records = data.records;

    if (!records) {
        return Error('No results found');
    }

    return records;
}

/**
 * Fetches and processes article data from Google Scholar
 * @param query - The search query string
 * @param result_id - The ID of the specific article to fetch
 * @returns Article data with content or error message
 */
async function getArticleData(id: string) {
    const url = `https://api.springernature.com/openaccess/jats?api_key=${process.env.SPRINGER_API_KEY}&callback=&s=1&q=${encodeURIComponent(id)}`


    const response = await fetch(url);

    const xml = await response.text();

    // Convert XML to JSON
    let myJson: any = xml2json(xml, {
        compact: true,
        spaces: 0,
        ignoreComment: true,
        ignoreDeclaration: true
    });

    if (parseJSON(myJson)) {
        myJson = JSON.parse(myJson);
    }
    else return myJson

    const records = myJson?.response?.records
    // Info(records, 'dir')
    
    if (!response.ok) {
        return Error('Error fetching article data');
    }
    
    if (!records) {
        return Error('Article not found');
    }

    return records;
}

function parseJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export { getSearchResults, getArticleData };
