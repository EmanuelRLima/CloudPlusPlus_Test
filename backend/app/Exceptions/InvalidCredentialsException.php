<?php

namespace App\Exceptions;

use Exception;

class InvalidCredentialsException extends Exception
{
    public function __construct(
        string $message = "Invalid email/username or password.",
        int $code = 401
    ) {
        parent::__construct($message, $code);
    }

    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $this->getMessage(),
                'error_type' => 'InvalidCredentialsException'
            ], $this->getCode());
        }
    }
}
