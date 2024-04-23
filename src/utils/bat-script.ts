export const genBatScript = (arr: Hosts[]) => {
    let batScript = `
@echo off
:: BatchGotAdmin
:-------------------------------------
REM --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\\getadmin.vbs"

    "%temp%\\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\\getadmin.vbs" ( del "%temp%\\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

:: 生成recover.bat以恢复hosts文件
(
echo @echo off
echo copy /y %SYSTEMROOT%\\System32\\drivers\\etc\\hosts.bak C:\\Windows\\System32\\drivers\\etc\\hosts
echo echo hosts has been recovered.
echo pause
) > recover.bat

echo Recover.bat has been created, you can run it to recover hosts file.

copy "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts" "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts.bak"
echo File hosts has been backed up to hosts.bak.
    `;
    arr.forEach((host) => {
        batScript += `echo ${host.ip} ${host.domain} >> "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts"\n`;
    });

    batScript += `
echo Update completed.
pause
    `;
    return batScript;
};
