import { DateTime } from "luxon";
import _ from "lodash";
import { parseFilterRule } from "@bwi/shared/parsers";

export const Validator = {
  date: function (date) {
    if (date instanceof Date) {
      const newdate = DateTime.from(date);
      return newdate.format("");
    }
  },
};

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
  // if (str instanceof Date) {
  //   return DateTime.from(str).format('DD-MM-YYYY').string;
  // }
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
  bookingMaxPerEntry,
  delayedEntries
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
      flag += timep.hour >= timeu.start.hour && timep.hour < timeu.end.hour;
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
    if (delayedEntries.includes(time)) continue;
    if (!checkIfAvailable(time)) continue;
    const existingEntry = times.find((e) => e.time === time);
    if (!existingEntry) {
      res.push(makeEntry(time, date));
    } else if (
      existingEntry.counter < bookingMaxPerEntry &&
      existingEntry.counter !== 0
    ) {
      res.push(existingEntry);
    }
  }
  return res;
};

export const dayToCommonFormat = (date) => {
  const { day, month, year } = date;
  return `${day}-${month < 10 ? `0${month}` : month}-${year}`;
};

export const generateDays = ({
  availableDayFrom = null,
  availableDayTo = null,
  filterRules = [],
  exclusiveDates = [],
  inclusiveDates = [],
}) => {
  if (!availableDayFrom || !availableDayTo) return null;
  const dayFrom = DateTime.fromISO(availableDayFrom);
  const dayTo = DateTime.fromISO(availableDayTo);
  let dayTemp = dayFrom;
  const calendarDays = [];
  while (dayTemp.toLocaleString() !== dayTo.toLocaleString()) {
    const commonDate = dayToCommonFormat(dayTemp);
    let c = 0;
    filterRules.forEach((rule) => {
      c += parseFilterRule(rule)(dayTemp);
    });

    if (
      (!c && !exclusiveDates.includes(commonDate)) ||
      inclusiveDates.includes(commonDate)
    ) {
      calendarDays.push(commonDate);
    }

    dayTemp = dayTemp.plus({ day: 1 });
  }
  return calendarDays.map((date) => ({ date }));
};
