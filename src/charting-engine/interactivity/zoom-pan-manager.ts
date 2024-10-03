import { IChartBase } from '../types/chart-types';
import { MathUtils } from '../utils/math-utils';

export class ZoomPanManager {
    private chart: IChartBase;
    private zoomLevel: number;
    private panOffset: { x: number; y: number };
    private isDragging: boolean;
    private lastMousePosition: { x: number; y: number };

    constructor(chart: IChartBase) {
        this.chart = chart;
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastMousePosition = { x: 0, y: 0 };
    }

    public enableZoomPan(): void {
        this.chart.getContainer().addEventListener('wheel', this.handleWheel.bind(this));
        this.chart.getContainer().addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    public disableZoomPan(): void {
        this.chart.getContainer().removeEventListener('wheel', this.handleWheel.bind(this));
        this.chart.getContainer().removeEventListener('mousedown', this.handleMouseDown.bind(this));
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    public zoomIn(factor: number): void {
        this.zoomLevel *= factor;
        this.applyZoomPan();
    }

    public zoomOut(factor: number): void {
        this.zoomLevel /= factor;
        this.applyZoomPan();
    }

    public resetZoomPan(): void {
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.applyZoomPan();
    }

    private handleWheel(event: WheelEvent): void {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        const mouseX = event.clientX - this.chart.getContainer().getBoundingClientRect().left;
        const mouseY = event.clientY - this.chart.getContainer().getBoundingClientRect().top;

        this.zoomLevel *= zoomFactor;
        this.panOffset.x += (mouseX - this.panOffset.x) * (1 - zoomFactor);
        this.panOffset.y += (mouseY - this.panOffset.y) * (1 - zoomFactor);

        this.applyZoomPan();
    }

    private handleMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.lastMousePosition.x;
        const deltaY = event.clientY - this.lastMousePosition.y;

        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;

        this.lastMousePosition = { x: event.clientX, y: event.clientY };
        this.applyZoomPan();
    }

    private handleMouseUp(): void {
        this.isDragging = false;
    }

    private applyZoomPan(): void {
        // Clamp zoom level to prevent extreme zooming
        this.zoomLevel = MathUtils.clamp(this.zoomLevel, 0.1, 10);

        // Apply zoom and pan transformations to the chart
        const transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
        this.chart.setTransform(transform);

        // Update chart components that need to be aware of zoom and pan
        this.chart.updateAxes(this.zoomLevel, this.panOffset);
        this.chart.updateDataPoints(this.zoomLevel, this.panOffset);

        // Trigger a re-render of the chart
        this.chart.render();
    }
}