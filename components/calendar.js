import { useState } from 'react';
import moment from "moment";
import { getInstance } from '../lib/momentCalendar';

const getOffsetDay = (offset, date) => {
  date = date.split('-').map(i => i.trim());
  date[1] = parseInt(date[1]);
  if (!date[1]) {
    date[1] = 12;
  }
  date = date.join('-');
  const daysAmount = moment(date).daysInMonth();
  return Math.abs( - daysAmount + offset);
};

const optimizeDays = (date, days, week) => {
  if (!days.filter(parseInt).length) return days;
  // console.log(days);
  date = date.split('-').map(i => i.trim());
  date[1] = parseInt(date[1]);
  if (!date[1]) {
    date[1] = 12;
  }
  date = date.join('-');
  let daysAmount = moment(date).daysInMonth();

  days = days.map((day, idx) => {
    if (day) return day;
    if (week === 1) {
      return daysAmount - days.length + idx + 2;
    }
    return idx;
  });
  console.log(days);
  return days;
};

const Calendar = ({ date: dateProp }) => {
  const [date, setDate] = useState(dateProp);
  const [calendar, setCalendar] = useState(getInstance());

  calendar.setCurrentDate(date);
  const weeks = calendar.getWeeksTable(true);

  return (
    <div className="calendar">
      <p>{getOffsetDay(0, date)}</p>
      {weeks.map( (days, i) => {
        days = optimizeDays(date, days, i);
        return <div className="week" key={i}>
          {days.map( (day, di) =>{
            return <div className="day" key={di}>
              {day}
            </div>
          })}
        </div>
      })}
    </div>
  );
};

export default Calendar;
