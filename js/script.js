import ScrollSuave from "./modules/scroll-suave.js";
import Accordion from "./modules/accordion.js";
import TabNav from "./modules/tabnav.js";
import Modal from "./modules/modal.js";
import Tooltip from "./modules/tooltip.js";
import DropdownMenu from "./modules/dropdown-menu.js";
import MenuMobile from "./modules/menu-mobile.js";
import Funcionamento from "./modules/funcionamento.js";
import fetchAnimais from "./modules/fetch-animais.js";
import fetchBitcoin from "./modules/fetch-bitcoin.js";
import ScrollAnima from "./modules/scroll-animacao.js";
import { SlideNav } from "./modules/slide.js";

const scrollSuave = new ScrollSuave('[data-menu="suave"] a[href^="#"]');
scrollSuave.init();

const listAccordion = new Accordion('[data-anime="accordion"] dt');
listAccordion.init();

const menuTabNav = new TabNav(
  '[data-tab="menu"] li',
  '[data-tab="content"] section'
);
menuTabNav.init();

const modal = new Modal(
  '[data-modal="abrir"]',
  '[data-modal="fechar"]',
  '[data-modal="container"]'
);
modal.init();

const tooltip = new Tooltip("[data-tooltip]");
tooltip.init();

const scrollAnimacao = new ScrollAnima('[data-anime="scroll"]');
scrollAnimacao.init();

const dropdownMenus = new DropdownMenu("[data-dropdown]");
dropdownMenus.init();

const menuMobile = new MenuMobile('[data-menu="button"]', '[data-menu="list"]');
menuMobile.init();

const horarioFuncionamento = new Funcionamento("[data-semana]");
horarioFuncionamento.init();

fetchAnimais("animaisapi.json", ".numeros-grid");

fetchBitcoin("https://blockchain.info/ticker", ".btc-preco");

const slide = new SlideNav(".slide-wrapper", ".slide");
slide.init().addArrow(".prev", ".next");

slide.addControl(".custom-constrols");
