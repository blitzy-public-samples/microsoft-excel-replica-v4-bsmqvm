import { CellType } from '../types/excel';
import { parseFormula } from './formulaUtils';

/**
 * Retrieves the value of a cell, handling different data types.
 * @param cell The cell object to get the value from
 * @returns The value of the cell as a string or number
 */
export function getCellValue(cell: CellType): string | number {
    if (cell.type === 'number') {
        return cell.value as number;
    } else if (cell.type === 'formula') {
        // For simplicity, we're returning the formula string.
        // In a real implementation, this would evaluate the formula.
        return cell.formula;
    } else {
        return cell.value as string;
    }
}

/**
 * Sets the value of a cell, handling type conversion and formula detection.
 * @param cell The cell object to set the value for
 * @param value The value to set
 * @returns The updated cell object
 */
export function setCellValue(cell: CellType, value: string | number): CellType {
    if (typeof value === 'number') {
        cell.type = 'number';
        cell.value = value;
    } else if (typeof value === 'string') {
        if (value.startsWith('=')) {
            cell.type = 'formula';
            cell.formula = value;
            // In a real implementation, we would parse and evaluate the formula here
            cell.value = parseFormula(value);
        } else {
            cell.type = 'string';
            cell.value = value;
        }
    }
    return cell;
}

/**
 * Formats a cell value based on the specified format string.
 * @param value The value to format
 * @param format The format string to apply
 * @returns The formatted cell value as a string
 */
export function formatCellValue(value: any, format: string): string {
    // This is a simplified implementation. In a real-world scenario,
    // we would use a more robust formatting library.
    if (typeof value === 'number') {
        if (format.includes('%')) {
            return `${(value * 100).toFixed(2)}%`;
        } else if (format.includes('$')) {
            return `$${value.toFixed(2)}`;
        }
    } else if (value instanceof Date) {
        // Simple date formatting
        return value.toLocaleDateString();
    }
    return String(value);
}

/**
 * Converts row and column indices to a cell address (e.g., "A1", "B2").
 * @param rowIndex The zero-based row index
 * @param columnIndex The zero-based column index
 * @returns The cell address as a string
 */
export function getCellAddress(rowIndex: number, columnIndex: number): string {
    const column = String.fromCharCode(65 + columnIndex); // 65 is ASCII for 'A'
    const row = rowIndex + 1; // Adding 1 because row indices are 1-based in Excel
    return `${column}${row}`;
}

/**
 * Parses a cell address string into row and column indices.
 * @param address The cell address string (e.g., "A1", "B2")
 * @returns An object containing rowIndex and columnIndex
 */
export function parseCellAddress(address: string): { rowIndex: number; columnIndex: number } {
    const match = address.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
        throw new Error('Invalid cell address');
    }

    const column = match[1];
    const row = parseInt(match[2], 10);

    let columnIndex = 0;
    for (let i = 0; i < column.length; i++) {
        columnIndex = columnIndex * 26 + (column.charCodeAt(i) - 64);
    }

    return {
        rowIndex: row - 1, // Subtracting 1 to convert to zero-based index
        columnIndex: columnIndex - 1
    };
}

// Export types to maintain consistency with the specification
export type { CellType };