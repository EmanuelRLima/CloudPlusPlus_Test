<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'value' => $this->value,
            'owner' => [
                'id' => $this->owner?->id,
                'username' => $this->owner?->username,
                'email' => $this->owner?->email,
            ],
           'tasks' => $this->whenLoaded('tasks', function () {
                return $this->tasks->map(function($task) {
                    return [
                        'id' => $task->id,
                        'username' => $task->username,
                        'status' => $task->status,
                    ];
                });
            }),
        ];
    }
}
