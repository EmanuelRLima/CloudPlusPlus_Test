<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'value' => $this->faker->randomFloat(2, 100, 10000),
        ];
    }
}
