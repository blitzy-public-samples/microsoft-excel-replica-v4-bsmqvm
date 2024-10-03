/**
 * This enumeration defines the various cell format types available in Microsoft Excel.
 * It provides a standardized set of values for cell formatting options.
 */
export enum CellFormatEnum {
    /**
     * Default format for cells
     */
    GENERAL = 'general',

    /**
     * Numeric format with configurable decimal places
     */
    NUMBER = 'number',

    /**
     * Monetary values with currency symbol
     */
    CURRENCY = 'currency',

    /**
     * Financial format with aligned decimal points
     */
    ACCOUNTING = 'accounting',

    /**
     * Various date formats
     */
    DATE = 'date',

    /**
     * Various time formats
     */
    TIME = 'time',

    /**
     * Numeric values displayed as percentages
     */
    PERCENTAGE = 'percentage',

    /**
     * Numbers displayed as fractions
     */
    FRACTION = 'fraction',

    /**
     * Scientific notation format
     */
    SCIENTIFIC = 'scientific',

    /**
     * Plain text format
     */
    TEXT = 'text',

    /**
     * Special formats like zip codes, phone numbers
     */
    SPECIAL = 'special',

    /**
     * User-defined custom formats
     */
    CUSTOM = 'custom'
}

// Export the enum as default for easier importing
export default CellFormatEnum;

/**
 * NOTE: This enum is used in the cell interface for typing the format property.
 * It may also be used by FormatUtils for formatting operations.
 */