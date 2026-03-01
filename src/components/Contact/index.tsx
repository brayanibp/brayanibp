import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 border-t border-zinc-900 mt-20">
      <h2 className="text-3xl font-bold mb-8 tracking-tight">Contact</h2>
      <p className="text-zinc-400 mb-8 max-w-2xl">
        I am currently open to new opportunities and technical collaborations. 
        Feel free to reach out via email.
      </p>
      <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/30 backdrop-blur-sm transition-all hover:border-blue-500/50 group">
        <p className="text-blue-500 font-medium mb-2">Email</p>
        <a 
          href="mailto:brayanibp@brayanibp.dev" 
          className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors"
        >
          brayanibp@brayanibp.dev
        </a>
      </div>
    </section>
  );
};

export default Contact;
