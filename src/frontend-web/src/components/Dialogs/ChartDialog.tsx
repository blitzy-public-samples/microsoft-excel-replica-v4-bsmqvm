import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@material-ui/core';
import { IChart, IChartOptions, ChartType } from '../../types/chart';
import { ExcelContext } from '../../context/ExcelContext';
import { useChartData } from '../../hooks/useChartData';
import { createChart, updateChartData, changeChartType } from '../../utils/chartUtils';
import api from '../../services/api';

interface ChartDialogProps {
  open: boolean;
  onClose: () => void;
  chart?: IChart;
}

const ChartDialog: React.FC<ChartDialogProps> = ({ open, onClose, chart }) => {
  const [chartOptions, setChartOptions] = useState<IChartOptions>({
    type: ChartType.Bar,
    title: '',
    dataRange: '',
  });
  const [dataRange, setDataRange] = useState('');
  const { workbook, activeSheet, updateWorkbook } = useContext(ExcelContext);
  const { chartData, fetchChartData } = useChartData();

  useEffect(() => {
    if (chart) {
      setChartOptions({
        type: chart.type,
        title: chart.title,
        dataRange: chart.dataRange,
      });
      setDataRange(chart.dataRange);
      fetchChartData(chart.dataRange);
    }
  }, [chart, fetchChartData]);

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newType = event.target.value as ChartType;
    setChartOptions((prev) => ({ ...prev, type: newType }));
    if (chartData) {
      changeChartType(chartData, newType);
    }
  };

  const handleDataRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = event.target.value;
    setDataRange(newRange);
    fetchChartData(newRange);
  };

  const handleCreate = async () => {
    if (!chartData) return;

    try {
      if (chart) {
        // Update existing chart
        const updatedChart = await api.put(`/charts/${chart.id}`, {
          ...chartOptions,
          dataRange,
          data: chartData,
        });
        updateChartData(updatedChart);
      } else {
        // Create new chart
        const newChart = await api.post('/charts', {
          ...chartOptions,
          dataRange,
          data: chartData,
          workbookId: workbook.id,
          worksheetId: activeSheet.id,
        });
        createChart(newChart);
      }
      updateWorkbook();
      onClose();
    } catch (error) {
      console.error('Error creating/updating chart:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="chart-dialog-title">
      <DialogTitle id="chart-dialog-title">
        {chart ? 'Edit Chart' : 'Create New Chart'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="chart-title"
          label="Chart Title"
          type="text"
          fullWidth
          value={chartOptions.title}
          onChange={(e) => setChartOptions((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Select
          value={chartOptions.type}
          onChange={handleTypeChange}
          fullWidth
          margin="dense"
        >
          {Object.values(ChartType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          id="data-range"
          label="Data Range"
          type="text"
          fullWidth
          value={dataRange}
          onChange={handleDataRangeChange}
          placeholder="e.g., A1:B10"
        />
        {/* TODO: Add ChartContainer component here to preview the chart */}
        {/* <ChartContainer chartType={chartOptions.type} data={chartData} /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          {chart ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartDialog;