import { useState, useEffect } from 'react';
import moment from "moment";
import swali from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRecord } from '../lib/recordContext';
import { getInstance } from '../lib/momentCalendar';

const swal = withReactContent(swali);

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

const optimizeDays = (date, days, recordStore) => {
  if (!days.filter(parseInt).length)
    return days.map(day => ({ day, booked: false }));
  // date = date.split('-').map(i => i.trim());
  // date[1] = parseInt(date[1]);
  // if (!date[1]) {
  //   date[1] = 12;
  // }
  // date = date.join('-');
  const momented = moment(date);
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
      let dated = momented;
      dated.day(day);
      dated = dated.toString();
      return { booked: false, day, date: dated };
    });
    // .map(day => {
    //   const formattedRecord = Object.keys(recordStore).map(k => {
    //     return recordStore[k];
    //   });
    //   if (formattedRecord.find((record) =>
    //     record.date === formatDatesDay(date, day, false)
    //   )) {
    //     return { booked: false, day };
    //   };
    //   return { booked: false, day };
    // });
  return days;
};

const renderCalendarCell = (records) => {
  const renderRow = (booked) => <div style={{
    backgroundColor: booked ? '#ff6961' : 'white'
  }}>

  </div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {records.map((record) => {
        return renderRow(record.booked);
      })}
    </div>
  );
};

const getCellBackground = (records) => {
  // records = records
  //   .map(i => {
  //     i.date = moment(i.date);
  //     return i;
  //   })
  //   .filter(i => i.date.date() === daynumb);
  // FROM 9:00 TO 18:00
  const percent = records.length * 2;
  if (percent === 0) return 'white';
  return `linear-gradient(to bottom, rgba(255,54,0,0.3) ${percent}%, white ${percent}%)`;
  // return `linear-gradient(to bottom, red ${percent}%, white 50%)`;
  // return `linear-gradient(to bottom, red 50%, white 50%)`;
};

const restrN = {
  low: '9:00',
  high: '18:00',
  range: 10
};

const makeTimeRange = ({low, high, range}) => {
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

const DayScheduleRow = ({ timeLabel, clickDay, nested = [], isNested }) => {
  // const isMainTimeLabel = () => parseInt(timeLabel.split(':')[1]) === 0;
  const isMainTimeLabel = () => isNested;
  const hovBackConst = '#7FDBFF';
  const backConst = 'rgba(255, 54, 0, 0.3)';
  const hovBackConstOut = isMainTimeLabel() ? backConst : 'rgba(255, 126, 0, 0.3)';
  const [
    backColorOnHover,
    setBackColorOnHover
  ] = useState(isMainTimeLabel()
    ? backConst
    : hovBackConstOut
    // : 'rgba(255, 126, 0, 0.3)'
  );
  const [
    showNested,
    setShowNested
  ] = useState(false);
  const [
    collapse,
    setCollapse
  ] = useState(!isMainTimeLabel());

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: '2px',
        padding: '5px',
        height: collapse ? '3px' : '',
        // background: 'rgba(255, 54, 0, 0.3)',
        background: backColorOnHover,
        borderRadius: '5px',
        cursor: 'pointer'
      }}
           onClick={() => {
             if (!nested.length) {
               clickDay();
             } else {
               setShowNested(!showNested);
             }
           }}
           onMouseOver={() => {
             setBackColorOnHover(hovBackConst);
             if (!isMainTimeLabel())
               setCollapse(false);
           }}
           onMouseOut={() => {
             setBackColorOnHover(hovBackConstOut);
             if (!isMainTimeLabel())
               setCollapse(true);
           }
           }
      >
        <div style={{
          color: 'white'
        }}>{collapse ? '' : timeLabel}</div>
      </div>
      { showNested && nested }
    </div>
  );
};

const DaySchedule = ({ onClick, date }) => {
  // const { recordDispatch } = useRecord();

  let prevsr = [];
  const addtoprevsr = (thing) => {
    prevsr = [
      ...prevsr, thing
    ];
  }

  return (
    <div>
      {makeTimeRange(restrN).map((tLabel) => {
        const isa = parseInt(tLabel.split(':')[1], 10) === 0;
        const isf = parseInt(tLabel.split(':')[0], 10) === 9;
        // if (!isa)
          prevsr.push(
           <DayScheduleRow clickDay={() => {
            onClick(tLabel, date);
          }} timeLabel={tLabel} />
        );
        return (
          <div>
            {(() => {
              if (isa) {
                prevsr = [];
                 return <DayScheduleRow clickDay={() => {
                  onClick(tLabel);
                }} timeLabel={tLabel} isNested={true} nested={prevsr} />
                }
            })()
            }
          </div>
        );
      })}
    </div>
  );
};

const DayCell = ({ day, records, onClick }) => {
  const [blur, setBlur] = useState(false);
  const [dayRecords, setDayRecords] = useState([]);
  const [cellBackground, setCellBackground] = useState('white');

  useEffect(() => {
    setDayRecords(records.filter((record) => {
      if (day)
        return moment(record.date).date() === day.day
    }));
  }, [records]);

  useEffect(() => {
    setCellBackground(getCellBackground(dayRecords));
  }, [dayRecords]);

  return (<div className="day"
               onClick={onClick}
               style={{
      background: cellBackground,
      cursor: day.day ? 'pointer' : 'default',
      filter: parseInt(day.day) ? (blur && 'blur(4px)') : ''
    }}
               // onMouseOver={() => setBlur(false)}
               // onMouseOut={() => setBlur(true)}
  >
    <div>
      {/*{JSON.stringify(dayRecords)}*/}
      {day.day || '\u00a0'}
    </div>
  </div>);
}

const DayCellInteract = async (
  recordDispatch,
  day,
  date
) => {
  const fnn = RegisterRecordSwal(recordDispatch);

  if (day.booked && day.day) {
    return swal.fire({
      title: 'На даний день черга заповнена, оберіть інший.'
    });
  }
  await swal.fire({
    title: 'Оберіть час',
    html: <DaySchedule date={date} onClick={fnn} />
  });

};

const RegisterRecordSwal = (recordDispatch) => {
  return async (hhmmLabel, date) => {
    await swal.fire({
      title: `Зареєструватись до черги о ${hhmmLabel}`,
      html:
        '<input id="swal-input1" class="swal2-input" autocomplete="off" placeholder="ПІБ">' +
        '<input id="swal-input2" class="swal2-input" autocomplete="off" placeholder="Номер телефону">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      },
      confirmButtonText: "Зареєструватись"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (validate(result.value)) {
          const sendEventToAPI = async (evv) => {
            const ap = await fetch('http://localhost:3000/api/bookmeet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(evv)
            });
            return await ap.json();
          };
          await sendEventToAPI({
              name: result.value[0],
              phone: result.value[1],
              date: formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1])
            }).then(res => {
              console.log(res)
          });
          // recordDispatch(
          //   {
          //     data:
          //       {
          //         name: result.value[0],
          //         phone: result.value[1],
          //         date: formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1])
          //       },
          //     type: 'addRecord'
          //   }
          // );
          return;
        }
        return swal.fire({
          title: 'Дані введено некорректно'
        });
      }
    });
  };
}

const Calendar = ({ date: dateProp, recordValues, addRecord }) => {
  const [date, setDate] = useState(dateProp);
  const [calendar, setCalendar] = useState(getInstance(date));
  const [input, setInput] = useState({
    name: "",
    phone: ""
  });
  calendar.setCurrentDate(date);
  const [weeks, setWeeks] = useState(calendar.getWeeksTable(true));
  const { recordStore, recordDispatch } = useRecord();

  useEffect(() => {
    calendar.setCurrentDate(date);
    setWeeks(calendar.getWeeksTable(true));
  }, []);

  return (
    <div className="calendar">
      {weeks.map( (days, i) => {
        // console.log(date);
        // days = optimizeDays(date, days, recordStore);
        days = days.map(d => ({booked: false, day: d}));
        return <div className="week" key={i}>
          {days.map( (day, di) =>
             <DayCell
                key={di}
                day={day}
                records={recordStore}
                onClick={() => DayCellInteract(
                  recordDispatch, day, formatDatesDay(date, day.day)
              )} />
          )}
        </div>
      })}
    </div>
  );
};

export default Calendar;
