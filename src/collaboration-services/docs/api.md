# Collaboration Services API Documentation

## Introduction

This document provides detailed information about the API endpoints for the collaboration services in Microsoft Excel. It covers the available endpoints, request/response formats, authentication requirements, and other essential details for integrating with the collaboration features.

### Base URL

All API requests should be made to the following base URL:

```
https://api.excel.microsoft.com/collaboration/v1
```

### Authentication Methods

The Collaboration Services API supports the following authentication methods:

1. Microsoft Account (for personal users)
2. Azure Active Directory (for organizational accounts)
3. OAuth 2.0 with JWT tokens

For detailed information on authentication, please refer to the Authentication section below.

## General API Information

### Request/Response Format

All API requests and responses use JSON (JavaScript Object Notation) format. Ensure that the `Content-Type` header is set to `application/json` when making requests.

### Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of an error, the response body will contain additional details about the error.

Example error response:

```json
{
  "error": {
    "code": "InvalidInput",
    "message": "The provided session ID is not valid."
  }
}
```

### Rate Limiting

To ensure fair usage and system stability, the API implements rate limiting. The current limits are:

- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time at which the current rate limit window resets (Unix timestamp)

## Authentication

### Token-based Authentication

The API uses OAuth 2.0 for authentication. To authenticate your requests, include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Obtaining an Access Token

To obtain an access token:

1. Register your application in the Microsoft Azure portal
2. Implement the OAuth 2.0 authorization flow in your application
3. Exchange the authorization code for an access token

### Permissions and Scopes

The following scopes are available for the Collaboration Services API:

- `collaboration.read`: Read access to collaboration sessions
- `collaboration.write`: Write access to collaboration sessions
- `presence.read`: Read access to user presence information
- `presence.write`: Write access to user presence information
- `version-control.read`: Read access to version history
- `version-control.write`: Write access to version control operations
- `permissions.read`: Read access to document permissions
- `permissions.write`: Write access to manage document permissions

Ensure that your application requests the appropriate scopes during the OAuth authorization process.

## Endpoints

### Collaboration

#### Create a Collaboration Session

```
POST /api/collaboration/session
```

Create a new collaboration session for a document.

**Request Body:**

```json
{
  "documentId": "string",
  "ownerId": "string"
}
```

**Response:**

```json
{
  "sessionId": "string",
  "documentId": "string",
  "ownerId": "string",
  "createdAt": "string (ISO 8601 date-time)"
}
```

#### Get Collaboration Session

```
GET /api/collaboration/session/:id
```

Retrieve details of a specific collaboration session.

**Response:**

```json
{
  "sessionId": "string",
  "documentId": "string",
  "ownerId": "string",
  "createdAt": "string (ISO 8601 date-time)",
  "participants": [
    {
      "userId": "string",
      "joinedAt": "string (ISO 8601 date-time)"
    }
  ]
}
```

#### Update Collaboration Session

```
PUT /api/collaboration/session/:id
```

Update the details of a collaboration session.

**Request Body:**

```json
{
  "ownerId": "string"
}
```

**Response:**

```json
{
  "sessionId": "string",
  "documentId": "string",
  "ownerId": "string",
  "updatedAt": "string (ISO 8601 date-time)"
}
```

#### End Collaboration Session

```
DELETE /api/collaboration/session/:id
```

End a collaboration session.

**Response:**

```json
{
  "message": "Collaboration session ended successfully"
}
```

### Presence

#### Set User Presence

```
POST /api/presence/user
```

Set the presence status for a user in a collaboration session.

**Request Body:**

```json
{
  "sessionId": "string",
  "userId": "string",
  "status": "string (online|away|offline)"
}
```

**Response:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "status": "string",
  "lastUpdated": "string (ISO 8601 date-time)"
}
```

#### Get Users Presence

```
GET /api/presence/users/:sessionId
```

Get the presence status of all users in a collaboration session.

**Response:**

```json
{
  "sessionId": "string",
  "users": [
    {
      "userId": "string",
      "status": "string",
      "lastUpdated": "string (ISO 8601 date-time)"
    }
  ]
}
```

#### Update User Presence

```
PUT /api/presence/user/:userId
```

Update the presence status of a user in a collaboration session.

**Request Body:**

```json
{
  "sessionId": "string",
  "status": "string (online|away|offline)"
}
```

**Response:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "status": "string",
  "lastUpdated": "string (ISO 8601 date-time)"
}
```

#### Remove User Presence

```
DELETE /api/presence/user/:userId
```

Remove a user's presence from a collaboration session.

**Query Parameters:**

- `sessionId`: The ID of the collaboration session

**Response:**

```json
{
  "message": "User presence removed successfully"
}
```

### Version Control

#### Create a Commit

```
POST /api/version-control/commit
```

Create a new commit in the version history.

**Request Body:**

```json
{
  "documentId": "string",
  "userId": "string",
  "changes": [
    {
      "cellId": "string",
      "oldValue": "string",
      "newValue": "string"
    }
  ],
  "message": "string"
}
```

**Response:**

```json
{
  "commitId": "string",
  "documentId": "string",
  "userId": "string",
  "timestamp": "string (ISO 8601 date-time)",
  "message": "string"
}
```

#### Get Version History

```
GET /api/version-control/history/:documentId
```

Retrieve the version history for a document.

**Query Parameters:**

- `limit`: Maximum number of commits to return (default: 50)
- `offset`: Number of commits to skip (for pagination)

**Response:**

```json
{
  "documentId": "string",
  "commits": [
    {
      "commitId": "string",
      "userId": "string",
      "timestamp": "string (ISO 8601 date-time)",
      "message": "string"
    }
  ],
  "totalCommits": "number"
}
```

#### Get Diff Between Commits

```
GET /api/version-control/diff/:commitId1/:commitId2
```

Get the differences between two commits.

**Response:**

```json
{
  "commitId1": "string",
  "commitId2": "string",
  "differences": [
    {
      "cellId": "string",
      "oldValue": "string",
      "newValue": "string"
    }
  ]
}
```

#### Revert to a Previous Commit

```
POST /api/version-control/revert/:commitId
```

Revert the document to a previous commit.

**Response:**

```json
{
  "message": "Document reverted successfully",
  "newCommitId": "string"
}
```

### Permissions

#### Grant Permission

```
POST /api/permissions/grant
```

Grant permission to a user for a document.

**Request Body:**

```json
{
  "documentId": "string",
  "userId": "string",
  "permissionLevel": "string (read|write|admin)"
}
```

**Response:**

```json
{
  "permissionId": "string",
  "documentId": "string",
  "userId": "string",
  "permissionLevel": "string",
  "grantedAt": "string (ISO 8601 date-time)"
}
```

#### Get Document Permissions

```
GET /api/permissions/:documentId
```

Retrieve the permissions for a document.

**Response:**

```json
{
  "documentId": "string",
  "permissions": [
    {
      "permissionId": "string",
      "userId": "string",
      "permissionLevel": "string",
      "grantedAt": "string (ISO 8601 date-time)"
    }
  ]
}
```

#### Update Permission

```
PUT /api/permissions/:permissionId
```

Update an existing permission.

**Request Body:**

```json
{
  "permissionLevel": "string (read|write|admin)"
}
```

**Response:**

```json
{
  "permissionId": "string",
  "documentId": "string",
  "userId": "string",
  "permissionLevel": "string",
  "updatedAt": "string (ISO 8601 date-time)"
}
```

#### Revoke Permission

```
DELETE /api/permissions/:permissionId
```

Revoke a user's permission for a document.

**Response:**

```json
{
  "message": "Permission revoked successfully"
}
```

## WebSocket API

The Collaboration Services API also provides real-time functionality through WebSockets for live collaboration features.

### Connection Establishment

To establish a WebSocket connection, connect to the following URL:

```
wss://api.excel.microsoft.com/collaboration/v1/ws
```

Include the access token as a query parameter:

```
wss://api.excel.microsoft.com/collaboration/v1/ws?token=<access_token>
```

### Real-time Events

Once connected, you'll receive real-time events for the collaboration sessions you're participating in. Events are sent as JSON objects.

Example event:

```json
{
  "type": "cell_update",
  "data": {
    "sessionId": "string",
    "cellId": "string",
    "value": "string",
    "userId": "string",
    "timestamp": "string (ISO 8601 date-time)"
  }
}
```

### Handling Disconnections

If the WebSocket connection is lost, implement an exponential backoff strategy for reconnection attempts. Start with a short delay (e.g., 1 second) and increase it with each failed attempt, up to a maximum delay (e.g., 1 minute).

## Data Models

### Collaboration Session

```json
{
  "sessionId": "string",
  "documentId": "string",
  "ownerId": "string",
  "createdAt": "string (ISO 8601 date-time)",
  "participants": [
    {
      "userId": "string",
      "joinedAt": "string (ISO 8601 date-time)"
    }
  ]
}
```

### User Presence

```json
{
  "userId": "string",
  "sessionId": "string",
  "status": "string (online|away|offline)",
  "lastUpdated": "string (ISO 8601 date-time)"
}
```

### Version History

```json
{
  "commitId": "string",
  "documentId": "string",
  "userId": "string",
  "timestamp": "string (ISO 8601 date-time)",
  "message": "string",
  "changes": [
    {
      "cellId": "string",
      "oldValue": "string",
      "newValue": "string"
    }
  ]
}
```

### Permission

```json
{
  "permissionId": "string",
  "documentId": "string",
  "userId": "string",
  "permissionLevel": "string (read|write|admin)",
  "grantedAt": "string (ISO 8601 date-time)"
}
```

## Examples

### JavaScript (using fetch)

```javascript
async function createCollaborationSession(documentId, ownerId) {
  const response = await fetch('https://api.excel.microsoft.com/collaboration/v1/api/collaboration/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <access_token>'
    },
    body: JSON.stringify({
      documentId,
      ownerId
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}
```

### Python (using requests)

```python
import requests

def get_version_history(document_id, limit=50, offset=0):
    url = f"https://api.excel.microsoft.com/collaboration/v1/api/version-control/history/{document_id}"
    headers = {
        "Authorization": "Bearer <access_token>"
    }
    params = {
        "limit": limit,
        "offset": offset
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    
    return response.json()
```

## Changelog

### Version 1.0.0 (2023-06-01)
- Initial release of the Collaboration Services API

### Version 1.1.0 (2023-07-15)
- Added support for WebSocket real-time events
- Improved rate limiting with more granular controls

### Version 1.2.0 (2023-09-01)
- Introduced version control endpoints
- Enhanced permission management capabilities

For any deprecated features or breaking changes, a migration guide will be provided in future updates.