import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Booking } from "../lib/bookCrud";
import styled from 'styled-components';
import moment from 'moment';
import Layout from '../components/layout';
import Calendar from '../components/calendar';

const StyledHeadline = styled.h2`
  
`;

const leftPad = (str, len, ch) => {
  str = String(str);
  let i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (i++ < len) {
    str = ch + str;
  }
  return str;
}
const formatMonth = (month) => {
  if (month/10 > 1) {
    return `${month}`;
  }
  return `0${month}`;
};

export default function Home({ recordContextState }) {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(formatMonth(today.getMonth() + 1));
  const [year, setYear] = useState(today.getFullYear());
  const [yearRange, setYearRange] = useState();
  const [formattedDate, setFormattedDate] = useState();
  const [constraintDateFrom, setConstraintDateFrom] = useState(1);
  const [constraintDateTo, setConstraintDateTo] = useState(10);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const end = year + 1;
    const start = 1999;

    setYearRange(Array.from({length: (end - start)}, (v, k) => k + start));
    setFormattedDate([
      leftPad(year, 4, 0),
      leftPad(month, 2, 0),
      leftPad(day, 2, 0)
    ].join("-"));
    setInitialized(true);
  }, []);

  useEffect(() => {
    setFormattedDate([
      leftPad(year, 4, 0),
      leftPad(month, 2, 0),
      leftPad(day, 2, 0)
    ].join("-"));
  }, [year, month, day]);

  return (

    <Layout recordContextState={recordContextState}>
      <div className="App-header">
        <StyledHeadline>Book a visit</StyledHeadline>
      </div>
      {initialized &&
        <div>
      <form className="year-selection">
        <label htmlFor="month">Month</label>
        <select name="month" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="01">01 - January</option>
          <option value="02">02 - February</option>
          <option value="04">04 - April</option>
          <option value="05">05 - May</option>
          <option value="06">06 - June</option>
          <option value="07">07 - July</option>
          <option value="08">08 - August</option>
          <option value="09">09 - September</option>
          <option value="10">10 - October</option>
          <option value="11">11 - November</option>
          <option value="12">12 - December</option>
        </select>

        <label htmlFor="year">Year</label>

        <select name="year" value={year} onChange={(e) => setYear(e.target.value)}>
          {yearRange.map((year) => {
            return <option key={year} value={year}>{year}</option>
          })}
        </select>

        <label htmlFor="dateFrom">Date From</label>
        <select name="dateFrom" id="" value={constraintDateFrom}
                onChange={(e) => setConstraintDateFrom(e.target.value)}>
          {Array(moment(year + '-' + month, 'YYYY-MM').daysInMonth()).fill(0).map((_, idx) => {
            return <option value={idx + 1} value={idx + 1}>{idx + 1}</option>
          })}
        </select>
        <label htmlFor="dateTo">Date To</label>
        <select name="dateFrom" id="" value={constraintDateTo}
                onChange={(e) => setConstraintDateTo(e.target.value)}>
          {Array(moment(year + '-' + month, 'YYYY-MM').daysInMonth()).fill(0).map((_, idx) => {
            return <option value={idx + 1} value={idx + 1}>{idx + 1}</option>
          })}
        </select>

        <label htmlFor="exportBtn">XLSX Export</label>
        <a href="http://localhost:3000/api/xlexport"><span style={{
         border: '1px solid black',
         padding: '5px',
         background: 'rgba(0,0,0,0.1)',
         borderRadius: '5px'
        }}>EXPORT</span></a>

      </form>
        <Calendar key={formattedDate} date={formattedDate} constraints={{ from: constraintDateFrom, to: constraintDateTo }}/>
        </div>
          }
    </Layout>
  )
}

export async function getServerSideProps() {
  const records = await Booking.getRecords();
  let recordContextState =
    (records && records.length)
      ? records
      : [];

  return {
    props: {
      recordContextState
    }
  };
};
