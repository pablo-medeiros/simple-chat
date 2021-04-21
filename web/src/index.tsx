import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { SocketContextProvider } from './hooks/useSocket';
import Routes from './routes';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #525252;
      border: none;
      border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
    ::-webkit-scrollbar-thumb:active {
      background: #e3e3e3;
    }
    ::-webkit-scrollbar-track {
      background: #d6d6d6;
      border: none;
      border-radius: 8px;
    }
    ::-webkit-scrollbar-track:hover {
      background: #707070;
    }
    ::-webkit-scrollbar-track:active {
      background: #3d3d3d;
    }
  }
  body{
    width: 100vw;
    min-height: 100vh;
  }
`

ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <Routes />
      <GlobalStyle/>
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


