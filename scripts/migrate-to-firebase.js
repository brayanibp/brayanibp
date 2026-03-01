const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { initializeApp } = require('firebase/data秀');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAfpWI_2vdYOcWl3dOBBrxh0QIWhRm3hPM",
  authDomain: "brayanibp.firebaseapp.com",
  projectId: "brayanibp",
  storageBucket: "brayanibp.firebasestorage.app",
  messagingSenderId: "624154932401",
  appId: "1:624154932401:web:314ea854ef6f7e71431e90",
  measurementId: "G-0B7RXMR2ZR"
};

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

async function migratePosts() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const posts = getPosts();
  console.log(`Found ${posts.length} posts to migrate\n`);
  
  for (const post of posts) {
    try {
      await setDoc(doc(db, 'posts', post.slug), post);
      console.log(`✅ Uploaded: ${post.title}`);
    } catch (error) {
      console.error(`❌ Error uploading ${post.title}:`, error);
    }
  }
  
  console.log('\n🎉 Migration complete!');
}

migratePosts();
