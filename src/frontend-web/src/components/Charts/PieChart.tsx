import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { IChart, IChartOptions, ChartType } from '../../types/chart';
import { IRange } from '../../types/excel';
import { createChart, updateChartData, optimizeChartPerformance } from '../../utils/chartUtils';

interface PieChartProps {
  data: IRange;
  options: Partial<IChartOptions>;
  width: number;
  height: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, options, width, height }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const chartConfig: IChart = createChart(ChartType.Pie, data, options);
        chartInstance.current = new Chart(ctx, chartConfig);

        // Optimize chart performance
        optimizeChartPerformance(chartInstance.current);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  useEffect(() => {
    if (chartInstance.current) {
      updateChartData(chartInstance.current, data);
      chartInstance.current.update();
    }
  }, [data]);

  return (
    <canvas
      ref={chartRef}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default PieChart;