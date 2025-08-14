<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\Auth\LoginUserService;
use App\Exceptions\InvalidCredentialsException;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;
use Throwable;

class LoginController extends Controller
{
    public function __construct(
        private LoginUserService $loginUserService
    ) {}

     /**
     * @OA\Post(
     *     path="/api/v1/login",
     *     summary="User login",
     *     description="Authenticate user and return access token",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Login credentials",
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="user", type="object", description="User information"),
     *             @OA\Property(property="token", type="string", example="1|abc123def456...", description="Authentication token")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Credenciais inválidas"),
     *             @OA\Property(property="error_type", type="string", example="InvalidCredentialsException")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */

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
