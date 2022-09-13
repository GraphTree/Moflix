import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecoilRoot } from 'recoil';
import {darkTheme} from './theme/theme';
import {ThemeProvider} from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: black;
  }
`


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
    
    <RecoilRoot>  
      <GlobalStyle/>
      <App />
    </RecoilRoot>  
  </ThemeProvider>
  // </React.StrictMode>
);

