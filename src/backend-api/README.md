# Microsoft Excel Backend API

This README provides an overview of the Microsoft Excel backend API, including setup instructions, usage guidelines, and other important information for developers.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Configuration](#configuration)
4. [API Documentation](#api-documentation)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contact](#contact)

## Introduction

The Microsoft Excel backend API is designed to provide RESTful endpoints for Excel functionalities, ensuring consistent performance across various platforms. This API is a crucial component of the Microsoft Excel ecosystem, enabling seamless integration with other Excel components and third-party applications.

Key features:
- Cross-platform accessibility
- Secure data handling with OAuth 2.0 authentication
- Comprehensive Excel operations support
- Scalable and performant architecture

## Getting Started

To set up the backend API locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/microsoft/excel-backend-api.git
   cd excel-backend-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

4. Start the development server:
   ```
   npm run dev
   ```

The API should now be running on `http://localhost:3000` (or the port specified in your `.env` file).

## Configuration

The API can be configured using environment variables. Key configuration options include:

- `PORT`: The port on which the server will run
- `DATABASE_URL`: Connection string for the database
- `JWT_SECRET`: Secret key for JWT token generation
- `CORS_ORIGIN`: Allowed origins for CORS

Refer to the `.env.example` file for a complete list of configuration options.

## API Documentation

Detailed API documentation is available via Swagger. When the server is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

This documentation provides a comprehensive overview of all available endpoints, request/response formats, and authentication requirements.

## Authentication

The API uses OAuth 2.0 for authentication. To access protected endpoints, you need to include a valid JWT token in the Authorization header of your requests:

```
Authorization: Bearer <your_token_here>
```

Refer to the authentication service documentation for details on obtaining and refreshing tokens.

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format. A typical error response looks like:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found."
  }
}
```

Refer to the error handling documentation for a complete list of error codes and their meanings.

## Rate Limiting

To ensure fair usage and system stability, the API implements rate limiting. Current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

When a limit is exceeded, the API will return a 429 (Too Many Requests) status code.

## Testing

To run the test suite:

```
npm test
```

This will run both unit and integration tests. For coverage reports:

```
npm run test:coverage
```

## Deployment

The API is designed to be deployed to Azure App Service. Deployment scripts and configurations can be found in the `infrastructure/` directory.

For manual deployment:

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

Refer to the deployment documentation for detailed instructions on setting up CI/CD pipelines.

## Contributing

We welcome contributions to the Microsoft Excel backend API! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or concerns, please open an issue on this repository or contact the Excel API team at excel-api-support@microsoft.com.