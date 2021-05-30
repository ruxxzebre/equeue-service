import moment from 'moment';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { formatUserState, formatSingleUserAction } from './helpers';
import { formatDatesDay } from "../components/calendar";
import { swal } from "./swals";

const sendEventToAPI = (evv) => {
  fetch('http://localhost:3000/api/bookmeet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(evv)
  });
};

export const RecordContext = createContext();
export const RecordSwitches = {
  addRecord(state, action) {
    // ASSIGN ID'S!!!!
    // PUT BOOKED EVENT FROM RETURN OF BACKEND
    // const formatted = formatUserState(state, action.data);
    const currentDate = moment(action.data.date);
    swal.fire({
      title: `Вас успішно зареєстровано. Приходь о ${
        currentDate.format('HH:mm').toString()
      } ${
        currentDate
          .format('DD.MM.YYYY')
          .toString()
      }`
    });
    // const response = fetch('http://localhost:3000/api/', {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   method: 'POST',
    //   body: JSON.stringify(formatted)
    // });
    sendEventToAPI(action.data);
    return [...state, action.data];
  }
}
export const RecordReducer = (state, action) => {
  switch (action.type) {
    case 'addRecord': return RecordSwitches.addRecord(state, action);
    default: return state;
  }
};
export const useRecord = () => useContext(RecordContext);

/*
const calendarValuesSchema = {
  specificDate: {
    startingTime: '9:00',
    specificTime: '9:00'
  }
};
*/
//
// export const recordReducerInit = async (state) => {
//   const records = await Booking.getRecords();
//   if (records && records.length > 0) return [...state, ...Booking.getRecords()];
//   return [...state];
// };

export const RecordContextProvider = ({ children, initialState }) => {
  const [recordStore, recordDispatch] = useReducer(RecordReducer, initialState || []);

  useEffect(() => {
  });

  useEffect(() => {
    console.log(recordStore);
  }, [recordStore]);

  return (
    <RecordContext.Provider value={{ recordStore, recordDispatch }}>
      { children }
    </RecordContext.Provider>
  )
};
