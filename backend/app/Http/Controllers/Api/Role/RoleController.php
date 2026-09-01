<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = $request->get('search');
        $roles = Role::where('name', 'like', '%'.$search.'%')
                            ->orderBy('name', 'desc');

        return response()->json([
            'status' => 200,
            'roles' => $roles->map(function($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'created_at' => $role->created_at->format('d/m/Y h:i:s'),
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $exist_role = Role::where('name', $request->name)
                                ->first();

        if($exist_role) {
            return response()->json([
                'status' => 403,
                'message' => "El nombre de rol ya existe"
            ]);
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'api'
        ]);

        return response()->json([
            'status' => 200,
            'role' => $role
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $exist_role = Role::where('name', $request->name)
                                ->where('id', '<>', $id)
                                ->first();

        if($exist_role) {
            return response()->json([
                'status' => 403,
                'message' => "El nombre de rol ya existe"
            ]);
        }

        $role = Role::findOrFail($id);
        
        $role->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 200,
            'role' => $role
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json([
            'status' => 200,
            'message' => 'El rol se ha eliminado correctamente'
        ]);
    }
}
