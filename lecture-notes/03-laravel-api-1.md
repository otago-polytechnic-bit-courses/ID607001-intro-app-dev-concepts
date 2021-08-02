# 03: Laravel API 1

## Key Point From Last Session

Do not make the assumption that your answer is correct. When you have solved a problem...take some time to think to yourself...have I met all the possible test cases.

## Laravel

**Laravel** is an **open-source** **PHP** web framework designed for creating web applications that follow the **Model–View–Controller (MVC)** architectural pattern. We will primarily use the **Model** and **Controller** in this module.

I suggest reading the this article - https://developer.mozilla.org/en-US/docs/Glossary/MVC

## Create a Laravel Application

Run the **laragon executable** in the **laragon** directory, then click the **Start All** button.

**Right-click on the window > Quick App > Laravel**. You will be presented with another window prompting you to name the application. Once named, click the **OK** button.

**Note:** an application can not be created until **Apache** and **MySQL** have been started.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-laragon-1.PNG?raw=true)

**Note:** A command prompt window will display in the background. It will take a few minutes to create the project.

Feel free to use this command prompt window going forward. Once the project is created, open it in **Visual Studio Code**.

## Directory Structure

We will not go through all of the directories. However, we will cover just the ones we will be using in this module.

* `app` - contains the core code such as controllers, models, providers.
* `config` - contains all of your project's configuration files such as auth, caching, database.
* `routes` - contains all of your project's route definitions. We are only concerned with `api.php`. However, in **Studio 3**, you will use `web.php`.

**Resource:** https://laravel.com/docs/8.x/structure

## Composer

**Composer** is the dependency manager for **Laravel** much like **npm** for **Node**. This comes by default. You should not need to install additional packages.

**Resource:** <https://getcomposer.org>

## Artisan

**Artisan** is the command line interface included with **Laravel**. It provides useful commands that can help you while your are building your project. You will be using a variety of commands in this class. There is no expectation to remember them all.

**Resource:** <https://laravel.com/docs/8.x/artisan>

## Create a MySQL Database

Go to the **Laragon** client window and click the **Database** button. You will be presented with the **Session Manager** window. Click the **Open** button to view all your databases.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-mysql-1.PNG?raw=true)

By default, **Laragon** creates a **MySQL** database for your project. However, due to deep freeze on the lab computers, you will need to manually create a **MySQL** database everytime you come to class.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-mysql-2.PNG?raw=true)

To create a **MySQL** database, **right-click on the Laragon tab > Create new > Database**.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-mysql-3.PNG?raw=true)

You will be presented with another window prompting you to name the database. To be consistent, name the database name the same as your project's name.

## Connecting to MySQL

In the `.env` file, modify your database credentials so that your project is connected to **MySQL**.

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=graysono-laravel-api
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** you do not need a password to use this database. Also, replace `graysono-laravel-api` with your project name.

## Model

A **model** class represents the logical structure and relationship of a database table. In **Laravel**, each table corresponds to a model. A model allows you to retrieve, create, update and delete data.

To create a new model and migration, run the following command:

```bash
php artisan make:model Institution --migration
```

In `app\Models\Institution.php`, specify the columns you wish to interact with. For example:

```php
...
class Institution extends Model {
    use HasFactory;

    protected $fillable = ['name', 'region', 'country'];
}
``` 

**Resource:** <https://laravel.com/docs/8.x/eloquent#generating-model-classes>

## Migration

You can think of migrations like version control for your database. They allow you to define and share the application's schema definitions.

In the `database\migrations` directory, you will see a migration file for the `Institution` **model** class.

```php
...
public function up() {
    // institutions is the name of the table
    Schema::create('institutions', function (Blueprint $table) {
        // institutions has two columns
        $table->id();
        $table->timestamps();
    });
}
...
```

Modify this migration file by adding a column for `name`, `region` and `country`. All three columns are of type `string`.

```php
...
public function up() {
    Schema::create('institutions', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('region');
        $table->string('country');
        $table->timestamps();
    });
}
...
```

**Question:** What does the `down()` method do?

If you change a migration file, you will have an outstanding migration. This means that your database schema will not reflect the columns specified in your migration file. To run all outstanding migrations, run the following command:

```bash
php artisan migrate
```

Go to your **MySQL** database and refresh the window. You should see five tables.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-mysql-4.PNG?raw=true)

## Controller

A **controller** class contains public action methods used to handle various **HTTP methods**, i.e., `GET`, `POST`, `PUT` and `DELETE`. These action methods handle incoming requests, retrieve the necessary **model** data and return the appropriate responses. 

Create a new **controller** by running the following command:

```bash
php artisan make:controller InstitutionController --api
```

In the `app\Http\Controllers` directory, you will find all your **controllers** including `InstitutionController.php`. In `InstitutionController.php`, you will see the following **CRUD** action methods:

```php
...
class InstitutionController extends Controller {
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

In order to use the `institutions` table, you need to import the `Institution` model. To do this, add the following line above the class declaration:

```php
...
use App\Models\Institution;

class InstitutionController extends Controller {
    ...
}
```

**Resource:** https://laravel.com/docs/8.x/controllers

### Eloquent

**Eloquent** is an **Object-Relational Mapping (ORM)** that allows you to query & manipulate data using an **Object-Oriented** programming language. Each **web framework** has one or more **ORMs** which encapsulate the code needed to query & manipulate data so that you do not need to use **SQL**. You interact directly with an object in the same programming language you are using, i.e., **PHP**. 

**Resource:** https://laravel.com/docs/8.x/eloquent

### Read All
```php
public function index() {
    return Institution::all();
    
    // SQL equivalent: SELECT * FROM institutions;
}
```

### Read One
```php
public function show($id) {
    return Institution::find($id);

    // SQL equivalent: SELECT * FROM institutions WHERE id = $id;
}
```

### Create
```php
public function store(Request $request) {
    return Institution::create($request->all());
    
    // SQL equivalent: INSERT INTO institutions VALUES ($request->name, $request->region, $request->country);
}
```

### Update
```php
public function update(Request $request, $id) {
    $institution = Institution::find($id);
    $institution->update($request->all());
    return $institution;

    // SQL equivalent:
    // UPDATE institutions
    // SET name = $request->name, region = $request->region, country = $request->country
    // WHERE id = $id;
}
```

### Delete
```php
public function destroy($id) {
    return Institution::destroy($id);
    
    // SQL equivalent:
    // DELETE FROM institutions 
    // WHERE id = $id;
}
```

You will look at how to provide more useful messages in the **Project 1: Laravel API** assessment.

## Route

In the `routes` directory, open the `api.php` file & create the following **API** endpoints:

```php
...
Route::group(['prefix' => 'institutions'], function () {
    Route::get('/', [InstitutionController::class, 'index']);
    Route::get('/{id}', [InstitutionController::class, 'show']);
    Route::post('/', [InstitutionController::class, 'store']);
    Route::put('/{id}', [InstitutionController::class, 'update']);
    Route::delete('/{id}', [InstitutionController::class, 'destroy']);
});
```

Make sure you import `InstitutionController`. If you do not, you will not have access to these action methods.

**Note:** All routes in `api.php` are prefix with `/api`.

**Resource:** https://laravel.com/docs/8.x/routing

## Run Development Server

Run the development server by running the following command:

```bash
php artisan serve
```

## Postman

**Postman** is an **API** development environment that allows you to design, mock & test your **APIs**. The examples below are using the **desktop client**. Alternatively, you can use the **web client**. The interface is much the same on both **clients**.

If you do not have an account, please sign up. There are two options - **username/password** and **Google**.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-1.PNG?raw=true)

Click on **Create a Request**.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-2.PNG?raw=true)

Lets send a `GET` request to the URL - http://127.0.0.1:8000/api/institutions. As you can see in the bottom panel, the response return is an empty array. Also, make note of the status code, i.e., 200.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-3.PNG?raw=true)

An empty array is not useful, so lets send a `POST` request to the same URL. Click on the **Body** tab, then the **form data** radio button. Add the appropriate key/value pairs, then click the **Send** button. Have a look at your **MySQL** database. You should now have a new row in your `institutions` tables. Alternatively, you can make a `GET` request.

**Question:** How would I get one institution?

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-4.PNG?raw=true)

What happens if you want to update a row, i.e., institution? Lets send a `PUT` request to the same URL. Here we have changed the name from **Otago Polytechnic** to **Te Kura Matatini ki Otago** using the row's `id`. Just note that we are using the **Params** tab not the **Body** tab.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-5.PNG?raw=true)

What happens if you do not want an institution anymore? Lets send a `DELETE` request to the same URL. Much like the `PUT` request, we must specify the row's `id`. As you can see, the response messages are not useful.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/03-laravel-api-1/03-postman-6.PNG?raw=true)

**Resources:**
* https://www.postman.com
* https://www.postman.com/downloads

## Formative Assessment

Click on the following **GitHub Classroom** link - https://classroom.github.com/a/c1Wxock6. You will be presented with the following:

This will automatically create a new repository for your **Project 1: Laravel API**. Open a **terminal** or **cmd**, change to the `www` directory and clone your repository. Change to the repository's directory and create a new **Laravel** project using the following command:

```bash
composer create-project laravel/laravel <PROJECT NAME>
```

Add, commit and push your code to your remote repository. Create a new branch called **03-laravel-api-1** by running the command:

```bash
git checkout -b 03-laravel-api-1
```

Open your project in **Visual Studio Code**. Setup your **models**, **controllers** and **routes** for those **entities** that do not have a **foreign key**. We will look at relationships next week.

Once you have complete this, make a pull request and assign **grayson-orr** as a reviewer.

If you finish earlier, I recommend moving onto the next concept. 
