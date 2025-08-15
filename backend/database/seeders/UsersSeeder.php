<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Example User',
            'username' => 'Example_Example',
            'email' => 'demoTeste@example.com',
            'password' => Hash::make('123456789'),
        ]);
    }
}
