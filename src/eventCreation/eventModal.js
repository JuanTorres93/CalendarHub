import getFloatingPosition from "../utils/helpers/floatingPositioner.js";
import {
  modalEvents,
  modalOverlay,
} from "../utils/helpers/dom/eventModalDom.js";

function openModal(e) {
  const rect = e.target.getBoundingClientRect();
  modalOverlay.classList.add("show-overlay");
  modalEvents.classList.add("show-container");
  const isDailyview = e.target.closest(".day-box, .day-half-box");
  getFloatingPosition(modalEvents, rect, isDailyview);
}

export default openModal;
