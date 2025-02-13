document.addEventListener('DOMContentLoaded', function() {
    const arxivUrl = 'https://export.arxiv.org/api/query?search_query=all:causal+inference&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending';

    fetch(arxivUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');
            const papersList = document.getElementById('papersList');

            if (!papersList) {
                console.error('Papers list element not found');
                return;
            }

            // Clear existing papers
            papersList.innerHTML = '';

            // Add new papers
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const title = entry.getElementsByTagName('title')[0].textContent;
                const authors = Array.from(entry.getElementsByTagName('author'))
                    .map(author => author.getElementsByTagName('name')[0].textContent)
                    .join(', ');
                const summary = entry.getElementsByTagName('summary')[0].textContent;
                const pdfLink = entry.getElementsByTagName('link')[1].getAttribute('href');
                const publishedDate = new Date(entry.getElementsByTagName('published')[0].textContent).toLocaleDateString();

                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${title}</h3>
                    <p><strong>Authors:</strong> ${authors}</p>
                    <p>${summary}</p>
                    <p><a href="${pdfLink}" target="_blank">Read PDF</a></p>
                    <p><strong>Submitted on:</strong> ${publishedDate}</p>
                `;
                papersList.appendChild(li);
            }
        })
        .catch(error => console.error('Error fetching arXiv data:', error));
});