# 06: Laravel API 4

## Sanctum

**Laravel Sanctum** is an authentication systems for single-page applications, mobile applications and token-based APIs.

**Composer** on the labs is not the lastest version and may not be able to install new dependencies. To update **Composer** to the lastest version, run the following command:

```xml
composer self-update
```

To install **Laravel Sanctum**, run the following command:

```xml
composer require laravel/sanctum
```

Publish **Sanctum's** configuration and migration files using the `vendor:publish` command. The configuration file will be located in your application's `config` directory:

```xml
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Run your database migrations. **Sanctum** will create one database table to store your API tokens:

```xml
php artisan migrate
```

Add **Sanctum's** middleware to the `api` middleware group within your application's `app/Http/Kernel.php` file:

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

## Model

**Sanctum** allows you to issue an **API token** that may be used to authenticate API requests. When making an API request using an **API token**, the **API token** is included in the **Authorization** header as a **Bearer** token.

Before we can create an **API token** for a user, we need to make sure the `User` model is using the `HasApiTokens` trait.

```php
...
use Laravel\Sanctum\HasApiTokens; // Add this import

class User extends Authenticatable {
    // Use the HasApiTokens trait
    use HasApiTokens, HasFactory, Notifiable;
    ...
}
```

## Controller

Create a new `Controller` class called `AuthController`. This is the boilerplate for an auth `Controller` class. Three functions - `register`, `login` and `logout`.

```php
...
use App\Models\User; // Add this import
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash; // Add this import

class AuthController extends Controller {
    public function register(Request $request) {
        ...
    }

    public function login(Request $request) {
        ...
    }

    public function logout(Request $request) {
        ...
    }
}
```

### Register Function

```php
public function register(Request $request) {
    // Validation rules
    $fields = $request->validate([
        'name' => 'required|string', // name is required and must be a string
        'email' => 'required|string|unique:users,email', // email is required, must be a string, unique to the 
                                                         // Users database table, i.e., you can not have the same email address
        'password' => 'required|string|confirmed' // password is required, must be a string and under validation
                                                  // must have a matching field of password_confirmation
    ]);

    $user = User::create([ // Create a new User
        // If the fields above validate, set them to name, email and password respectively
        'name' => $fields['name'], 
        'email' => $fields['email'], 
        'password' => bcrypt($fields['password']) // Bcrypt's work factor is adjustable. It means that the time it takes to generate
                                                  // a hash can be increased. Slow is good...the longer an algorithm takes to hash a 
                                                  // password, the longer it takes malicious users to crack the password
    ]);
   
    $response = [
        'user' => $user,
        'token' => $token
    ];

    return response($response, 201); // Return a response with a status code
}
```

### Login Function

```php
public function login(Request $request) {
    $fields = $request->validate([
        'email' => 'required|string',
        'password' => 'required|string'
    ]);

    // Get the user's email address. Return the first result
    $user = User::where('email', $fields['email'])->first();

    // Check if the given user's password matches the user's hashed password in the database
    if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
            'message' => 'Bad Credentials.'
        ], 401);
    } else {
        // createToken argument -> name of the token
        $token = $user->createToken('P@ssw0rd')->plainTextToken; // Return a new NewAccessToken instance. Note: an API token is hashed using the
                                                                 // SHA-256 hashing algorithm before it is stored in your database. However, you may
                                                                 // want to access the API token's plain-text value using the plainTextToken property
    }

    $response = [
        'user' => $user,
        'token' => $token
    ];

    return response($response, 201);
}
```

### Logout Function

```php
public function logout(Request $request) {
    auth()->user()->tokens()->delete(); // Revoking the user's API token

    return [
        'message' => 'Successfully Logged Out.'
    ];
}
```

## Route

To protect specific **API routes**, attach **sanctum** authentication guard to your **API routes** in `routes/api.php` file. This gauard will ensure incoming requests are authenticated. **Note:** you must provide a valid **API token** in the **Authorization** header.

```php
...
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Non-protected routes
Route::group(['prefix' => 'institutions'], function () {
    Route::get('/', [InstitutionController::class, 'index']);
    Route::get('/{id}', [InstitutionController::class, 'show']);
    Route::put('/{id}', [InstitutionController::class, 'update']);
    Route::delete('/{id}', [InstitutionController::class, 'destroy']);
});

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/institutions', [InstitutionController::class, 'store']); // Can only make a POST request if the user is authenticated.
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['prefix' => 'students'], function () {
    Route::get('/', [StudentController::class, 'index']);
});
```

## Deployment

You are going to use [Heroku](https://www.heroku.com/) to deploy your project. In order to do this, you must [signup](https://signup.heroku.com/) and login.

### Procfile

Create a [Procfile](https://devcenter.heroku.com/articles/procfile) in the root directory of your project.

In **Procfile**, add the following command:

```
web: vendor/bin/heroku-php-apache2 public/
```

This declares a single process type, web & the command needed to run the application. The **web:** part is important. This process type will be attached to the HTTP routing stack of **Heroku** & receive traffic when deployed.

## Create a New Application

When you login, you will be presented with the **Heroku** dashboard. This will display all of your **Heroku** applications. If this is your first time using **Heroku**, you will not see any applications.

To create a new application, click on the **New** button in the top right-hand corner. Choose the **Create new app** option.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-1.png" />

Name the new application appropriately. 

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-2.png" />


## Connecting with your GitHub Repository

To connect your application with your **GitHub** repository, go to the **Deploy** tab and scroll down to the **Deployment method** section. Choose the **GitHub** method. Search for your repository, then click the **Connect** button.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-3.png" />

## Automatic Deploy

To make things streamlined, you will enable automatic deploys meaning every push to `master` branch will deploy a new version of your application.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-5.png" />

### Set Environment Variables

You will need to set configuration variables for your application since it does not have access to `.env`. Go to the **Settings** tab and scroll down to the **Config Vars** section. Click on the **Reveal Config Vars** button to show your application's configuration variables. Your application should not have any yet.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-4.png" />

Add the following configuration variables:

| Key      | Value |
| ----------- | ----------- |
| APP_DEBUG      | true       |
| APP_ENV   | production        |
| APP_KEY   | APP_KEY found in your project's .env file        |
| APP_NAME   | Laravel       |
| APP_URL   | https://**name of your application**.herokuapp.com/        |
    
## Heroku PostgreSQL

[PostgreSQL](https://www.heroku.com/postgres) is another database management system similar to MySQL. To add a **PostgreSQL** database to your **Heroku**, go to https://elements.heroku.com/addons/heroku-postgresql and click the **Install Heroku Postgres** button. You will be redirected to the following:

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-6.png" />

Search for the application to provision **Heroku Postgres**. Once you have done that click the **Submit Order Form** button.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-7.png" />

By provisioning **Heroku Postgres**, it will create a new configuration variable called `DATABASE_URL`. The value can be read as `postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`.

## Connect Heroku PostgreSQL with your Application

Go back to your **Laravel** project in **Visual Studio Code**. 

In `config\database.php`, find the `default` setting & change it to the following:

```php
'default' => env('DB_CONNECTION', 'pgsql'), // It will look for a MySQL database first, then 
                                            // a PostgreSQL database if a MySQL database is not found
```

Also, find the `pgsql` setting & change it to the following:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => $DATABASE_URL['host'],
    'port' => $DATABASE_URL['port'],
    'database' => ltrim($DATABASE_URL['path'], '/'),
    'username' => $DATABASE_URL['user'],
    'password' => $DATABASE_URL['pass'],
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'schema' => 'public',
    'sslmode' => 'prefer',
],
```

These settings will allow you to interchange between **PostgreSQL** & **MySQL** as well local & production development.

In `.env`, you need to specify the `DATABASE_URL` as your application will not know where to connect to your **PostgreSQL** database. Go back to the **Config Vars** section on **Heroku**. Copy & paste the `DATABASE_URL` value into `.env`. 

Your `.env` should look similar to the following:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=api
DB_USERNAME=root
DB_PASSWORD=
DB_URL=<link your PostgreSQL database on Heroku>
```

Make sure you commit and push your changes to your **GitHub** repository.

## Migration

You can run artisan commands in **Heroku's** console. Click on the **More** button in the top right-hand corner next to the **Open app** button.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-8.png" />

Make sure you migrate and seed your database tables.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/06-laravel-api-4/06-heroku-9.png" />
