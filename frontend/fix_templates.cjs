const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix className strings that accidentally got "Rs {"
    // E.g. className={`... Rs {condition ? ...`} -> className={`... ${condition ? ...`}
    content = content.replace(/className=\{\`(.*?)\`\}/gs, (match, inner) => {
        return `className={\`${inner.replace(/Rs \{/g, '${')}\`}`;
    });
    
    // Fix other template literals not containing money:
    // "Rank Rs {index + 1}" -> "Rank ${index + 1}"
    content = content.replace(/Rank Rs \{/g, 'Rank ${');
    
    // "Cat: Rs {product" -> "Cat: ${product"
    content = content.replace(/Cat: Rs \{/g, 'Cat: ${');
    
    // "Stock: Rs {product" -> "Stock: ${product"
    content = content.replace(/Stock: Rs \{/g, 'Stock: ${');
    
    // "Variance: Rs {res" -> "Variance: Rs ${res"
    content = content.replace(/Variance: Rs \{/g, 'Variance: Rs ${');
    
    // "Cash Rs {movementType.toUpperCase()} of Rs {movementAmount} recorded!"
    // This is tricky.
    // "Cash Rs {movement" -> "Cash ${movement"
    content = content.replace(/Cash Rs \{/g, 'Cash ${');
    // "} of Rs {movement" -> "} of Rs ${movement"
    content = content.replace(/\} of Rs \{/g, '} of Rs ${');
    
    // "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase Rs {"
    // This is a className string that doesn't use className={...} directly, maybe inside a larger block.
    // Let's globally replace uppercase Rs { -> uppercase ${
    content = content.replace(/uppercase Rs \{/g, 'uppercase ${');
    
    // For Dashboard.jsx / MainLayout.jsx:
    // text-sm Rs {
    content = content.replace(/text-sm Rs \{/g, 'text-sm ${');
    
    // badge Rs {
    content = content.replace(/badge Rs \{/g, 'badge ${');

    // font-medium Rs {
    content = content.replace(/font-medium Rs \{/g, 'font-medium ${');

    // transition-all Rs {
    content = content.replace(/transition-all Rs \{/g, 'transition-all ${');

    // text-white Rs {
    content = content.replace(/text-white Rs \{/g, 'text-white ${');

    // bg-slate-50\/50 Rs {
    content = content.replace(/bg-slate-50\/50 Rs \{/g, 'bg-slate-50/50 ${');
    
    // bg-gradient-to-br Rs {
    content = content.replace(/bg-gradient-to-br Rs \{/g, 'bg-gradient-to-br ${');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
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
