:: Setzt temporär die Umgebungsvariablen
SET NODE_ENV=development
SET DEBUG=me2u4:*

:: Startet den Server
cd ..
CALL npm start
pause