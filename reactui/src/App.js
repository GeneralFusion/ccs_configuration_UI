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
          palette: {
            mode,
            primary: {
              main: '#f21fa1',
              contrastText: 'white'
            },
            secondary: {
              main: '#c9bfbb'
            },
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
