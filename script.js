import 'regenerator-runtime/runtime';
import 'core-js/stable';

('use strict');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
   e.preventDefault();
   modal.classList.remove('hidden');
   overlay.classList.remove('hidden');
};

const closeModal = function () {
   modal.classList.add('hidden');
   overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
   }
});

btnScrollTo.addEventListener('click', function (e) {
   const s1coords = section1.getBoundingClientRect();

   //Scrolling
   // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

   // window.scrollTo({
   //    left: s1coords.left + window.pageXOffset,
   //    top: s1coords.top + window.pageYOffset,
   //    behavior: 'smooth',
   // })

   section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el) {
//    el.addEventListener('click', function(e) {
//       e.preventDefault();
//       const id = this.getAttribute('href');
//       document.querySelector(`${id}`).scrollIntoView({behavior: 'smooth' });

//    })
// })

// Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
   e.preventDefault();

   // Matching strategy
   if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
   }
});

document
   .querySelector('.operations__tab-container')
   .addEventListener('click', function (e) {
      e.preventDefault();
      // Guard clause
      if (!e.target.closest('.operations__tab')) return;

      const data = e.target
         .closest('.operations__tab')
         .getAttribute('data-tab');

      document
         .querySelectorAll('.operations__content')
         .forEach((e) => e.classList.remove('operations__content--active'));
      document
         .querySelectorAll('.operations__tab')
         .forEach((e) => e.classList.remove('operations__tab--active'));

      document
         .querySelector(`.operations__content--${data}`)
         .classList.add('operations__content--active');
      document
         .querySelector(`.operations__tab--${data}`)
         .classList.add('operations__tab--active');
   });

// Menu fade animation
const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', function (e) {
   if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
      siblings.forEach((e) => {
         if (e !== link) e.style.opacity = 0.5;
      });
      logo.style.opacity = 0.5;
   }
});

nav.addEventListener('mouseout', function (e) {
   if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
      siblings.forEach((e) => {
         e.style.opacity = 1;
      });
      logo.style.opacity = 1;
   }
});

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//    if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
//    else nav.classList.remove('sticky');
// })

// Sticky navigation - Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
   const [entry] = entries;

   if (!entry.isIntersecting) nav.classList.add('sticky');
   else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
   root: null,
   threshold: 0,
   rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
   const [entry] = entries;

   if (!entry.isIntersecting) return;

   entry.target.classList.remove('section--hidden');
   observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
   root: null,
   threshold: 0.15,
});

allSections.forEach(function (section) {
   sectionObserver.observe(section);
   section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
   const [entry] = entries;

   if (!entry.isIntersecting) return;

   // Replace src with data-src
   entry.target.src = entry.target.dataset.src;

   // Remove blurr effect when good resolution image is fully loaded
   entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
   });

   observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
   root: null,
   threshold: 0,
   rootMargin: '200px',
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const maxSlide = slides.length;
let curSlide = 0;

const createDots = function () {
   slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
         'beforeend',
         `<button class="dots__dot" data-slide="${i}"></button>`
      );
   });
};
createDots();

const activateDot = function (slide) {
   const allDots = document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));

   document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
};
activateDot(0);

slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

const goToSlide = function (slide) {
   slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
   );
};
goToSlide(0);

// Next slide
const nextSlide = function () {
   if (curSlide === maxSlide - 1) {
      curSlide = 0;
   } else {
      curSlide++;
   }
   goToSlide(curSlide);
   activateDot(curSlide);
};

const prevSlide = function () {
   if (curSlide === 0) {
      curSlide = maxSlide - 1;
   } else {
      curSlide--;
   }
   goToSlide(curSlide);
   activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Navigating slider with keys
document.addEventListener('keydown', function (e) {
   if (e.key === 'ArrowLeft') prevSlide();
   if (e.key === 'ArrowRight') nextSlide();
});

// Dots
dotContainer.addEventListener('click', function (e) {
   if (e.target.classList.contains('dots__dot')) {
      console.log(e.target);
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
   }
});

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

// const randomInt = (min, max) => Math.floor(Math.random() * (min - max + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//    this.style.backgroundColor = randomColor();
// })

// const h1 = document.querySelector('h1');
// console.log(h1.closest('.header'));
