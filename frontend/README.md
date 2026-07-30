# vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates.

However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can run `Volar: Switch TS Plugin on/off` from VS Code command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Seguridad de autenticación (login/logout/refresh)

### Resumen del enfoque

El frontend usa sesiones basadas en cookie HttpOnly emitida por backend:

- No almacena el JWT en una cookie accesible por JavaScript.
- Todas las peticiones API se envían con `credentials: 'include'`.
- El refresh se hace al recibir `401` en rutas protegidas y se reintenta una sola vez.

### Flujo de login

1. `POST /api/login` con credenciales.
2. Backend responde con `Set-Cookie: access_token=...; HttpOnly`.
3. Frontend guarda solo metadatos de sesión (`userData`, `tokenType`, `tokenExpiresIn`) para UI.
4. Redirección al dashboard.

### Flujo de refresh

1. Si una petición protegida devuelve `401`, el cliente llama `POST /api/refresh`.
2. Si refresh funciona, backend rota token y vuelve a emitir cookie HttpOnly.
3. Frontend reintenta automáticamente la petición original.
4. Si refresh falla, se limpia sesión local y se redirige a login.

Control de concurrencia:
- Se usa una promesa compartida (`refreshPromise`) para evitar múltiples refresh simultáneos.

### Flujo de logout

1. `POST /api/logout`.
2. Backend revoca token (blacklist) y borra cookie `access_token`.
3. Frontend limpia estado local y navega a login.

### Mensaje de sesión expirada

Se muestra el mensaje "Tu sesion expiro. Inicia sesion nuevamente." cuando:

- Hay `401` en ruta protegida.
- Falló el intento de refresh.
- Se redirige a `/login?reason=session-expired`.

### Ajuste clave para desarrollo local

En backend, para localhost:

- `AUTH_COOKIE_SECURE=false`
- `AUTH_COOKIE_SAME_SITE=lax`

En producción (HTTPS):

- `AUTH_COOKIE_SECURE=true`
- `AUTH_COOKIE_SAME_SITE=none`
