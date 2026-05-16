# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- **Authentication System**: JWT-based login, registration, and protected routes.
- **Leads Management (CRUD)**: Create, Read, Update, and Delete leads.
- **Advanced Filtering & Search**: Filter leads by Status and Source. Search by name or email. All filters work together.
- **Debounced Search**: Optimized API calls with a 500ms debounce.
- **Pagination**: Server-side pagination with 10 records per page.
- **Export to CSV**: Download the currently filtered leads to a CSV file.
- **Role-Based Access Control**: 
  - Admin: Can manage all leads.
  - Sales User: Can only manage leads assigned to them.
- **Dark Mode Support**: Fully responsive UI with a seamless Light/Dark mode toggle.
- **Dockerized**: Easy setup and deployment using Docker Compose.

## Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- Docker (optional, for Docker setup)

### Environment Variables

1. Copy the `.env.example` file in the `backend` directory to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Make sure the MongoDB URI is correct in your `.env` file.

### Running Locally (Without Docker)

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. The backend will start on `http://localhost:5555` and the frontend on `http://localhost:5173`.

### Running with Docker

You can spin up the entire stack using Docker Compose:

```bash
docker-compose up --build
```
This will start MongoDB, the backend API, and the frontend server.

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and get a token
- `GET /api/auth/profile` - Get logged-in user details

- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads (Supports query params: `search`, `status`, `source`, `sort`, `page`)
- `GET /api/leads/export` - Export leads to CSV
- `GET /api/leads/:id` - Get a single lead by ID
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

## Project Structure

- `backend/`: Node.js API built with Express and Mongoose.
- `frontend/`: React Dashboard built with Vite, TailwindCSS, and Axios.
- `docker-compose.yml`: For containerized deployment.
