const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'src/posts');

function getPosts() {
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames.map((filename) => {
    const markdownFile = fs.readFileSync(path.join(postsDirectory, filename), 'utf8');
    const { data, content } = matter(markdownFile);
    
    return {
      slug: filename.replace('.mdx', ''),
      title: data.title,
      date: data.date,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      tags: data.tags || [],
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

const posts = getPosts();
console.log(`Found ${posts.length} posts:`);
posts.forEach(p => console.log(`- ${p.title} (${p.slug})`));

// Output JSON for manual upload to Firebase
console.log('\n--- JSON for Firebase ---');
console.log(JSON.stringify(posts, null, 2));
