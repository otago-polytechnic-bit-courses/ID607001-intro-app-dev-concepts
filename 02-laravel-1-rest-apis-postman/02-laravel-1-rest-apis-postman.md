# Laravel 1 - REST APIs & Postman

## Creating a Laravel Project

## Model
In [Laravel](https://laravel.com/), we can create a new model & migration by running the following:

```php
// Windows
> php artisan make:model Learner -m

// macOS or Linux
$ php artisan make:model Learner -m
```

#### What is a model?

Go to the `app` directory. A file called `Learner.php` has been created. In `Learner.php`, specify the database table you wish to interact with and its fields. For example:

```php
class Student extends Model {
    use HasFactory;

    protected $table = 'students';

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
}
```

Also, a migration file has been created in the `database/migrations` directory which generates a database table, i.e., `learners`. Modify your migration file by adding a column for `first_name`, `last_name`,`phone_number` & `email_address` which are of type `string`.

```php
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->increments('id');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->timestamps();
    });
}
```
## Connecting to MySQL
In `.env` file, modify your database credentials so that your project connects to [MySQL](https://www.mysql.com/) locally. You will look at how to connect to a cloud database later on.
```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=api
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** You **do not** need a password to use this database.

Run your migration using the following command:

```php
// Windows
> php artisan migrate

// macOS or Linux
$ php artisan migrate
```

## Controller
You can create a controller that will contain the [CRUD](https://developer.mozilla.org/en-US/docs/Glossary/CRUD) methods for your [API](https://developer.mozilla.org/en-US/docs/Glossary/API). However, before you create a new controller, you must understand what it is.

#### What is a controller?
A [Controller
](https://laravel.com/docs/8.x/controllers) class contains public action methods used to handle various [HTTP requests methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods), i.e., `GET`, `POST`, `PUT` & `DELETE`. Theses action methods handle incoming requests, retrieve the necessary model data & return the appropriate response.

To create a new controller, run the following command:

```php
// Windows
> php artisan make:controller ApiController

// macOS or Linux
$ php artisan make:controller ApiController
```
#### Where are controllers located?

In the `app\Http\Controllers` directory, you will find `ApiController.php`. In `ApiController.php`, add the following methods:

```php
class ApiController extends Controller {
    public function createStudent(Request $request) {
    }

    public function updateStudent(Request $request, $id) {
    }

    public function deleteStudent($id) {
    }

    public function getAllStudents() {
    }
    
    public function getStudent($id) {
    }
}
```

### Create a Student

```php
public function createStudent(Request $request) {
    $student = new Student;
    $student->first_name = $request->first_name;
    $student->last_name = $request->last_name;
    $student->phone_number = $request->phone_number;
    $student->email_address = $request->email_address;
    $student->save();
    return response()->json(["message" => "Student created."], 201);
}
```

#### What is this code snippet doing?
- A new `Request` is instantiated in the `createStudent()` parameter.
- A new `Student` is instantiated in the `createStudent()` method block.
- The `Student`'s data is fetched from the request & saved.
- A [JSON](https://developer.mozilla.org/en-US/docs/Glossary/JSON) `Response` is returned containing a message & status response code of [201](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201).

### Update a Student

```php
public function updateStudent(Request $request, $id) {
    if (Student::where('id', $id)->exists()) {
        $student = Student::find($id);
        $student->first_name = is_null($request->first_name) ? $student->first_name : $request->first_name;
        $student->last_name = is_null($request->last_name) ? $student->last_name : $request->last_name;
        $student->phone_number = is_null($request->phone_number) ? $student->phone_number : $request->phone_number;
        $student->email_address = is_null($request->email_address) ? $student->email_address : $request->email_address;
        $student->save();
        return response()->json(["message" => "Student updated."], 200);
    } else {
        return response()->json(["message" => "Student not found."], 404);    
    }
}
```

#### What is this code snippet doing?
- A new `Request` is instantiated in the `createStudent` parameter.
- Retrieving the `id` in the `createStudent` parameter.
- Checking if the `Student` to update exists:
   - If `true`, its finds the `Student` which matches the `id` & checks if any of its data is `is_null()`. If `is_null()`, its replaces the request with an existing value. Otherwise, its replaces the request with a new value.  
   - If `false`, a [JSON](https://developer.mozilla.org/en-US/docs/Glossary/JSON) `Response` is returned containing a message & status response code of [404](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404).

### Delete a Student
```php
public function deleteStudent ($id) {
    if(Student::where('id', $id)->exists()) {
        $student = Student::find($id);
        $student->delete();
        return response()->json(["message" => "Student deleted."], 202);
    } else {
        return response()->json(["message" => "Student not found."], 404);
    }
}
```

#### What is this code snippet doing?

### Get All Students
```php
public function getAllStudents() {
    $students = Student::get()->toJson(JSON_PRETTY_PRINT);
    return response($students, 200);
}
```
#### What is this code snippet doing?

### Get One Student

```php
public function getStudent($id) {
    if (Student::where('id', $id)->exists()) {
        $student = Student::where('id', $id)->get()->toJson(JSON_PRETTY_PRINT);
        return response($student, 200);
    } else {
        return response()->json(["message" => "Student not found."], 404);
    }
}
```

#### What is this code snippet doing?

## Routes

#### What is a route?

In the `routes` directory, open the `api.php` file & create the following API endpoint:

```php
Route::post('students', 'ApiController@createStudent');
Route::put('students/{id}', 'ApiController@updateStudent');
Route::delete('students/{id}','ApiController@deleteStudent');
Route::get('students', 'ApiController@getAllStudents');
Route::get('students/{id}', 'ApiController@getStudent');
```

**Note:** All routes in `api.php` are prefix with `/api`.

## Postman

#### What is Postman?

#### How to test your API endpoints

In the `app\Providers\RouteServiceProvider` directory, uncomment line 29. Please read the comments for more detail.
