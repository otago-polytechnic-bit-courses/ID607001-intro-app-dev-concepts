# Laravel 1 - REST APIs & Postman

## Overview

## What We Will Building

## Creating a Laravel Project

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

Also, a migration file has been created in the `database/migration` directory which generates a database table, i.e., `learners`. Modify the migration file to create a column for `first_name`, `last_name`,`phone_number` & `email_address` which are of type `string`.

```php
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
```

## Route

## Controller

## Postman
