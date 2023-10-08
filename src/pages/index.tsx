import dynamic from 'next/dynamic';
// import Contact from '../components/contact';

const About = dynamic(()=>import('../components/about'));
const Experience = dynamic(()=>import('../components/experience'));
const Projects = dynamic(()=>import('../components/projects'));

export default function Home() {
  return <>
    <About />
    <Experience />
    <Projects />
    {/* <Contact></Contact> */}
  </>;
}