'use strict';

class UIElements {
  constructor() {
    // Modal elements
    this.modal = document.querySelector('.modal');
    this.overlay = document.querySelector('.overlay');
    this.btnCloseModal = document.querySelector('.btn--close-modal');
    this.btnsOpenModal = document.querySelectorAll('.btn--show-modal');

    // Navigation
    this.nav = document.querySelector('.nav');
    this.navLinks = document.querySelector('.nav__links');

    // Sections
    this.header = document.querySelector('.header');
    this.section1 = document.querySelector('#section--1');
    this.section5 = document.querySelector('#section--5');
    this.sections = document.querySelectorAll('.section');

    // Scroll button
    this.btnScrollTo = document.querySelector('.btn--scroll-to');

    // Tabs
    this.tabs = document.querySelectorAll('.operations__tab');
    this.tabsContainer = document.querySelector('.operations__tab-container');
    this.tabsContent = document.querySelectorAll('.operations__content');

    // Slider
    this.slides = document.querySelectorAll('.slide');
    this.slider = document.querySelector('.slider');
    this.btnRight = document.querySelector('.slider__btn--right');
    this.btnLeft = document.querySelector('.slider__btn--left');
    this.dotsContainer = document.querySelector('.dots');
  }
}

class Modal {
  constructor(elements) {
    this.elements = elements;
    this.bindEvents();
  }

  open(e) {
    e.preventDefault();
    this.elements.modal.classList.remove('hidden');
    this.elements.overlay.classList.remove('hidden');
  }

  close() {
    this.elements.modal.classList.add('hidden');
    this.elements.overlay.classList.add('hidden');
  }

  bindEvents() {
    this.elements.btnsOpenModal.forEach(btn =>
      btn.addEventListener('click', this.open.bind(this))
    );
    this.elements.btnCloseModal.addEventListener(
      'click',
      this.close.bind(this)
    );
    this.elements.overlay.addEventListener('click', this.close.bind(this));

    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        !this.elements.modal.classList.contains('hidden')
      ) {
        this.close();
      }
    });
  }
}

class Navigation {
  constructor(elements) {
    this.elements = elements;
    this.bindEvents();
  }

  handleHover(opacity, e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(element => {
        if (element !== link) element.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }
  }

  handleScroll(e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  }

  bindEvents() {
    this.elements.navLinks.addEventListener(
      'click',
      this.handleScroll.bind(this)
    );
    this.elements.nav.addEventListener(
      'mouseover',
      this.handleHover.bind(this, 0.5)
    );
    this.elements.nav.addEventListener(
      'mouseout',
      this.handleHover.bind(this, 1)
    );
  }
}

class TabComponent {
  constructor(elements) {
    this.elements = elements;
    this.bindEvents();
  }

  handleClick(e) {
    e.preventDefault();
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;

    // Active tab
    this.elements.tabs.forEach(t =>
      t.classList.remove('operations__tab--active')
    );
    clicked.classList.add('operations__tab--active');

    // Active content
    this.elements.tabsContent.forEach(c =>
      c.classList.remove('operations__content--active')
    );
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  }

  bindEvents() {
    this.elements.tabsContainer.addEventListener(
      'click',
      this.handleClick.bind(this)
    );
  }
}

class StickyNavigation {
  constructor(elements) {
    this.elements = elements;
    this.navHeight = this.elements.nav.getBoundingClientRect().height;
    this.init();
  }

  handleIntersect(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) this.elements.nav.classList.add('sticky');
    else this.elements.nav.classList.remove('sticky');
  }

  init() {
    const headerObserver = new IntersectionObserver(
      this.handleIntersect.bind(this),
      {
        root: null,
        threshold: 0,
        rootMargin: `-${this.navHeight}px`,
      }
    );
    headerObserver.observe(this.elements.header);
  }
}

class ScrollReveal {
  constructor(elements) {
    this.elements = elements;
    this.init();
  }

  revealSection(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }

  init() {
    const sectionObserver = new IntersectionObserver(this.revealSection, {
      root: null,
      threshold: 0.15,
    });

    this.elements.sections.forEach(section => {
      sectionObserver.observe(section);
      section.classList.add('section--hidden');
    });
  }
}

class LazyImageLoader {
  constructor() {
    this.imgTargets = document.querySelectorAll('img[data-src]');
    this.init();
  }

  loadImg(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }

  init() {
    const imgObserver = new IntersectionObserver(this.loadImg, {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    });

    this.imgTargets.forEach(img => imgObserver.observe(img));
  }
}

class Slider {
  constructor(elements) {
    this.elements = elements;
    this.curSlide = 0;
    this.maxSlide = this.elements.slides.length;
    this.init();
    this.bindEvents();
  }

  createDots() {
    this.elements.slides.forEach((_, i) => {
      this.elements.dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  goToSlide(slide) {
    this.elements.slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }

  nextSlide() {
    if (this.curSlide === this.maxSlide - 1) this.curSlide = 0;
    else this.curSlide++;
    this.goToSlide(this.curSlide);
    this.activateDot(this.curSlide);
  }

  prevSlide() {
    if (this.curSlide === 0) this.curSlide = this.maxSlide - 1;
    else this.curSlide--;
    this.goToSlide(this.curSlide);
    this.activateDot(this.curSlide);
  }

  init() {
    this.goToSlide(0);
    this.createDots();
    this.activateDot(0);
  }

  bindEvents() {
    this.elements.btnRight.addEventListener('click', this.nextSlide.bind(this));
    this.elements.btnLeft.addEventListener('click', this.prevSlide.bind(this));

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    this.elements.dotsContainer.addEventListener('click', e => {
      if (e.target.classList.contains('dots__dot')) {
        const slide = e.target.dataset.slide;
        this.goToSlide(slide);
        this.curSlide = Number(slide);
        this.activateDot(this.curSlide);
      }
    });
  }
}

class ProductService {
  static async fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }
}

class ProductDisplay {
  constructor(container) {
    this.container = container;
    this.init();
  }

  async init() {
    try {
      const products = await ProductService.fetchProducts();
      this.render(products);
    } catch (error) {
      this.renderError();
    }
  }

  render(products) {
    const markup = products
      .map(product => this.createProductMarkup(product))
      .join('');

    this.container
      .querySelector('.features')
      .insertAdjacentHTML('beforeend', markup);
  }

  createProductMarkup(product) {
    return `
      <a href="#"> 
        <div class="features__feature card">
          <div class="features__icon">
            <img src="${product.image}" alt="${
      product.title
    }" class="features__img" />
          </div>
          <h5 class="features__header">${product.title}</h5>
          <p class="features__price">$${product.price.toFixed(2)}</p>
        </div>
      </a>
    `;
  }

  renderError() {
    this.container
      .querySelector('.features')
      .insertAdjacentHTML(
        'beforeend',
        `<p class="error">Could not load products. Please try again later.</p>`
      );
  }
}

// Initialize the application
const init = function () {
  const elements = new UIElements();

  new Modal(elements);
  new Navigation(elements);
  new TabComponent(elements);
  new StickyNavigation(elements);
  new ScrollReveal(elements);
  new LazyImageLoader();
  new Slider(elements);
  new ProductDisplay(elements.section5);

  // Scroll button functionality
  elements.btnScrollTo.addEventListener('click', () => {
    elements.section1.scrollIntoView({ behavior: 'smooth' });
  });
};

init();
