@echo off
echo Avvio del backend Flask...
start cmd /k "cd api && venv\Scripts\activate && python api.py"

echo Attendere alcuni secondi che il backend sia attivo...
REM timeout /t 1 >nul

echo Apertura del browser all'indirizzo http://127.0.0.1:5000
start "" http://127.0.0.1:5000

pause
