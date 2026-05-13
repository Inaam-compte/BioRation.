@echo off
REM Create the limits directory
mkdir "c:\Users\hp\Desktop\biorotation\app\(app)\aliments\limits"

REM Copy the file to the new location with new name
copy "c:\Users\hp\Desktop\biorotation\app\(app)\aliments\limits.page.tsx" "c:\Users\hp\Desktop\biorotation\app\(app)\aliments\limits\page.tsx"

REM Delete the old file
del "c:\Users\hp\Desktop\biorotation\app\(app)\aliments\limits.page.tsx"

echo Done!
