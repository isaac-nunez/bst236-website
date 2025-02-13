import fs from 'fs';
import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';

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

        // Read the entire papers.html file
        const papersHtmlPath = 'papers.html';
        let papersHtmlContent = fs.readFileSync(papersHtmlPath, 'utf8');

        // Find the section where papers should be inserted
        const startMarker = '<section id="papers-section">';
        const endMarker = '</section>';
        
        // Create new papers content
        let newContent = `${startMarker}
            <h2>Latest Papers in Causal Inference</h2>
            <ul id="papersList">`;
            
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const title = entry.getElementsByTagName('title')[0].textContent;
            const authors = Array.from(entry.getElementsByTagName('author'))
                .map(author => author.getElementsByTagName('name')[0].textContent)
                .join(', ');
            const summary = entry.getElementsByTagName('summary')[0].textContent;
            const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href');
            const publishedDate = new Date(entry.getElementsByTagName('published')[0].textContent).toLocaleDateString();

            newContent += `
                <li>
                    <h3>${title}</h3>
                    <p><strong>Authors:</strong> ${authors}</p>
                    <p>${summary}</p>
                    <p><a href="${pdfLink}" target="_blank">Read PDF</a></p>
                    <p><strong>Submitted on:</strong> ${publishedDate}</p>
                </li>`;
        }
        
        newContent += `
            </ul>
        ${endMarker}`;

        // Replace the entire papers section
        const sectionPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
        papersHtmlContent = papersHtmlContent.replace(sectionPattern, newContent);
        
        fs.writeFileSync(papersHtmlPath, papersHtmlContent, 'utf8');
        console.log('Papers list updated successfully');
    } catch (error) {
        console.error('Error fetching Arxiv papers:', error);
    }
}

fetchArxivPapers();