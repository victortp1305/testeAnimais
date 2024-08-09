import debounce from "./debounce.js";
export default class ScrollAnima {
  constructor(sections) {
    this.sections = document.querySelectorAll(sections);
    this.activeClass = "ativo";
    this.windowMetade = window.innerHeight * 0.6;

    this.getDistance = this.getDistance.bind(this);

    // Faz com que a função aplique o debounce
    this.checarDistancia = debounce(this.checarDistancia.bind(this), 50);
  }

  getDistance() {
    this.distance = [...this.sections].map((section) => {
      const offset = section.offsetTop;
      return {
        element: section,
        offset: Math.floor(offset - this.windowMetade),
      };
    });
  }

  checarDistancia() {
    this.distance.forEach((section) => {
      if (window.scrollY > section.offset) {
        section.element.classList.add(this.activeClass);
      } else if (section.element.classList.contains(this.activeClass)) {
        section.element.classList.remove(this.activeClass);
      }
    });
  }

  animaScroll() {
    this.sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const isSectionVisible = sectionTop - this.windowMetade < 0;
      if (isSectionVisible) section.classList.add(this.activeClass);
      else if (section.classList.contains(this.activeClass)) {
        section.classList.remove(this.activeClass);
      }
    });
  }

  init() {
    if (this.sections.length) {
      this.getDistance();
      this.checarDistancia();
      window.addEventListener("scroll", this.checarDistancia);
    }
    return this;
  }

  stop() {
    window.removeEventListener("scroll", this.checarDistancia);
  }
}
