<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Services\Auth\RegisterUserService;
use Illuminate\Http\JsonResponse;
use Throwable;

class RegisterController extends Controller
{
    public function __construct(
        private RegisterUserService $registerUserService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {

        try {
            $user = $this->registerUserService->execute($request->validated());

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);

        } catch (Throwable $e) {
            throw $e;
        }
    }
}
