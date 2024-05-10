import JobCard from "../JobCard";
import Job from "@/models/job_model";
import jobs from "@/data/jobs.json";
import style from "./experience.module.css";

const Experience = () => {
  const jobsList: Job[]  = jobs.jobsList;
  const jobsCards: React.JSX.Element[] = jobsList.map((jobData,index)=>{
    return <JobCard key={index} {...jobData} />;
  });
  return (
    <>
      <section id="experience">
        <h2>Experience</h2>
        <ul className={style["jobs-list"]}>
          {jobsCards}
        </ul>
      </section>
    </>
  );
}

export default Experience;