import Head from 'next/head';
import styled from 'styled-components';
import {createContext, useContext, useEffect, useReducer, useState} from 'react';

const StyledMain = styled.div`
  margin: 10px;
`;

const RecordContext = createContext();
const RecordReducer = (state, action) => {
  switch (action.type) {
    case 'addRecord': return formatUserState(state, action.data);
    default: return state;
  }
};
export const formatUserState = (state, data) => {
  return [
    ...state,
    data
  ];
  // TODO: time entries
  if (!state.length) {
    return [...state, {
      '9:00': data
    }];
  }
  return [...state, {
    '9:00': data
  }];
};
export const useRecord = () => useContext(RecordContext);

const calendarValuesSchema = {
  specificDate: {
    startingTime: '9:00',
    specificTime: '9:00'
  }
};

const RecordContextProvider = ({ children }) => {
  const [recordStore, recordDispatch] = useReducer(RecordReducer, []);

  useEffect(() => {
    console.log(recordStore)
  }, [recordStore]);

  return (
    <RecordContext.Provider value={{ recordStore, recordDispatch }}>
        { children }
    </RecordContext.Provider>
  )
};

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Book entry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* header */}
      <main>
        <RecordContextProvider>
          <StyledMain>
            {/* content */}
            { children }
          </StyledMain>
        </RecordContextProvider>
      </main>

      {/* footer */}
    </>
  )
};

export default Layout;
