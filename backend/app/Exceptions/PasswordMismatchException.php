<?php

namespace App\Exceptions;

use Exception;

class PasswordMismatchException extends Exception
{
    public function __construct(
        string $message = "Passwords do not match.",
        int $code = 422
    ) {
        parent::__construct($message, $code);
    }
}
