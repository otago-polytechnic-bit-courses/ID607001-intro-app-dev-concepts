# Laravel 2 - API Validation & Relationships

## API Validation
In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. However, you will look at [manually creating validators](https://laravel.com/docs/8.x/validation#manually-creating-validators) instead. **Laravel** also includes a range of validation rules that you can apply to your data.

To create a validator instance manually, you will use a  `Validator` [facade](https://laravel.com/docs/8.x/facades). It is fine if you do not understand what a **facade** is, but basically, a **facade** provides a simplified interface to a complex subsystem. **Facades** in **Laravel** provide a static interface to classes that are available in the application's service container.

In `ApiController.php`, update the `createStudent()` method as follows:
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
        return response()->json(['message' => $validator->errors()], 403);
    } else {
        Student::create($request->all());
        return response()->json(['message' => 'Student created.'], 201);
    }
}
...
```

The `make()` method accepts two arguments - the data under validation & an array of validation rules that are applied to the data.

If a validation rule fails, return a **JSON** `Response` containing a message which indicates that a rule has failed & a status response code of [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403).

### Test Your API Validation

<img src="../tex/img/03-laravel-2-api-validation-relationships/03-postman-1.png" width="800" height="500" />

