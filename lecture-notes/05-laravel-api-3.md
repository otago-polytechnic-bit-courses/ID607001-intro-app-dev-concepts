# 05: Laravel API 3

## API Resources
When you are building an API, you want a transformation layer that sits between your **Eloquent** models and **JSON** responses (what is returned to the user). You may only want to display certain attributes for a specific set of users, i.e., displaying personal information to admins or display certain relationships between models. **API Resource** classes allow you to transform your models in **JSON** representations easily.

To create a new **API Resource** class, run the following command:

```bash
php artisan make:resource InstitutionResource
```

```php
...
use Illuminate\Http\Resources\Json\JsonResource;

class InstitutionResource extends JsonResource {
    public function toArray($request) {
        return [
            'name' => $this->name,
            'region' => $this->region,
            'country' => $this->country
        ];
    }
}
```

We are only displaying an institution's `name`, `region` and `country`. If you refer to earlier example, by default, it included `id`, `created_at` and `updated_at`.

An example of how to use the `InstitutionResource` in `InstitutionController`.

```php
...
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use Illuminate\Http\Request;

class InstitutionController extends Controller {
    public function index() {
        return InstitutionResource::collection(Institution::all());
    }  
...
```

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/05-laravel-api-3/05-postman-1.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/eloquent-resources

## Caching

Your application may perform CPU intensive tasks that take several seconds to complete, i.e., retrieving or processing data. When this happens, it is common to cache the data for a period of time, i.e., one hour or 24 hours so that it can be quickly retrieved on subsequent requests for the same data, i.e., retrieving all student data.

It makes sense to cache data when retrieving and this is done in the `index()` action method in `InstitutionController`. Here we are using the `InstitutionResource` to return an institution's `name`, `region` and `country`. The `Cache::remember()` function accepts three arguments - key, number of seconds and callback function. The callback function returns and caches all the `Institution` data. **Note:** this includes attributes not specified in `InstitutionResource`, i.e., `id`, `created_at` and `updated_at`.

```php
...
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache; // New import

class InstitutionController extends Controller {
    public function index() {
        return InstitutionResource::collection(Cache::remember('institutions', 60 * 60 * 24 , function () {
            return Institution::all();
        }));
    }
...
```

**Resource:** https://laravel.com/docs/8.x/cache

## Observer

If we add a new institution, we want to clear the cache. We can do this manually, but it is best that we observe these changes. To do this, we need to create an observer by running the following command:

```bash
php artisan make:observer InstitutionObserver --model=Institution
```

This will create a observer for the `Institution` model. You could also do the same for the `Student` model.

In the `app\Http\Resources` directory, open `InstitutionObserver.php`. You will be given functions for each action method, but we are only concerned with the `created()` action method. In this method, you want to clear the cache when a new institution is created and this is done by calling `Cache::forget()` function. This function accepts one argument which is the key specified above, i.e., `institutions`.

```php
...
use App\Models\Institution;
use Illuminate\Support\Facades\Cache;

class InstitutionObserver {
    public function created(Institution $institution) {
        Cache::forget('institutions');
    }
...
```

In the `app\Providers` directory, open `AppServiceProvider.php`. In the `boot()` method, call the `Institution::observe()` function. This function accepts one argument which is the `InstitutionObserver` class. This will observe any changes to `Institution` while the application is being served.

```php
...
use App\Models\Institution;
use App\Observers\InstitutionObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    ...
    public function boot() {
        Institution::observe(InstitutionObserver::class);
    }
}
```

**Resource:** https://laravel.com/docs/8.x/eloquent#observers

## Rate Limits

We can restrict the amount of traffic for a given route or group of routes in `app\Providers\RouteServiceProvider.php`. This is used to protect against excessive use, whether it is intended or unintended.

```php
...
class RouteServiceProvider extends ServiceProvider {
    ...
    protected function configureRateLimiting() {
        RateLimiter::for('api', function (Request $request) {
            // Change the rate limit from 60 (default) to 1
            return Limit::perMinute(1)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
```

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/05-laravel-api-3/05-postman-2.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/routing#rate-limiting
