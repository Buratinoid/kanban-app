Задание

Система управления проектами (Angular):
https://github.com/rolling-scopes-school/tasks/blob/master/tasks/angular/project-management-app.md


Docker-файлы для тестового-сервера:
https://github.com/vitaly-sazonov/kanban-rest


Proxy для решения проблем с CORS:

1. Установить пакет Local CORS Proxy (LCP)
    npm install -g local-cors-proxy

2. Запустить LCP
    lcp --proxyUrl https://localhost:4000

3! В проекте прописан адрес LCP (localhost:8010)
    src / app / models / url.ts (поле: url)
