@echo off
REM AEGIS Full System Startup Script
REM Starts Neo4j, Backend API, and Frontend Dev Server
REM Usage: Double-click or run from C:\Users\shlok\Downloads\Final Year Project\AEGIS

set "SCRIPT_DIR=%~dp0"
set "DOCKER_BIN=C:\Users\shlok\AppData\Local\Programs\DockerDesktop\resources\bin"
set "PATH=%DOCKER_BIN%;%PATH%"

echo.
echo ====================================================
echo  AEGIS - Adversarial Early-Warning Geopolitical IS
echo ====================================================
echo.

REM 1. Start Neo4j (idempotent - skips if already running)
docker ps 2>nul | findstr /i "aegis-neo4j-1" >nul
if %ERRORLEVEL% equ 0 (
    echo [1/3] Neo4j is already running at http://localhost:7474
) else (
    echo [1/3] Starting Neo4j Knowledge Graph container...
    docker compose up -d neo4j
    echo       Neo4j starting at http://localhost:7474  [user: neo4j / pass: aegis_secure_2024]
    timeout /t 5 /nobreak >nul
)

REM 2. Start Backend API (from backend/ directory for correct module resolution)
echo.
echo [2/3] Starting AEGIS Backend API on port 8000...
start "AEGIS Backend" cmd /k "cd /d "%SCRIPT_DIR%backend" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul

REM 3. Start Frontend Dev Server
echo.
echo [3/3] Starting AEGIS Frontend on port 5173...
start "AEGIS Frontend" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"

echo.
echo ====================================================
echo  All services launched. Open http://localhost:5173
echo  Backend API:    http://localhost:8000
echo  Neo4j Browser:  http://localhost:7474
echo ====================================================
echo.
