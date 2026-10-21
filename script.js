document.querySelectorAll('.brand > span').forEach(brandName=>brandName.textContent="Brunda's Academy");
document.querySelectorAll('.brand-mark').forEach(brandMark=>brandMark.alt="Brunda's Academy");
document.querySelector('.footer-bottom > span').textContent="© 2026 Brunda's Academy. All rights reserved.";
const heroCarousel=document.querySelector('.hero-carousel');
if(heroCarousel){
  const bannerSlides=[...heroCarousel.querySelectorAll('.hero-banner-slide')];
  const bannerDots=[...heroCarousel.querySelectorAll('.hero-carousel-dots button')];
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeBanner=0, autoplayTimer;
  const showBanner=index=>{
    activeBanner=(index+bannerSlides.length)%bannerSlides.length;
    bannerSlides.forEach((slide,i)=>{
      const active=i===activeBanner;
      slide.classList.toggle('active',active);
      slide.setAttribute('aria-hidden',String(!active));
    });
    bannerDots.forEach((dot,i)=>{
      const active=i===activeBanner;
      dot.classList.toggle('active',active);
      dot.setAttribute('aria-current',String(active));
    });
  };
  const stopAutoplay=()=>clearInterval(autoplayTimer);
  const startAutoplay=()=>{
    stopAutoplay();
    if(!reducedMotion.matches&&bannerSlides.length>1&&!document.hidden){
      autoplayTimer=setInterval(()=>showBanner(activeBanner+1),5500);
    }
  };
  bannerDots.forEach((dot,i)=>dot.addEventListener('click',()=>{
    showBanner(i);
    startAutoplay();
  }));
  heroCarousel.addEventListener('mouseenter',stopAutoplay);
  heroCarousel.addEventListener('mouseleave',startAutoplay);
  heroCarousel.addEventListener('focusin',stopAutoplay);
  heroCarousel.addEventListener('focusout',event=>{
    if(!heroCarousel.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener('visibilitychange',startAutoplay);
  reducedMotion.addEventListener('change',startAutoplay);
  startAutoplay();
}
const skeletonStartedAt = Date.now();
const minimumSkeletonDuration = 2500;
window.addEventListener('load',()=>{
  const remainingTime = Math.max(0, minimumSkeletonDuration - (Date.now() - skeletonStartedAt));
  setTimeout(()=>{
    document.body.classList.replace('is-loading','is-loaded');
    // openContactPopupOnce();
  }, remainingTime);
});
const contactPopup=document.querySelector('.contact-popup');
const contactPopupStorageKey='brundas-academy-contact-popup-seen';
const closeContactPopup=()=>{
  contactPopup.classList.remove('open');
  contactPopup.setAttribute('aria-hidden','true');
  document.body.classList.remove('contact-popup-open');
  localStorage.setItem(contactPopupStorageKey,'true');
};
const openContactPopup=(interest='')=>{
  if(interest) contactPopup.querySelector('select[name="interest"]').value=interest;
  setTimeout(()=>{
    contactPopup.classList.add('open');
    contactPopup.setAttribute('aria-hidden','false');
    document.body.classList.add('contact-popup-open');
    contactPopup.querySelector('input').focus();
  },600);
};
const openContactPopupOnce=()=>{
  if(!localStorage.getItem(contactPopupStorageKey)) openContactPopup();
};
contactPopup.querySelectorAll('[data-contact-popup-close]').forEach(element=>element.addEventListener('click',closeContactPopup));
const submitContactForm=async form=>{
  const message=form.querySelector('.form-message'),submitButton=form.querySelector('button[type="submit"]');
  if(!window.CONTACT_API_URL){message.textContent='Enquiries are not configured yet. Please contact us directly.';return;}
  submitButton.disabled=true;message.textContent='Sending your enquiry…';
  try{
    const response=await fetch(window.CONTACT_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value,email:form.elements.email.value,phone:form.elements.phone?.value,message:form.elements.message?.value,interest:form.elements.interest.value,website:form.elements.website.value})});
    const body=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(body.error||'We could not send your enquiry.');
    message.textContent='Thanks — your enquiry has been sent. We’ll be in touch shortly.';
    form.reset();localStorage.setItem(contactPopupStorageKey,'true');
  }catch(error){message.textContent=error.message||'We could not send your enquiry. Please try again.';}finally{submitButton.disabled=false;}
};
contactPopup.querySelector('.contact-popup-form').addEventListener('submit',event=>{
  event.preventDefault();
  return submitContactForm(event.currentTarget);
  event.currentTarget.querySelector('.form-message').textContent='Thanks — your enquiry has been sent. We’ll be in touch shortly.';
  event.currentTarget.reset();
  localStorage.setItem(contactPopupStorageKey,'true');
});
document.querySelectorAll('.service-card a').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  openContactPopup('Digital services');
}));
const scrollTopButton=document.querySelector('.scroll-top');
const progress=document.querySelector('.scroll-progress'), navWrap=document.querySelector('.nav-wrap');
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${max?window.scrollY/max:0})`;scrollTopButton.classList.toggle('visible',window.scrollY>500);navWrap.classList.toggle('scrolled',window.scrollY>12)},{passive:true});
scrollTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const courseModal=document.querySelector('.course-modal');
const closeCourseModal=()=>{courseModal.classList.remove('open');courseModal.setAttribute('aria-hidden','true')};
courseModal.querySelectorAll('.modal-close,.modal-close-button,.modal-backdrop,.modal-enquire').forEach(element=>element.addEventListener('click',closeCourseModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCourseModal();if(contactPopup.classList.contains('open'))closeContactPopup()}});
const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
document.querySelectorAll('.nav-drop > button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = btn.parentElement;
    const wasOpen = parent.classList.contains('open');
    document.querySelectorAll('.nav-drop.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) parent.classList.add('open');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-drop')) {
    document.querySelectorAll('.nav-drop.open').forEach(el => el.classList.remove('open'));
  }
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    nav?.classList.remove('open');
    document.querySelectorAll('.nav-drop.open').forEach(el => el.classList.remove('open'));
  });
});

document.querySelectorAll('.course-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.course-tabs button').forEach(tab=>{const selected=tab===button;tab.classList.toggle('selected',selected);tab.setAttribute('aria-selected',selected)});const f=button.dataset.filter;document.querySelectorAll('.course-card').forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'block':'none')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('.contact-form').addEventListener('submit',event=>{
  event.preventDefault();
  submitContactForm(event.currentTarget);
});
