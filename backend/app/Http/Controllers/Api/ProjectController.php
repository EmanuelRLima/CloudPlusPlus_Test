<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Project::class, 'project');
    }

    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
            'sort' => 'nullable|in:name,created_at,updated_at',
            'direction' => 'nullable|in:asc,desc',
            'page_size' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Project::with('owner');

        $query->when($request->filled('search'), function ($query) use ($request) {
            return $query->where('name', 'like', "%{$request->search}%");
        })
        ->when($request->filled('status'), function ($query) use ($request) {
            return $query->where('status', $request->status);
        })
        ->when($request->filled('sort'), function ($query) use ($request) {
            $direction = $request->get('direction', 'asc');
            return $query->orderBy($request->sort, $direction);
        });

        $pageSize = $request->get('page_size', 10);

        return ProjectResource::collection($query->paginate($pageSize));
    }

    public function store(ProjectRequest $request)
    {
       try {
            DB::beginTransaction();

            $data = $request->validated();
            $project = auth()->user()->projects()->create($data);

            DB::commit();
            return new ProjectResource($project->load('owner'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create project'], 500);
        }
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load('owner', 'tasks'));
    }

    public function update(ProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        if (isset($request->status) && $request->status === 'inactive') {
            $project->tasks()->update(['status' => 'inactive']);
        }

        return new ProjectResource($project->load('owner', 'tasks'));
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
