import { faker } from '@faker-js/faker';

// Define interfaces based on the JSON specification
interface ICell {
    value: any;
    formula?: string;
    format?: string;
}

interface IWorksheet {
    name: string;
    cells: { [key: string]: ICell };
}

interface IWorkbook {
    name: string;
    sheets: IWorksheet[];
}

interface IChart {
    type: string;
    data: any;
    options: any;
}

interface IFormula {
    expression: string;
    result: any;
}

interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const generateMockCell = (options: Partial<ICell> = {}): ICell => {
    return {
        value: options.value ?? faker.datatype.any(),
        formula: options.formula,
        format: options.format ?? faker.helpers.arrayElement(['General', 'Number', 'Currency', 'Date', 'Percentage']),
    };
};

export const generateMockWorksheet = (options: Partial<IWorksheet> = {}): IWorksheet => {
    const cells: { [key: string]: ICell } = {};
    const cellCount = faker.datatype.number({ min: 10, max: 100 });

    for (let i = 0; i < cellCount; i++) {
        const column = String.fromCharCode(65 + faker.datatype.number({ min: 0, max: 25 }));
        const row = faker.datatype.number({ min: 1, max: 100 });
        cells[`${column}${row}`] = generateMockCell();
    }

    return {
        name: options.name ?? faker.lorem.word(),
        cells: options.cells ?? cells,
    };
};

export const generateMockWorkbook = (options: Partial<IWorkbook> = {}): IWorkbook => {
    const sheetCount = options.sheets?.length ?? faker.datatype.number({ min: 1, max: 5 });
    const sheets = [];

    for (let i = 0; i < sheetCount; i++) {
        sheets.push(generateMockWorksheet());
    }

    return {
        name: options.name ?? faker.lorem.words(2),
        sheets: options.sheets ?? sheets,
    };
};

export const generateMockChart = (options: Partial<IChart> = {}): IChart => {
    return {
        type: options.type ?? faker.helpers.arrayElement(['bar', 'line', 'pie', 'scatter']),
        data: options.data ?? {
            labels: faker.helpers.arrayElements(['A', 'B', 'C', 'D', 'E'], 5),
            datasets: [{
                label: faker.lorem.word(),
                data: faker.helpers.arrayElements([10, 20, 30, 40, 50], 5),
            }],
        },
        options: options.options ?? {
            responsive: true,
            title: {
                display: true,
                text: faker.lorem.sentence(),
            },
        },
    };
};

export const generateMockFormula = (options: Partial<IFormula> = {}): IFormula => {
    return {
        expression: options.expression ?? `=SUM(A1:A${faker.datatype.number({ min: 2, max: 10 })})`,
        result: options.result ?? faker.datatype.number({ min: 0, max: 1000 }),
    };
};

export const generateMockUser = (options: Partial<IUser> = {}): IUser => {
    return {
        id: options.id ?? faker.datatype.uuid(),
        name: options.name ?? faker.name.fullName(),
        email: options.email ?? faker.internet.email(),
        role: options.role ?? faker.helpers.arrayElement(['Viewer', 'Editor', 'Admin']),
    };
};