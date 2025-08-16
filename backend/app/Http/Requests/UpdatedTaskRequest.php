<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatedTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,completed,inactive',
            'project_id' => 'sometimes|exists:projects,id',
            'user_id' => 'sometimes|exists:users,id',
            'due_date' => 'sometimes|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status must be "Pending", "Completed", or "Inactive".',
        ];
    }
}

