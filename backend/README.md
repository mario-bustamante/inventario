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

Al hacer `refresh`, el token anterior queda **inmediatamente invalidado** (blacklist) y se emite uno nuevo.

```php
// app/Services/AuthService.php
$newToken = auth()->refresh(true, true);
// forceForever=true -> blacklist permanente del token anterior
// resetClaims=true  -> nuevas claims en el token emitido
```

Al hacer `logout`, el token actual también se revoca:

```php
auth()->logout(true); // true = invalidación permanente en blacklist
```

Además, `logout` es tolerante a token ya expirado/inválido para garantizar limpieza de sesión en cliente.

> Requiere `JWT_BLACKLIST_ENABLED=true`.

---

#### 3. CORS con credenciales y origen restringido

Solo se permite el origen definido en `FRONTEND_URL` y se habilita envío de credenciales para cookies HttpOnly.

```php
// config/cors.php
'allowed_origins' => [rtrim(env('FRONTEND_URL'), '/')],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
'paths'           => ['api/*'],
'supports_credentials' => true,
```

Notas:
- Se normaliza `FRONTEND_URL` con `rtrim(..., '/')` para evitar fallos por slash final.
- En frontend se debe usar `credentials: 'include'`.

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

#### 5. JWT en cookie HttpOnly (sin exponer token a JavaScript)

Se migró el flujo para reducir riesgo ante XSS:
- `login`, `register` y `refresh` emiten la cookie `access_token` como **HttpOnly**.
- El token ya no se devuelve en el JSON público como `access_token`.
- `logout` elimina la cookie con `Cookie::forget('access_token', ...)`.

Implementación principal:
- `app/Http/Controllers/Api/AuthController.php`
- `app/Http/Middleware/UseJwtFromCookie.php`

`UseJwtFromCookie` toma `access_token` desde cookie y la convierte en header `Authorization: Bearer ...` internamente para compatibilidad con `auth:api`.

Esto permite que el frontend no lea JWT ni lo decodifique localmente.

#### 6. Rutas de autenticación y protección

`/me` y `/logout` requieren `auth:api`.

`/refresh` quedó público por diseño controlado para permitir rotación cuando el access token está vencido, usando la cookie JWT enviada por el navegador. Si el token es inválido/revocado, responde `401`.

```php
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/refresh',  [AuthController::class, 'refresh']);
});

Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
    Route::get('/me',       [AuthController::class, 'me']);
    Route::post('/logout',  [AuthController::class, 'logout']);
});
```

---

#### 7. Hashing de contraseñas

Las contraseñas se almacenan con `Hash::make()` (bcrypt, coste 12 por defecto en Laravel). Nunca se almacenan en texto plano.

---

### Variables de entorno requeridas

```env
JWT_SECRET=          # Generar con: php artisan jwt:secret
JWT_TTL=15           # Expiración del access token en minutos
JWT_REFRESH_TTL=20160  # Ventana de refresco (14 días)
JWT_BLACKLIST_ENABLED=true
FRONTEND_URL=https://tu-dominio-frontend.com

# Cookies JWT (HttpOnly)
AUTH_COOKIE_DOMAIN=       # Dominio de la cookie (vacío = host actual)
AUTH_COOKIE_SECURE=true   # true: solo envía cookie por HTTPS
AUTH_COOKIE_SAME_SITE=none # none/lax/strict. 'none' requiere AUTH_COOKIE_SECURE=true
```

Recomendación local:

```env
AUTH_COOKIE_SECURE=false   # En localhost sin HTTPS
AUTH_COOKIE_SAME_SITE=lax  # Permite flujo normal en mismo sitio/origen cercano
```

Recomendación producción (HTTPS obligatorio):

```env
AUTH_COOKIE_SECURE=true    # Obligatorio en producción con HTTPS
AUTH_COOKIE_SAME_SITE=none # Necesario si frontend y API operan en orígenes distintos
```

---

### Endpoints de autenticación

| Método | Ruta | Middleware | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | `throttle:5,1` | Autenticar usuario |
| `POST` | `/api/auth/register` | `throttle:5,1` | Registrar usuario |
| `POST` | `/api/auth/refresh` | `throttle:5,1` | Rotar token JWT y renovar cookie HttpOnly |
| `GET` | `/api/auth/me` | `auth:api` | Usuario autenticado |
| `POST` | `/api/auth/logout` | `auth:api` | Revocar token y eliminar cookie |

---

### Respuesta pública de auth

La respuesta de `login/register/refresh` entrega información de sesión y usuario, pero **no** expone `access_token` en el cuerpo JSON.

```json
{
    "user": { "id": 1, "name": "...", "email": "..." },
    "token_type": "Bearer",
    "expires_in": 15
}
```

El JWT viaja en la cookie HttpOnly `access_token`.

---

## Roles y permisos con Spatie

El proyecto usa `spatie/laravel-permission` para administrar roles y permisos. Un usuario puede tener uno o varios roles; las relaciones se almacenan en la tabla polimórfica `model_has_roles`, por lo que la tabla `users` no requiere una columna `role_id`.

### Instalación

```bash
composer require spatie/laravel-permission
php artisan migrate
```

La migración `database/migrations/2026_08_28_000002_create_permission_tables.php` crea las tablas:

```text
roles
permissions
model_has_roles
model_has_permissions
role_has_permissions
```

El modelo `App\Models\User` utiliza el trait `HasRoles`, que habilita los métodos para consultar y asignar roles y permisos.

### Crear y asignar roles

Como la autenticación del proyecto usa el guard `api`, crea los roles y permisos con ese mismo guard:

```php
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

$role = Role::findOrCreate('admin', 'api');
$permission = Permission::findOrCreate('manage users', 'api');

$role->givePermissionTo($permission);

$user = User::findOrFail(1);
$user->assignRole($role);
```

### Consultar autorizaciones

```php
$user->hasRole('admin');
$user->hasAnyRole(['admin', 'manager']);
$user->can('manage users');
```

Para proteger una ruta con permisos, utiliza el middleware de Spatie:

```php
Route::middleware(['auth:api', 'permission:manage users,api'])
    ->get('/users', [UserController::class, 'index']);
```

Después de crear o cambiar roles y permisos mediante código, limpia la caché de permisos:

```bash
php artisan permission:cache-reset
```

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

