<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Http\Requests\UpdatedTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Task::class, 'task');
    }

    public function index(Project $project, Request $request)
    {
        $query = $project->tasks()->with('creator');

        $query->when($request->filled('search'), function ($query) use ($request) {
            return $query->where('title', 'like', "%{$request->search}%");
        })
        ->when($request->filled('status'), function ($query) use ($request) {
            return $query->where('status', $request->status);
        })
        ->when($request->filled('sort_by'), function ($query) use ($request) {
            $direction = $request->get('sort_direction', 'asc');
            return $query->orderBy($request->sort_by, $direction);
        });

        $totalPending = $project->tasks()->where('status', 'pending')->count();
        $totalCompleted = $project->tasks()->where('status', 'completed')->count();
        $totalInactive = $project->tasks()->where('status', 'inactive')->count();

        $pageSize = $request->get('page_size', 10);

        return TaskResource::collection($query->paginate($pageSize))->additional([
            'meta' => [
                'total_pending' => $totalPending,
                'total_completed' => $totalCompleted,
                'total_inactive' => $totalInactive,
            ],
        ]);
    }

    public function store(TaskRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $task = $project->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'user_id' => auth()->id(),
            'due_date' => $request->due_date,
        ]);

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        return new TaskResource($task->load('creator'));
    }

    public function update(UpdatedTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return new TaskResource($task->load('creator'));
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
