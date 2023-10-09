function sectionsObserver() {
  const elements = document.querySelectorAll('h2');
  const observer = new IntersectionObserver((entries, observer)=>{
    entries.forEach((entry)=>{
      if (!entry.isIntersecting) return;
      const section = entry.target.parentElement;
      const identifier = section?.id;
      const option = document.querySelector(`li[about=${identifier}]`);
      const prevOption = document.querySelector('.section.active');
      if (option?.attributes.getNamedItem('about')?.value === prevOption?.attributes.getNamedItem('about')?.value) return;
      const optionAttribute = option?.attributes.getNamedItem('about');
      const prevOptionAttribute = prevOption?.attributes.getNamedItem('about');
      if (String(optionAttribute?.value) === String(prevOptionAttribute?.value)) return;
      option?.classList.add('active');
      prevOption?.classList.remove('active');
    });
  });
  elements.forEach((element)=>{
    observer.observe(element);
  });
  return observer;
}

export default sectionsObserver;