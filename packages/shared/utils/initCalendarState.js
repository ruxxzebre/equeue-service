const { createRange } = require("./misc");
const { DateTime } = require("luxon");

const initializeState = ({
  dayStartsAt = "9:00",
  dayEndsAt = "18:30",
  minuteInterval = 10,
  unavailableTimes = ["13:00-14:00"],
  currentDay, currentYear, currentMonth, bookingMaxPerEntry = 2,
  availableDayFrom,
  availableDayTo
   }) => {
  const now = DateTime.now();
  const state = {
    input: {
      phone: "",
      fullName: "",
    },
    currentMonth: currentMonth || now.month,
    currentYear: currentYear || now.year,
    currentDay: currentDay || now.day,
    daysInCurrentMonth: now.daysInMonth,
    availableDayFrom: availableDayFrom || now.toString(),
    availableDayTo: availableDayTo || DateTime.fromObject({ year: 2021, month: 8, day: 17 }).toString(),
    acceptableYears: createRange(2020, 2022),
    acceptableMonths: createRange(1, 12),
    timeRange: {
      dayStartsAt: dayStartsAt || "9:00",
      dayEndsAt: dayEndsAt || "18:30",
      minuteInterval: minuteInterval || 10,
      unavailableTimes: unavailableTimes || ["14:00-15:00"],
    },
    bookingMaxPerEntry: bookingMaxPerEntry || 2,
    exclusiveDates: [
      "30-07-2021",
      "31-07-2021",
      "01-08-2021",
      "02-08-2021"
    ],
    delayedEntriesTimes: [],
    delayTime: 1000 * 60 * 5, // in ms
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

module.exports.initializeState = initializeState;
