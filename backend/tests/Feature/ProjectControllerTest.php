<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_projects_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id', 'name', 'description', 'status',
                             'start_date', 'end_date', 'value',
                             'owner' => ['id', 'name', 'email']
                         ]
                     ],
                     'links',
                     'meta'
                 ]);
    }

    #[Test]
    public function it_filters_projects_by_search(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project1 = Project::factory()->create([
            'user_id' => $user->id,
            'name' => 'Laravel Project'
        ]);
        $project2 = Project::factory()->create([
            'user_id' => $user->id,
            'name' => 'Vue Project'
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects?search=Laravel');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['name' => 'Laravel Project']);
    }

    #[Test]
    public function it_filters_projects_by_status(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $activeProject = Project::factory()->create([
            'user_id' => $user->id,
            'status' => 'active'
        ]);
        $inactiveProject = Project::factory()->create([
            'user_id' => $user->id,
            'status' => 'inactive'
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects?status=active');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['status' => 'active']);
    }

    #[Test]
    public function it_sorts_projects_by_name(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $projectB = Project::factory()->create([
            'user_id' => $user->id,
            'name' => 'B Project'
        ]);
        $projectA = Project::factory()->create([
            'user_id' => $user->id,
            'name' => 'A Project'
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects?sort=name&direction=asc');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals('A Project', $data[0]['name']);
        $this->assertEquals('B Project', $data[1]['name']);
    }

    #[Test]
    public function it_validates_index_parameters(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects?status=invalid&sort=invalid&direction=invalid&page_size=101');

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status', 'sort', 'direction', 'page_size']);
    }

    #[Test]
    public function it_creates_project_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $projectData = [
            'name' => 'New Project',
            'description' => 'A new project description',
            'status' => 'active',
            'start_date' => '2024-01-01',
            'end_date' => '2024-12-31',
            'value' => 10000.00
        ];

        $response = $this->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id', 'name', 'description', 'status',
                         'start_date', 'end_date', 'value',
                         'owner' => ['id', 'name', 'email']
                     ]
                 ])
                 ->assertJson([
                     'data' => [
                         'name' => 'New Project',
                         'description' => 'A new project description',
                         'status' => 'active',
                         'owner' => ['id' => $user->id]
                     ]
                 ]);

        $this->assertDatabaseHas('projects', [
            'name' => 'New Project',
            'user_id' => $user->id
        ]);
    }

    #[Test]
    public function it_validates_required_fields_on_create(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/projects', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function it_validates_end_date_after_start_date(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/projects', [
            'name' => 'Test Project',
            'start_date' => '2024-12-31',
            'end_date' => '2024-01-01'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['end_date']);
    }

    #[Test]
    public function it_shows_project_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'id', 'name', 'description', 'status',
                         'start_date', 'end_date', 'value',
                         'owner' => ['id', 'name', 'email'],
                         'tasks'
                     ]
                 ])
                 ->assertJson([
                     'data' => [
                         'id' => $project->id,
                         'name' => $project->name
                     ]
                 ]);
    }

    #[Test]
    public function it_updates_project_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $updateData = [
            'name' => 'Updated Project Name',
            'description' => 'Updated description',
            'status' => 'inactive'
        ];

        $response = $this->putJson("/api/v1/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'name' => 'Updated Project Name',
                         'description' => 'Updated description',
                         'status' => 'inactive'
                     ]
                 ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name'
        ]);
    }

    #[Test]
    public function it_updates_tasks_to_inactive_when_project_becomes_inactive(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = $project->tasks()->create([
            'name' => 'Test Task',
            'status' => 'active',
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/v1/projects/{$project->id}", [
            'name' => $project->name,
            'status' => 'inactive'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'inactive'
        ]);
    }

    #[Test]
    public function it_prevents_unauthorized_user_from_updating_project(): void
    {
        $owner = User::factory()->create(['username' => 'owner']);
        $unauthorizedUser = User::factory()->create(['username' => 'unauthorized']);
        $project = Project::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($unauthorizedUser);

        $response = $this->putJson("/api/v1/projects/{$project->id}", [
            'name' => 'Unauthorized Update'
        ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function it_deletes_project_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Project deleted successfully']);

        $this->assertModelMissing($project);
    }

    #[Test]
    public function it_prevents_unauthorized_user_from_deleting_project(): void
    {
        $owner = User::factory()->create(['username' => 'owner']);
        $unauthorizedUser = User::factory()->create(['username' => 'unauthorized']);
        $project = Project::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($unauthorizedUser);

        $response = $this->deleteJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(403);
    }

    #[Test]
    public function it_returns_404_for_nonexistent_project(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects/999');

        $response->assertStatus(404);
    }
}
