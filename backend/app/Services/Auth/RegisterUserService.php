<?php

namespace App\Services\Auth;

use App\Exceptions\PhotoUploadException;
use App\Exceptions\UserCreationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class RegisterUserService
{
    public function execute(array $data): User
    {

       $photoPath = null;

    if (isset($data['photo'])) {
        if (!$data['photo']->isValid()) {
            throw new PhotoUploadException('File is invalid');
        }

        try {
            $photoName = Str::uuid() . '.' . $data['photo']->getClientOriginalExtension();
            $photoPath = $data['photo']->storeAs('users/photos', $photoName, 'public');
        } catch (Throwable $e) {
            throw new PhotoUploadException('Failed to upload photo: ' . $e->getMessage());
        }
    }

        try {
            $user = User::create([
                'name'     => $data['name'],
                'username' => $data['username'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'photo'    => $photoPath,
            ]);

            return $user;
        } catch (Throwable $e) {
            if ($photoPath && Storage::disk('public')->exists($photoPath)) {
                Storage::disk('public')->delete($photoPath);
            }

            throw new UserCreationException('Failed to create user: ' . $e->getMessage());
        }
    }
}
