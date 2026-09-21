import dayjs from "../../day.js";

function renderYears(listClass, itemClass, currentYear, currentYearClass) {
  const carousel = document.querySelector(listClass);
  const yearList = Array.from({ length: 201 }, (_, i) => {
    const years = dayjs().year() + i;
    const startYear = years - 100;
    return startYear;
  });
  yearList.forEach((year) => {
    const el = document.createElement("div");
    el.className = itemClass;
    el.setAttribute("data-testid", `mini-year-item-${year}`);
    el.textContent = year;

    if (year === currentYear) {
      el.classList.add(currentYearClass);
    }

    carousel.appendChild(el);
  });
  return yearList;
}
export default renderYears;
