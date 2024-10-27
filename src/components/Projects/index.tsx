import data from '@/data/projects.json';
import ProjectCard from '../ProjectCard';
import style from "./projects.module.css";

export default function Projects() {
  const projects = data.projects;
  
  const projectsList = projects.map((project, index)=>{
    return <ProjectCard key={index+project.name} {...project}/>;
  });

  return <section id="projects">
    <h2>Projects</h2>
    <ul className={style['projects-list']}>
      {projectsList}
    </ul>
  </section>;
}