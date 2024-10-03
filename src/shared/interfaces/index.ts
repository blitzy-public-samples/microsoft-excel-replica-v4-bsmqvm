// This file serves as the central export point for all shared interfaces used across the Microsoft Excel application,
// facilitating easy import and usage of these interfaces throughout the project.

// Import interfaces
import { ICell } from './ICell';
import { IWorksheet } from './IWorksheet';
import { IWorkbook } from './IWorkbook';
import { IChart } from './IChart';
import { IFormula } from './IFormula';
import { IUser } from './IUser';

// Export interfaces
export {
    ICell,
    IWorksheet,
    IWorkbook,
    IChart,
    IFormula,
    IUser
};

// This file addresses the following requirements:
// 1. Cross-platform Accessibility: By centralizing interface exports, it ensures consistent functionality
//    and user experience across desktop, web, and mobile platforms.
// 2. Data Management: These interfaces provide a foundation for efficient input, storage, and organization
//    of structured data throughout the application.