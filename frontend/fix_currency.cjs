const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace \$${ (literal $ followed by interpolation) with Rs ${
    content = content.replace(/\$\$\{/g, 'Rs ${');
    
    // Replace >$ with >Rs 
    content = content.replace(/>\$(\d)/g, '>Rs $1');
    
    // Replace >${ with >Rs ${
    content = content.replace(/>\$\{/g, '>Rs ${');
    
    // Replace ($) with (Rs)
    content = content.replace(/\(\$\)/g, '(Rs)');

    // Replace $ with Rs in generic text context if it is standalone
    content = content.replace(/ \$/g, ' Rs ');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
    }
}

function walkSync(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkSync(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

walkSync(path.join(__dirname, 'src'));
