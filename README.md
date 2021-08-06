# IN607: Introductory Application Development Concepts

This repository contains all information relating to this course, i.e., course directive & assessment documents.
Repositories

Here are the following assessment submission repositories:
* In-Class Activities - https://classroom.github.com/a/P656imf2
* Practical: API Testing Research - https://classroom.github.com/a/0kYlKqW8
* Project 1: Laravel API - https://classroom.github.com/a/c1Wxock6
* Project 2: React CRUD - https://classroom.github.com/a/PZJYGNeP

# Computer Lab Setup

Everytime you work on the lab computers, you will need to do the following:
- Go to the `laragon` directory in the C drive and create the `www` directory
- Create a new database and name is as specified [here](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/master/lecture-notes/03-laravel-api-1.md#create-a-mysql-database)
- Change directory to the `www` directory and clone your **GitHub** repository containing your program files, i.e., **Laravel** project
- Change directory to your **GitHub** repository and open it in **Visual Studio Code**
- In the terminal or command prompt, change directory to your **Laravel** project and run the following command:

```xml
cp .env.example .env
```

Remember, this file is ignored by our `.gitignore`.

In `.env`, change the `DB_DATABASE` value to the name of your database.

Also, we need to install our **Laravel** project's dependencies and migrate our database by running the following commands:

```xml
composer install
php artisan migrate
```

From here, you are ready to develop :+1:.
