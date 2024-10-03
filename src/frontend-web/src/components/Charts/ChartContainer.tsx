import React, { useContext, useMemo } from 'react';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { IChart, IChartOptions, ChartType } from '../../types/chart';
import { useChartData } from '../../hooks/useChartData';
import { ExcelContext } from '../../context/ExcelContext';

interface ChartContainerProps {
  chartId: string;
  type: ChartType;
  dataRange: string;
  options: Partial<IChartOptions>;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ chartId, type, dataRange, options }) => {
  const { theme, locale } = useContext(ExcelContext);
  const { data, loading, error } = useChartData(chartId, dataRange);

  const chartProps = useMemo(() => {
    return {
      data,
      options: {
        ...options,
        theme,
        locale,
      },
    };
  }, [data, options, theme, locale]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>Error loading chart: {error.message}</div>;
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'line':
        return <LineChart {...chartProps} />;
      case 'pie':
        return <PieChart {...chartProps} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container" role="img" aria-label={`${type} chart`}>
      {renderChart()}
    </div>
  );
};

export default ChartContainer;