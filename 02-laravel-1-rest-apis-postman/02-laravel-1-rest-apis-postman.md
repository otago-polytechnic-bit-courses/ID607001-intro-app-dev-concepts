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
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Learner extends Model
{
    protected $table = 'learners';

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
}

```

Also, a migration file has been created in the `database/migration` directory which generates a database table, i.e., `learners`. Modify your migration file by adding a column for `first_name`, `last_name`,`phone_number` & `email_address` which are of type `string`.

```php
...
public function up()
{
    Schema::create('learners', function (Blueprint $table) {
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

In the `app\http\controller` directory, you will find `ApiController.php`. In `ApiController.php`, add the following methods:

```php
...
class ApiController extends Controller
{
    public function getAllLearners() {}
    
    public function getLearner($id) {}

    public function createLearner(Request $request) {}

    public function updateLearner(Request $request, $id) {}

    public function deleteLearner($id) {}
}
```

In the `routes` directory, open the `api.php` file & create the following API endpoint:

```php
...
Route::get('learners', 'ApiController@getAllLearners');
Route::get('learners/{id}', 'ApiController@getLearner');
Route::post('learners', 'ApiController@createLearner');
Route::put('learners/{id}', 'ApiController@updateLearner');
Route::delete('learners/{id}','ApiController@deleteLearner');
```

## Postman
