<?php

namespace App\Exceptions;

use Exception;

class UserCreationException extends Exception
{
    public function __construct(
        string $message = "Failed to create user in database.",
        int $code = 422
    ) {
        parent::__construct($message, $code);
    }
}
