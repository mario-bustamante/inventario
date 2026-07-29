<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(), [
                "name" => "required",
                "email" => "required|email|unique:users",
                'password' => 'required|min:8'
            ]
        );

        if($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password)
        ]);

        $token = auth()->login($user);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'message'=>'Credenciales incorrectas'
            ],401);
        }

        return response()->json([
            'access_token'=>$token,
            'token_type'=>'Bearer',
            'expires_in'=>auth()->factory()->getTTL()*60
        ]);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => auth()->refresh(),
            'token_type'   => 'Bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
        ]);
    }

    public function logout()
    {
        auth()->logout();

        return response()->json([
            'message'=>'Logout correcto'
        ]);
    }
}
