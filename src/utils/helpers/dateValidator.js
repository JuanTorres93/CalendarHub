import dayjs from "../../day.js";
function dateValidator(initialDate, repeatDate) {
  const todayEvent = dayjs(initialDate);
  const isBefore = todayEvent.isBefore(dayjs(repeatDate)); //ritorna booleano
  if (isBefore) {
    return false;
  }
  return true;
}

export default dateValidator;
