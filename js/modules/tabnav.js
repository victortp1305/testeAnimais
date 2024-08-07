export default class TabNav {
  constructor(menu, content) {
    this.tabMenu = document.querySelectorAll(menu);
    this.tabContent = document.querySelectorAll(content);
  }

  activeTab(index) {
    this.tabContent.forEach((section) => {
      section.classList.remove("ativo");
    });
    const direcao = this.tabContent[index].dataset.anime;
    this.tabContent[index].classList.add("ativo", direcao);
  }

  addMenuEvent() {
    this.tabMenu.forEach((itemMenu, index) => {
      itemMenu.addEventListener("click", () => {
        this.activeTab(index);
      });
    });
  }

  init() {
    if (this.tabMenu.length && this.tabContent.length) {
      this.tabContent[0].classList.add("ativo");
      this.addMenuEvent();
    }
  }
}
