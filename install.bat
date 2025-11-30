@echo off
echo ========================================
echo TrustChain - Installation Script
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo.

echo [2/5] Installing smart contract dependencies...
cd contracts
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install contract dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo [3/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo [4/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo [5/5] Setting up environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env from example
)
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo Created frontend\.env from example
)
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend\.env with your configuration
echo 2. Update frontend\.env with your configuration
echo 3. Start MongoDB: net start MongoDB
echo 4. Run: npm run blockchain (in contracts folder)
echo 5. Run: npm run deploy-contracts (in contracts folder)
echo 6. Run: npm run backend (in backend folder)
echo 7. Run: npm run frontend (in frontend folder)
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.
pause
