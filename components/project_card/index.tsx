import Project from "@/models/projects_model";
import Image from "next/image";

export default function ProjectCard(project: Project) {
  const techsList = project.techs?.map((tech, index)=> {
    return <li key={index} className="project-tech">{tech}</li>;
  }) || [];
  return <>
    <li key={project.name} className="project-card">
      <a href={project.link_url} className="project-link">
        <div className="project-image">
          <Image src={project.image_url} alt={project.name} width={200} height={100}/>
        </div>
        <div className="project-body">
          <h3 className="project-name">{project.name}</h3>
          <span className="project-description">{project.description}</span>
          {techsList.length !== 0 && (
            <ul>
              {(techsList)}
            </ul>
          )}
        </div>
      </a>
    </li>
  </>;
}