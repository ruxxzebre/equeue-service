import moment from "moment";
import {dayCellBackground} from "../styles/colors";

export const formatUserState = (state, data) => {
  const momented = moment(data.date);
  const dataDay = momented.date();
  const specificDayRecords = state.filter((record) => {
    const day = moment(record.date).date();
    return dataDay === day;
  });
  momented.hour(
    9 + Math.floor(specificDayRecords.length*10/60)
  );
  momented.minute(
    specificDayRecords.length*10%60
  );
  data.date = momented.toString();

  // if (9 + Math.floor(specificDayRecords.length*10/60) === 18) {
  //   return state;
  // }
  return [...state, {
    ...data
  }];
};

export const formatSingleUserAction = (state, action) => {
  const momented = moment(data.date);
  const dataDay = momented.date();
  const specificDayRecords = state.filter((record) => {
    const day = moment(record.date).date();
    return dataDay === day;
  });
  momented.hour(
    9 + Math.floor(specificDayRecords.length*10/60)
  );
  momented.minute(
    specificDayRecords.length*10%60
  );
  data.date = momented.toString();

  // if (9 + Math.floor(specificDayRecords.length*10/60) === 18) {
  //   return state;
  // }
  return data;
};


export const validate = (values) => {
  const schem = (v) => v.length > 1;
  return values.filter(schem).length === 2;
}

export const getCellBackground = (records) => {
  const percent = records.length * 2;
  if (percent === 0) return 'white';
  return `linear-gradient(to right, ${dayCellBackground.MAIN} ${percent}%, ${dayCellBackground.SECONDARY} ${percent}%)`;
};

export const formatDatesDay = (date, day, fromui = true, obj = false) => {
  date = moment(date);
  date.date(day);
  if (fromui) '';
  // console.log('formatted: ' + date.toString(), 'day is: ' + day);
  return obj ? date : date.toString();
};

export const formatDatesHHMM = (date, hh, mm, obj = false) => {
  date = moment(date);
  date.hour(hh);
  date.minute(mm);
  return obj ? date : date.toString();
}

export const filterRecToCertDay = (records, daynumb, obj = false) => {
  records = records
    .map(i => {
      i.date = moment(i.date);
      return i;
    })
    .filter(i => i.date.date() === daynumb)
    .map(i => {
      if (!obj) i.date = i.date.toString();
      return i;
    });
  return records;
}

export const makeTimeRange = ({low, high, range}) => {
  const prs = (a) => parseInt(a, 10);
  const timedata = {
    low: {
      hrs: prs(low.split(':')[0]),
      min: prs(low.split(':')[1])
    },
    high: {
      hrs: prs(high.split(':')[0]),
      min: prs(high.split(':')[1])
    }
  };
  const arlen =
    ((timedata.high.hrs*60 + timedata.high.min) -
      (timedata.low.hrs*60 + timedata.low.min))/range;
  let counters = {
    min: 0,
    hr: prs(low.split(':')[0])
  };
  const rar = Array(arlen).fill(0).map((_, idx) => {
    if (idx !== 0)
      counters.min += range;
    if (counters.min === 60) {
      counters.min = 0;
      counters.hr += 1;
    }
    return `${counters.hr}:${
      counters.min < 10
        ? `0${counters.min}`
        : counters.min
    }`;
  });
  return rar;
};
