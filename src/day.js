import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import dayOfYear from "dayjs/plugin/dayOfYear";
import localeData from "dayjs/plugin/localeData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import "dayjs/locale/it-ch";

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(dayOfYear);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);

dayjs.locale("it-ch");

export default dayjs;
