<?php

namespace App\Exceptions;

use Exception;

class UserRegistrationException extends Exception
{
    public function __construct(
        string $message = "User registration failed",
        int $code = 422
    ) {
        parent::__construct($message, $code);
    }
}
