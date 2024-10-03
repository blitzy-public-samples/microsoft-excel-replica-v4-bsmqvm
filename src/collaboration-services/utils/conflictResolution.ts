import { generateDiff, applyPatch, mergeDiffs, diffCells, patchCell, CellData, CellDiff } from '../utils/diffPatch';
import { CollaborationSessionDocument } from '../models/collaborationSession';
import { IWorkbook, IWorksheet, ICell } from '../../shared/interfaces';

/**
 * Resolves conflicts between user changes and server changes based on a common base version
 * @param baseVersion The common base version of the workbook
 * @param userVersion The user's version of the workbook
 * @param serverVersion The server's version of the workbook
 * @returns The resolved workbook with conflicts merged
 */
export function resolveConflict(baseVersion: IWorkbook, userVersion: IWorkbook, serverVersion: IWorkbook): IWorkbook {
    const resolvedWorkbook: IWorkbook = JSON.parse(JSON.stringify(baseVersion));

    for (let i = 0; i < resolvedWorkbook.worksheets.length; i++) {
        const baseWorksheet = baseVersion.worksheets[i];
        const userWorksheet = userVersion.worksheets[i];
        const serverWorksheet = serverVersion.worksheets[i];

        resolvedWorkbook.worksheets[i] = mergeWorksheets(baseWorksheet, userWorksheet, serverWorksheet);
    }

    return resolvedWorkbook;
}

/**
 * Merges changes from user and server versions of a worksheet
 * @param baseWorksheet The base version of the worksheet
 * @param userWorksheet The user's version of the worksheet
 * @param serverWorksheet The server's version of the worksheet
 * @returns The merged worksheet
 */
export function mergeWorksheets(baseWorksheet: IWorksheet, userWorksheet: IWorksheet, serverWorksheet: IWorksheet): IWorksheet {
    const mergedWorksheet: IWorksheet = JSON.parse(JSON.stringify(baseWorksheet));

    for (let row = 0; row < mergedWorksheet.cells.length; row++) {
        for (let col = 0; col < mergedWorksheet.cells[row].length; col++) {
            const baseCell = baseWorksheet.cells[row][col];
            const userCell = userWorksheet.cells[row][col];
            const serverCell = serverWorksheet.cells[row][col];

            mergedWorksheet.cells[row][col] = mergeCells(baseCell, userCell, serverCell);
        }
    }

    return mergedWorksheet;
}

/**
 * Merges changes from user and server versions of a cell
 * @param baseCell The base version of the cell
 * @param userCell The user's version of the cell
 * @param serverCell The server's version of the cell
 * @returns The merged cell
 */
export function mergeCells(baseCell: ICell, userCell: ICell, serverCell: ICell): ICell {
    const mergedCell: ICell = { ...baseCell };

    mergedCell.value = resolveValueConflict(baseCell.value, userCell.value, serverCell.value);
    mergedCell.formula = resolveFormulaConflict(baseCell.formula, userCell.formula, serverCell.formula);
    mergedCell.format = resolveFormatConflict(baseCell.format, userCell.format, serverCell.format);

    return mergedCell;
}

/**
 * Resolves conflicts between user and server changes to a cell's value
 * @param baseValue The base value of the cell
 * @param userValue The user's value of the cell
 * @param serverValue The server's value of the cell
 * @returns The resolved cell value
 */
export function resolveValueConflict(baseValue: string, userValue: string, serverValue: string): string {
    if (userValue === serverValue) {
        return userValue;
    }

    if (userValue === baseValue) {
        return serverValue;
    }

    if (serverValue === baseValue) {
        return userValue;
    }

    // If both user and server made changes, use a merging strategy or last-write-wins
    // For simplicity, we'll use last-write-wins here
    return serverValue;
}

/**
 * Resolves conflicts between user and server changes to a cell's formula
 * @param baseFormula The base formula of the cell
 * @param userFormula The user's formula of the cell
 * @param serverFormula The server's formula of the cell
 * @returns The resolved cell formula
 */
export function resolveFormulaConflict(baseFormula: string, userFormula: string, serverFormula: string): string {
    if (userFormula === serverFormula) {
        return userFormula;
    }

    if (userFormula === baseFormula) {
        return serverFormula;
    }

    if (serverFormula === baseFormula) {
        return userFormula;
    }

    // If both user and server made changes, use a merging strategy or last-write-wins
    // For simplicity, we'll use last-write-wins here
    return serverFormula;
}

/**
 * Resolves conflicts between user and server changes to a cell's formatting
 * @param baseFormat The base formatting of the cell
 * @param userFormat The user's formatting of the cell
 * @param serverFormat The server's formatting of the cell
 * @returns The resolved cell formatting
 */
export function resolveFormatConflict(baseFormat: any, userFormat: any, serverFormat: any): any {
    const mergedFormat: any = { ...baseFormat };

    for (const key in serverFormat) {
        if (userFormat[key] === serverFormat[key]) {
            mergedFormat[key] = serverFormat[key];
        } else if (userFormat[key] === baseFormat[key]) {
            mergedFormat[key] = serverFormat[key];
        } else if (serverFormat[key] === baseFormat[key]) {
            mergedFormat[key] = userFormat[key];
        } else {
            // If both user and server made changes, use a priority system or last-write-wins
            // For simplicity, we'll use last-write-wins here
            mergedFormat[key] = serverFormat[key];
        }
    }

    return mergedFormat;
}