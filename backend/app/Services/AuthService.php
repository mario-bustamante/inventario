<?php

namespace App\Services;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthService
{
    /**
     * Registra un nuevo usuario y emite un token de acceso.
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = auth()->login($user);

        return $this->buildTokenResponse($token, $user);
    }

    /**
     * Autentica al usuario y emite un token de acceso.
     * Devuelve null si las credenciales son incorrectas.
     */
    public function login(array $credentials): ?array
    {
        $token = auth()->attempt($credentials);

        if (!$token) {
            return null;
        }

        return $this->buildTokenResponse($token, auth()->user());
    }

    /**
     * Rota el token actual: revoca (blacklist) el anterior y emite uno nuevo.
     *
     * @throws TokenInvalidException|JWTException
     */
    public function refresh(): array
    {
        // forceForever=true garantiza que el token anterior quede en blacklist
        // aunque blacklist_enabled esté desactivado en jwt.php
        $newToken = auth()->refresh(true, true);

        return $this->buildTokenResponse($newToken, auth()->user());
    }

    /**
     * Revoca el token actual añadiéndolo a la blacklist.
     */
    public function logout(): void
    {
        // true = forzar invalidación permanente en la blacklist
        auth()->logout(true);
    }

    /**
     * Construye el array de respuesta con token y datos del usuario.
     */
    private function buildTokenResponse(string $token, $user): array
    {
        return [
            'user'         => new UserResource($user),
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'expires_in'   => auth()->factory()->getTTL(),
        ];
    }
}
