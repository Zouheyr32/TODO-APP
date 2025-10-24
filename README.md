# TODO List Application

A full-stack TODO list application built with FastAPI backend and Next.js frontend, featuring a modern admin dashboard interface.

## 📋 Project Overview

This project is a comprehensive TODO list management system with:

- **Backend**: FastAPI with SQLAlchemy ORM and MySQL database
- **Frontend**: Next.js 13+ with Redux Toolkit and Spike Admin Template
- **Features**: Complete CRUD operations, bulk actions, and analytics dashboard

## 🚀 Technologies Used

### Backend

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM for Python
- **MySQL**: Relational database management system
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server implementation

### Frontend

- **Next.js**: React framework with server-side rendering
- **Redux Toolkit**: State management library
- **TypeScript**: Typed superset of JavaScript
- **Spike Template**: Professional admin dashboard template
- **Axios**: Promise-based HTTP client

## 📁 Project Structure

```
todo-app/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic schemas for validation
│   │   ├── services/          # Business logic layer
│   │   ├── routes/            # API endpoints
│   │   └── db/                # Database configuration
│   ├── alembic/               # Database migrations
│   ├── main.py                # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment variables template
│
├── frontend/                   # Next.js frontend application
│   ├── app/                   # Next.js 13+ app router
│   │   ├── dashboard/         # Dashboard page
│   │   └── tasks/             # Tasks management page
│   ├── components/            # React components
│   │   ├── tasks/             # Task-related components
│   │   └── dashboard/         # Dashboard components
│   ├── store/                 # Redux store configuration
│   │   └── slices/            # Redux slices
│   ├── services/              # API service layer
│   └── package.json           # Node.js dependencies
│
└── README.md                   # This file
```

## ✨ Features

### Task Management

- ✅ **Create Tasks**: Add new tasks with title and description
- ✅ **View Tasks**: Display all tasks in an organized table
- ✅ **Edit Tasks**: Modify existing task details
- ✅ **Delete Tasks**: Remove individual tasks
- ✅ **Bulk Delete**: Select and delete multiple tasks at once

### Dashboard Analytics

- 📊 **Total Tasks**: Display the total number of tasks created
- 📝 **Modified Tasks**: Show count of tasks that have been edited
- 🗑️ **Deleted Tasks**: Track the number of deleted tasks

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 16+**: [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+**: [Download MySQL](https://dev.mysql.com/downloads/)
- **Git**: [Download Git](https://git-scm.com/downloads/)

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd backend
```

#### 2.2 Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 Configure Database

1. Create a MySQL database:

```sql
CREATE DATABASE todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

3. Edit `.env` file:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/todo_db
```

#### 2.5 Run Database Migrations

```bash
alembic upgrade head
```

#### 2.6 Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation (Swagger UI) at `http://localhost:8000/docs`

### 3. Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

#### 3.2 Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3.3 Configure API Endpoint

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3.4 Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks/{id}` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `DELETE /tasks/bulk` - Delete multiple tasks

### Metrics

- `GET /metrics` - Get dashboard metrics (total, modified, deleted counts)

## 🏗️ Architecture

### Backend Architecture

```
Routes (API Layer)
    ↓
Services (Business Logic)
    ↓
Models (Data Layer)
    ↓
Database (MySQL)
```

### Frontend Architecture

```
Pages (UI Layer)
    ↓
Components (Reusable UI)
    ↓
Redux Store (State Management)
    ↓
API Services (HTTP Layer)
    ↓
Backend API
```
