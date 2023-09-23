import Image from 'next/image';
export default function About() {
  return <section id="About">
    {/* <figure className="logo">
      <Image src="assets/icons/BrayanIBP Really Black Logo Transparent bg.svg" alt="BrayanIBP Logo" height={300} width={390}/>
    </figure> */}
    <h2>About Me</h2>
    <p className='about_me'>
      I am passionate about <b>technology, 
      software development and education</b>. 
      I remain on a constant quest for knowledge 
      that I can apply in my day to day life.
      <b> My goal is to improve performance and deliver 
      solutions that make a difference</b>. 
      <br />
      <br />
      I am a Full-Stack Developer with +5 years 
      of experience with <b>Node.js, React.js | Angular, Redux, 
       RxJS, MySQL, GCP and Firebase</b>. 
        I have worked in health insurance companies, 
        software development companies and emerging startups, 
        but also have a <b>B2 English level</b>.
      <br />
      I’ve also used <b>kanban, waterfall, 
      and other</b> agile methodologies.
      <br />
      <br />
      I am excited to keep learning, share what I know with my team, find solutions to work challenges and be part of a collaborative culture. I am interested in specialising in Back End technologies.
    </p>
    {/* <figure>
      <span></span>
      <Image className='' src="/assets/images/Brayan_Bernal_Short_Photo.jpg" alt="Brayan Bernal" width={400} height={400} />
    </figure> */}
  </section>;
}