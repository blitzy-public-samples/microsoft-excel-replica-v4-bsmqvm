import { useState, useEffect, useCallback } from 'react';
import { ChartData } from '../types/chart';
import { processChartData } from '../utils/chartUtils';
import { fetchChartData } from '../services/api';
import { useExcelContext } from '../context/ExcelContext';

/**
 * Custom hook for managing chart data in the web version of Microsoft Excel.
 * @param chartId - The ID of the chart to fetch data for.
 * @returns An object containing the chart data, loading state, and any error that occurred.
 */
export const useChartData = (chartId: string) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { currentWorkbook, currentWorksheet } = useExcelContext();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rawData = await fetchChartData(chartId, currentWorkbook, currentWorksheet);
      const processedData = processChartData(rawData);
      setChartData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [chartId, currentWorkbook, currentWorksheet]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { chartData, isLoading, error };
};