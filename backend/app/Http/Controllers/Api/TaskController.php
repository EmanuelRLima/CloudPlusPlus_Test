<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
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
        $tasks = $project->tasks()->with('creator');

        if ($status = $request->get('status')) {
            $tasks->where('status', $status);
        }

        if ($sort = $request->get('sort')) {
            $direction = $request->get('direction', 'asc');
            $tasks->orderBy($sort, $direction);
        }

        $pageSize = $request->get('page_size', 10);

        return TaskResource::collection($tasks->paginate($pageSize));
    }

    public function store(TaskRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $task = $project->tasks()->create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
            'user_id' => auth()->id(),
        ]);

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        return new TaskResource($task->load('creator'));
    }

    public function update(TaskRequest $request, Task $task)
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
