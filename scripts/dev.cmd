@echo off
rem Arranca el servidor de desarrollo desde cualquier carpeta (usado por la vista previa del editor).
cd /d "%~dp0.."
set "PATH=C:\Program Files\nodejs;%PATH%"
npm run dev
