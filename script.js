const slides = [...document.querySelectorAll('.hero-slide')];
slides.forEach(slide=>slide.querySelector('.hero-visual').insertAdjacentHTML('beforeend','<div class="hero-mobile-benefits" aria-label="Programme benefits"><span>▣ Industry-led</span><span>◌ Hands-on labs</span><span>✓ Career support</span></div>'));
document.querySelectorAll('.brand > span').forEach(brandName=>brandName.textContent="Brunda's Academy");
document.querySelectorAll('.brand-mark').forEach(brandMark=>brandMark.alt="Brunda's Academy");
document.querySelector('.footer-bottom > span').textContent="© 2026 Brunda's Academy. All rights reserved.";
const skeletonStartedAt = Date.now();
const minimumSkeletonDuration = 2500;
window.addEventListener('load',()=>{
  const remainingTime = Math.max(0, minimumSkeletonDuration - (Date.now() - skeletonStartedAt));
  setTimeout(()=>{
    document.body.classList.replace('is-loading','is-loaded');
    openContactPopupOnce();
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
contactPopup.querySelector('.contact-popup-form').addEventListener('submit',event=>{
  event.preventDefault();
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
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(window.innerWidth<=780)return;const rect=hero.getBoundingClientRect();hero.style.setProperty('--hero-x',`${(e.clientX-rect.left-rect.width/2)/55}px`);hero.style.setProperty('--hero-y',`${(e.clientY-rect.top-rect.height/2)/55}px`)});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px')});
const courseModal=document.querySelector('.course-modal');
const closeCourseModal=()=>{courseModal.classList.remove('open');courseModal.setAttribute('aria-hidden','true')};
courseModal.querySelectorAll('.modal-close,.modal-close-button,.modal-backdrop,.modal-enquire').forEach(element=>element.addEventListener('click',closeCourseModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCourseModal();if(contactPopup.classList.contains('open'))closeContactPopup()}});
const dots = [...document.querySelectorAll('.slide-dots button')];
const slideCount = document.querySelector('.slide-count');
let current = 0, timer;
function showSlide(index) { current = (index + slides.length) % slides.length; slides.forEach((s,i)=>s.classList.toggle('active',i===current)); dots.forEach((d,i)=>d.classList.toggle('active',i===current)); slideCount.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`; }
function autoplay(){clearInterval(timer);timer=setInterval(()=>showSlide(current+1),6500)}
document.querySelector('.next').addEventListener('click',()=>{showSlide(current+1);autoplay()});
document.querySelector('.previous').addEventListener('click',()=>{showSlide(current-1);autoplay()});
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);autoplay()})); autoplay();
let touchStartX=0;
document.querySelector('.hero').addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX},{passive:true});
document.querySelector('.hero').addEventListener('touchend',e=>{const distance=e.changedTouches[0].screenX-touchStartX;if(Math.abs(distance)>45){showSlide(current+(distance<0?1:-1));autoplay()}},{passive:true});
const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-links');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav-drop button').forEach(btn=>btn.addEventListener('click',()=>{if(innerWidth<=680) btn.parentElement.classList.toggle('open')}));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.course-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.course-tabs button').forEach(tab=>{const selected=tab===button;tab.classList.toggle('selected',selected);tab.setAttribute('aria-selected',selected)});const f=button.dataset.filter;document.querySelectorAll('.course-card').forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'block':'none')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('.contact-form').addEventListener('submit',e=>{e.preventDefault();e.currentTarget.querySelector('.form-message').textContent='Thanks — your enquiry has been sent. We’ll be in touch shortly.';e.currentTarget.reset()});
