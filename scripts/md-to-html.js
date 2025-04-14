const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Configure marked options
marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
});

// HTML template with styling
const htmlTemplate = (content, lang) => `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms and Conditions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4 {
            color: #2c3e50;
            margin-top: 1.5em;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.2em; }
        p { margin: 1em 0; }
        ul, ol { margin: 1em 0; padding-left: 2em; }
        li { margin: 0.5em 0; }
        code {
            background-color: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`;

// Function to convert markdown to HTML
async function convertMarkdownToHtml() {
    const mdDir = path.join(__dirname, '..', 'md');
    const htmlDir = path.join(__dirname, '..', 'html');

    // Ensure html directory exists
    await fs.ensureDir(htmlDir);

    // Get all markdown files
    const files = await fs.readdir(mdDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    // Process each markdown file
    for (const file of mdFiles) {
        const mdPath = path.join(mdDir, file);
        const htmlPath = path.join(htmlDir, file.replace('.md', '.html'));
        
        // Read markdown content
        const mdContent = await fs.readFile(mdPath, 'utf8');
        
        // Convert to HTML
        const htmlContent = marked(mdContent);
        
        // Determine language from filename
        const lang = file.split('.')[0];
        
        // Wrap in HTML template
        const fullHtml = htmlTemplate(htmlContent, lang);
        
        // Write HTML file
        await fs.writeFile(htmlPath, fullHtml);
        console.log(`Converted ${file} to HTML`);
    }
}

// Run the conversion
convertMarkdownToHtml().catch(console.error); 