
import Project from "@/models/projects_model";
import Image from "next/image";
import { useEffect, useState } from "react";
import style from "./project-card.module.css";

export default function ProjectCard(project: Project) {
  const [imageSize, setImageSize] = useState({
    height: 125,
    width: 250
  });
  const techsList = project.techs?.map((tech, index)=> {
    return <li key={index} className={style["project-tech"]}>{tech}</li>;
  }) || [];
  const resolveImage = () => {
    if (window.innerWidth < 426) {
      setImageSize({
        width:410,
        height:205
      });
      return;
    }
    setImageSize({
      width: 250, 
      height:125
    });
    return;
  }
  useEffect(()=>{
    window.addEventListener('load',resolveImage);
    window.addEventListener('resize',resolveImage);
  },[]);
  return <>
    <li key={project.name} className={style["project-card"]}>
      <a target="_blank" href={project.link_url} className={style["project-link"]}>
        <h3 className={style["project-name"]}>{project.name}</h3>
        <div className={style["project-image"]}>
          <Image src={encodeURI(project.image_url)} alt={project.name} width={imageSize.width} height={imageSize.height}/>
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