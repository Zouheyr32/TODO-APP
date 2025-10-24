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

REM Setup database
echo [INFO] Setting up database...
cd backend

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run migrations
echo [INFO] Running database migrations...
alembic upgrade head

echo [SUCCESS] Database setup completed
cd ..

echo.
echo [SUCCESS] 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your database credentials
echo 2. Start the backend server: cd backend ^&^& venv\Scripts\activate.bat ^&^& uvicorn main:app --reload
echo 3. Start the frontend server: cd frontend ^&^& npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
pause
