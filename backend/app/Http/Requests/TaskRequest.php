<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'project_id' => 'sometimes|exists:projects,id',
            'user_id' => 'sometimes|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'task name is required.',
            'status.in' => 'Status must be "active" or "inactive".',
        ];
    }
}

