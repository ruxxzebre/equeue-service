import Head from 'next/head'
import Image from 'next/image'
import {useEffect, useState} from 'react';
import styles from '../styles/Home.module.css'
import Layout from '../components/layout';
import Calendar from '../components/calendar';

const leftPad = (str, len, ch) => {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

export default function Home() {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [yearRange, setYearRange] = useState();
  const [formattedDate, setFormattedDate] = useState();
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

    <Layout>
      <div className="App-header">
        <h2>Book a visit</h2>
      </div>
      {initialized &&
        <div>
      <form className="year-selection">
        <label htmlFor="month">Month</label>
        <select name="month" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="01">01 - January</option>
          <option value="02">02 - February</option>
          <option value="03">03 - March</option>
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
      </form>
        <Calendar key={formattedDate} date={formattedDate}/>
        </div>
          }
    </Layout>
  )
}
