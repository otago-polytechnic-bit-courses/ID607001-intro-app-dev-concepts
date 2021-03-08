# Laravel 2 - API Validation & Relationships

## API Validation
In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. However, you will look at [manually creating validators](https://laravel.com/docs/8.x/validation#manually-creating-validators) instead. **Laravel** also includes a range of validation rules that you can apply to your data.

To create a validator instance manually, you will use a  `Validator` [facade](https://laravel.com/docs/8.x/facades). The `make()` method on the **facade** generates a new validator instance: 

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

If a validation rules fails, then return a **JSON** `Response` containing message indicating a validation rule did not pass & a status response code of [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403). 

### Test Your API Validation

<img src="../tex/img/03-laravel-1-rest-apis-postman/02-postman-1.png" width="700" height="400" />

## Activity ✏️
In this activity, you will extend the **api** project. 
