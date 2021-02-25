# Laravel 1 - REST APIs & Postman

## Overview

## What We Will Building

## Creating a Laravel Project

## Model
In **Laravel**, we can create a new model & migration by running the following:

```php
// Windows
> php artisan make:model Learner -m

// macOS or Linux
$ php artisan make:model Learner -m
```

Go to the `app` directory. A file called `Learner.php` has been created. In `Learner.php`, specify the database table you wish to interact with and its fields. For example:

```php
...

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
}
```

Also, a migration file has been created in the `database/migrations` directory which generates a database table, i.e., `learners`. Modify your migration file by adding a column for `first_name`, `last_name`,`phone_number` & `email_address` which are of type `string`.

```php
...
public function up()
{
    Schema::create('students', function (Blueprint $table) {
        $table->increments('id');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->timestamps();
    });
}
...
```
## Connecting to MySQL
In `.env` file, modify your database credentials so that your project connects to **MySQL**.

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<your database name>
DB_USERNAME=<your database username>
DB_PASSWORD=<your database password>
```

Run your migration using the following command:

```php
// Windows
> php artisan migrate

// macOS or Linux
$ php artisan migrate
```

## Route
Now that you have a basic application setup, you can create a controller that will contain the CRUD methods for your API. To create a new controller, run the following command:

```php
// Windows
> php artisan make:controller ApiController

// macOS or Linux
$ php artisan make:controller ApiController
```

## Controller

In the `app\Http\Controllers` directory, you will find `ApiController.php`. In `ApiController.php`, add the following methods:

```php
...
class ApiController extends Controller
{
    public function getAllStudents() 
    {
    }
    
    public function getStudent($id)
    {
    }

    public function createStudent(Request $request)
    {
    }

    public function updateStudent(Request $request, $id)
    {
    }

    public function deleteStudent($id)
    {
    }
}
```

In the `routes` directory, open the `api.php` file & create the following API endpoint:

```php
...
Route::get('students', 'ApiController@getAllStudents');
Route::get('students/{id}', 'ApiController@getStudent');
Route::post('students', 'ApiController@createStudent');
Route::put('students/{id}', 'ApiController@updateStudent');
Route::delete('students/{id}','ApiController@deleteStudent');
```

In the `app\Providers\RouteServiceProvider` directory, uncomment line 29. Please read the comments for more detail.

### Create a Student

### Get All Students

### Get One Student

### Update a Student

### Delete a Student

## Postman
