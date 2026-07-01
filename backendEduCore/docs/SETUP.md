# EduCore Backend — Setup Guide

## 1. Requirements
- PHP 8.3+, Composer
- XAMPP (bundled MySQL + phpMyAdmin) — used for local development

## 2. Install dependencies
```bash
composer install
```

## 3. Configure `.env`
Copy `.env.example` to `.env` if you don't already have one, then set:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=educore_db
DB_USERNAME=root
DB_PASSWORD=          # empty by default on XAMPP

GEMINI_API_KEY=...            # free key from aistudio.google.com/apikey — required for AI features
GEMINI_MODEL=gemini-2.5-flash
```
Generate an app key and JWT secret if missing:
```bash
php artisan key:generate
php artisan jwt:secret
```

## 4. Start XAMPP MySQL
Open the XAMPP Control Panel and start **MySQL** (phpMyAdmin at `http://localhost/phpmyadmin`).

## 5. Create the database
Via phpMyAdmin, or:
```bash
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS educore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 6. Run migrations & seed
```bash
php artisan migrate:fresh --seed
php artisan storage:link
```

> Note (Windows + OneDrive): if `php artisan` fails with "directory must be present and writable", PHP's `is_writable()` is being fooled by OneDrive's read-only attribute on synced folders. Fix with:
> ```powershell
> Get-ChildItem -Recurse -Directory | ForEach-Object { $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly) }
> ```

## 7. Start the server
```bash
php artisan serve
# API running at http://localhost:8000/api
```

## Demo accounts
All demo accounts use the password `password123`.

| Role       | Email                          | Notes                              |
|------------|---------------------------------|-------------------------------------|
| Admin      | admin@educore.test              | Full access                        |
| Formateur  | formateur@educore.test          | Mohammed Alami — Développement Web, Bases de Données |
| Formateur  | formateur2@educore.test         | Nadia Bensouda — Réseaux Informatiques, Systèmes d'Exploitation |
| Formateur  | formateur3@educore.test         | Karim Tazi — Comptabilité Générale, Management d'Entreprise |
| Stagiaire  | stagiaire@educore.test          | Youssef Benali — groupe DEV101-G1  |
| Stagiaire  | stagiaire2@educore.test … stagiaire8@educore.test | 7 more stagiaires spread across DEV101-G2, RS101-G1, GE101-G1 |

The seeder also creates 3 filières, 4 groupes, 3 salles, 6 modules, 8 séances
d'emploi du temps and 4 annonces so the platform has enough demo data to
navigate around without every list being empty.

`POST /api/auth/register` is for stagiaires only (must supply `groupe_id`) — admin and
formateur accounts are created by an admin via `POST /api/users`.

## Roles & access
- **admin**: full CRUD on everything.
- **formateur**: can create annonces, manage files on their own modules, read everything.
- **stagiaire**: read-only everywhere.

Enforced via the `role:` middleware (`app/Http/Middleware/RoleMiddleware.php`) on
`routes/api.php`, checked against `users.role_id` → `roles.nom`.

## API Endpoints summary
```
POST   /api/auth/register        (stagiaire only, requires groupe_id)
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
POST   /api/auth/refresh

GET    /api/dashboard                                    (admin only)

GET|POST        /api/users                                (admin only)
GET|PUT|DELETE  /api/users/{id}                            (admin only)

GET              /api/filieres            GET /api/filieres/{id}
POST|PUT|DELETE  /api/filieres[/{id}]                      (admin only)

GET              /api/groupes             GET /api/groupes/{id}
POST|PUT|DELETE  /api/groupes[/{id}]                       (admin only)

GET              /api/salles              GET /api/salles/{id}
POST|PUT|DELETE  /api/salles[/{id}]                        (admin only)

GET              /api/modules             GET /api/modules/{id}
POST|PUT|DELETE  /api/modules[/{id}]                       (admin only)

GET|PUT|DELETE   /api/annonces[/{id}]                       (update/delete: owner or admin)
POST             /api/annonces                              (admin + formateur)

GET              /api/emplois-du-temps    GET /api/emplois-du-temps/{id}
POST|PUT|DELETE  /api/emplois-du-temps[/{id}]               (admin only)
POST             /api/emplois-du-temps/generate-ia           ← AI draft schedule (admin only, not persisted)
POST             /api/emplois-du-temps/bulk                  ← persist a batch of séances (admin only)

GET              /api/fichiers            GET /api/fichiers/{id}
POST|DELETE      /api/fichiers[/{id}]                       (admin + formateur)
POST             /api/fichiers/{id}/resume                  ← AI summary

POST             /api/ai/chat                                ← AI chat assistant
```
