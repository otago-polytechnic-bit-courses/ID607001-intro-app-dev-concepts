# Laravel 2 - API Validation & Relationships

## API Validation
In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. However, you will look at [manually creating validators](https://laravel.com/docs/8.x/validation#manually-creating-validators) instead. **Laravel** also includes a range of validation rules that you can apply to your data.

To create a validator instance manually, you will use a  `Validator` [facade](https://laravel.com/docs/8.x/facades). It is fine if you do not understand what a **facade** is, but basically, a **facade** provides a simplified interface to a complex subsystem. In **Laravel**, a **facade** provides a static interface to classes available in the application's service container.

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

The `make()` method accepts two arguments - the data under validation & an array of validation rules that are applied to the data. If a validation rule fails, return a **JSON** `Response` containing a message which indicates that a rule has failed & a status response code of [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403).

### Test Your API Validation

<img src="../tex/img/03-laravel-2-api-validation-relationships/03-postman-1.png" width="800" height="500" />

## Relationships
Database tables are often related to each other. For example, an institution may have many students or a student may have many courses. 

## Activity ✏️
In this activity, you will extend the **api** project. 

1. Create a new **model** & migration called `Institution`.
2. In the `create_institutions_table.php` migration file, add the following columns in the `up()` method:
```php
...
public function up() {
    Schema::create('institutions', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->string('city');
        $table->string('state');
        $table->string('country');
        $table->timestamps();
    });
}
...
```
3. In the `create_students_table.php` migration file, add the following columns in the `up()` method:
```php
...
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->increments('id');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->integer('institution_id')->unsigned();
        $table->foreign('institution_id')->references('id')->on('institutions'); // Refers to the primary key in the institutions table.
        $table->timestamps();
    });
}
...
```
4. In `app\Models\Institution.php`, adding the following:
```php
...
protected $table = 'institutions';

protected $fillable = ['name', 'city', 'state', 'country'];

protected $appends = ['students_count'];

public function students() {
    return $this->hasMany(Student::class);
}

public function getStudentsCountAttribute() {
    return $this->students()->count();
}
...
```
5. Make a migration.
6. Copy `institution-data.json` & `student-data.json` into the `database\data` directory.
7. Create a `Seeder` class which seeds the `institutions` which `institution-data.json`.
8. Update `StudentSeeder.php` so that it also seeds `institution_id` with `student-data.json`.
9. In `routes\api.php`, add the following route group:
```php
Route::group(['prefix' => 'institutions'], function () {
    Route::get('/', 'ApiController@getAllInstitutions');
});
```
10. In `app\Http\Controllers\ApiController.php`, add the following:
```php
public function getAllInstitutions(Request $request) {
    return Institution::with(['students'])->get();
} 
```
