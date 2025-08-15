<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'value' => 'nullable|numeric|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'name is required.',
            'status.in' => 'Status must be "active" or "inactive".',
            'end_date.after_or_equal' => 'end_date must be equal to or after start_date.',
            'value.numeric' => 'value must be a number.',
        ];
    }
}
