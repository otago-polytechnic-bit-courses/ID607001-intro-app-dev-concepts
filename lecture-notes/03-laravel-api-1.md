# 03: Laravel API 1

## Laravel

## Create a Laravel Application

Run the **laragon executable** in the **laragon** directory, then click the **Start All** button.

**Right-click on the window > Quick App > Laravel**. You will be presented with another window prompting you to name the application. Once named, click the **OK** button.

**Note:** an application can not be created until **Apache** and **MySQL** have been started.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-laragon-1.PNG?raw=true)

Change directory to your new application, then open it in **Visual Studio Code**.

## Model

A **Model** class represents the logical structure and relationship of a database table. In **Laravel**, each table corresponds to a model. A model allows you to retrieve, create, update and delete data.

To create a new model and migration, run the following command:

```xml
php artisan make:model Student --migration
```

In `app\Models\Student.php`, specify the database table and fields you wish to interact with. For example:

```php
...
class Student extends Model {
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
}
```

**Resource:** https://laravel.com/docs/8.x/eloquent#generating-model-classes

## Migration
You can think of migrations like version control for your database. They allow you to define and share the application's schema definitions.

In the `database\migrations` directory, you will see a migration file for the `Student` **Model** class.

```php
...
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->timestamps();
    });
}
...
```

Modify this migration file by adding a column for `first_name`, `last_name`,`phone_number` and `email_address`. All four columns are of type `string`.

```php
...
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->timestamps();
    });
}
...
```

## Create a MySQL Database

## Connecting to MySQL

In the `.env` file, modify your database credentials so that your project is connected to **MySQL**.

```xml
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grayson_api_db
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** you do not need a password to use this database.

## Controller
A **Controller** class contains public action methods used to handle various **HTTP methods**, i.e., `GET`, `POST`, `PUT` and `DELETE`. These action methods handle incoming requests, retrieve the necessary **model** data and return the appropriate responses. 

To create a new **controller**, execute the following command:

```xml
php artisan make:controller StudentController --api
```

In the `app\Http\Controllers` directory, you will find all your **controllers** including `StudentController.php`. 

In `StudentController.php`, you will see the following **CRUD** methods:

```php
...
class StudentController extends Controller
{
    public function index() {
        // Some code
    }

    public function store(Request $request) {
        // Some code
    }

    public function show($id) {
        // Some code
    }

    public function update(Request $request, $id) {
        // Some code
    }

    public function destroy($id) {
      // Some code
    }
}
```

**Resource:** https://laravel.com/docs/8.x/controllers

### Read All

### Read One

### Create

### Update

### Delete

## Route

## Postman

## Practical
