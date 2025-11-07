# Social Media Backend API

A RESTful API backend for a social media application with blog functionality, user authentication, and image uploads.

## Features

- User authentication (signup, login)
- Blog CRUD operations
- Image upload functionality
- JWT-based authentication
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd socialmedia-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | /api/user/signup | Register a new user | No |
| POST | /api/user/login | Login user | No |
| GET | /api/user/me | Get current user | Yes |
| GET | /api/user/:id | Get user by ID | Yes |

### Blog Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /api/blog/all-blog | Get all blogs | No |
| GET | /api/blog/get-blog/:id | Get blog by ID | No |
| GET | /api/blog/user-blog/:userId | Get blogs by user ID | No |
| POST | /api/blog/add-blog | Create a new blog | Yes |
| PUT | /api/blog/update-blog/:id | Update a blog | Yes |
| DELETE | /api/blog/delete-blog/:id | Delete a blog | Yes |

### Upload Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | /api/upload | Upload an image | Yes |

## API Request & Response Examples

### User Signup

**Request:**
```
POST /api/user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Login

**Request:**
```
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Blog

**Request:**
```
POST /api/blog/add-blog
Content-Type: multipart/form-data
Authorization: Bearer jwt_token_here

{
  "title": "My First Blog",
  "description": "This is my first blog post",
  "content": "Lorem ipsum dolor sit amet...",
  "image": [file upload]
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Blog created successfully",
  "data": {
    "_id": "blog_id",
    "title": "My First Blog",
    "description": "This is my first blog post",
    "content": "Lorem ipsum dolor sit amet...",
    "image": "uploads/image_filename.jpg",
    "user": "user_id",
    "createdAt": "2023-05-16T10:00:00.000Z",
    "updatedAt": "2023-05-16T10:00:00.000Z"
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Deployment

The backend is deployed on Render at:
https://socialmedia-backend-zng2.onrender.com

## License

MIT 
https://socialmedia-backend-zng2.onrender.com
