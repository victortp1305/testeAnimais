import debounce from "./debounce";

export class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = {
      // posição final apos o mouseup
      finalPosition: 0,
      // posição X do mouse no clique inicial
      startX: 0,
      // o quanto eu movi a partir do inicio do evento ate o final (mousemove entre o mousedown até o mouseup)
      movement: 0,
    };
    this.activeClass = "active";

    this.changeEvent = new Event("changeEvent");
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX) {
    this.dist.movedPosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatPosition(clientX) {
    // 1.6 serve pra acelerar os movimento
    this.dist.movement = (this.dist.startX - clientX) * 1.6;

    // finalPosition guarda o valor de retorno (this.dist.movedPosition) na funçaõ onEnd
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.wrapper.addEventListener(movetype, this.onMove);

    // evita a transição no inicio e durante o movimento
    this.transition(false);
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatPosition(pointerPosition);
    this.moveSlide(finalPosition);
  }
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movedPosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    // this.dist.movement = o quanto eu movi a partir do inicio do evento ate o final (mousemove entre o mousedown até o mouseup)
    // se eu mexi o mouse pra esquerda 120 pixel ele ativa o NextSlide que vai para o proximo Slide. (MESMO COM O CONTRARIO PrevSlide) e caso exista next ou prev, ele volta ao centro do item ativo
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  // Slides config
  //calcula pra colocar o elemento ao centro
  // o tamanho total do wrapper menos o tamanho total do item, faz com que sobre apenas a margin de diferenta do item para tela total, e dividir por dois faz com que de pra passar o valor de uma das duas margins (margin-left ou margin-right)
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    //valor da posição do inicio do elemento - a margin
    // valor negativo pois no translate para se mover para esquerda tem que ser negativo
    //(slide.offsetLeft - margin) pois o - margin fará com que ele puxe menos pra esquerda o elemento deixando assim uma margin a esquerda do elemento
    return -(slide.offsetLeft - margin);
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      // position que centraliza o slide referente
      const position = this.slidePosition(element);
      return {
        element,
        position,
      };
    });
  }

  slidesIndexNav(index) {
    // Alem de ver qual é o ultimo item da array, verifica também quantos itens tem
    const last = this.slideArray.length - 1;
    // pra verificar os index do slide anterior ao selecionado(active) e ao slide proximo
    this.index = {
      // feito assim pois caso o primeiro item esteja ativo, seu index sera [0] fazendo assim com que o resultado seja false, pois 0 é false. Sendo assim o item anterior não existe
      prev: index ? index - 1 : undefined,
      active: index,
      // se acaso o index for o ultimo, o next sera dado como undefined, caso o contrario o next é 1 index acima
      next: index === last ? undefined : index + 1,
    };
  }

  // escolhe o position centralizado do slide de acordo com seu index
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    // Centraliza de fato o slide ativo
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    // atualize também a posição final
    this.dist.finalPosition = activeSlide.position;
    // ativar a classe ativo
    this.changeActiveClass();

    //
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.slideArray.forEach((object) => {
      object.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      // atualiza o position
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 100);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
  }

  init() {
    if (this.wrapper && this.slide) {
      this.transition(true);
      this.bindEvents();
      this.addSlideEvents();
      this.slideConfig();
      this.changeSlide(0);
      this.addResizeEvent();
    }
    return this;
  }
}

export class SlideNav extends Slide {
  // Só precisei colocar esse constructor pra ativar os binds dessa nova class :)
  constructor(slide, wrapper) {
    // pra puxar o constructor da classe extendida
    super(slide, wrapper);
    this.bindControlEvents();
  }
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArroWEvent();

    this.arrowDisabled();

    this.wrapper.addEventListener("changeEvent", this.arrowDisabled);
  }

  arrowDisabled() {
    if (this.index.prev === undefined) {
      this.prevElement.setAttribute("disabled", "");
      this.nextElement.removeAttribute("disabled");
    } else if (this.index.next === undefined) {
      this.nextElement.setAttribute("disabled", "");
      this.prevElement.removeAttribute("disabled");
    } else {
      this.nextElement.removeAttribute("disabled");
      this.prevElement.removeAttribute("disabled");
    }
  }

  addArroWEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement("ul");
    // cria a quantidade certa e na ordem de li de acordo com os slides
    this.slideArray.forEach((slide, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</li>`;
    });
    control.dataset.control = "slide";
    this.wrapper.appendChild(control);
    return control;
  }
  // Evento que será usado de callback para um forEach
  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      // muda o slide para o index respectivo
      this.changeSlide(index);
      // Ativa a classe active para de acordo com slide ativo respectivo
      //this.activeControlItem();  não é mais necessário pois a mudança é escutada quando executa o changeSlide ("changeEvent")
    });

    // após isso ser executado ele vai escutar essa mudança no changeSlide (ou seja, cada vez que o slide mudar vai ativar esse evento)
    this.wrapper.addEventListener("changeEvent", this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((item) => {
      item.classList.remove(this.activeClass);
    });
    // acidionar classe ativo ao item repectivo ao slide ativo
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    // desestruturar a lista, jogando cada item da lista dentro de uma array
    this.controlArray = [...this.control.children];
    // ele replica a função eventControl sem a necessidade de criar o callback do zero
    this.controlArray.forEach(this.eventControl);
    // Ativa de cara a funcionalidade que marca como ativo a li respectiva ao slide ativo
    this.activeControlItem();
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
    this.arrowDisabled = this.arrowDisabled.bind(this);
  }
}
