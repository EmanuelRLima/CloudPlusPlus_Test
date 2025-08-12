<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'username'   => $this->username,
            'email'      => $this->email,
            'photo'      => $this->photo ? Storage::url($this->photo) : null,
            'created_at' => $this->created_at,
        ];
    }
}
