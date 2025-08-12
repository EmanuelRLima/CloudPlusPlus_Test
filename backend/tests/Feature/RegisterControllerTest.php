<?php

namespace Tests\Feature;

use App\Exceptions\PhotoUploadException;
use App\Exceptions\UserCreationException;
use App\Models\User;
use App\Services\RegisterUserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    #[Test]
    public function it_registers_user_successfully_without_photo(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'Test User',
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'id', 'name', 'username', 'email',
                         'photo', 'created_at', 'updated_at'
                     ]
                 ])
                 ->assertJson([
                     'message' => 'User registered successfully',
                     'user' => [
                         'name' => 'Test User',
                         'username' => 'Test User',
                         'email' => 'test@example.com',
                         'photo' => null
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'username' => 'Test User'
        ]);
    }

    #[Test]
    public function it_registers_user_successfully_with_photo(): void
    {
        $photo = UploadedFile::fake()->image('avatar.jpg', 100, 100);

        $response = $this->postJson('/api/v1/register', [
            'name' => 'Test User',
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'photo' => $photo,
        ]);

        $response->assertStatus(201);

        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->photo);

        Storage::disk('public')->assertExists($user->photo);
    }

    #[Test]
    public function it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'name', 'username', 'email', 'password', 'password_confirmation'
                 ]);
    }

    #[Test]
    public function it_validates_unique_email_and_username(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
            'username' => 'existing'
        ]);

        $response = $this->postJson('/api/v1/register', [
            'name' => 'Test User',
            'username' => 'existing',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'username']);
    }

    #[Test]
    public function it_validates_password_confirmation(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('password_confirmation');
    }

}
