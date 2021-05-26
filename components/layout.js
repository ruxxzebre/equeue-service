import Head from 'next/head';
import styled from 'styled-components';
import { RecordContextProvider } from '../lib/recordContext';

const StyledMain = styled.div`
  margin: 10px;
`;

const Layout = ({ children, recordContextState }) => {
  return (
    <>
      <Head>
        <title>Book entry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* header */}
      <main>
        <RecordContextProvider initialState={recordContextState}>
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
