const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const educationCarousel = document.querySelector('.education-carousel');
const educationSlides = [...document.querySelectorAll('[data-education-slide]')];
const educationDots = [...document.querySelectorAll('.education-dot')];
let educationIndex = 0;
let educationTimer;
let educationTouching = false;

if (educationCarousel && educationSlides.length) {
  const showEducationSlide = (nextIndex) => {
    educationIndex = (nextIndex + educationSlides.length) % educationSlides.length;
    educationSlides.forEach((slide, index) => {
      const isActive = index === educationIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    educationDots.forEach((dot, index) => {
      const isActive = index === educationIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const restartEducationTimer = () => {
    window.clearInterval(educationTimer);
    if (!educationTouching && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      educationTimer = window.setInterval(() => showEducationSlide(educationIndex + 1), 5200);
    }
  };

  const pauseEducationTimer = () => window.clearInterval(educationTimer);

  document.querySelector('.education-prev').addEventListener('click', () => { showEducationSlide(educationIndex - 1); restartEducationTimer(); });
  document.querySelector('.education-next').addEventListener('click', () => { showEducationSlide(educationIndex + 1); restartEducationTimer(); });
  educationDots.forEach((dot, index) => dot.addEventListener('click', () => { showEducationSlide(index); restartEducationTimer(); }));
  educationCarousel.addEventListener('mouseenter', pauseEducationTimer);
  educationCarousel.addEventListener('mouseleave', restartEducationTimer);
  educationCarousel.addEventListener('focusin', pauseEducationTimer);
  educationCarousel.addEventListener('focusout', restartEducationTimer);
  educationCarousel.addEventListener('touchstart', () => { educationTouching = true; pauseEducationTimer(); }, { passive: true });
  educationCarousel.addEventListener('touchend', () => { educationTouching = false; restartEducationTimer(); }, { passive: true });
  educationCarousel.addEventListener('touchcancel', () => { educationTouching = false; restartEducationTimer(); }, { passive: true });
  showEducationSlide(0);
  restartEducationTimer();
}

const revealItems = [...document.querySelectorAll('.skill-item, .project')];
revealItems.forEach((item, index) => {
  item.classList.add('slide-in-target');
  item.style.setProperty('--slide-delay', `${(index % 4) * 90}ms`);
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#main-nav a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');

    if (targetId === '#contact') {
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', targetId);
        }, 40);
      }
    }
  });
});

document.querySelectorAll('.project-link').forEach((project) => {
  project.addEventListener('click', (event) => {
    const destination = project.getAttribute('href');
    if (destination?.startsWith('#project-')) {
      event.preventDefault();
      const projectName = project.dataset.project;
      window.alert(`${projectName} is ready for your case study link.`);
    }
  });
});
