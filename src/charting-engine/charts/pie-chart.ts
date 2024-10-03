import { ChartBase } from '../core/chart-base';
import { ChartType } from '../types/chart-types';
import { ChartOptions } from '../types/chart-options';
import { ColorUtils } from '../utils/color-utils';
import { MathUtils } from '../utils/math-utils';

interface PieSlice {
    value: number;
    percentage: number;
    color: string;
    startAngle: number;
    endAngle: number;
    label: string;
}

export class PieChart extends ChartBase {
    private slices: PieSlice[] = [];
    private totalValue: number = 0;

    constructor(options: ChartOptions) {
        super(options);
        this.type = ChartType.Pie;
    }

    public render(): void {
        this.calculateSlices();
        this.drawChart();
        this.drawLabels();
    }

    private calculateSlices(): void {
        this.totalValue = this.data.reduce((sum, dataPoint) => sum + dataPoint.value, 0);
        let startAngle = 0;

        this.slices = this.data.map((dataPoint, index) => {
            const percentage = (dataPoint.value / this.totalValue) * 100;
            const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
            const slice: PieSlice = {
                value: dataPoint.value,
                percentage,
                color: ColorUtils.getColor(index, this.options.colors),
                startAngle,
                endAngle,
                label: dataPoint.label
            };
            startAngle = endAngle;
            return slice;
        });
    }

    private drawChart(): void {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        this.slices.forEach(slice => {
            this.drawSlice(slice, radius);
        });

        this.ctx.restore();
    }

    private drawSlice(slice: PieSlice, radius: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, radius, slice.startAngle, slice.endAngle);
        this.ctx.closePath();
        this.ctx.fillStyle = slice.color;
        this.ctx.fill();

        if (this.options.borderWidth && this.options.borderWidth > 0) {
            this.ctx.strokeStyle = this.options.borderColor || '#ffffff';
            this.ctx.lineWidth = this.options.borderWidth;
            this.ctx.stroke();
        }
    }

    private drawLabels(): void {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `${this.options.fontSize || 12}px ${this.options.fontFamily || 'Arial'}`;

        this.slices.forEach(slice => {
            const midAngle = (slice.startAngle + slice.endAngle) / 2;
            const labelRadius = radius * 1.2;
            const x = centerX + Math.cos(midAngle) * labelRadius;
            const y = centerY + Math.sin(midAngle) * labelRadius;

            this.ctx.fillStyle = this.options.fontColor || '#000000';
            this.ctx.fillText(slice.label, x, y);

            if (this.options.showPercentages) {
                const percentageY = y + (this.options.fontSize || 12) + 2;
                this.ctx.fillText(`${MathUtils.roundToDecimal(slice.percentage, 1)}%`, x, percentageY);
            }
        });
    }
}