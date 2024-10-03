import { ChartTypes } from '../types/chart-types';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';
import { formatFileName } from '../utils/formatting-utils';
import * as fs from 'fs';
import { createCanvas, Canvas } from 'canvas';

interface IExportOptions {
  format: 'png' | 'jpeg' | 'svg';
  quality?: number;
  backgroundColor?: string;
  scale?: number;
  fileName?: string;
}

export async function exportChartAsImage(chart: ChartTypes, options: IExportOptions): Promise<string> {
  // Validate input
  if (!chart || !options) {
    throw new Error('Invalid input: chart and options are required');
  }

  // Determine the appropriate renderer
  const renderer = options.format === 'svg' ? new SVGRenderer() : new CanvasRenderer();

  // Render the chart
  const renderedChart = options.format === 'svg' 
    ? renderChartToSVG(chart) 
    : renderChartToCanvas(chart, options.scale || 1);

  // Apply transformations
  if (options.backgroundColor && options.format !== 'svg') {
    applyBackgroundColor(renderedChart, options.backgroundColor);
  }

  // Convert to desired format
  const imageBuffer = await convertToFormat(renderedChart, options);

  // Save the image file
  const filePath = saveImageFile(imageBuffer, options.fileName || 'chart', options.format);

  return filePath;
}

function renderChartToSVG(chart: ChartTypes): string {
  const svgRenderer = new SVGRenderer();
  return svgRenderer.render(chart);
}

function renderChartToCanvas(chart: ChartTypes, scale: number): Canvas {
  const canvasRenderer = new CanvasRenderer();
  const canvas = createCanvas(chart.width * scale, chart.height * scale);
  canvasRenderer.render(chart, canvas);
  return canvas;
}

function applyBackgroundColor(canvas: Canvas, color: string): void {
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

async function convertToFormat(renderedChart: string | Canvas, options: IExportOptions): Promise<Buffer> {
  if (options.format === 'svg') {
    return Buffer.from(renderedChart as string);
  } else {
    const canvas = renderedChart as Canvas;
    const format = options.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = options.quality || 0.92;
    return canvas.toBuffer(format, { quality });
  }
}

function saveImageFile(buffer: Buffer, fileName: string, format: string): string {
  const formattedFileName = formatFileName(`${fileName}.${format}`);
  const filePath = `./${formattedFileName}`;
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function renderChartToSVG(chart: ChartTypes): string {
  const svgRenderer = new SVGRenderer();
  return svgRenderer.render(chart);
}

export function renderChartToCanvas(chart: ChartTypes, width: number, height: number): Canvas {
  const canvasRenderer = new CanvasRenderer();
  const canvas = createCanvas(width, height);
  canvasRenderer.render(chart, canvas);
  return canvas;
}

export async function convertSVGToPNG(svgString: string, width: number, height: number): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  await new Promise(resolve => img.onload = resolve);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toBuffer('image/png');
}

export async function convertSVGToJPEG(svgString: string, width: number, height: number, quality: number): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
  await new Promise(resolve => img.onload = resolve);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toBuffer('image/jpeg', { quality });
}

export function saveImageFile(buffer: Buffer, fileName: string, format: string): string {
  const formattedFileName = formatFileName(`${fileName}.${format}`);
  const filePath = `./${formattedFileName}`;
  fs.writeFileSync(filePath, buffer);
  return filePath;
}