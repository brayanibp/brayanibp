function mouseOver(identifier: string) {
  const section = document.querySelector(`#${identifier}`);
  section?.addEventListener('mouseover',(event)=>{
    const target = event.currentTarget as Element;
    if(!isInViewport(target)) return;
    const option = document.querySelector(`li[about=${identifier}]`);
    const prevOption = document.querySelector('.section.active');
    const optionAttribute = option?.attributes.getNamedItem('about');
    const prevOptionAttribute = prevOption?.attributes.getNamedItem('about');
    if (String(optionAttribute?.value) === String(prevOptionAttribute?.value)) return;
    option?.classList.add('active');
    prevOption?.classList.remove('active');
  });
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  console.log(rect.top);
  return false;
}

export default mouseOver;