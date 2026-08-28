# Frontend de Inventario

Aplicación Vue 3 para la administración de inventario. Utiliza Vue Router, Pinia, PrimeVue y una API Laravel.

## Requisitos

- Node.js 20 o superior.
- pnpm.
- Backend Laravel ejecutándose en `http://localhost:8000`.

## Instalación y ejecución

Instala las dependencias de la aplicación:

```bash
pnpm add vue-router pinia primevue@4 @primevue/themes primeicons
pnpm install axios
```

Instala TypeScript, pruebas, linting y formateo:

```bash
pnpm add -D typescript@~5.9 vue-tsc@latest vitest @vue/test-utils jsdom eslint @eslint/js eslint-plugin-vue globals prettier
```

Para crear el archivo de configuración TypeScript, utiliza `tsc`:

```bash
pnpm exec tsc --init
```

No uses `pnpm exec vue-tsc --init`; `vue-tsc` valida archivos Vue y TypeScript, pero no crea el archivo `tsconfig.json`.

Ejecuta el proyecto:

```bash
pnpm dev
```

La aplicación se expone normalmente en `http://localhost:5173`.

## Variables de entorno

Crea un archivo `.env` en la raíz de `frontend`:

```env
VITE_API_URL=http://localhost:8000/api
```

Las variables disponibles en el navegador deben comenzar con `VITE_`. No incluyas secretos en ellas, porque Vite las incorpora al bundle del cliente.

## Autenticación

El frontend consume los siguientes endpoints de Laravel:

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

El backend emite el JWT como una cookie llamada `access_token` con el atributo `HttpOnly`. Por tanto, el token no se guarda en `localStorage`, `sessionStorage` ni debe leerse desde JavaScript.

Axios está configurado con `withCredentials: true` para enviar la cookie en peticiones a la API. El router valida las rutas protegidas usando `GET /api/auth/me`; si la sesión no es válida, redirige al usuario a `/login`.

### Renovación del token

El cliente Axios detecta respuestas `401` de endpoints protegidos. En ese caso, envía una única petición a `POST /api/auth/refresh`. Laravel rota el JWT y responde con una nueva cookie `HttpOnly`; después, Axios reintenta la petición original.

```text
Petición protegida recibe 401
	↓
POST /api/auth/refresh
	↓
Laravel actualiza la cookie HttpOnly
	↓
Axios reintenta la petición original una vez
```

Las rutas `login`, `register`, `refresh` y `logout` no activan la renovación automática, lo que evita ciclos de reintentos. Las solicitudes simultáneas comparten la misma renovación para no enviar múltiples llamadas a `refresh`. Si la renovación falla, la petición conserva el error y el guard del router redirige a `/login` cuando no puede validar `GET /api/auth/me`.

### Configuración de cookies

En desarrollo local, el backend puede utilizar:

```env
FRONTEND_URL=http://localhost:5173
AUTH_COOKIE_DOMAIN=
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=lax
```

En producción, el frontend y API deben usar HTTPS y la cookie debe marcarse como segura:

```env
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=lax
```

`HttpOnly` evita que scripts del navegador accedan al JWT. `SameSite=lax` ayuda a mitigar ataques CSRF; el backend debe mantener CORS restringido al dominio real del frontend y permitir credenciales únicamente para ese origen.

## Estructura

```text
src/
├── app/              Configuración de la aplicación y rutas
├── domain/           Entidades y contratos de negocio
├── application/      Casos de uso
├── infrastructure/   Cliente HTTP y repositorios de API
├── presentation/     Vistas, componentes y stores Pinia
└── shared/           Utilidades y servicios compartidos
```

## Comandos útiles

```bash
pnpm dev
pnpm build
pnpm exec vue-tsc --noEmit
pnpm list vue vue-router pinia primevue @primevue/themes primeicons typescript vitest eslint prettier
```
