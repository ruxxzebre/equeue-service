import { useState, useEffect } from 'react';
import moment from "moment";
import withReactContent from 'sweetalert2-react-content';
import { useRecord } from '../lib/recordContext';
import { getInstance } from '../lib/momentCalendar';
import { formatDatesDay,
  filterRecToCertDay,
  validate,
  getCellBackground,
  makeTimeRange } from "../lib/helpers";
import { useRouter } from "next/router";
import { dayCellBackground } from "../styles/colors";
import { submitEventBooking } from "../lib/controller";
import { restrN } from "../lib/constants";
import calendarStyles from "./calendar.module.scss";

import swali from 'sweetalert2';
const swal = withReactContent(swali);

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
            : (
              isBooked
                ? { background: 'grey' }
                : calendarStyles.cellRowNested
              )
        }
        style={{
          height: collapse ? '3px' : '',
          marginLeft: isMainTimeLabel() ? '' : '15px'
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
        <div className={calendarStyles.timeLabel}>{collapse ? '' : timeLabel}</div>
      </div>
      { showNested && nested }
    </div>
  );
};

const DaySchedule = ({ onClick, date, dayDates }) => {
  const renderRange = () => {
    let prevsr = [];
    let baseRow = null;
    return makeTimeRange(restrN).map((tLabel) => {
      baseRow = null;
      const isa = parseInt(tLabel.split(':')[1], 10) === 0;
      const isbooked = !!(dayDates || []).find(({ date: d }) => {
        const hour = d.hour();
        const minute = d.minute();
        const foundLabel = `${hour}:${minute > 9 ? minute : `0${minute}`}`;
        return foundLabel === tLabel;
      });

      if (isbooked) return null;

      if (!isa)
        prevsr.push(
          <DayScheduleRow clickDay={() => {
            onClick(tLabel, date);
          }} timeLabel={tLabel} isBooked={isbooked} />
        );

      if (isa) {
        prevsr = [];
        return <DayScheduleRow clickDay={() => {
          onClick(tLabel);
        }} timeLabel={tLabel} isNested={true} nested={prevsr} />;
      }
      return null;
    });
  };

  return (
    <div>
      {renderRange()}
    </div>
  );
};

const DayCellInactive = ({ day, customColor }) => {
  return (<div className="day"
               style={{
                 backgroundColor: customColor || 'rgba(0,0,0,0.25)',
                 border: '1px solid rgba(0,0,0,0.2)'
               }}
  >
      {day.day || '\u00a0'}
  </div>);
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
      cursor: day.day ? 'pointer' : 'default',
      filter: parseInt(day.day) ? (blur && 'blur(4px)') : ''
    }}
  >
    <div style={{
      background: cellBackground
    }}>
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
          await submitEventBooking(result, hhmmLabel, refreshData);
        }
    }
    });
  };
}

const Calendar = ({ date: dateProp, recordValues, addRecord, constraints }) => {
  const [date] = useState(dateProp);
  const router = useRouter();
  const [calendar] = useState(getInstance(date));
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
          {days.map( (day, di) => {
            const constrained = (day.day > constraints.to || day.day < constraints.from);
            if (constrained) return <DayCellInactive day={day} />;
            if (!parseInt(day.day)) return <DayCellInactive day={day} customColor={'white'} />;
            return <DayCell
              key={di}
              day={day}
              records={recordStore}
              onClick={() =>
                DayCellInteract(recordStore,
                    recordDispatch, day, formatDatesDay(date, day.day), refreshData
                  )
              } />
            }
          )}
        </div>
      })}
    </div>
  );
};

export default Calendar;
