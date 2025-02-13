# REPORT

-Isaac Núñez 

Website link: https://isaac-nunez.github.io/bst236-website/main.html

All files used to construct the website are publicly available in the website's repository. 

This report describes the construction of the website requested in homework 1 for BST 236. Overall, the emphasis is in how to use AI to do the heavy lifting, how to use GitHub, how to use GitHub pages, and how to use GitHub actions. 

## The overall structure of the Project was as follows

```
my-website

│   ├── index.html        # Main entry point of the website
│   ├── main.html         # Main page content
│   ├── games.html        # Games page content
│   ├── papers.html       # Papers page content
│   ├── styles
│   │   └── style.css     # CSS styles for the website
│   └── scripts
│       └── main.js       # JavaScript for interactive functionality
├── package.json          # npm configuration file
└── README.md             # Documentation for the project
```
Originally, copilot created a folder "src" that contained all the files that are now under "root". This made it impossible for github pages to deploy the webpage, so always make sure that the html files are at the same level as the README.md file, otherwise the latter will be the one showing up.



## Tutorial: Designing the Webpage with GitHub Copilot

### 1. How Copilot Generally Designed the Webpage

GitHub Copilot works with a prompt. The initial prompts need not be too specific, the first thing is getting the website to work. To design the webpage, Copilot provided suggestions for HTML, CSS, and JavaScript code based on the context of my prompt. The general steps were as followed:
 1) First created a repository in my github, and cloned it in locally. 
 2) Asked copilot to write the code for a website that has three pages, specified the background color, the letter font and color, and a very general structure of the layout. I tried to be as explicit as possible with the requirements, specifying the font by name (rather than just saying "a formal font").
 3) Copilot created the documents shown in the diagram above, and accessing the index.html file allowed me to determine how did the changes made each time affected the webpage.
 4) I tweaked the characteristics mentioned in point 2 just to make sure it worked. 
 5) Once I made sure, I committed and pushed the files to the github repository.
 6) Then I went to settings, and then to Pages. I selected to deploy the website from the main branch. After a couple of minutes, the website was available online. All further changes were built on these initial steps.


### 2. How Copilot Generated the Pacman Game

To generate the Pacman game, I prompted copilot numerous times based on the game result. Throughout, several characteristics had to be modified (e.g. pacman did not look like pacman) and sometimes these changes introduced new errors. Sometimes, these new errors brought problems, such as that the game stopped running. Most of these problematic edits were in the pacman.js file. 

To make sure these new errors were not devastating, I committed the changes every time I had a reasonably working version of the game. Once the first running version existed, all further commits were only when the game was significantly better (that is, when going back to a prior version would not be terrible).

The prompting tip in this case is to be as specific as possible about the error and not use ambigous words. For example, if the game is not showing, do not say that the game "does not run", because it may interpret it as if pacman was literally not "running" and try to address something about pacman's movement, rather than the fact that the game did not initialize.

For the game, copilot created a .js file.

### 3. How Copilot Made the Arxiv Preprints Appear on the Webpage

To display Arxiv preprints on the webpage, Copilot fetched data from the Arxiv API. The way it does it in general, is that it creates a .js file that manages the extraction of the paper data. Also, it creates a .js file managing the update of the paper data. Additionally, I asked copilot to create a .yml file that runs in GitHub workflow (`update-content.yml`). This file will update the paper list once a day at midnight eastern time. 

Of note, I had to create a Personal Access Token in Github so the .yml file ran in workflow ppropriately. The general steps are relevant, because it was a limiting issue:
Go to Your Repository:

1) Navigate to the repository where you want to use the token.
Access Repository Settings:

2) Click on "Settings" in the top menu of the repository.
Add a New Secret:

3) In the left sidebar, click on "Secrets and variables" and then "Actions".
Click the "New repository secret" button.
Name your secret (e.g., TOKEN).
Paste the token you copied earlier into the "Value" field.
Click the "Add secret" button.

You should write down or save your token. Afterwards, ask copilot to write code in your .yml file so it can use the token.

Sometimes, the workflow within github actions can result in an error. Fortunately, they are very explicit and show you the error code. When this happens, simply paste the error message in copilot and ask to fix.

Happy coding!

Isaac

## License

This project is licensed under the MIT License.