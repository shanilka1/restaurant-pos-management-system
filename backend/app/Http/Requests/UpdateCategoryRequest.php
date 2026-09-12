<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the category ID from the route, it might be an object if implicit binding is used
        $categoryId = $this->route('category');
        if (is_object($categoryId)) {
            $categoryId = $categoryId->id;
        }

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($categoryId)->whereNull('deleted_at')
            ],
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }
}
