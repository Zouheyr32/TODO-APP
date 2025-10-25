# TODO App - Full Stack Application

A comprehensive TODO list management application built with FastAPI backend and Next.js frontend, featuring task management, analytics dashboard, and modern UI/UX.

## 🚀 Technologies Used

### Backend

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM) library
- **MySQL** - Relational database management system
- **Alembic** - Database migration tool for SQLAlchemy
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for running FastAPI applications
- **python-dotenv** - Load environment variables from .env files

### Frontend

- **Next.js 13+** - React framework with App Router
- **TypeScript** - Typed JavaScript for better development experience
- **Material-UI (MUI)** - React component library for UI
- **Redux Toolkit** - State management library
- **Axios** - HTTP client for API requests
- **Spike Next.js Free Admin Template** - Professional admin dashboard template

## 📁 Project Structure

```
TODO-APP/
├── backend/
│   ├── app/
│   │   ├── db/
│   │   │   └── database.py          # Database configuration
│   │   ├── models/
│   │   │   └── task.py              # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── task.py              # Pydantic schemas for tasks
│   │   │   ├── metrics.py           # Pydantic schemas for metrics
│   │   │   └── common.py            # Common response schemas
│   │   ├── services/
│   │   │   ├── task_service.py      # Business logic for tasks
│   │   │   └── metrics_service.py   # Business logic for metrics
│   │   ├── routes/
│   │   │   ├── tasks.py             # Task API endpoints
│   │   │   └── metrics.py           # Metrics API endpoints
│   │   └── main.py                  # FastAPI application entry point
│   ├── alembic/                     # Database migrations
│   ├── requirements.txt              # Python dependencies
│   └── .env.example                  # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── (DashboardLayout)/
│   │   │   │   ├── dashboard/       # Dashboard page
│   │   │   │   └── tasks/           # Tasks management page
│   │   │   └── layout.tsx           # Root layout
│   │   ├── components/              # Reusable React components
│   │   │   ├── ErrorBoundary.tsx    # Error boundary component
│   │   │   ├── LoadingSpinner.tsx    # Loading component
│   │   │   └── NotificationProvider.tsx # Notification system
│   │   ├── store/                   # Redux store configuration
│   │   │   ├── index.ts             # Store setup
│   │   │   ├── slices/              # Redux slices
│   │   │   └── StoreProvider.tsx    # Store provider
│   │   ├── services/                # API service layer
│   │   │   ├── api.ts               # Axios configuration
│   │   │   ├── taskService.ts       # Task API service
│   │   │   └── metricsService.ts    # Metrics API service
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useTasks.ts          # Task management hooks
│   │   │   └── useMetrics.ts        # Metrics hooks
│   │   └── utils/                   # Utility functions
│   ├── package.json                 # Node.js dependencies
│   └── .env.local                   # Frontend environment variables
└── README.md                        # Project documentation
```

## ✨ Features

### Backend Features

- **RESTful API** - Complete CRUD operations for tasks
- **Soft Delete** - Tasks are marked as deleted but preserved in database
- **Modification Tracking** - Track how many times a task has been modified
- **Database Migrations** - Alembic for database schema management
- **Data Validation** - Pydantic schemas for request/response validation
- **Dashboard Analytics** - Metrics endpoints for Total, Modified, and Deleted task counts
- **Error Handling** - Comprehensive error responses
- **CORS Support** - Cross-origin resource sharing configuration

### Frontend Features

- **Task Management** - Create, read, update, delete tasks
- **Bulk Operations** - Select and delete multiple tasks
- **Dashboard Analytics** - Visual metrics for Total, Modified, and Deleted tasks
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Optimistic UI updates
- **Error Handling** - User-friendly error messages
- **Loading States** - Proper loading indicators
- **Modern UI** - Professional admin dashboard design

## 📸 Screenshots

### Dashboard Page

![Dashboard](screenshots/dashboard.png)
_Main dashboard showing task metrics and analytics_

### Tasks Management Page

![Tasks](screenshots/tasks.png)
_Task management interface with create, edit, delete, and bulk operations_

### Task Creation Modal

![Task Form](screenshots/task-form.png)
_Modal for creating and editing tasks_

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

### Quick Setup (Recommended)

The easiest way to get started is using our automated setup scripts:

#### For Windows:

```bash
# Run the Windows setup script
setup.bat
```

#### For Linux/Mac:

```bash
# Make the script executable and run it
chmod +x setup.sh
./setup.sh
```

These scripts will automatically:

- Set up the backend environment and dependencies
- Set up the frontend environment and dependencies
- Create necessary configuration files
- Run database migrations
- Provide next steps for starting the application

#### After Running Setup Scripts:

The setup scripts will automatically:

- Prompt for MySQL credentials
- Create the MySQL database if it doesn't exist
- Set up backend and frontend environments
- Install all dependencies
- Create configuration files (.env)
- Run database migrations

1. **Start the Application**:

   ```bash
   # Terminal 1 - Start Backend
   cd backend
   source venv/bin/activate  # Windows: venv\Scripts\activate
   python main.py

   # Terminal 2 - Start Frontend
   cd frontend
   npm run dev
   ```

2. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

If you prefer to set up manually or the scripts don't work, follow the steps below:

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TODO-APP/backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file in the backend directory:

   ```
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/todo_db
   ```

5. **Setup database**

   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE IF NOT EXISTS todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;

   # Run migrations
   alembic upgrade head
   ```

6. **Start the server**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Task Endpoints

#### Get All Tasks

```http
GET /tasks?skip=0&limit=100
```

#### Get Task by ID

```http
GET /tasks/{task_id}
```

#### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description"
}
```

#### Update Task

```http
PUT /tasks/{task_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

#### Delete Task

```http
DELETE /tasks/{task_id}
```

#### Bulk Delete Tasks

```http
POST /tasks/bulk
Content-Type: application/json

{
  "task_ids": [1, 2, 3]
}
```

#### Search Tasks

```http
GET /tasks/search?title=search_term&page=1&size=10
```

### Metrics Endpoints

#### Get Dashboard Metrics

```http
GET /metrics
```

Returns:

- **total_tasks**: Total number of active (non-deleted) tasks
- **modified_tasks**: Number of tasks edited at least once (modification_count > 0)
- **deleted_tasks**: Number of soft-deleted tasks

#### Get Task Statistics

```http
GET /metrics/stats
```

Returns detailed statistics including total created, total modified, total deleted, and average modifications per task.

## Task Model Schema

| Field              | Type        | Description                                  |
| ------------------ | ----------- | -------------------------------------------- |
| id                 | Integer     | Primary key, auto-increment                  |
| title              | String(255) | Task title (required)                        |
| description        | Text        | Task description (optional)                  |
| is_deleted         | Boolean     | Soft delete flag (default: false)            |
| modification_count | Integer     | Number of times task was edited (default: 0) |
| created_at         | DateTime    | Task creation timestamp                      |
| updated_at         | DateTime    | Last update timestamp                        |


## 🏗️ Architecture

### Backend Architecture

- **Models** - SQLAlchemy ORM models for database entities
- **Schemas** - Pydantic models for data validation and serialization
- **Services** - Business logic layer for complex operations
- **Routes** - API endpoint definitions and request handling
- **Database** - SQLAlchemy configuration and session management

### Frontend Architecture

- **Pages** - Next.js App Router pages for different routes
- **Components** - Reusable React components
- **Store** - Redux store for state management
- **Services** - API service layer for backend communication
- **Hooks** - Custom React hooks for component logic

## 🚀 Deployment

### Backend Deployment

1. Set up production database
2. Configure environment variables
3. Run database migrations

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or other hosting platform
3. Configure environment variables
