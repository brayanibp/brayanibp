const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'src/posts');

function convertPost(filename) {
  let content = fs.readFileSync(path.join(postsDirectory, filename), 'utf8');
  
  // Pattern to match <SyntaxHighlighter language="xxx">\n{`...`}\n</SyntaxHighlighter>
  // Convert to markdown code blocks
  const pattern = /<SyntaxHighlighter language="([^"]+)"[^>]*>\n?\{`\n?([\s\S]*?)\n?`\}\n?<\/SyntaxHighlighter>/g;
  
  let converted = content.replace(pattern, (match, lang, code) => {
    // Clean the code
    const cleanCode = code.trim();
    return `\`\`\`${lang}\n${cleanCode}\n\`\`\``;
  });
  
  // Also handle inline pattern <SyntaxHighlighter language="xxx">{`code`}</SyntaxHighlighter>
  const inlinePattern = /<SyntaxHighlighter language="([^"]+)"[^>]*>\{\`([\s\S]*?)\`\}<\/SyntaxHighlighter>/g;
  converted = converted.replace(inlinePattern, (match, lang, code) => {
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
  });
  
  fs.writeFileSync(path.join(postsDirectory, filename), converted);
  console.log(`Converted: ${filename}`);
}

const filenames = fs.readdirSync(postsDirectory);
filenames.forEach(convertPost);

console.log('\n✅ All posts converted!');
console.log('Now update Firebase with: node scripts/migrate-to-firebase.js');
