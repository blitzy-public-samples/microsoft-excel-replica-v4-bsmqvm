import { IChart } from '../interfaces/IChart';
import { ChartTypeEnum } from '../enums/ChartTypeEnum';
import { BaseModel } from './BaseModel';

export class ChartModel extends BaseModel implements IChart {
    id: string;
    type: ChartTypeEnum;
    title: string;
    dataRange: string;
    xAxis: IChartAxis;
    yAxis: IChartAxis;
    series: IChartSeries[];
    legend: IChartLegend;
    width: number;
    height: number;
    position: object;
    style: object;
    is3D: boolean;
    hasDataLabels: boolean;
    hasDataTable: boolean;
    hasErrorBars: boolean;
    hasTrendlines: boolean;

    constructor(props: Partial<IChart>) {
        super(props.id);
        this.type = props.type || ChartTypeEnum.Bar;
        this.title = props.title || '';
        this.dataRange = props.dataRange || '';
        this.xAxis = props.xAxis || { title: '', min: null, max: null };
        this.yAxis = props.yAxis || { title: '', min: null, max: null };
        this.series = props.series || [];
        this.legend = props.legend || { position: 'right', show: true };
        this.width = props.width || 500;
        this.height = props.height || 300;
        this.position = props.position || { x: 0, y: 0 };
        this.style = props.style || {};
        this.is3D = props.is3D || false;
        this.hasDataLabels = props.hasDataLabels || false;
        this.hasDataTable = props.hasDataTable || false;
        this.hasErrorBars = props.hasErrorBars || false;
        this.hasTrendlines = props.hasTrendlines || false;
    }

    updateProperties(props: Partial<IChart>): void {
        Object.assign(this, props);
        this.update();
    }

    toJSON(): IChart {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            dataRange: this.dataRange,
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            series: this.series,
            legend: this.legend,
            width: this.width,
            height: this.height,
            position: this.position,
            style: this.style,
            is3D: this.is3D,
            hasDataLabels: this.hasDataLabels,
            hasDataTable: this.hasDataTable,
            hasErrorBars: this.hasErrorBars,
            hasTrendlines: this.hasTrendlines
        };
    }
}