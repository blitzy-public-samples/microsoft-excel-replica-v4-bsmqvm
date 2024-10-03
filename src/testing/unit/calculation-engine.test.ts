import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CalculationEngine } from '../../calculation-engine/CalculationEngine';
import { createMockWorkbook, createMockWorksheet, createMockCell } from '../utils/test-helpers';
import { generateMockFormula } from '../utils/mock-data-generator';
import { IFormula } from '../../shared/interfaces/IFormula';
import { FormulaResult } from '../../shared/types/FormulaTypes';

describe('CalculationEngine', () => {
  let calculationEngine: CalculationEngine;
  let mockWorkbook: ReturnType<typeof createMockWorkbook>;
  let mockWorksheet: ReturnType<typeof createMockWorksheet>;

  beforeEach(() => {
    mockWorkbook = createMockWorkbook();
    mockWorksheet = createMockWorksheet(mockWorkbook);
    calculationEngine = new CalculationEngine();
  });

  describe('Formula Calculation', () => {
    it('should correctly calculate a simple arithmetic formula', () => {
      const formula: IFormula = {
        text: '=1+2',
        type: 'Arithmetic',
        references: []
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe(3);
    });

    it('should handle cell references in formulas', () => {
      const cellA1 = createMockCell(mockWorksheet, 'A1', 5);
      const cellB1 = createMockCell(mockWorksheet, 'B1', 3);
      const formula: IFormula = {
        text: '=A1+B1',
        type: 'Arithmetic',
        references: ['A1', 'B1']
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe(8);
    });

    it('should handle complex nested formulas', () => {
      const cellA1 = createMockCell(mockWorksheet, 'A1', 10);
      const cellB1 = createMockCell(mockWorksheet, 'B1', 5);
      const cellC1 = createMockCell(mockWorksheet, 'C1', 2);
      const formula: IFormula = {
        text: '=((A1+B1)*C1)/2',
        type: 'Arithmetic',
        references: ['A1', 'B1', 'C1']
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe(15);
    });

    it('should handle errors in formulas', () => {
      const formula: IFormula = {
        text: '=1/0',
        type: 'Arithmetic',
        references: []
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe('#DIV/0!');
    });
  });

  describe('Array Formulas', () => {
    it('should correctly calculate an array formula', () => {
      const cellRange = [
        createMockCell(mockWorksheet, 'A1', 1),
        createMockCell(mockWorksheet, 'A2', 2),
        createMockCell(mockWorksheet, 'A3', 3)
      ];
      const formula: IFormula = {
        text: '=SUM(A1:A3)',
        type: 'Array',
        references: ['A1:A3']
      };
      const result = calculationEngine.calculateArrayFormula(formula, mockWorksheet);
      expect(result).toBe(6);
    });
  });

  describe('Dynamic Arrays', () => {
    it('should handle dynamic array formulas', () => {
      const formula: IFormula = {
        text: '=SEQUENCE(3,2)',
        type: 'DynamicArray',
        references: []
      };
      const result = calculationEngine.calculateDynamicArrayFormula(formula, mockWorksheet);
      expect(result).toEqual([
        [1, 1],
        [2, 2],
        [3, 3]
      ]);
    });
  });

  describe('Cross-platform Consistency', () => {
    it('should produce consistent results across platforms', () => {
      const formula: IFormula = generateMockFormula('Complex');
      const desktopResult = calculationEngine.calculateFormula(formula, mockWorksheet);
      const webResult = calculationEngine.calculateFormula(formula, mockWorksheet);
      const mobileResult = calculationEngine.calculateFormula(formula, mockWorksheet);

      expect(desktopResult).toEqual(webResult);
      expect(webResult).toEqual(mobileResult);
    });
  });

  describe('Performance', () => {
    it('should calculate large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => i + 1);
      const formula: IFormula = {
        text: '=SUM(A1:A10000)',
        type: 'Array',
        references: ['A1:A10000']
      };

      const startTime = performance.now();
      const result = calculationEngine.calculateArrayFormula(formula, mockWorksheet);
      const endTime = performance.now();

      expect(result).toBe(50005000); // Sum of numbers from 1 to 10000
      expect(endTime - startTime).toBeLessThan(100); // Assuming 100ms is an acceptable threshold
    });
  });

  describe('Error Handling', () => {
    it('should handle circular references', () => {
      const cellA1 = createMockCell(mockWorksheet, 'A1', '=B1');
      const cellB1 = createMockCell(mockWorksheet, 'B1', '=A1');
      const formula: IFormula = {
        text: '=A1',
        type: 'Reference',
        references: ['A1']
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe('#CIRCULAR!');
    });

    it('should handle #NAME? errors for undefined functions', () => {
      const formula: IFormula = {
        text: '=UNKNOWNFUNCTION()',
        type: 'Function',
        references: []
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe('#NAME?');
    });
  });

  describe('Function Library', () => {
    it('should correctly calculate statistical functions', () => {
      const cellRange = [
        createMockCell(mockWorksheet, 'A1', 1),
        createMockCell(mockWorksheet, 'A2', 2),
        createMockCell(mockWorksheet, 'A3', 3),
        createMockCell(mockWorksheet, 'A4', 4),
        createMockCell(mockWorksheet, 'A5', 5)
      ];
      const formula: IFormula = {
        text: '=AVERAGE(A1:A5)',
        type: 'Statistical',
        references: ['A1:A5']
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(result).toBe(3);
    });

    it('should correctly calculate financial functions', () => {
      const formula: IFormula = {
        text: '=NPV(0.1, 100, 200, 300)',
        type: 'Financial',
        references: []
      };
      const result = calculationEngine.calculateFormula(formula, mockWorksheet);
      expect(Number(result.toFixed(2))).toBe(481.59);
    });
  });
});