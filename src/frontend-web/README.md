# Microsoft Excel Web Frontend

This README serves as the primary documentation for the frontend web application of Microsoft Excel, providing developers with essential information about the project structure, setup instructions, and development guidelines.

## 1. Introduction

The Microsoft Excel web frontend is a crucial component of the cross-platform Excel application, ensuring consistent functionality and user experience across desktop, web, and mobile platforms. This web-based version leverages modern web technologies to deliver a powerful spreadsheet application accessible through web browsers.

## 2. Project Structure

The frontend-web project is organized as follows:

```
src/frontend-web/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Ribbon/
│   │   ├── FormulaBar/
│   │   ├── Grid/
│   │   ├── Sheets/
│   │   ├── Charts/
│   │   └── Dialogs/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── __tests__/
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## 3. Setup Instructions

To set up the development environment for the Excel web frontend:

1. Ensure you have Node.js (v14+) and npm (v6+) installed.
2. Clone the repository and navigate to the `src/frontend-web` directory.
3. Run `npm install` to install dependencies.
4. Create a `.env` file based on `.env.example` and configure environment variables.
5. Run `npm start` to start the development server.
6. Open `http://localhost:3000` in your browser to view the application.

## 4. Development Guidelines

- Follow the TypeScript coding standards and use strict type checking.
- Use React functional components and hooks for state management.
- Implement responsive design for cross-device compatibility.
- Write unit tests for components and utility functions.
- Use the shared constants, interfaces, and utilities from the `src/shared` directory.

## 5. Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Formats code using Prettier.

## 6. Key Dependencies

- React: JavaScript library for building user interfaces
- TypeScript: Typed superset of JavaScript
- Webpack: Module bundler for the application
- Jest: Testing framework for unit and integration tests

## 7. Deployment

The frontend web application is deployed using Azure App Service. Refer to the `infrastructure/` directory for deployment scripts and configuration.

## 8. Contributing

1. Fork the repository and create a new branch for your feature or bug fix.
2. Follow the coding standards and development guidelines.
3. Write tests for new features or modifications.
4. Submit a pull request with a clear description of your changes.

## 9. Troubleshooting

- If you encounter build errors, ensure all dependencies are installed and up to date.
- Check the browser console for any runtime errors or warnings.
- Verify that your Node.js and npm versions meet the minimum requirements.

## 10. Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/concepts/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

For any additional questions or support, please contact the Excel development team.