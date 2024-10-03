/**
 * This enumeration defines the different types of formulas available in Microsoft Excel.
 * It provides a standardized set of categories for different types of formulas.
 */
export enum FormulaTypeEnum {
    MATH = 'MATH',
    STATISTICAL = 'STATISTICAL',
    FINANCIAL = 'FINANCIAL',
    LOGICAL = 'LOGICAL',
    TEXT = 'TEXT',
    DATE_TIME = 'DATE_TIME',
    LOOKUP_REFERENCE = 'LOOKUP_REFERENCE',
    DATABASE = 'DATABASE',
    ENGINEERING = 'ENGINEERING',
    INFORMATION = 'INFORMATION',
    ARRAY = 'ARRAY',
    CUBE = 'CUBE',
    CUSTOM = 'CUSTOM'
}

// Export the enum as default for easier importing
export default FormulaTypeEnum;