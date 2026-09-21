@echo off
title PathStudy - Domain https://pathstudy.id.vn
echo ========================================================
echo   Connecting PathStudy to https://pathstudy.id.vn
echo ========================================================
echo.
echo He thong dang ket noi truc tiep vao ten mien https://pathstudy.id.vn...
echo Giu nguyen cua so nay de duy tri trang web hoat dong.
echo.

"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel run pathstudy
pause
