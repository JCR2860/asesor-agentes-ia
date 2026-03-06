@echo off
echo =======================================================
echo Limpiando la cache de Next.js y reiniciando el servidor
echo =======================================================

echo.
echo 1. Cerrando posibles procesos de Node.js (Si el servidor estaba corriendo)...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 2. Borrando la carpeta .next (Cache de la aplicacion)...
if exist ".next" rmdir /S /Q ".next"

echo.
echo 3. Todo limpio! Levantando el servidor de nuevo...
echo Espera unos segundos mientras arranca en http://localhost:3000
echo.

cmd /k "npm run dev"
