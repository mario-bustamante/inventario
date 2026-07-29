<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

---

## Seguridad — Autenticación JWT

### Arquitectura implementada

La autenticación sigue una arquitectura en capas para separar responsabilidades:

```
AuthController  →  AuthService  →  User Model
     ↓                  ↓
LoginRequest         UserResource
RegisterRequest
```

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Controller | `app/Http/Controllers/Api/AuthController.php` | Entrada/salida HTTP |
| Form Requests | `app/Http/Requests/Api/LoginRequest.php` | Validación de login |
| Form Requests | `app/Http/Requests/Api/RegisterRequest.php` | Validación de registro |
| Resource | `app/Http/Resources/UserResource.php` | Formato de respuesta JSON |
| Service | `app/Services/AuthService.php` | Lógica de negocio |

---

### Mejoras de seguridad aplicadas

#### 1. Protección contra Brute Force — Rate Limiting

Las rutas públicas están limitadas a **5 intentos por minuto** por IP. Pasado ese límite, Laravel devuelve `429 Too Many Requests` automáticamente.

```php
// routes/api.php
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
```

Las rutas protegidas tienen un límite de 60 peticiones por minuto.

---

#### 2. Rotación y Revocación de Tokens JWT

Al hacer `refresh`, el token anterior queda **inmediatamente invalidado** (añadido a la blacklist). Se emite un token nuevo.

```php
// AuthService.php
$newToken = auth()->refresh(true, true);
// forceForever=true → blacklist permanente del token anterior
// resetClaims=true  → nuevas claims en el token emitido
```

Al hacer `logout`, el token actual también es revocado:

```php
auth()->logout(true); // true = forzar blacklist permanente
```

> Requiere `JWT_BLACKLIST_ENABLED=true` en `.env` (valor por defecto).

---

#### 3. CORS Restrictivo

Solo se permite el origen definido en `FRONTEND_URL`. Ningún otro dominio puede hacer peticiones a la API.

```php
// config/cors.php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
'paths'           => ['api/*'],
```

---

#### 4. Validación con Form Requests

La validación ocurre antes de llegar al controlador. Si falla, se devuelve `422 Unprocessable Entity` con los errores detallados.

`RegisterRequest` exige:
- `name` — requerido, string, máx. 255 caracteres
- `email` — requerido, email válido, único en BD
- `password` — requerido, mínimo 8 caracteres, confirmado (`password_confirmation`)

`LoginRequest` exige:
- `email` — requerido, formato email
- `password` — requerido, string

---

#### 5. Rutas protegidas bajo `auth:api`

`/me`, `/refresh` y `/logout` requieren un token JWT válido. Sin token o con token expirado/revocado se devuelve `401 Unauthorized`.

```php
Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
    Route::get('/me',       [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout',  [AuthController::class, 'logout']);
});
```

---

#### 6. Hashing de contraseñas

Las contraseñas se almacenan con `Hash::make()` (bcrypt, coste 12 por defecto en Laravel). Nunca se almacenan en texto plano.

---

### Variables de entorno requeridas

```env
JWT_SECRET=          # Generar con: php artisan jwt:secret
JWT_TTL=15           # Expiración del access token en minutos
JWT_REFRESH_TTL=20160  # Ventana de refresco (14 días)
JWT_BLACKLIST_ENABLED=true
FRONTEND_URL=https://tu-dominio-frontend.com
```

---

### Endpoints de autenticación

| Método | Ruta | Middleware | Descripción |
|---|---|---|---|
| `POST` | `/api/login` | `throttle:5,1` | Autenticar usuario |
| `POST` | `/api/register` | `throttle:5,1` | Registrar usuario |
| `GET` | `/api/me` | `auth:api` | Usuario autenticado |
| `POST` | `/api/refresh` | `auth:api` | Rotar token |
| `POST` | `/api/logout` | `auth:api` | Revocar token |

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
