import React from 'react';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import App from './App';
import { ExcelProvider } from './context/ExcelContext';
import { ThemeProvider } from './context/ThemeContext';

// Function to render the main React application
const renderApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  ReactDOM.render(
    <StrictMode>
      <ThemeProvider>
        <ExcelProvider>
          <App />
        </ExcelProvider>
      </ThemeProvider>
    </StrictMode>,
    rootElement
  );
};

// Initialize the application
renderApp();

// Enable hot module replacement for development
if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}

// Add error boundary for production
if (process.env.NODE_ENV === 'production') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Uncaught error:', error);
    // Here you can add code to send error reports to your error tracking service
  };
}

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // This is a simple example, you might want to use a more robust solution
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
      // Here you can send this data to your analytics service
    }, 0);
  });
}

// Accessibility check
if (process.env.NODE_ENV === 'development') {
  if ('axe' in window) {
    (window as any).axe.run((err: Error, results: any) => {
      if (err) throw err;
      console.log('Accessibility check results:', results);
    });
  }
}