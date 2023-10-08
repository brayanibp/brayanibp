function sectionsObserver() {
  const elements = document.querySelectorAll('section');
  const options = {
    root: document.querySelector('#Content'),
    thresholds: [0, 0.25, 0.5, 0.75, 1]
  };
  const observer = new IntersectionObserver((entries, observer)=>{
    // console.log(entries);
    entries.forEach((entry)=>{
      console.log(entry.target);
    });
    // section = document.querySelector(`#${identifier}`);
    // section?.addEventListener('onScroll',(event)=>{
    //   const target = event.currentTarget as Element;
    //   if(!isInViewport(target)) return;
    //   const option = document.querySelector(`li[about=${identifier}]`);
    //   const prevOption = document.querySelector('.section.active');
    //   const optionAttribute = option?.attributes.getNamedItem('about');
    //   const prevOptionAttribute = prevOption?.attributes.getNamedItem('about');
    //   if (String(optionAttribute?.value) === String(prevOptionAttribute?.value)) return;
    //   option?.classList.add('active');
    //   prevOption?.classList.remove('active');
    // });
  });
  elements.forEach((element)=>{
    observer.observe(element);
  });
}

// function isInViewport(element: Element): boolean {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top >= 0 
//     && rect.left >= 0 
//     && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 
//     && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// }

export default sectionsObserver;