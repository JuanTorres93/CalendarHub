
import dayjs from "./day.js";

const globalDate = {
    date: null,

    init(){
        const stored = localStorage.getItem("userDate");
        this.date = stored? dayjs(JSON.parse(stored)) : dayjs();
    },
    setDate(newDate) {
        this.date = newDate;
        localStorage.setItem(
        "userDate",
        JSON.stringify(newDate.format("YYYY-MM-DD"))
    );
  }
};


globalDate.init()


export default globalDate

