<?php

namespace Tests\Unit\Auth;

use App\Exceptions\InvalidCredentialsException;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Auth\LoginUserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LoginUserServiceTest extends TestCase
{
    use RefreshDatabase;

    private LoginUserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new LoginUserService();
        Storage::fake('public');
    }

    #[Test]
    public function it_authenticates_user_with_valid_email(): void
    {
        $user = User::factory()->create([
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'john@example.com',
            'password' => 'password123',
        ];

        $result = $this->service->execute($data);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(UserResource::class, $result['user']);
        $this->assertIsString($result['token']);
        $this->assertNotEmpty($result['token']);
    }

    #[Test]
    public function it_authenticates_user_with_valid_username(): void
    {
        $user = User::factory()->create([
            'username' => 'johndoe',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'johndoe',
            'password' => 'password123',
        ];

        $result = $this->service->execute($data);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(UserResource::class, $result['user']);
        $this->assertIsString($result['token']);
        $this->assertNotEmpty($result['token']);
    }

    #[Test]
    public function it_throws_exception_for_invalid_email(): void
    {
        $this->expectException(InvalidCredentialsException::class);
        $this->expectExceptionMessage('Invalid email/username or password.');

        User::factory()->create([
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'wrong@example.com',
            'password' => 'password123',
        ];

        $this->service->execute($data);
    }

    #[Test]
    public function it_throws_exception_for_invalid_username(): void
    {
        $this->expectException(InvalidCredentialsException::class);
        $this->expectExceptionMessage('Invalid email/username or password.');

        User::factory()->create([
            'username' => 'johndoe',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'wronguser',
            'password' => 'password123',
        ];

        $this->service->execute($data);
    }

    #[Test]
    public function it_throws_exception_for_invalid_password(): void
    {
        $this->expectException(InvalidCredentialsException::class);
        $this->expectExceptionMessage('Invalid email/username or password.');

        User::factory()->create([
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'john@example.com',
            'password' => 'wrongpassword',
        ];

        $this->service->execute($data);
    }

    #[Test]
    public function it_throws_exception_for_non_existent_user(): void
    {
        $this->expectException(InvalidCredentialsException::class);
        $this->expectExceptionMessage('Invalid email/username or password.');

        $data = [
            'login' => 'nonexistent@example.com',
            'password' => 'password123',
        ];

        $this->service->execute($data);
    }

    #[Test]
    public function it_returns_user_resource_with_correct_format(): void
    {
        $user = User::factory()->create([
            'name' => 'Jane Doe',
            'username' => 'janedoe',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'jane@example.com',
            'password' => 'password123',
        ];

        $result = $this->service->execute($data);

        $userResource = $result['user'];
        $this->assertInstanceOf(UserResource::class, $userResource);

        $userArray = $userResource->toArray(request());
        $this->assertEquals($user->id, $userArray['id']);
        $this->assertEquals('Jane Doe', $userArray['name']);
        $this->assertEquals('janedoe', $userArray['username']);
        $this->assertEquals('jane@example.com', $userArray['email']);
    }

    #[Test]
    public function it_creates_valid_sanctum_token(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $data = [
            'login' => 'test@example.com',
            'password' => 'password123',
        ];

        $result = $this->service->execute($data);

        $this->assertIsString($result['token']);
        $this->assertNotEmpty($result['token']);

        $this->assertMatchesRegularExpression('/^\d+\|.+$/', $result['token']);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
            'name' => 'auth-token',
        ]);
    }

    #[Test]
    public function it_correctly_detects_email_vs_username(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $emailData = [
            'login' => 'test@example.com',
            'password' => 'password123',
        ];

        $emailResult = $this->service->execute($emailData);
        $this->assertEquals($user->id, $emailResult['user']->id);

        $usernameData = [
            'login' => 'testuser',
            'password' => 'password123',
        ];

        $usernameResult = $this->service->execute($usernameData);
        $this->assertEquals($user->id, $usernameResult['user']->id);
    }
}
