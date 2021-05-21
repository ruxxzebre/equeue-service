import { createContext, useContext } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

const StyledMain = styled.div`
  margin: 10px;
`;

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Book entry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* header */}
      <main>
        <StyledMain>
          {/* content */}
          { children }
        </StyledMain>
      </main>

      {/* footer */}
    </>
  )
};

export default Layout;
