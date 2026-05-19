import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { AppProvider } from './context/AppContext';

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#F57C00',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
   </ErrorBoundary>
)
