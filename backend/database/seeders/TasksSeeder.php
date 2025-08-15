<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class TasksSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

       Project::all()->each(function ($project) use ($user) {
            Task::factory()->count(5)->create([
                'project_id' => $project->id,
                'user_id' => $user->id,
            ]);
        });
    }
}
