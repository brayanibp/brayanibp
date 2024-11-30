import Project from "@/models/projects_model";
import Image from "next/image";
import style from "./project-card.module.css";

export default function ProjectCard(project: Project) {
  const techsList = project.techs?.map((tech, index)=> {
    return <li key={index} className={style["project-tech"]}>{tech}</li>;
  }) || [];
  return <>
    <li key={project.name} className={style["project-card"]}>
      <a target="_blank" href={project.link_url} className={style["project-link"]}>
        <h3 className={style["project-name"]}>{project.name}</h3>
        <div className={style["project-image"]}>
          <Image 
            src={encodeURI(project.image_url)} 
            alt={project.name} 
            width={250} 
            height={125}
            loading="lazy"
            quality={75}
          />
        </div>
        <div className={style["project-body"]}>
          <span className={style["project-description"]}>{project.description}</span>
          {techsList.length !== 0 && (
            <ul className={style["techs-list"]}>
              {(techsList)}
            </ul>
          )}
        </div>
      </a>
    </li>
  </>;
}