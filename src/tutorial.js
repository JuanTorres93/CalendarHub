import { tutorialSlides } from "./utils/data/tutorialData.js";

const TUTORIAL_KEY = "calendar_tutorial_seen";
let currentSlide = 0;
let tutorialOverlay = null;

function createTutorialOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("tutorial-overlay");

  overlay.innerHTML = `
    <article
     class="tutorial-modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="tutorial-title"
     >
      <button
       type="button"
        class="tutorial-close"
         aria-label="Chiudi tutorial"
         >×</button>
      <div class="tutorial-container">
        <nav class="tutorial-navigation" aria-label="Sezioni tutorial">
        
        </nav>
        <section class="main-tutorial" aria-labelledby="tutorial-title">
          <div class="tutorial-content">
            <div class="tutorial-image-wrapper">
              <img class="tutorial-image" src="" alt="tutorial slide">
            </div>

            <div class="tutorial-text">
              <h2 id="tutorial-title" class="tutorial-title"></h2>
              <p class="tutorial-description"></p>
            </div>

          </div>
          <div class="tutorial-actions">
            <button type="button" class="tutorial-prev">Indietro</button>
            <button type="button" class="tutorial-next">Avanti</button>
          </div>
        </section>
      </div>
    </article>
    `;
  document.body.appendChild(overlay);
  tutorialOverlay = overlay;

  overlay
    .querySelector(".tutorial-close")
    .addEventListener("click", finishTutorial);
  overlay.querySelector(".tutorial-prev").addEventListener("click", prevSlide);
  overlay.querySelector(".tutorial-next").addEventListener("click", nextSlide);
  overlay
    .querySelector(".tutorial-navigation")
    .addEventListener("click", goToChapter);
}
function renderNavTutorial() {
  const nav = document.querySelector(".tutorial-navigation");
  nav.innerHTML = "";
  const getChapters = Array.from(
    new Set(tutorialSlides.map((item) => item.chapter)),
  );
  getChapters.forEach((chapter) => {
    const chapterBtn = document.createElement("button");
    chapterBtn.className = "tutorial-navigation-btns";
    chapterBtn.type = "button";
    chapterBtn.dataset.chapter = chapter;
    chapterBtn.textContent = chapter;

    nav.appendChild(chapterBtn);
  });
}

function renderTutorial(index) {
  const slide = tutorialSlides[index];
  if (!slide || !tutorialOverlay) return;

  tutorialOverlay.querySelector(".tutorial-image").src = slide.image;
  tutorialOverlay.querySelector(".tutorial-title").innerText = slide.title;
  tutorialOverlay.querySelector(".tutorial-description").innerText = slide.text;

  const prevBtn = tutorialOverlay.querySelector(".tutorial-prev");
  const nextBtn = tutorialOverlay.querySelector(".tutorial-next");

  prevBtn.disabled = index === 0;
  nextBtn.innerText = index === tutorialSlides.length - 1 ? "Fine" : "Avanti";
}

export function openTutorial() {
  currentSlide = 0;
  if (!tutorialOverlay) {
    createTutorialOverlay();
  }
  tutorialOverlay.classList.add("show");
  renderTutorial(currentSlide);
  renderNavTutorial();
  highLightCurrentChapter();
}
function nextSlide() {
  if (currentSlide >= tutorialSlides.length - 1) {
    finishTutorial();
    return;
  }
  currentSlide++;
  renderTutorial(currentSlide);
  highLightCurrentChapter();
}

function prevSlide() {
  if (currentSlide === 0) return;
  currentSlide--;
  renderTutorial(currentSlide);
  highLightCurrentChapter();
}

function closeTutorial() {
  if (!tutorialOverlay) return;
  tutorialOverlay.classList.remove("show");
}
function goToChapter(e) {
  const btn = e.target.closest(".tutorial-navigation-btns");
  if (btn) {
    const currentChapter = tutorialSlides.findIndex(
      (item) => item.chapter === btn.dataset.chapter,
    );
    if (currentChapter === -1) return;
    currentSlide = currentChapter;
    renderTutorial(currentSlide);
    highLightCurrentChapter();
  }
}
function highLightCurrentChapter() {
  const btns = tutorialOverlay.querySelectorAll(".tutorial-navigation-btns");
  const current = tutorialSlides[currentSlide];
  btns.forEach((btn) => {
    if (btn.classList.contains("active-chapter")) {
      btn.classList.remove("active-chapter");
      btn.removeAttribute("aria-current");
    }
    if (btn.dataset.chapter === current.chapter) {
      btn.classList.add("active-chapter");
      btn.setAttribute("aria-current", "true");
    }
  });
}

function finishTutorial() {
  localStorage.setItem(TUTORIAL_KEY, "true");
  closeTutorial();
}

export function resetTutorial() {
  localStorage.removeItem(TUTORIAL_KEY);
  openTutorial();
}

export function initTutorial() {
  const hasSeentutorial = localStorage.getItem(TUTORIAL_KEY);
  if (!hasSeentutorial) {
    openTutorial();
  }
}
