<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\Auth\LoginUserService;
use App\Exceptions\InvalidCredentialsException;
use Illuminate\Http\JsonResponse;
use Throwable;

class LoginController extends Controller
{
    public function __construct(
        private LoginUserService $loginUserService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginUserService->execute($request->validated());

            return response()->json([
                'message' => 'Login successful',
                'user' => $result['user'],
                'token' => $result['token'],
            ], 200);

        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error_type' => 'InvalidCredentialsException'
            ], 401);
        } catch (Throwable $e) {
            throw $e;
        }
    }

    public function logout(): JsonResponse
    {
        try {
            auth()->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successful'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error during logout'
            ], 500);
        }
    }
}
