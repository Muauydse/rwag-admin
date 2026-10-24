@echo off
chcp 65001 >nul
title تجهيز أسرار استضافة لوحة تحكم رواج
cd /d "%~dp0"
where python >nul 2>nul || (echo يلزم تثبيت Python & pause & exit /b 1)
python "%~dp0export_secrets.py"
echo.
echo انسخ القيم من الملف إلى متغيرات البيئة في الاستضافة، ثم احذف الملف.
pause
