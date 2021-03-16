# Laravel 2 - API Validation & Relationships

## API Validation
In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. However, you will look at [manually creating validators](https://laravel.com/docs/8.x/validation#manually-creating-validators) instead. **Laravel** also includes a range of validation rules that you can apply to your data.

To create a validator instance manually, you will use a  `Validator` [facade](https://laravel.com/docs/8.x/facades). It is fine if you do not understand what a **facade** is, but basically, a **facade** provides a simplified interface to a complex subsystem. A **facade** in **Laravel** provides a static interface to classes available in the application's service container.

In `ApiController.php`, update the `createStudent()` method as follows:
```php
...
public function createStudent(Request $request) {
    $validator = Validator::make($request->all(), [
        'first_name' => 'required',
        'last_name' => 'required',
        'phone_number' => 'required',
        'email_address' => 'required'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => $validator->errors()], 403);
    } else {
        Student::create($request->all());
        return response()->json(['message' => 'Student created.'], 201);
    }
}
...
```

In order to use the `Validator` **facade**, you must add the following import statement:

```php
use Validator;
```

The `make()` method accepts two arguments - the data under validation & an array of validation rules that are applied to the data. If a validation rule fails, return a **JSON** `Response` containing a message which indicates that a rule has failed & a status response code of [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403).

### Test Your API Validation

<img src="../tex/img/03-laravel-2-api-validation-relationships/03-postman-1.png" width="800" height="500" />

## Relationships
Database tables are often related to each other. For example, an institution may have many students or a student may have many courses. 

### Create a Relationship Between Two Tables
Firstly, create a new **model** & migration called `Institution`. This database table will have a relationship with the `students` database table. 

In `app\Models\Institution.php`, specify the database table and fields you wish to interact with. For example:

```php
...
class Institution extends Model {
    use HasFactory;

    protected $table = 'institutions';

    protected $fillable = ['name', 'city', 'state', 'country'];
    
    public function students() {
        return $this->hasMany(Student::class);
    }
}
```

The `students()` method is indicating that an `Institution` has many `Students`.

In the `database\migrations` directory, update `create_institutions_table.php` with the following:
```php
...
public function up() {
    Schema::create('institutions', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->string('city');
        $table->string('state');
        $table->string('country');
        $table->timestamps();
    });
}
...
```

Thus far, this should be familiar. Make sure to migrate your changes by executing the following command:

```
php artisan migrate
```

You are going to create a relationships between the `students` & `institutions` database table. To do this, update `create_students_table.php` with the following:

```php
...
public function up() {
    Schema::create('students', function (Blueprint $table) {
        $table->increments('id');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('phone_number');
        $table->string('email_address');
        $table->integer('institution_id')->unsigned();
        $table->foreign('institution_id')->references('id')->on('institutions');
        $table->timestamps();
    });
}
...
```
The `students` or child database table contains a foreign key & the `institutions` or parent/referenced database table contains the candidate key. `$table->foreign('institution_id')->references('id')->on('institutions');` refers to the primary key in the `institutions` database table.  To make a migration to an existing table, execute the following command:

```
php artisan make:migration --table=students
```

## Controller
In `app\Http\Controllers\ApiController.php`, add the following:

```php
public function getAllInstitutions(Request $request) {
    return Institution::with(['students'])->get();
} 
```

When accessing relationships as properties, the relationship data is lazy loaded which means the data is not loaded until you access the property for the first time. However, **Eloquent** can eager load relationships at the time you query the parent model. Have you heard of the **N + 1 query problem**? The `with()` method is used to alleviates this. 

This is an hypothetical example using an `Author` & `Book` **model**:

```php
$books = Book::all();

foreach ($books as $book) {
    echo $book->author->name;
}
```

This code will execute one query to retrieve all the books & one query for each book to retrieve the author. If there were 10 books, 11 queries would be executed.

```php
$books = Book::with('author')->get();

foreach ($books as $book) {
    echo $book->author->name;
}
```

This code would only ever execute two queries regardless on the number of books. A bit of magic...not really, this code is using a `JOIN`. Remember, if you are using two or more tables, use a `JOIN` wherever possible.

## Route
In `routes\api.php`, create a new route group for `institutions`. You will only need one `GET` route as follows:

```php
Route::group(['prefix' => 'institutions'], function () {
    Route::get('/', 'ApiController@getAllInstitutions');
});
```

## Seeder
Copy `institution-data.json` & `student-data.json` into the `database\data` directory. You may be prompt to override `student-data.json`. Create a `Seeder` class which seeds data in the `institutions` database table with `institution-data.json`. 

Go & have a look at the contents in `student-data.json`. You will notice a new key called `institution_id`. The value maps to the object's index in `institution-data.json`. For example, Stanford University is index is 1 & Dominykas Roy's `institution_id` is 1, so we can assume that Dominykas Roy attends Stanford University. Also, you will need to update `StudentSeeder.php` so that it seeds `institution_id` into the `students` database table.

## Appending Values To JSON
This is example on how you [append](https://laravel.com/docs/8.x/eloquent-serialization#appending-values-to-json) values to **JSON**. For each `Institution`, it will return the `Student` count as a new key/value pair. For example `student_count: 3`.

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

## Activity ✏️
In this activity, you will extend the **api** project provided to you in this directory. 

1. In `ApiController.php`, apply validation rules to the `createCar()` method. You **must** set two constraints with the required constraint.
2. Create a relationship of your choice with the `cars` database table.
