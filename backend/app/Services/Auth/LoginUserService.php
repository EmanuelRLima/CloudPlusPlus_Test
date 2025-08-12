<?php

namespace App\Services\Auth;

use App\Exceptions\InvalidCredentialsException;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginUserService
{
    public function execute(array $data): array
    {
        $login = $data['login'];

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $login)->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new InvalidCredentialsException();
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => new UserResource($user),
            'token' => $token,
        ];
    }
}
