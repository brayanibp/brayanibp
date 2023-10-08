import React, { useEffect } from "react";
import jobs from '@/data/jobs.json';
import JobCard from "../job_card";
import Job from "@/models/job_model";

export default function Experience() {
  const jobsList: Job[]  = jobs.jobsList;
  const jobsCards: React.JSX.Element[] = jobsList.map((jobData,index)=>{
    return <JobCard key={index} {...jobData} />;
  });
  return <section id="Experience">
    <h2>Experience</h2>
    <ul className="jobs-list">
      {jobsCards}
    </ul>
  </section>;
}