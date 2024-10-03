import { ChartTypes } from '../types/chart-types';
import { SVGRenderer } from '../renderers/svg-renderer';
import { ImageExporter } from './image-exporter';
import xmlserializer from 'xmlserializer';

/**
 * Options for SVG export
 */
export interface SVGExportOptions {
    width: number;
    height: number;
    preserveAspectRatio: boolean;
    includeLegend: boolean;
    includeTitle: boolean;
    optimizeSVG: boolean;
}

/**
 * Metadata for SVG export
 */
export interface SVGMetadata {
    creator: string;
    creationDate: Date;
    excelVersion: string;
    chartId: string;
}

/**
 * Exports the given chart as an SVG string.
 * @param chart The chart to export
 * @param options Export options
 * @returns SVG string representation of the chart
 */
export function exportToSVG(chart: ChartTypes, options: SVGExportOptions): string {
    // Validate input parameters
    if (!chart || !options) {
        throw new Error('Invalid input parameters');
    }

    // Create SVG renderer instance
    const renderer = new SVGRenderer();

    // Render chart to SVG
    const svgElement = renderer.render(chart, options.width, options.height);

    // Apply export options
    applyExportOptions(svgElement, options);

    // Convert SVG element to string
    let svgString = xmlserializer.serializeToString(svgElement);

    // Clean up SVG
    if (options.optimizeSVG) {
        svgString = cleanupSVG(svgString);
    }

    // Add metadata
    const metadata: SVGMetadata = {
        creator: 'Microsoft Excel',
        creationDate: new Date(),
        excelVersion: '16.0',
        chartId: chart.id || 'unknown'
    };
    svgString = addMetadata(svgString, metadata);

    return svgString;
}

/**
 * Applies export options to the SVG element.
 * @param svgElement The SVG element to modify
 * @param options Export options
 */
function applyExportOptions(svgElement: SVGElement, options: SVGExportOptions): void {
    svgElement.setAttribute('width', options.width.toString());
    svgElement.setAttribute('height', options.height.toString());
    
    if (options.preserveAspectRatio) {
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    } else {
        svgElement.setAttribute('preserveAspectRatio', 'none');
    }

    if (!options.includeLegend) {
        const legend = svgElement.querySelector('.chart-legend');
        if (legend) {
            legend.remove();
        }
    }

    if (!options.includeTitle) {
        const title = svgElement.querySelector('.chart-title');
        if (title) {
            title.remove();
        }
    }
}

/**
 * Cleans up the SVG string by removing unnecessary attributes and optimizing the output.
 * @param svgString SVG string to clean up
 * @returns Cleaned up SVG string
 */
function cleanupSVG(svgString: string): string {
    // Parse SVG string to DOM
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

    // Remove unnecessary attributes
    const elementsToClean = svgDoc.querySelectorAll('*');
    elementsToClean.forEach((el) => {
        el.removeAttribute('data-name');
        el.removeAttribute('data-id');
    });

    // Optimize SVG structure (example: remove empty groups)
    const emptyGroups = svgDoc.querySelectorAll('g:empty');
    emptyGroups.forEach((group) => group.remove());

    // Convert cleaned DOM back to string
    return xmlserializer.serializeToString(svgDoc);
}

/**
 * Adds metadata to the SVG string.
 * @param svgString SVG string to add metadata to
 * @param metadata Metadata to add
 * @returns SVG string with added metadata
 */
function addMetadata(svgString: string, metadata: SVGMetadata): string {
    // Parse SVG string to DOM
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

    // Create metadata elements
    const metadataElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    for (const [key, value] of Object.entries(metadata)) {
        const metaItem = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'meta');
        metaItem.setAttribute('name', key);
        metaItem.setAttribute('content', value.toString());
        metadataElement.appendChild(metaItem);
    }

    // Add metadata elements to SVG
    const svgRoot = svgDoc.documentElement;
    svgRoot.insertBefore(metadataElement, svgRoot.firstChild);

    // Convert updated DOM back to string
    return xmlserializer.serializeToString(svgDoc);
}

// Export the SVGExportOptions and SVGMetadata interfaces
export { SVGExportOptions, SVGMetadata };