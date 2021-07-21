# 06: Laravel API 4

## Sanctum

```xml
composer self-update
```

```xml
composer require laravel/sanctum
```

```xml
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

```xml
php artisan migrate
```

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

## Model

```php
...
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    ...
}
```

## Controller

```php
...
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

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

```php
public function register(Request $request) {
    $fields = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|unique:users,email',
        'password' => 'required|string|confirmed'
    ]);

    $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'password' => bcrypt($fields['password'])
    ]);

    $token = $user->createToken('P@ssw0rd')->plainTextToken;

    $response = [
        'user' => $user,
        'token' => $token
    ];

    return response($response, 201);
}
```

```php
public function login(Request $request) {
    $fields = $request->validate([
        'email' => 'required|string',
        'password' => 'required|string'
    ]);

    // Check email
    $user = User::where('email', $fields['email'])->first();

    // Check password
    if(!$user || !Hash::check($fields['password'], $user->password)) {
        return response([
            'message' => 'Bad Credentials.'
        ], 401);
    }

    $token = $user->createToken('P@ssw0rd')->plainTextToken;

    $response = [
        'user' => $user,
        'token' => $token
    ];

    return response($response, 201);
}
```

```php
public function logout(Request $request) {
    auth()->user()->tokens()->delete();

    return [
        'message' => 'Successfully Logged Out.'
    ];
}
```

## Route
```php
...
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['prefix' => 'institutions'], function () {
    Route::get('/', [InstitutionController::class, 'index']);
    Route::get('/{id}', [InstitutionController::class, 'show']);
    Route::put('/{id}', [InstitutionController::class, 'update']);
    Route::delete('/{id}', [InstitutionController::class, 'destroy']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/institutions', [InstitutionController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['prefix' => 'students'], function () {
    Route::get('/', [StudentController::class, 'index']);
});
```

## Heroku

## PostgreSQL

## Practical
