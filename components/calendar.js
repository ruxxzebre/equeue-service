import { useState } from 'react';
import moment from "moment";
import swal from 'sweetalert2';
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
  date = date.split('-').map(i => i.trim());
  date[1] = parseInt(date[1]);
  if (!date[1]) {
    date[1] = 12;
  }
  date = date.join('-');
  let daysAmount = moment(date).daysInMonth();
  const truthyDays = days.filter(Boolean).map(parseInt);
  const firstTrueDay = truthyDays[0];
  let newMonthCounter = 0;
  days = days.reverse().map((day, idx, arr) => {
    if (day)
      return day;
    if (firstTrueDay === 1)
      return daysAmount - idx;
    return null;
  }).reverse().map(i => i || (newMonthCounter += 1));
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
            return <div className="day" key={di} onClick={async () => {
              await swal.fire({
                title: 'Зареєструватись до черги',
                html:
                  '<input id="swal-input1" class="swal2-input" placeholder="ПІБ">' +
                  '<input id="swal-input2" class="swal2-input" placeholder="Номер телефону">',
                focusConfirm: false,
                preConfirm: () => {
                  return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                  ]
                }
              });
              swal.fire({
                title: 'Вас успішно зареєстровано'
              });

            }}>
              {day}
            </div>
          })}
        </div>
      })}
    </div>
  );
};

export default Calendar;
