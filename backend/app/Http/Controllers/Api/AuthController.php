<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return $this->attachAccessTokenCookie(
            response()->json($this->publicAuthPayload($result), 201),
            $result['access_token'],
            (int) $result['expires_in'],
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        return $this->attachAccessTokenCookie(
            response()->json($this->publicAuthPayload($result)),
            $result['access_token'],
            (int) $result['expires_in'],
        );
    }

    public function me(): JsonResponse
    {
        return response()->json(new UserResource(auth()->user()));
    }

    public function refresh(): JsonResponse
    {
        try {
            $result = $this->authService->refresh();
        } catch (TokenInvalidException) {
            return response()->json(['message' => 'Token inválido'], 401);
        } catch (JWTException) {
            return response()->json(['message' => 'No se pudo refrescar el token'], 500);
        }

        return $this->attachAccessTokenCookie(
            response()->json($this->publicAuthPayload($result)),
            $result['access_token'],
            (int) $result['expires_in'],
        );
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout();
        } catch (JWTException|TokenInvalidException) {
            // If the token is already invalid/expired we still clear cookie client-side.
        }

        return response()
            ->json(['message' => 'Logout correcto'])
            ->withCookie(Cookie::forget('access_token', '/', env('AUTH_COOKIE_DOMAIN')));
    }

    private function publicAuthPayload(array $result): array
    {
        return [
            'user' => $result['user'],
            'token_type' => $result['token_type'],
            'expires_in' => $result['expires_in'],
        ];
    }

    private function attachAccessTokenCookie(JsonResponse $response, string $token, int $ttlMinutes): JsonResponse
    {
        $secure = (bool) env('AUTH_COOKIE_SECURE', app()->environment('production'));
        $sameSite = env('AUTH_COOKIE_SAME_SITE', $secure ? 'none' : 'lax');

        return $response->cookie(
            'access_token',
            $token,
            $ttlMinutes,
            '/',
            env('AUTH_COOKIE_DOMAIN'),
            $secure,
            true,
            false,
            $sameSite,
        );
    }
}
