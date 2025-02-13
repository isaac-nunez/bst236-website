const fs = require('fs');
const fetch = require('node-fetch');

async function fetchArxivPapers() {
    const apiUrl = 'http://export.arxiv.org/api/query?search_query=all:causal+inference&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const entries = xmlDoc.getElementsByTagName('entry');

        let papersHtml = '';
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const title = entry.getElementsByTagName('title')[0].textContent;
            const link = entry.getElementsByTagName('link')[0].getAttribute('href');
            papersHtml += `
                <li>
                    <a href="${link}" target="_blank">
                        ${title}
                    </a>
                </li>
            `;
        }

        const papersHtmlPath = 'papers.html';
        let papersHtmlContent = fs.readFileSync(papersHtmlPath, 'utf8');
        papersHtmlContent = papersHtmlContent.replace(/<ul id="papersList">.*?<\/ul>/s, `<ul id="papersList">${papersHtml}</ul>`);
        fs.writeFileSync(papersHtmlPath, papersHtmlContent, 'utf8');
    } catch (error) {
        console.error('Error fetching Arxiv papers:', error);
    }
}

fetchArxivPapers();