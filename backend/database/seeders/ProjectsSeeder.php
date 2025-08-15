<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Project::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);
    }
}
