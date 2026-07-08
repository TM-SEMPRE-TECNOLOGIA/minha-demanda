@echo off
setlocal

REM ====== Lança o Contador de Imagens (Tkinter) ======
REM Estrutura:
REM 1) Se houver venv local, usa pythonw da venv
REM 2) Tenta pythonw do sistema (sem console)
REM 3) Tenta pyw (launcher sem console)
REM 4) Tenta py (com console)
REM 5) Tenta python (com console)

set SCRIPT=%~dp0contador_imagens_tk.py

if not exist "%SCRIPT%" (
  echo Nao foi encontrado o arquivo contador_imagens_tk.py no mesmo diretorio deste .bat.
  echo Coloque o .bat e o .py na mesma pasta.
  pause
  exit /b 1
)

REM 1) venv local
if exist "%~dp0venv\Scripts\pythonw.exe" (
  "%~dp0venv\Scripts\pythonw.exe" "%SCRIPT%"
  exit /b %errorlevel%
)

REM 2) pythonw do sistema
where pythonw >nul 2>nul
if %errorlevel%==0 (
  pythonw "%SCRIPT%"
  exit /b %errorlevel%
)

REM 3) pyw (launcher)
where pyw >nul 2>nul
if %errorlevel%==0 (
  pyw "%SCRIPT%"
  exit /b %errorlevel%
)

REM 4) py (com console)
where py >nul 2>nul
if %errorlevel%==0 (
  py "%SCRIPT%"
  exit /b %errorlevel%
)

REM 5) python (com console)
where python >nul 2>nul
if %errorlevel%==0 (
  python "%SCRIPT%"
  exit /b %errorlevel%
)

echo Nao encontrei uma instalacao do Python.
echo Instale o Python 3 e marque "Add Python to PATH".
pause
exit /b 1
