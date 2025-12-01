<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'host' => 'sometimes|required|string',
            'ip' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'image' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'order' => 'nullable|integer',
        ];
    }
}
