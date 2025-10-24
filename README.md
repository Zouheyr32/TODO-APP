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
- **Metrics API** - Analytics endpoints for dashboard data
- **Error Handling** - Comprehensive error responses
- **CORS Support** - Cross-origin resource sharing configuration

### Frontend Features

- **Task Management** - Create, read, update, delete tasks
- **Bulk Operations** - Select and delete multiple tasks
- **Search & Filtering** - Advanced task filtering capabilities
- **Dashboard Analytics** - Visual metrics and productivity tracking
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Optimistic UI updates
- **Error Handling** - User-friendly error messages
- **Loading States** - Proper loading indicators
- **Modern UI** - Professional admin dashboard design

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

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

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Setup database**

   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE todo_db;

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
  "description": "Task Description",
  "is_completed": false
}
```

#### Update Task

```http
PUT /tasks/{task_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "is_completed": true
}
```

#### Delete Task

```http
DELETE /tasks/{task_id}
```

#### Bulk Delete Tasks

```http
DELETE /tasks/bulk
Content-Type: application/json

{
  "task_ids": [1, 2, 3]
}
```

#### Search Tasks

```http
GET /tasks/search?title=search_term&is_completed=true&page=1&size=10
```

### Metrics Endpoints

#### Get Dashboard Metrics

```http
GET /metrics
```

#### Get Task Statistics

```http
GET /metrics/stats
```

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
