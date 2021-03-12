# Laravel 3 - PHPUnit & Deployment

## PHPUnit

## Deployment

You are going to use [Heroku](https://www.heroku.com/) to deploy your **api** project. In order to do this, you must [signup](https://signup.heroku.com/) & download the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) for your respective operating system.

In your **api** project, execute the following command:

```
git init
```

### Procfile

Create a [Procfile](https://devcenter.heroku.com/articles/procfile) in the root directory of your **api** project.

In Procfile, add the following command:

```
web: vendor/bin/heroku-php-apache2 web/
```

This declares a single process type, web & the command needed to run the application. The **web:** part is important. This process type will be attached to the HTTP routing stack of **Heroku** & receive traffic when deployed.

### Create a New Application

When you create an application on **Heroku**, a **git** remote called **heroku** is also created & associated with your local git repository.

To create a new application, execute the following command:

```
heroku create
```
or

```
heroku create <name of your application> 
```

**Heroku** generates a random name for your application or you can pass a parameter to specify your own application name.

### Setting Environment Variables

```
heroku config:set APP_DEBUG=true
heroku config:set APP_ENV=production
heroku config:set APP_KEY=<APP_KEY found in your project's .env file>
heroku config:set APP_NAME=Laravel
heroku config:set APP_URL=https://<name of your application>.herokuapp.com/
```

### Heroku PostgreSQL

[PostgreSQL](https://www.heroku.com/postgres) is another database management system similar to MySQL. To create a **PostgreSQL** on **Heroku**, execute the following command:

```
heroku addons:create heroku-postgresql:hobby-dev
```

By executing this command, it will create an environment variable called `DATABASE_URL`.

In `config\database.php`, find the `default` setting & change it to the following:

```php
'default' => env('DB_CONNECTION', 'pgsql'),
```

Also, find the `pgsql` setting & change it to the following:

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
],
```

These settings will allow you to interchange between **PostgreSQL** & **MySQL** as well local & production development.

### Comitting Your Changes

Since you have made changes, your git repository on **Heroku** will not be the same as your local repository, therefore, you need to commit those changes by executing the following commands:

```
git add .
git commit -m "<some message>"
git push heroku main
```

### Running Commands via Heroku

**Heroku** allows you to execute commands using `heroku run`. Commands are not limited to **PHP**. You can execute commands in languages that are supported by **Heroku**.

```
heroku run php artisan migrate
heroku run php artisan db:seed
```

## Activity ✏️
In this activity, you will extend the **api** project provided to you in this directory. 

1. Write one unit test for each route in your **cars** group.
2. Deploy your **api** project to **Heroku**.
