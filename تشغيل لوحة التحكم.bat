@echo off
chcp 65001 >nul
title لوحة تحكم رواج
cd /d "%~dp0"
set "URL=http://127.0.0.1:8788/"

curl -s -f -o nul --max-time 1 %URL%api/auth/me >nul 2>nul
curl -s -o nul --max-time 1 %URL% && goto open

set "PYW="
for %%P in (pyw.exe pythonw.exe) do if not defined PYW (where %%P >nul 2>nul && set "PYW=%%P")
if defined PYW (
  start "" %PYW% "%~dp0panel_server.py"
) else (
  where python >nul 2>nul || (echo يلزم تثبيت Python لتشغيل لوحة التحكم & pause & exit /b 1)
  start "Rawaj Panel" /min python "%~dp0panel_server.py"
)
echo جارٍ تشغيل لوحة التحكم...
for /l %%i in (1,1,30) do (
  curl -s -o nul --max-time 1 %URL% && goto open
  timeout /t 1 /nobreak >nul
)
echo تعذر تشغيل لوحة التحكم.
pause
exit /b 1

:open
start "" %URL%
exit /b 0
