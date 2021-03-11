# Laravel 3 - PHPUnit & Deployment

## PHPUnit

## Deployment

```
git init
```

### Procfile

```
echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile
```

### Create a New Application

```
heroku create <name of your application>
```

### Setting Environment Variables
```
heroku config:set APP_DEBUG=true
heroku config:set APP_ENV=production
heroku config:set APP_KEY=<APP_KEY found in your project's .env file>
heroku config:set APP_NAME=Laravel
heroku config:set APP_URL=https://<name of your application>.herokuapp.com/
```

### Heroku PostgreSQL


```php
'pgsql' => [
  'driver' => 'pgsql',
  'url' => env('DATABASE_URL'),
  'host' => isset($DATABASE_URL['host']) ? $DATABASE_URL['host'] : null,
  'port' => isset($DATABASE_URL['port']) ? $DATABASE_URL['port'] : null,
  'database' => isset($DATABASE_URL['path']) ? ltrim($DATABASE_URL['path'], '/') : null,
  'username' => isset($DATABASE_URL['user']) ? $DATABASE_URL['user'] : null,
  'password' => isset($DATABASE_URL['pass']) ? $DATABASE_URL['pass'] : null,
  'charset' => 'utf8',
  'prefix' => '',
  'prefix_indexes' => true,
  'schema' => 'public',
  'sslmode' => 'prefer',
]
```


```
heroku run php artisan migrate
heroku run php artisan db:seed
```

## Activity ✏️
In this activity, you will extend the **api** project provided to you in this directory. 

1. Write one unit test for each route in your **cars** group.
2. Deploy your **api** project to **Heroku**.
