@echo off
REM TODO App Setup Script for Windows
REM This script sets up the entire TODO application on Windows

echo 🚀 Setting up TODO App...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

echo [INFO] Requirements check completed

REM Setup backend
echo [INFO] Setting up backend...
cd backend

REM Create virtual environment
echo [INFO] Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    echo [INFO] Creating environment file...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your database credentials
)

echo [SUCCESS] Backend setup completed
cd ..

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend

REM Install dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Copy environment file
if not exist .env.local (
    echo [INFO] Creating environment file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
)

echo [SUCCESS] Frontend setup completed
cd ..

REM Setup MySQL database
echo [INFO] Setting up MySQL database...
echo.
echo === MySQL Database Setup ===
echo Please provide your MySQL credentials to create the database.
echo.

set /p DB_HOST="MySQL Host [localhost]: "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="MySQL Port [3306]: "
if "%DB_PORT%"=="" set DB_PORT=3306

set /p DB_USER="MySQL Username [root]: "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD="MySQL Password: "

set /p DB_NAME="Database Name [todo_db]: "
if "%DB_NAME%"=="" set DB_NAME=todo_db

REM Test MySQL connection and create database
echo [INFO] Testing MySQL connection...
mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASSWORD% -e "SELECT 1;" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL connection successful!
    
    REM Create database if not exists
    echo [INFO] Creating database '%DB_NAME%' if it doesn't exist...
    mysql -h%DB_HOST% -P%DB_PORT% -u%DB_USER% -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo [SUCCESS] Database '%DB_NAME%' is ready!
    
    REM Create .env file
    echo [INFO] Creating backend\.env file...
    echo DATABASE_URL=mysql+pymysql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME% > backend\.env
    echo [SUCCESS] Created backend\.env file
    
    REM Run migrations
    echo [INFO] Running database migrations...
    cd backend
    call venv\Scripts\activate.bat
    alembic upgrade head
    cd ..
    echo [SUCCESS] Database migrations completed!
) else (
    echo [ERROR] MySQL connection failed!
    echo.
    echo Please check:
    echo   1. MySQL is running
    echo   2. Credentials are correct
    echo   3. MySQL is accessible on %DB_HOST%:%DB_PORT%
    echo.
    echo You can manually create the .env file later:
    echo   DATABASE_URL=mysql+pymysql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%
    pause
    exit /b 1
)

echo.
echo [SUCCESS] 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the backend server: cd backend ^&^& venv\Scripts\activate.bat ^&^& python main.py
echo 2. Start the frontend server: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
pause
