<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_logs_in_user_successfully_with_valid_email(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'id', 'name', 'username', 'email',
                         'photo', 'created_at'
                     ],
                     'token'
                 ])
                 ->assertJson([
                     'message' => 'Login successful',
                     'user' => [
                         'id' => $user->id,
                         'email' => 'test@example.com',
                     ]
                 ]);

        $this->assertNotEmpty($response->json('token'));
    }

    #[Test]
    public function it_logs_in_user_successfully_with_valid_username(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'testuser',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'id', 'name', 'username', 'email',
                         'photo', 'created_at'
                     ],
                     'token'
                 ])
                 ->assertJson([
                     'message' => 'Login successful',
                     'user' => [
                         'id' => $user->id,
                         'username' => 'testuser',
                     ]
                 ]);

        $this->assertNotEmpty($response->json('token'));
    }

    #[Test]
    public function it_fails_login_with_invalid_email(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'wrong@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid email/username or password.',
                     'error_type' => 'InvalidCredentialsException'
                 ]);
    }

    #[Test]
    public function it_fails_login_with_invalid_username(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'wronguser',
            'password' => 'password123',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid email/username or password.',
                     'error_type' => 'InvalidCredentialsException'
                 ]);
    }

    #[Test]
    public function it_fails_login_with_invalid_password(): void
    {
        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid email/username or password.',
                     'error_type' => 'InvalidCredentialsException'
                 ]);
    }

    #[Test]
    public function it_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['login', 'password']);
    }

    #[Test]
    public function it_accepts_any_string_as_login_field(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'login' => 'any-string-here',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    #[Test]
    public function it_logs_out_user_successfully(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser'
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Logout successful'
                 ]);
    }
}
