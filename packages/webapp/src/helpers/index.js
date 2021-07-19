import { DateTime } from "luxon";
import _ from "lodash";
// import { v4 as uuid } from "uuid";

/**
 * Creates array range from certain number to limit.
 * @param {number} from
 * @param {number} to
 * @return {array}
 */
export function createRange(from, to) {
  if (to <= from) return [];
  return Array(to + 1 - from)
    .fill(0)
    .map((_, idx) => from + idx);
}

export const parseTime = (arg) => {
  if (typeof arg === "string") {
    const str = arg;
    if (!str) return null;
    const [hour, minute] = str.split(":").map(parseFloat);
    if ((hour && minute) || minute === 0)
      return {
        hour,
        minute,
      };
  }
  if (typeof arg === "object") {
    if (!arg.hour) return null;
    if (!arg.minute && arg.minute !== 0) return null;
    arg.hour = parseFloat(arg.hour);
    arg.minute = parseFloat(arg.minute);
    if (isNaN(arg.hour) || isNaN(arg.minute)) return null;
    return `${arg.hour}:${arg.minute / 10 < 1 ? `0${arg.minute}` : arg.minute}`;
  }
};

export const parseTimeRange = (timeRange) => {
  const [start, end] = timeRange.split("-");
  return { start: parseTime(start), end: parseTime(end) };
};

// FORMAT SHOULD BE "15-07-2021"
export const parseDate = (str) => {
  if (!str) return null;
  let dateArray = str.split("-");
  if (dateArray.length !== 3) return null;
  if (
    !(
      dateArray[0].length === 2 &&
      dateArray[1].length === 2 &&
      dateArray[2].length === 4
    )
  )
    return null;
  dateArray = dateArray.map(parseFloat);
  if (dateArray.filter(Boolean).length < 3) return null;
  return DateTime.fromObject({
    day: dateArray[0],
    month: dateArray[1],
    year: dateArray[2],
  });
};

export const makeEntry = (time, date) => ({ time, date, counter: 0 });

export const generateEntries = (
  existingEntries,
  date,
  rangeState,
  bookingMaxPerEntry
) => {
  const times = existingEntries.filter((e) => e.date === date).map(_.cloneDeep);
  const range = _.cloneDeep(rangeState);
  const from = parseTime(range.dayStartsAt);
  const to = parseTime(range.dayEndsAt);
  const unavailableTimes = range.unavailableTimes.map((t) => parseTimeRange(t));
  /**
   * Checks if time is not in unavailable times range
   * @param {string} time
   */
  const checkIfAvailable = (time) => {
    const timep = parseTime(time);
    let flag = 0;
    unavailableTimes.forEach((timeu) => {
      flag += (
        timep.hour >= timeu.start.hour
        && timep.hour < timeu.end.hour
      );
    });
    return !flag;
  };

  range.from = from;
  range.to = to;
  range.interval = range.minuteInterval;

  const arlen = Math.floor(
    ((range.to.hour - range.from.hour) * 60) / range.interval
  );
  const res = [];
  for (let i = 0; i < arlen; i++) {
    const time = parseTime(range.from);
    if (range.from.minute + range.interval === 60) {
      range.from.minute = 0;
      range.from.hour += 1;
    } else {
      range.from.minute += range.interval;
    }
    if (!checkIfAvailable(time)) continue;
    const existingEntry = times.find((e) => e.time === time);
    if (!existingEntry) res.push(makeEntry(time, date));
    else if (existingEntry.counter < bookingMaxPerEntry)
      res.push(existingEntry);
  }
  return res;
};

export const initializeEntries = (state) => {
  const gened = [];
  for (let i = state.availableDayFrom; i < state.availableDayTo; i++) {
    gened.push(
      ...generateEntries(
        i,
        state.availableDayTo,
        state.timeRange,
        state.currentYear,
        state.currentMonth
      )
    );
  }
  const entries = {};
  const entriesIds = gened.map((i) => {
    const id = i.id;
    delete i.id;
    entries[id] = i;
    return id;
  });
  return { entries, entriesIds };
};

/**
 *
 * @param existingEntries
 */
// export const generateEntries = (existingEntries = []) => {
//
// };

export const initializeState = () => {
  const now = DateTime.now();
  const state = {
    input: {
      phone: "",
      fullName: "",
    },
    currentMonth: now.month,
    currentYear: now.year,
    currentDay: now.day,
    daysInCurrentMonth: now.daysInMonth,
    availableDayFrom: now.day,
    availableDayTo: now.daysInMonth,
    acceptableYears: createRange(2020, 2022),
    acceptableMonths: createRange(1, 12),
    timeRange: {
      dayStartsAt: "9:00",
      dayEndsAt: "18:30",
      minuteInterval: 10,
      unavailableTimes: ["14:00-15:00"],
    },
    bookingMaxPerEntry: 2,
    entries: [
      {
        date: "18-07-2021",
        time: "9:10",
        counter: 1,
        id: "b9f620e8-95d7-4ee2-b175-fec37957c4ec",
      },
    ],
  };
  return state;
};

export const generateDays = ({
  year,
  month,
  constraintsDayFrom = null,
  constraintsDayTo = null,
}) => {
  const calendarDays = [];
  const date = DateTime.fromObject({ year, month, day: 1 });
  const wkday = date.weekday;
  if (wkday > 1) {
    let c = wkday;
    while (c !== 1) {
      calendarDays.push("");
      c -= 1;
    }
  }
  (() => {
    let c = 1;
    while (c <= date.daysInMonth) {
      calendarDays.push(c);
      c += 1;
    }
  })();
  const wkdayLast = DateTime.fromObject({
    year,
    month,
    day: date.daysInMonth,
  }).weekday;
  if (wkdayLast < 7) {
    let c = wkdayLast;
    while (c !== 7) {
      calendarDays.push("");
      c += 1;
    }
  }
  if (constraintsDayFrom && constraintsDayTo) {
    return calendarDays
      .filter((day) => day >= constraintsDayFrom && day <= constraintsDayTo)
      .map((i) => ({
        day: i,
        date: `${i}-${month < 10 ? `0${month}` : month}-${year}`,
      }));
  }
  return calendarDays.map((i) => ({
    day: i,
    date: `${i}-${month < 10 ? `0${month}` : month}-${year}`,
  }));
};
