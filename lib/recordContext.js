import moment from 'moment';
import swali from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { formatUserState } from './helpers';
import { formatDatesDay } from "../components/calendar";

const swal = withReactContent(swali);

export const RecordContext = createContext();
export const RecordSwitches = {
  addRecord(state, action) {
    const formatted = formatUserState(state, action.data);
    const currdate = moment(formatted[formatted.length - 1].date);
    swal.fire({
      title: `Вас успішно зареєстровано. Приходь о ${
        currdate.format('HH:mm').toString()
      } ${
        currdate
          .format('DD.MM.YYYY')
          .toString()
      }`
    });
    return formatted;
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
