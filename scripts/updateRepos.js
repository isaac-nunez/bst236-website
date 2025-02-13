import fs from 'fs';
import fetch from 'node-fetch';

async function fetchGitHubRepos() {
    const username = 'isaac-nunez';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const repos = await response.json();

        let reposHtml = '';
        repos.forEach(repo => {
            reposHtml += `
                <li>
                    <a href="${repo.html_url}" target="_blank">
                        ${repo.name}
                    </a>
                    - Last updated: ${new Date(repo.updated_at).toLocaleDateString()}
                </li>
            `;
        });

        const mainHtmlPath = 'src/main.html';
        let mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');
        mainHtml = mainHtml.replace(/<ul id="reposList">.*?<\/ul>/s, `<ul id="reposList">${reposHtml}</ul>`);
        fs.writeFileSync(mainHtmlPath, mainHtml, 'utf8');
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
    }
}

fetchGitHubRepos();