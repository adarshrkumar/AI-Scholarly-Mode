@echo off
taskkill /F /IM "Claude.exe" >nul 2>&1
start "" "%LocalAppData%\AnthropicClaude\Claude.exe"
cls