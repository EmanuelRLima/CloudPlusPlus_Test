<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function update(User $user, Task $task)
    {
        return $user->id === $task->user_id || $user->id === $task->project->user_id;
    }

    public function delete(User $user, Task $task)
    {
        return $user->id === $task->project->user_id;
    }

    public function create(User $user)
    {
        return true;
    }

    public function view(User $user, Task $task)
    {
        return true;
    }

    public function viewAny(User $user)
    {
        return true;
    }
}
