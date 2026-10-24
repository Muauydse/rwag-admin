@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title نشر لوحة تحكم رواج على GitHub
cd /d "%~dp0"

echo ==========================================================
echo        نشر لوحة تحكم رواج على GitHub
echo ==========================================================
echo.

where git >nul 2>nul || (echo [خطأ] Git غير مثبت — حمّله من https://git-scm.com/download/win & pause & exit /b 1)

rem ---- هوية Git (مرة واحدة) ----
for /f "delims=" %%i in ('git config --global user.name 2^>nul') do set "GNAME=%%i"
if not defined GNAME (
  set /p "GNAME=اكتب اسمك لـ Git (بالإنجليزية): "
  git config --global user.name "!GNAME!"
)
for /f "delims=" %%i in ('git config --global user.email 2^>nul') do set "GMAIL=%%i"
if not defined GMAIL (
  set /p "GMAIL=اكتب بريد حسابك في GitHub: "
  git config --global user.email "!GMAIL!"
)

rem ---- إنشاء المستودع المحلي ----
if not exist ".git" (
  git init -b main >nul || (echo [خطأ] تعذر إنشاء المستودع & pause & exit /b 1)
  echo تم إنشاء مستودع Git محلي.
)

git add -A

rem ---- فحص أمان: منع رفع أي سر ----
git ls-files --cached > "%TEMP%\rawaj_files.txt"
findstr /i /c:"keys/" /c:"panel-data/" /c:"signing-key" /c:"secret.key" /c:"mongo.json" /c:".env" "%TEMP%\rawaj_files.txt" | findstr /v /i /c:".env.example" >nul
if not errorlevel 1 (
  echo.
  echo [توقف] تم اكتشاف ملفات سرية ضمن الملفات المراد رفعها:
  findstr /i /c:"keys/" /c:"panel-data/" /c:"signing-key" /c:"secret.key" /c:"mongo.json" /c:".env" "%TEMP%\rawaj_files.txt" | findstr /v /i /c:".env.example"
  git reset -q
  echo تم إلغاء العملية حفاظاً على أمان التراخيص وبيانات العملاء.
  pause & exit /b 1
)
findstr /i /c:"بيانات الدخول" /c:"أسرار-الاستضافة" "%TEMP%\rawaj_files.txt" >nul
if not errorlevel 1 (
  echo [توقف] ملف كلمة المرور أو الأسرار ضمن الملفات — تم الإلغاء.
  git reset -q
  pause & exit /b 1
)
echo ✓ فحص الأمان: لا توجد ملفات سرية ضمن الرفع.

git diff --cached --quiet
if errorlevel 1 (
  git commit -q -m "تحديث لوحة تحكم رواج" && echo ✓ تم حفظ التغييرات ^(commit^).
) else (
  echo لا توجد تغييرات جديدة للحفظ.
)

rem ---- ربط مستودع GitHub ----
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  echo.
  echo أنشئ مستودعاً جديداً على GitHub ^(يُفضّل Private^) من: https://github.com/new
  echo بدون README أو .gitignore — ثم انسخ رابطه مثل: https://github.com/USERNAME/rawaj-panel.git
  echo.
  set /p "REPO=الصق رابط المستودع هنا: "
  if "!REPO!"=="" (echo لم يُدخل رابط. & pause & exit /b 1)
  git remote add origin "!REPO!"
)

echo.
echo جارٍ الرفع إلى GitHub... ^(قد تُطلب منك تسجيل الدخول إلى GitHub في نافذة المتصفح^)
git push -u origin main
if errorlevel 1 (
  echo.
  echo [خطأ] تعذر الرفع. تحقق من الرابط وتسجيل الدخول ثم أعد المحاولة.
  pause & exit /b 1
)
echo.
echo ==========================================================
echo  ✓ تم رفع لوحة التحكم إلى GitHub بنجاح
echo  الخطوة التالية: النشر على Render — راجع README.md
echo ==========================================================
pause
