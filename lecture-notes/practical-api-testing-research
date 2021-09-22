# Practical: API Testing Research Notes

## API Testing

**API testing** is a software testing practice which validates **APIs**. The purpose is to check the functionality, reliability & security of the **APIs**. **API testing** mainly concentrates on the business logic rather than the presentation logic.

To create a new test, execute the following command:

```php
php artisan make:test StudentTest
```

By default, tests will be placed in the `Tests\Feature` directory.

Here is an example on how you would test your `Student` routes:

```php
<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\Student;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StudentTest extends TestCase
{
    public function setUp(): void {
        parent::setUp();

        Institution::create([
            'id' => 1,
            'name' => "Brown University",
            'city' => "Providence",
            'state' => "Rhode Island",
            'country' => "United States of America"
        ]);

        Student::create([
            'first_name' => "John",
            'last_name' => "Doe",
            'phone_number' => "910-123-3121",
            'email_address' => "john.doe@gmail.com",
            'institution_id' => 1
        ]);
    }

    public function test_post_student()
    {
        $payload = [
            'first_name' => "Jane",
            'last_name' => "Doe",
            'phone_number' => "910-321-2131",
            'email_address' => "jane.doe@gmail.com",
            'institution_id' => 1
        ];

        $response = $this->post('/api/students', $payload);
        $response
            ->assertStatus(201)
            ->assertJson([
                "message" => "Student created."
            ]);
    }

    public function test_update_student()
    {
        $payload = [
            'first_name' => "Joe",
            'phone_number' => "910-123-4567",
            'email_address' => 'joe.doe@gmail.com'
        ];

        $response = $this->put('/api/students/1', $payload);
        $response
            ->assertStatus(200)
            ->assertJson([
                "message" => "Student updated."
            ]);
    }

    public function test_get_students()
    {
        $response = $this->get('/api/students');
        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                [
                    '*' => [
                        'id',
                        'first_name',
                        'last_name',
                        'phone_number',
                        'email_address'
                    ]
                ]
            );
    }

    public function test_get_student()
    {
        $response = $this->get('/api/students/1');
        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'first_name' => 'John',
                'last_name' => 'Doe'
            ]);
    }

    public function test_delete_student()
    {
        $response = $this->delete('/api/students/1');
        $response
            ->assertStatus(202)
            ->assertJson([
                "message" => "Student deleted."
            ]);
    }

    public function test_deleted_student_not_found()
    {
        $response = $this->delete('/api/students/2');
        $response
            ->assertStatus(404)
            ->assertJson([
                "message" => "Student not found."
            ]);
    }
}
```

To run your test, execute the following command:

```php
.\vendor\bin\phpunit
```

**Resource:**  https://laravel.com/docs/8.x/testing
