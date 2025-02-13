document.addEventListener('DOMContentLoaded', function() {
    const username = 'isaac-nunez'; // Replace with your GitHub username
    const githubUrl = `https://api.github.com/users/${username}/events`;

    fetch(githubUrl)
        .then(response => response.json())
        .then(data => {
            const repoSet = new Set();
            const repoList = [];

            for (const event of data) {
                if (event.type === 'PushEvent' && !repoSet.has(event.repo.name)) {
                    repoSet.add(event.repo.name);
                    repoList.push({
                        name: event.repo.name,
                        url: `https://github.com/${event.repo.name}`,
                        date: new Date(event.created_at).toLocaleDateString()
                    });
                }
                if (repoList.length >= 5) break;
            }

            const reposListElement = document.getElementById('reposList');
            repoList.forEach(repo => {
                const repoItem = document.createElement('li');
                repoItem.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p><a href="${repo.url}" target="_blank">View Repository</a></p>
                    <p><strong>Last Commit Date:</strong> ${repo.date}</p>
                `;
                reposListElement.appendChild(repoItem);
            });
        })
        .catch(error => console.error('Error fetching GitHub data:', error));
});