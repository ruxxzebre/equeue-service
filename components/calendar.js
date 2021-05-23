import { useState, useEffect } from 'react';
import moment from "moment";
import swal from 'sweetalert2';
import { useRecord } from '../components/layout';
import { getInstance } from '../lib/momentCalendar';

const validate = (values) => {
  const schem = (v) => v.length > 1;
  return values.filter(schem).length === 2;
}

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

const formatDatesDay = (date, day, fromui = true, obj = false) => {
  date = moment(date);
  date.date(day);
  if (fromui)
    console.log('formatted: ' + date.toString(), 'day is: ' + day);
  return obj ? date : date.toString();
};

const optimizeDays = (date, days, recordStore) => {
  if (!days.filter(parseInt).length)
    return days.map(day => ({ day, booked: false }));
  // date = date.split('-').map(i => i.trim());
  // date[1] = parseInt(date[1]);
  // if (!date[1]) {
  //   date[1] = 12;
  // }
  // date = date.join('-');
  let daysAmount = moment(date).daysInMonth();
  const truthyDays = days.filter(Boolean).map(parseInt);
  const firstTrueDay = truthyDays[0];
  let newMonthCounter = 0;
  days = days
    .reverse()
    .map((day, idx) => {
    if (day)
      return day;
    if (firstTrueDay === 1)
      return daysAmount - idx;
    return null;
  })
    .reverse()
    .map(i => i || (newMonthCounter += 1))
    .map(day => {
      // console.log(formatDatesDay(date, day));
      // console.log(recordStore)
      if (recordStore.find((record) =>
        record.date === formatDatesDay(date, day, false)
      )) {
        return { booked: true, day };
      };
      return { booked: false, day };
    });
  return days;
};

const Calendar = ({ date: dateProp, recordValues, addRecord }) => {
  const [date, setDate] = useState(dateProp);
  const [calendar, setCalendar] = useState(getInstance());
  calendar.setCurrentDate(date);
  const [weeks, setWeeks] = useState(calendar.getWeeksTable(true));
  const { recordStore, recordDispatch } = useRecord();

  useEffect(() => {
    // console.log(recordStore)
  }, [recordStore]);

  useEffect(() => {
    calendar.setCurrentDate(date);
    setWeeks(calendar.getWeeksTable(true));
  });

  return (
    <div className="calendar">
      {weeks.map( (days, i) => {
        // console.log(date);
        days = optimizeDays(date, days, recordStore);
        return <div className="week" key={i}>
          {days.map( (day, di) =>{
            return <div className="day" style={{ backgroundColor: day.booked ? '#ff6961' : 'white' }} key={di} onClick={async () => {
              if (day.booked) {
                return swal.fire({
                  title: 'На даний день черга заповнена, оберіть інший.'
                });
              }
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
                },
                confirmButtonText: "Зареєструватись"
              }).then((result) => {
                if (result.isConfirmed) {
                  if (validate(result.value)) {
                    recordDispatch(
                      {data: { name: result.value[0], phone: result.value[1], date: formatDatesDay(date, day.day) }, type: 'addRecord'}
                    );
                    return swal.fire({
                      title: `Вас успішно зареєстровано. Приходьте о 9:00 ${
                        formatDatesDay(date, day.day, true, true).format('DD.MM.YYYY').toString()
                      }`
                    });
                  }
                  return swal.fire({
                    title: 'Дані введено некорректно'
                  });
                }
              });
            }} >
              {day.day}
            </div>
          })}
        </div>
      })}
    </div>
  );
};

export default Calendar;
