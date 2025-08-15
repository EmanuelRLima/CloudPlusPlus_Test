<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_creates_task_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $taskData = [
            'name' => 'New Task',
            'description' => 'Task description',
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/projects/{$project->id}/tasks", $taskData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id', 'name', 'description', 'status',
                         'creator', 'project_id', 'created_at', 'updated_at'
                     ]
                 ])
                 ->assertJson([
                     'data' => [
                         'name' => 'New Task',
                         'description' => 'Task description',
                         'status' => 'active',
                         'project_id' => $project->id
                     ]
                 ]);

        $this->assertDatabaseHas('tasks', [
            'name' => 'New Task',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);
    }

    #[Test]
    public function it_creates_task_with_default_active_status(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $taskData = [
            'name' => 'New Task',
            'description' => 'Task description'
        ];

        $response = $this->postJson("/api/v1/projects/{$project->id}/tasks", $taskData);

        $response->assertStatus(201)
                 ->assertJson([
                     'data' => ['status' => 'active']
                 ]);
    }

    #[Test]
    public function it_validates_required_fields_on_task_creation(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/projects/{$project->id}/tasks", []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function it_validates_task_status_on_creation(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/projects/{$project->id}/tasks", [
            'name' => 'Test Task',
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function it_prevents_unauthorized_user_from_creating_task(): void
    {
        $owner = User::factory()->create(['username' => 'owner']);
        $unauthorizedUser = User::factory()->create(['username' => 'unauthorized']);
        $project = Project::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($unauthorizedUser);

        $response = $this->postJson("/api/v1/projects/{$project->id}/tasks", [
            'name' => 'Unauthorized Task'
        ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function it_shows_task_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'id', 'name', 'description', 'status',
                         'creator' => ['id', 'name'],
                         'project_id', 'created_at', 'updated_at'
                     ]
                 ])
                 ->assertJson([
                     'data' => [
                         'id' => $task->id,
                         'name' => $task->name,
                         'project_id' => $project->id
                     ]
                 ]);
    }

    #[Test]
    public function it_updates_task_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $updateData = [
            'name' => 'Updated Task Name',
            'description' => 'Updated description',
            'status' => 'inactive'
        ];

        $response = $this->putJson("/api/v1/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'name' => 'Updated Task Name',
                         'description' => 'Updated description',
                         'status' => 'inactive'
                     ]
                 ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'name' => 'Updated Task Name'
        ]);
    }

    #[Test]
    public function it_allows_project_owner_to_update_task(): void
    {
        $projectOwner = User::factory()->create(['username' => 'owner']);
        $taskCreator = User::factory()->create(['username' => 'creator']);
        $project = Project::factory()->create(['user_id' => $projectOwner->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $taskCreator->id
        ]);

        Sanctum::actingAs($projectOwner);

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'name' => 'Updated by Project Owner'
        ]);

        $response->assertStatus(200);
    }

    #[Test]
    public function it_allows_task_creator_to_update_task(): void
    {
        $projectOwner = User::factory()->create(['username' => 'owner']);
        $taskCreator = User::factory()->create(['username' => 'creator']);
        $project = Project::factory()->create(['user_id' => $projectOwner->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $taskCreator->id
        ]);

        Sanctum::actingAs($taskCreator);

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'name' => 'Updated by Task Creator'
        ]);

        $response->assertStatus(200);
    }

    #[Test]
    public function it_prevents_unauthorized_user_from_updating_task(): void
    {
        $projectOwner = User::factory()->create(['username' => 'owner']);
        $taskCreator = User::factory()->create(['username' => 'creator']);
        $unauthorizedUser = User::factory()->create(['username' => 'unauthorized']);
        $project = Project::factory()->create(['user_id' => $projectOwner->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $taskCreator->id
        ]);

        Sanctum::actingAs($unauthorizedUser);

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'name' => 'Unauthorized Update'
        ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function it_validates_update_data(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'name' => '',
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'status']);
    }

    #[Test]
    public function it_deletes_task_successfully(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Task deleted successfully']);

        $this->assertModelMissing($task);
    }

    #[Test]
    public function it_allows_only_project_owner_to_delete_task(): void
    {
        $projectOwner = User::factory()->create(['username' => 'owner']);
        $taskCreator = User::factory()->create(['username' => 'creator']);
        $project = Project::factory()->create(['user_id' => $projectOwner->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $taskCreator->id
        ]);

        Sanctum::actingAs($taskCreator);
        $response = $this->deleteJson("/api/v1/tasks/{$task->id}");
        $response->assertStatus(403);

        Sanctum::actingAs($projectOwner);
        $response = $this->deleteJson("/api/v1/tasks/{$task->id}");
        $response->assertStatus(200);
    }

    #[Test]
    public function it_prevents_unauthorized_user_from_deleting_task(): void
    {
        $projectOwner = User::factory()->create(['username' => 'owner']);
        $taskCreator = User::factory()->create(['username' => 'creator']);
        $unauthorizedUser = User::factory()->create(['username' => 'unauthorized']);
        $project = Project::factory()->create(['user_id' => $projectOwner->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $taskCreator->id
        ]);

        Sanctum::actingAs($unauthorizedUser);

        $response = $this->deleteJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(403);
    }

    #[Test]
    public function it_returns_404_for_nonexistent_task(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/tasks/999');

        $response->assertStatus(404);
    }

    #[Test]
    public function it_returns_404_for_nonexistent_project_in_task_listing(): void
    {
        $user = User::factory()->create(['username' => 'testuser']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/projects/999/tasks');

        $response->assertStatus(404);
    }

    #[Test]
    public function it_loads_creator_relationship_in_task_responses(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'name' => 'John Doe'
        ]);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'creator' => [
                             'id' => $user->id,
                             'name' => 'John Doe'
                         ]
                     ]
                 ]);
    }
}
