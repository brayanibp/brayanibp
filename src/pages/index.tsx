import dynamic from 'next/dynamic';

const About = dynamic(()=>import('../components/about'));
const Experience = dynamic(()=>import('../components/experience'));
const Projects = dynamic(()=>import('../components/projects'));
const Contact = dynamic(()=>import('../components/contact'));

export default function Home() {
  return <>
    <About />
    <Experience />
    <Projects />
    <Contact />
  </>;
}