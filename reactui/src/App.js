import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Controller from './Controller.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';





export default function App() {
    const [mode, setMode] = React.useState('dark')

    const theme =
        createTheme({
          components:{
            MuiCssBaseline: {
              styleOverrides: 
               `
               /* ===== Scrollbar CSS ===== */
               /* Firefox */
               * {
                 scrollbar-width: auto;
                 scrollbar-color: #f21fa1 #2e2e2e;
               }
             
               /* Chrome, Edge, and Safari */
               *::-webkit-scrollbar {
                 width: 8px;
                 height: 10px;
               }
             
               *::-webkit-scrollbar-track {
                 background: #2e2e2e;
                 border-radius: 13px;
                 border: none
               }
             
               *::-webkit-scrollbar-thumb {
                 background-color: #f21fa1;
                 border-radius: 13px;
                 border: none;
               }
    
              
  

               `
              
            }
          },
          palette: {
            mode,
            primary: {
              main: '#f21fa1',
              contrastText: 'white'
            },
            secondary: {
              main: '#c9bfbb'
            },
            error: {
              main: '#FF0000'
            },
            sucess: {
              main: '00FF00'
            }
          },
          status:{
            enable: '#00c925',
            disable: '#c90000',
            warning: '#d17000',
 
          },
          typography:{
            fontSize: 12,
            fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
            ].join(','),
          }
        })
    
    fetch('/profileInfo').then(res => {
      res.json().then(isDarkMode => {
        setMode(isDarkMode.isDarkMode ? 'dark' : 'light')
      })
    })

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Container maxWidth="xl" >
              <Controller name="uv"></Controller>
          </Container>
        </CssBaseline>
  
      </ThemeProvider>
    
    );


 

}
