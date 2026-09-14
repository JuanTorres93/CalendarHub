import dayjs from "../../day.js";
import createElement from "./createElement.js";

function renderYears(listClass, itemClass, currentYear, currentYearClass){
    const carousel = document.querySelector(listClass)
        const yearList = Array.from({length: 201}, (_, i) => {
            const years = dayjs().year() + i
            const startYear = years - 100
            return startYear
        })
        yearList.forEach((year)=>{
          
            const el = createElement(
                carousel,
                    itemClass,
                    year,
                    "div",
                    { attributes: { "data-testid": `mini-year-item-${year}` } }
            )
            if(year === currentYear){
                el.classList.add(currentYearClass)
            }
        })
        return yearList
}
export default renderYears