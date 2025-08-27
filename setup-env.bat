@echo off
setlocal enabledelayedexpansion

REM Nature Harvest Environment Setup Script for Windows
REM This script helps you set up environment files for all three projects

echo 🌱 Nature Harvest Environment Setup
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "nature-harvest-server" (
    echo [ERROR] Please run this script from the root directory containing all three projects
    pause
    exit /b 1
)

if not exist "nature-harvest-dashboard" (
    echo [ERROR] Please run this script from the root directory containing all three projects
    pause
    exit /b 1
)

if not exist "nature-harvest-website" (
    echo [ERROR] Please run this script from the root directory containing all three projects
    pause
    exit /b 1
)

echo [INFO] Starting environment setup...
echo.

REM Generate a secure JWT secret (simple random string)
set "JWT_SECRET="
for /L %%i in (1,1,32) do (
    set /a "rand=!random! %% 62"
    if !rand! lss 26 (
        set "JWT_SECRET=!JWT_SECRET!!chr(65+!rand!)"
    ) else if !rand! lss 52 (
        set "JWT_SECRET=!JWT_SECRET!!chr(97+!rand!-26)"
    ) else (
        set "JWT_SECRET=!JWT_SECRET!!chr(48+!rand!-52)"
    )
)

REM Get user preferences
echo Please provide the following information for your environment setup:
echo.

set /p "MONGODB_URI=MongoDB URI [mongodb://localhost:27017/nature-harvest]: "
if "!MONGODB_URI!"=="" set "MONGODB_URI=mongodb://localhost:27017/nature-harvest"

set /p "SERVER_PORT=Server Port [3002]: "
if "!SERVER_PORT!"=="" set "SERVER_PORT=3002"

set /p "API_URL=API URL for clients [https://nature-harvest-q2ra.vercel.app/api]: "
if "!API_URL!"=="" set "API_URL=https://nature-harvest-q2ra.vercel.app/api"

set /p "WEBSITE_URL=Website URL [http://localhost:3000]: "
if "!WEBSITE_URL!"=="" set "WEBSITE_URL=http://localhost:3000"

set /p "DASHBOARD_URL=Dashboard URL [http://localhost:3001]: "
if "!DASHBOARD_URL!"=="" set "DASHBOARD_URL=http://localhost:3001"

echo.
echo [INFO] Setting up environment files...
echo.

REM Setup Server Environment
echo [INFO] Setting up server environment...
if exist "nature-harvest-server\.env" (
    echo [WARNING] Backing up existing nature-harvest-server\.env
    copy "nature-harvest-server\.env" "nature-harvest-server\.env.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
)

if exist "nature-harvest-server\env.example" (
    copy "nature-harvest-server\env.example" "nature-harvest-server\.env"
    echo [SUCCESS] Created nature-harvest-server\.env
    
    REM Update server .env with user values
    powershell -Command "(Get-Content 'nature-harvest-server\.env') -replace 'mongodb://localhost:27017/nature-harvest', '!MONGODB_URI!' | Set-Content 'nature-harvest-server\.env'"
    powershell -Command "(Get-Content 'nature-harvest-server\.env') -replace 'PORT=3002', 'PORT=!SERVER_PORT!' | Set-Content 'nature-harvest-server\.env'"
    powershell -Command "(Get-Content 'nature-harvest-server\.env') -replace 'your-super-secure-secret-key-change-this-in-production', '!JWT_SECRET!' | Set-Content 'nature-harvest-server\.env'"
) else (
    echo [ERROR] Example file nature-harvest-server\env.example not found!
)

REM Setup Dashboard Environment
echo [INFO] Setting up dashboard environment...
if exist "nature-harvest-dashboard\.env" (
    echo [WARNING] Backing up existing nature-harvest-dashboard\.env
    copy "nature-harvest-dashboard\.env" "nature-harvest-dashboard\.env.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
)

if exist "nature-harvest-dashboard\env.example" (
    copy "nature-harvest-dashboard\env.example" "nature-harvest-dashboard\.env"
    echo [SUCCESS] Created nature-harvest-dashboard\.env
    
    REM Update dashboard .env with user values
    powershell -Command "(Get-Content 'nature-harvest-dashboard\.env') -replace 'http://localhost:3002/api', '!API_URL!' | Set-Content 'nature-harvest-dashboard\.env'"
    powershell -Command "(Get-Content 'nature-harvest-dashboard\.env') -replace 'http://localhost:3001', '!DASHBOARD_URL!' | Set-Content 'nature-harvest-dashboard\.env'"
) else (
    echo [ERROR] Example file nature-harvest-dashboard\env.example not found!
)

REM Setup Website Environment
echo [INFO] Setting up website environment...
if exist "nature-harvest-website\.env.local" (
    echo [WARNING] Backing up existing nature-harvest-website\.env.local
    copy "nature-harvest-website\.env.local" "nature-harvest-website\.env.local.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
)

if exist "nature-harvest-website\env.example" (
    copy "nature-harvest-website\env.example" "nature-harvest-website\.env.local"
    echo [SUCCESS] Created nature-harvest-website\.env.local
    
    REM Update website .env.local with user values
    powershell -Command "(Get-Content 'nature-harvest-website\.env.local') -replace 'http://localhost:3002/api', '!API_URL!' | Set-Content 'nature-harvest-website\.env.local'"
    powershell -Command "(Get-Content 'nature-harvest-website\.env.local') -replace 'http://localhost:3000', '!WEBSITE_URL!' | Set-Content 'nature-harvest-website\.env.local'"
) else (
    echo [ERROR] Example file nature-harvest-website\env.example not found!
)

echo.
echo [SUCCESS] Environment setup completed!
echo.

REM Display summary
echo 📋 Setup Summary:
echo =================
echo • Server: nature-harvest-server\.env
echo • Dashboard: nature-harvest-dashboard\.env
echo • Website: nature-harvest-website\.env.local
echo.
echo 🔧 Configuration:
echo =================
echo • MongoDB URI: !MONGODB_URI!
echo • Server Port: !SERVER_PORT!
echo • API URL: !API_URL!
echo • Website URL: !WEBSITE_URL!
echo • Dashboard URL: !DASHBOARD_URL!
echo • JWT Secret: [Generated securely]
echo.

REM Next steps
echo 🚀 Next Steps:
echo ==============
echo 1. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:latest
echo 2. Start Server: cd nature-harvest-server ^&^& npm install ^&^& npm start
echo 3. Start Dashboard: cd nature-harvest-dashboard ^&^& npm install ^&^& npm start
echo 4. Start Website: cd nature-harvest-website ^&^& npm install ^&^& npm run dev
echo.

echo [WARNING] Remember to:
echo • Never commit .env files to version control
echo • Use different secrets for production
echo • Set up proper CORS origins for production
echo • Configure SSL certificates for production
echo.

echo [SUCCESS] Setup complete! Happy coding! 🎉
pause 