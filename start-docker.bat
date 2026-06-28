@echo off
:: Supprimer la ligne chcp 65001 qui pose problème
title CRM Microservices Docker Manager
color 0A  :: Texte vert sur fond noir

:: Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker n'est pas installé. Veuillez installer Docker avant de continuer.
    pause
    exit /b
)

:: Affichage du bandeau
echo ╔══════════════════════════════════════════════════════════╗
echo ║          CRM MICROSERVICES DOCKER MANAGER               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:menu
echo [1] Démarrer tous les services
echo [2] Arrêter tous les services
echo [3] Voir les logs
echo [4] Voir le statut
echo [5] Redémarrer un service
echo [6] Ouvrir dans le navigateur
echo [7] Nettoyer les volumes Docker
echo [8] Quitter
echo.
set /p choice=Choisissez une option [1-8]: 

if "%choice%"=="1" goto start_services
if "%choice%"=="2" goto stop_services
if "%choice%"=="3" goto show_logs
if "%choice%"=="4" goto show_status
if "%choice%"=="5" goto restart_service
if "%choice%"=="6" goto open_browser
if "%choice%"=="7" goto clean_docker
if "%choice%"=="8" goto exit
echo Option invalide
goto menu

:start_services
echo Construction et démarrage des services...
docker-compose build --no-cache
docker-compose up -d
timeout /t 15 /nobreak >nul
goto show_status

:stop_services
echo Arrêt des services...
docker-compose down
echo Services arrêtés
goto menu

:show_logs
docker-compose ps
echo.
set /p service=Entrez le nom du service (laisser vide pour tous): 
if "%service%"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %service%
)
goto menu

:show_status
docker-compose ps
echo.
echo URLs d'accès:
echo   Frontend React:       http://localhost:3000
echo   Auth Service API:     http://localhost:8000
echo   Customer Service API: http://localhost:8001
echo   Customer Service Docs: http://localhost:8001/docs
echo.
pause
goto menu

:restart_service
docker-compose ps
echo.
set /p service=Entrez le nom du service à redémarrer: 
docker-compose restart %service%
echo Service %service% redémarré
goto menu

:open_browser
start http://localhost:3000
start http://localhost:8001/docs
echo Navigateur ouvert
goto menu

:clean_docker
echo Nettoyage des volumes Docker non utilisés...
docker system prune -f
echo Volumes Docker nettoyés.
goto menu

:exit
echo Au revoir!
pause
exit
