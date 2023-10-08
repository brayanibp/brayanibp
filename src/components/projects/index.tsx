import data from '@/data/projects.json';
import ProjectCard from '../project_card';

export default function Projects() {
  const projects = data.projects;
  const projectsList = projects.map((project, index)=>{
    return <ProjectCard key={index+project.name} {...project}/>;
  });
  return <section id="Projects">
    <h2>Projects</h2>
    <ul className='projects-list'>
      {projectsList}
    </ul>
  </section>;
}