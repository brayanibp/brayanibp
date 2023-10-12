import Job from "@/models/job_model";

export default function JobCard(jobProps: Job): React.JSX.Element {
  const achievementsList: React.JSX.Element[] = jobProps.achievements.map((achievement, index)=>{
    return <li key={index+achievement}>{achievement}</li>;
  });
  const techsList: React.JSX.Element[] = jobProps.techs.map((tech, index)=>{
    return <li className="tech" key={index+tech}>{tech}</li>;
  });
  return <>
    <li key={jobProps.title} className="job-card">
      <a href={jobProps.url} target="_blank" rel="noopener noreferrer">
        <span className="timeline">{jobProps.timeline}</span>
        <div className="container">
          <h3 className="company">{jobProps.company}</h3>
          <span className="title">{jobProps.title}</span>
          <ul className="achievements">
            {achievementsList}
          </ul>
          <ul className="techs-list">
            {techsList}
          </ul>      
        </div>
      </a>
    </li>
  </>;
}