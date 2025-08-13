import { memo } from 'react';
import Job from "@/models/job_model";
import style from "./job-card.module.css";

const JobCard = memo(function JobCard(jobProps: Job): React.JSX.Element {
  const achievementsList: React.JSX.Element[] = jobProps.achievements.map((achievement, index)=>{
    return <li key={index+achievement}>{achievement}</li>;
  });
  const techsList: React.JSX.Element[] = jobProps.techs.map((tech, index)=>{
    return <li className={style["tech"]} key={index+tech}>{tech}</li>;
  });
  return <>
    <li key={jobProps.title+jobProps.company+jobProps.timeline} className={style["job-card"]}>
      <a href={jobProps.url} target="_blank" rel="noopener noreferrer" aria-label={`${jobProps.title} at ${jobProps.company}`}>
        <span className={style["timeline"]}>{jobProps.timeline}</span>
        <div className={style["container"]}>
          <h3 className="title">{jobProps.title}</h3>
          <h4 className="company" aria-label="Company">{jobProps.company}</h4>
          <ul className={style["achievements"]}>
            {achievementsList}
          </ul>
          <ul className={style["techs-list"]}>
            {techsList}
          </ul>      
        </div>
      </a>
    </li>
  </>;
});

export default JobCard;