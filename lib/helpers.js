import moment from "moment";

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
