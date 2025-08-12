<?php

namespace Tests\Unit\Auth;

use App\Exceptions\PhotoUploadException;
use App\Exceptions\UserCreationException;
use App\Models\User;
use App\Services\Auth\RegisterUserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RegisterUserServiceTest extends TestCase
{
    use RefreshDatabase;

    private RegisterUserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new RegisterUserService();
        Storage::fake('public');
    }

    #[Test]
    public function it_creates_user_without_photo(): void
    {
        $data = [
            'name' => 'Jane Doe',
            'username' => 'janedoe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $user = $this->service->execute($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Jane Doe', $user->name);
        $this->assertEquals('janedoe', $user->username);
        $this->assertEquals('jane@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));

        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
            'username' => 'janedoe'
        ]);
    }

    #[Test]
    public function it_creates_user_with_photo(): void
    {
        $photo = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $data = [
            'name' => 'John Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'photo' => $photo,
        ];

        $user = $this->service->execute($data);

        $this->assertInstanceOf(User::class, $user);
        $this->assertNotNull($user->photo);
        $this->assertStringStartsWith('users/photos/', $user->photo);

        Storage::disk('public')->assertExists($user->photo);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

   #[Test]
public function it_throws_exception_for_invalid_photo(): void
{
    $this->expectException(PhotoUploadException::class);


    $fakeFile = UploadedFile::fake()->create('invalid.txt', 1000);

    $invalidPhoto = new class(
        $fakeFile->getPathname(),
        $fakeFile->getClientOriginalName(),
        $fakeFile->getClientMimeType(),
        null,
        true
    ) extends UploadedFile {
        public function isValid(): bool
        {
            return false;
        }
    };

    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
        'photo' => $invalidPhoto,
    ];

    $this->service->execute($data);
}

    #[Test]
    public function it_handles_database_transaction_rollback(): void
    {
        $this->expectException(UserCreationException::class);

        $data = [
            'name' => str_repeat('a', 1000),
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $this->service->execute($data);
    }
}
