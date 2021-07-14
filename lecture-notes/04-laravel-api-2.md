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

Make sure to migrate using the following command:

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

Create a new route for the `index()` action method in `StudentController`.

Go **Postman** and test your new route.


![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-4.PNG?raw=true)

## Seeder
Copy `institution-data.json` & `student-data.json` into the `database\data` directory. You may be prompt to override `student-data.json`. Create a `Seeder` class which seeds data in the `institutions` database table with `institution-data.json`. 

Go & have a look at the contents in `student-data.json`. You will notice a new key called `institution_id`. The value maps to the object's index in `institution-data.json`. For example, Stanford University is index is 1 & Dominykas Roy's `institution_id` is 1, so we can assume that Dominykas Roy attends Stanford University. Also, you will need to update `StudentSeeder.php` so that it seeds `institution_id` into the `students` database table.

**Resource:** https://laravel.com/docs/8.x/seeding

## Appending Values To JSON
This is example on how you append values to **JSON**. For each `Institution`, it will return the `Student` count as a new key/value pair. For example `student_count: 3`.

```php
...
class Institution extends Model {
    ...
    protected $appends = ['students_count'];
    ...
    public function getStudentsCountAttribute() {
        return $this->students()->count();
    }
}
```

**Resource:** https://laravel.com/docs/8.x/eloquent-serialization#appending-values-to-json

## Practical
