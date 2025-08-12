<?php

namespace App\Exceptions;

use App\Exceptions\PhotoUploadException;
use App\Exceptions\UserCreationException;
use App\Exceptions\UserRegistrationException;
use App\Exceptions\InvalidCredentialsException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($this->isCustomAuthException($exception)) {
            return $this->renderCustomAuthException($exception);
        }

        return parent::render($request, $exception);
    }

    private function isCustomAuthException(Throwable $exception): bool
    {
        return $exception instanceof PhotoUploadException ||
               $exception instanceof UserCreationException ||
               $exception instanceof UserRegistrationException ||
               $exception instanceof InvalidCredentialsException;
    }

    private function renderCustomAuthException(Throwable $exception): JsonResponse
    {
        return response()->json([
            'message' => $exception->getMessage(),
            'error_type' => class_basename($exception)
        ], $exception->getCode());
    }
}
