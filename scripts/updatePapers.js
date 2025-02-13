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

        // Read the papers.html file
        const papersHtmlPath = 'papers.html';
        let papersHtmlContent = fs.readFileSync(papersHtmlPath, 'utf8');

        // Create new content with only the latest 10 papers
        let newPapersSection = `
        <section id="papers-section">
            <h2>Latest Papers in Causal Inference</h2>
            <ul id="papersList">`;
            
        // Only process the first 10 entries
        const numEntries = Math.min(entries.length, 10);
        for (let i = 0; i < numEntries; i++) {
            const entry = entries[i];
            const title = entry.getElementsByTagName('title')[0].textContent;
            const authors = Array.from(entry.getElementsByTagName('author'))
                .map(author => author.getElementsByTagName('name')[0].textContent)
                .join(', ');
            const summary = entry.getElementsByTagName('summary')[0].textContent;
            const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href');
            const publishedDate = new Date(entry.getElementsByTagName('published')[0].textContent).toLocaleDateString();

            newPapersSection += `
                <li>
                    <h3>${title}</h3>
                    <p><strong>Authors:</strong> ${authors}</p>
                    <p>${summary}</p>
                    <p><a href="${pdfLink}" target="_blank">Read PDF</a></p>
                    <p><strong>Submitted on:</strong> ${publishedDate}</p>
                </li>`;
        }
        
        newPapersSection += `
            </ul>
        </section>`;

        // Replace the papers section in the HTML content
        const updatedHtmlContent = papersHtmlContent.replace(
            /<section id="papers-section">[\s\S]*?<\/section>/,
            newPapersSection
        );
        
        fs.writeFileSync(papersHtmlPath, updatedHtmlContent, 'utf8');
        console.log('Updated papers.html with the 10 newest papers');
    } catch (error) {
        console.error('Error updating papers:', error);
    }
}

fetchArxivPapers();