const fs = require('fs');
const { execSync } = require('child_process');
const { version } = require('../package.json');

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function generateChangelog() {
  try {
    // Read existing CHANGELOG.md
    const changelogPath = 'CHANGELOG.md';
    let changelog = fs.existsSync(changelogPath) 
      ? fs.readFileSync(changelogPath, 'utf8')
      : '# Changelog\n\n';

    // Get latest git commit messages since last tag
    const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
    const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s"`).toString().split('\n');

    // Categorize commits
    const categories = {
      Added: [],
      Changed: [],
      Fixed: [],
      Removed: []
    };

    commits.forEach(commit => {
      if (commit.startsWith('add:')) {
        categories.Added.push(commit.replace('add:', '').trim());
      } else if (commit.startsWith('change:')) {
        categories.Changed.push(commit.replace('change:', '').trim());
      } else if (commit.startsWith('fix:')) {
        categories.Fixed.push(commit.replace('fix:', '').trim());
      } else if (commit.startsWith('remove:')) {
        categories.Removed.push(commit.replace('remove:', '').trim());
      }
    });

    // Generate new version entry
    let newEntry = `\n## [${version}] - ${getCurrentDate()}\n\n`;

    // Add categorized changes
    Object.entries(categories).forEach(([category, items]) => {
      if (items.length > 0) {
        newEntry += `### ${category}\n`;
        items.forEach(item => {
          newEntry += `- ${item}\n`;
        });
        newEntry += '\n';
      }
    });

    // Insert new entry after the header
    const headerEnd = changelog.indexOf('\n\n');
    if (headerEnd === -1) {
      changelog += newEntry;
    } else {
      changelog = changelog.slice(0, headerEnd + 2) + newEntry + changelog.slice(headerEnd + 2);
    }

    // Write updated changelog
    fs.writeFileSync(changelogPath, changelog);
    console.log('Changelog updated successfully!');

  } catch (error) {
    console.error('Error generating changelog:', error);
    process.exit(1);
  }
}

generateChangelog();