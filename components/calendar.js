import { useState, useEffect } from 'react';
import moment from "moment";
import swali from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRecord } from '../lib/recordContext';
import { getInstance } from '../lib/momentCalendar';
import { useRouter } from "next/router";
import { dayCellBackground } from "../styles/colors";
import calendarStyles from "./calendar.module.scss";

const swal = withReactContent(swali);

const validate = (values) => {
  const schem = (v) => v.length > 1;
  return values.filter(schem).length === 2;
}

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

const filterRecToCertDay = (records, daynumb, obj = false) => {
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

const getCellBackground = (records) => {
  const percent = records.length * 2;
  if (percent === 0) return 'white';
  return `linear-gradient(to bottom, ${dayCellBackground.MAIN} ${percent}%, ${dayCellBackground.SECONDARY} ${percent}%)`;
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

const DayScheduleRow = ({ timeLabel, clickDay, nested = [], isNested, isBooked }) => {
  const isMainTimeLabel = () => isNested;
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
      <div
        className={
          isMainTimeLabel()
          ? calendarStyles.cellRowMain
          : calendarStyles.cellRowNested
        }
        style={{
          height: collapse ? '3px' : '',
          // background: backColorOnHover,
        }}
           onClick={() => {
             if (!isBooked) {
               if (!nested.length) {
                 clickDay();
               } else {
                 setShowNested(!showNested);
               }
             }
           }}
           onMouseOver={() => {
             if (!isBooked && !isMainTimeLabel()) {
               setCollapse(false);
             }
           }}
           onMouseOut={() => {
             if (!isBooked && !isMainTimeLabel()) {
                 setCollapse(true);
             }
           }}
      >
        <div style={{
          color: 'white'
        }}>{collapse ? '' : timeLabel}</div>
      </div>
      { showNested && nested }
    </div>
  );
};

const DaySchedule = ({ onClick, date, dayDates }) => {
  // const timeRange = makeTimeRange(restrN);
  const renderRange = () => {
    let prevsr = [];
    return makeTimeRange(restrN).map((tLabel) => {
      const isa = parseInt(tLabel.split(':')[1], 10) === 0;
      const isbooked = !!(dayDates || []).find(({ date: d }) => {
        const findlabel = `${d.hour()}:${d.minute() > 10 ? d.minute() : `0${d.minute()}`}`;
        return findlabel === tLabel;
      });
      prevsr.push(
        <DayScheduleRow clickDay={() => {
          onClick(tLabel, date);
        }} timeLabel={tLabel} isBooked={isbooked} />
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
    });
  };

  return (
    <div>
      {renderRange()}
    </div>
  );
};

const DayCell = ({ day, records, onClick }) => {
  const [blur, setBlur] = useState(false);
  const [dayRecords, setDayRecords] = useState([]);
  const [cellBackground, setCellBackground] = useState(dayCellBackground.SECONDARY);

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
  >
    <div>
      {day.day || '\u00a0'}
    </div>
  </div>);
}

const DayCellInteract = async (
  recordStore,
  recordDispatch,
  day,
  date,
  refreshData
) => {
  const fnn = RegisterRecordSwal(recordDispatch, refreshData);

  if (day.booked && day.day) {
    return swal.fire({
      title: 'На даний день черга заповнена, оберіть інший.'
    });
  }
  if (!parseInt(day.day)) {
    return;
  }
  await swal.fire({
    title: 'Оберіть час',
    html: <DaySchedule date={date} onClick={fnn} dayDates={filterRecToCertDay(recordStore, day.day, true)} />
  });

};

const RegisterRecordSwal = (recordDispatch, refreshData = () => '') => {
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
              if (!res.error) {
                recordDispatch(
                  {
                    data:
                      {
                        name: result.value[0],
                        phone: result.value[1],
                        date: formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1])
                      },
                    type: 'addRecord'
                  }
                );
                const currentDate = formatDatesHHMM(date, hhmmLabel.split(':')[0], hhmmLabel.split(':')[1], true);
                swal.fire({
                  title: `Вас успішно зареєстровано. Приходь о ${
                    currentDate.format('HH:mm').toString()
                  } ${
                    currentDate
                      .format('DD.MM.YYYY')
                      .toString()
                  }`}).then(refreshData);
              } else {
                return swal.fire({
                  title: 'Дані введено некорректно',
                  text: res.error
                });
              }
            });
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
  const router = useRouter();
  const [calendar, setCalendar] = useState(getInstance(date));
  const [input, setInput] = useState({
    name: "",
    phone: ""
  });
  calendar.setCurrentDate(date);
  const [weeks, setWeeks] = useState(calendar.getWeeksTable(true));
  const { recordStore, recordDispatch } = useRecord();
  const refreshData = () => {
    router.replace(router.asPath);
  };


  useEffect(() => {
    calendar.setCurrentDate(date);
    setWeeks(calendar.getWeeksTable(true));
  }, []);

  return (
    <div className="calendar">
      {weeks.map( (days, i) => {
        days = days.map(d => ({booked: false, day: d}));
        return <div className="week" key={i}>
          {days.map( (day, di) =>
             <DayCell
                key={di}
                day={day}
                records={recordStore}
                onClick={() => DayCellInteract(recordStore,
                  recordDispatch, day, formatDatesDay(date, day.day), refreshData
              )} />
          )}
        </div>
      })}
    </div>
  );
};

export default Calendar;
