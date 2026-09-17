const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix double Rs
    content = content.replace(/Rs Rs \{/g, 'Rs {');
    // Fix >Rs Rs
    content = content.replace(/>Rs Rs/g, '>Rs');
    
    // Check for any remaining $ inside JSX that should be Rs
    // like -${ or +${ 
    content = content.replace(/-\$\{/g, '-Rs ${');
    content = content.replace(/\+\$\{/g, '+Rs ${');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed double Rs in', filePath);
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
