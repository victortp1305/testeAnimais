import outsideClick from "./outsideclick.js";

export default class DropdownMenu {
  constructor(dropdownMenus, events) {
    this.dropdownMenus = document.querySelectorAll(dropdownMenus);
    if (events === undefined) this.events = ["touckstart", "click"];
    else this.events = events;
    this.activeClass = "active";
    this.activeDropdownMenu = this.activeDropdownMenu.bind(this);
  }

  addDropdownEvent() {
    this.dropdownMenus.forEach((menu) => {
      this.events.forEach((userEvent) => {
        menu.addEventListener(userEvent, this.activeDropdownMenu);
      });
    });
  }

  activeDropdownMenu(event) {
    event.preventDefault();
    const element = event.currentTarget;
    element.classList.add(this.activeClass);
    outsideClick(element, this.events, () => {
      element.classList.remove(this.activeClass);
    });
  }

  init() {
    if (this.dropdownMenus.length) {
      this.addDropdownEvent();
    }
    return this;
  }
}
