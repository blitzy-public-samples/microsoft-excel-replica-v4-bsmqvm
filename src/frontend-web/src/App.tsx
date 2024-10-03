import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { ExcelProvider } from '../context/ExcelContext';
import { ThemeProvider } from '../context/ThemeContext';
import Ribbon from '../components/Ribbon/Ribbon';
import FormulaBar from '../components/FormulaBar/FormulaBar';
import Grid from '../components/Grid/Grid';
import SheetTabs from '../components/Sheets/SheetTabs';
import { api } from '../services/api';
import { auth } from '../services/auth';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// Lazy-loaded components
const ChartDialog = lazy(() => import('../components/Dialogs/ChartDialog'));
const ShareDialog = lazy(() => import('../components/Dialogs/ShareDialog'));

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check authentication status
        const authStatus = await auth.checkAuthStatus();
        setIsAuthenticated(authStatus);

        if (authStatus) {
          // Initialize API and load necessary data
          await api.initialize();
        }

        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access Excel</div>;
  }

  return (
    <ErrorBoundary>
      <ExcelProvider>
        <ThemeProvider>
          <AppContainer>
            <Ribbon />
            <MainContent>
              <FormulaBar />
              <Grid />
              <SheetTabs />
            </MainContent>
            <Suspense fallback={<LoadingSpinner />}>
              <ChartDialog />
              <ShareDialog />
            </Suspense>
          </AppContainer>
        </ThemeProvider>
      </ExcelProvider>
    </ErrorBoundary>
  );
};

export default App;