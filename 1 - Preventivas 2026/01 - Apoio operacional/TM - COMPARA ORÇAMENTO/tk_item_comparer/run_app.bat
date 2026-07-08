@echo off
setlocal

REM === Run locally on Windows with minimal friction ===
REM - Creates venv if missing
REM - Installs requirements
REM - Runs the Tkinter app

cd /d %~dp0

if not exist .venv (
  echo [setup] Criando ambiente virtual...
  python -m venv .venv
)

echo [setup] Instalando dependencias...
.venv\Scripts\python -m pip install --upgrade pip >nul
.venv\Scripts\python -m pip install -r requirements.txt

echo.
echo [run] Abrindo aplicativo...
.venv\Scripts\python app.py

endlocal
