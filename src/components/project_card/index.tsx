import Project from "@/models/projects_model";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProjectCard(project: Project) {
  const [imageSize, setImageSize] = useState({
    height: 100,
    width: 200
  });
  const techsList = project.techs?.map((tech, index)=> {
    return <li key={index} className="project-tech">{tech}</li>;
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
      width: 200, 
      height:100
    });
    return;
  }
  useEffect(()=>{
    window.addEventListener('load',resolveImage);
    window.addEventListener('resize',resolveImage);
  },[]);
  return <>
    <li key={project.name} className="project-card">
      <a target="_blank" href={project.link_url} className="project-link">
        <div className="project-image">
          <Image src={project.image_url} alt={project.name} width={imageSize.width} height={imageSize.height}/>
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