"use server";
import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/About").then((res)=>res));
const Contact = dynamic(() => import("@/components/Contact"));
const Experience = dynamic(() => import("@/components/Experience"));
const Projects = dynamic(() => import("@/components/Projects"));
const Social = dynamic(() => import("@/components/Social"), {
  ssr: false,
});

const Home = () => {
  return (
    <main>
      <About />
      <Experience />
      <Projects />
      <Contact />
      <Social />
    </main>
  );
}

export default Home;