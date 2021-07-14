# 04: Laravel API 2

## Validation

In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. Aslo there  is a range of validation rules that you can apply to your data.

In `InstitutionController.php`, update the `store()` method as follows:

```php
public function store(Request $request) {
    $request->validate([
        'name' => 'required',
        'region' => 'required',
        'country' => 'required'
    ]);

    return Institution::create($request->all());
}
```

This means you can not create an **institution** without providing a `name`, `region` and `country`.

Go to **Postman** and test your validation rules. As you can see, the appropriate values are not provided. 

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-1.PNG?raw=true)

We have to make one small change in the **Headers** tab. If you do not accept `application/json`, then you will be returned with a different response. 

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-2.PNG?raw=true)

Click the **Send** button and you should see the following messages:

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-3.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/validation

## Relationships
Database tables are often related to each other. For example, an institution may have many students or a student may have many courses. 

### Create a Relationship Between Two Tables
Firstly, create a new **model** & migration called `Student`. This database table will have a relationship with the `institutions` database table. 

In `app\Models\Student.php`, specify the database table and fields you wish to interact with. For example:

```php
...
class Student extends Model {
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
}
```

In the `database\migrations` directory, update `create_institutions_student.php` with the following:

```php
...
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->foreignId('institution_id')
            ->constrained('institution')
            ->onUpdate('cascade')
            ->onDelete('cascade');
        $table->timestamps();
    });
}
...
```

The `students` or child database table contains a foreign key & the `institutions` or parent/referenced database table contains the candidate key. `$table->foreignId('institutions_id')->constrained('institutions');` refers to the primary key in the `institutions` database table.

**Question:** What does `onUpdate('cascade')` and `onDelete('cascade')` do?

Remember to migrate using the following command:

```xml
php artisan migrate
```

## Controller

Create a new **controller** called `StudentController`. This file will contain the same action methods as `InstitutionController`. Lets just focus on the `index()` action method for now...you can do the rest later. I wish to retrieve data from the `students` tables and `institutions` tables. To do that we can use the `join` function as follows:

```php
...
public function index() {
    return Student::join('institutions', 'students.institution_id', '=', 'institutions.id')
        ->get([
            'students.first_name', 
            'students.last_name', 
            'institutions.name',
            'institutions.region',
            'institutions.country'
        ]);
}
...
```

Here we are only retrieving the student's first name, last name, and their institution's name, region and country.

## Route

In `api.php`, create a new route for the `index()` action method in `StudentController`.

## Seeder
Copy the two **JSON** files - `institution-data.json` & `student-data.json` into the `database\seeders` directory. Create two `Seeder` classes which will seed the `students` and `institutions` tables seperately with the appropriate **JSON** file. To do this, run the following commands:

```xml
php artisan make:seeder InstitutionSeeder
php artisan make:seeder StudentSeeder
```

Spend a minute looking through the contents of both **JSON** files. You will notice a new key called `institution_id`. The value maps to the object's index in `institution-data.json`. For example, Stanford University is index is 1 & Dominykas Roy's `institution_id` is 1, so we can assume that Dominykas Roy attends Stanford University. 

In the `InstitutionSeeder` and `StudentSeeder`, you will be given a method called `run()`. In this method, you will add the following code:

```php
// StudentSeeder.php

public function run() {
    $json_file = File::get('student-data.json');
    DB::table('students')->delete();
    $data = json_decode($json_file);
    foreach ($data as $obj) {
        Student::create(array(
            'first_name' => $obj->first_name,
            'last_name' => $obj->last_name,
            'phone_number' => $obj->phone_number,
            'email_address' => $obj->email_address,
            'institution_id' => $obj->institution_id
        ));
    } 
}
```

Also, you will need to include two imports:

```php
...
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class StudentSeeder extends Seeder {
...
```

In `DatabaseSeeder.php`, you have also been given a `run()` method. Call `InstitutionSeeder` and `StudentSeeder` as follows:
```php
public function run() {
    // \App\Models\User::factory(10)->create();
    $this->call(InstitutionSeeder::class);
    $this->call(StudentSeeder::class);
}
```

Once you have done this, you can use the following command to seed your tables:

```xml
php artisan db:seed
```

Go **Postman** and test your new route.

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-4.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/seeding

## Appending Values To JSON
You may want to add attributes that do not have a column in one of your tables. This is example on how you append values to **JSON**. For each `Institution`, it will return the `Student` count as a new key/value pair. For example `student_count: 3`.

```php
...
class Institution extends Model {
    ...
    protected $appends = ['student_count'];
    ...
    public function students() {
        return $this->hasMany(Student::class);
    }

    public function getStudentsCountAttribute() {
        return $this->students()->count();
    }
}
```

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-5.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/eloquent-serialization#appending-values-to-json

## Practical
