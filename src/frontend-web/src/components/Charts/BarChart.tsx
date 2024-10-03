import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';
import { IRange } from '../../types/excel';
import { IChart, IChartOptions, ChartType } from '../../types/chart';
import { createChart, updateChartData, optimizeChartPerformance } from '../../utils/chartUtils';

interface BarChartProps {
  data: IRange;
  options: Partial<IChartOptions>;
  width: number;
  height: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, options, width, height }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (!chartInstance.current) {
          // Create new chart
          chartInstance.current = createChart(ctx, {
            type: ChartType.Bar,
            data: data,
            options: options,
          });
        } else {
          // Update existing chart
          updateChartData(chartInstance.current, data);
          chartInstance.current.options = { ...chartInstance.current.options, ...options };
          chartInstance.current.update();
        }

        // Optimize chart performance
        optimizeChartPerformance(chartInstance.current);
      }
    }

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, options]);

  return (
    <canvas
      ref={chartRef}
      width={width}
      height={height}
      aria-label="Bar Chart"
      role="img"
    />
  );
};

export default BarChart;