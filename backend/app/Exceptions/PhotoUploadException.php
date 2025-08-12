<?php

namespace App\Exceptions;

use Exception;

class PhotoUploadException extends Exception
{
    public function __construct(
        string $message = "Failed to upload user photo.",
        int $code = 500
    ) {
        parent::__construct($message, $code);
    }
}
