# API Keys Dashboard - API Documentation

This application provides a complete CRUD API for managing API keys.

## API Endpoints

### 1. Get All API Keys
- **GET** `/api/keys`
- **Description**: Retrieve all API keys
- **Response**: Array of API key objects

### 2. Create New API Key
- **POST** `/api/keys`
- **Description**: Create a new API key
- **Request Body**:
  ```json
  {
    "name": "string (required)",
    "description": "string (optional)"
  }
  ```
- **Response**: Created API key object

### 3. Get Specific API Key
- **GET** `/api/keys/[id]`
- **Description**: Retrieve a specific API key by ID
- **Response**: API key object or 404 if not found

### 4. Update API Key
- **PUT** `/api/keys/[id]`
- **Description**: Update an existing API key
- **Request Body**:
  ```json
  {
    "name": "string (optional)",
    "description": "string (optional)",
    "isActive": "boolean (optional)"
  }
  ```
- **Response**: Updated API key object

### 5. Delete API Key
- **DELETE** `/api/keys/[id]`
- **Description**: Delete an API key
- **Response**: Success message

## API Key Object Structure

```typescript
interface ApiKey {
  id: string;           // Unique identifier
  name: string;         // Display name
  key: string;          // Generated API key (starts with "sk-")
  description: string;  // Optional description
  createdAt: string;    // ISO timestamp
  lastUsed?: string;    // Optional last usage timestamp
  isActive: boolean;    // Active/inactive status
}
```

## Features

- ✅ Create new API keys with custom names and descriptions
- ✅ View all API keys in a table format
- ✅ Edit existing API keys (name, description, status)
- ✅ Delete API keys with confirmation
- ✅ Toggle API key active/inactive status
- ✅ Copy API keys to clipboard
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time updates without page refresh

## Usage

1. Navigate to the home page
2. Click "🔑 API Keys Dashboard" button
3. Use the dashboard to manage your API keys
4. Create, edit, delete, or toggle status of API keys as needed

## Technical Notes

- Uses in-memory storage for demo purposes
- In production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- API keys are generated with 40 random characters prefixed with "sk-"
- All operations are performed client-side with server-side API validation
