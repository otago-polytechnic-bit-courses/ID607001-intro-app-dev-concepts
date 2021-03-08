# Laravel 2 - REST API Validation & Relationships

## REST API Validation

```php
...
public function createStudent(Request $request) {
    $validator = Validator::make($request->all(), [
        'first_name' => 'required',
        'last_name' => 'required',
        'phone_number' => 'required',
        'email_address' => 'required'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => $validator->errors()], 401);
    } else {
        Student::create($request->all());
        return response()->json(['message' => 'Student created.'], 201);
    }
}
...
``

## Relationships

## Activity ✏️
In this activity, you will extend the **api** project. 

