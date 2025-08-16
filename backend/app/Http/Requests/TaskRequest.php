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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,completed,inactive',
            'project_id' => 'sometimes|exists:projects,id',
            'user_id' => 'sometimes|exists:users,id',
            'due_date' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'task title is required.',
            'status.in' => 'Status must be "Pending", "Completed", or "Inactive".',
            'due_date.required' => 'Due date is required.',
            'due_date.date' => 'Due date must be a valid date.',
            'due_date.after_or_equal' => 'Due date must be today or in the future.',
        ];
    }
}

