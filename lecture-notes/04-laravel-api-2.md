# 04: Laravel API 2

## Validation

In **Laravel**, there are different ways to validate your data. The most common way is to use the `validate()` method. Also, there  is a range of validation rules that you can apply to your data, not just what you see below. 

In `InstitutionController.php`, update the `store()` method as follows:

```php
...
public function store(Request $request) {
    $request->validate([
        'name' => 'required',
        'region' => 'required',
        'country' => 'required'
    ]);

    return Institution::create($request->all());
}
...
```

By providing these rules, you can not create an **institution** without providing a `name`, `region` and `country`.

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
    use HasFactory; // Omit this if you had the issue with Laragon not creating the Models directory

    protected $fillable = ['first_name', 'last_name', 'phone_number', 'email_address'];
    
    public function students() {
        return $this->hasMany(Student::class); // This is an example of a relationship - an institution can have many students
    }
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
        $table->foreignId('institution_id')->constrained('institutions');
        $table->timestamps();
    });
}
...
```

The `students` or child database table contains a foreign key & the `institutions` or parent/referenced database table contains the candidate key. `$table->foreignId('institutions_id')->constrained('institutions');` refers to the primary key in the `institutions` database table.

Remember to migrate using the following command:

```bash
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

    // SQL equivalent:
    // SELECT students.first_name, students.last_name, institutions.name, institutions.region, institutions.country
    // FROM students
    // JOIN institutions on students.institution_id = institutions.id;
}
...
```

Here we are only retrieving the student's first name, last name, and their institution's name, region and country.

## Route

In `api.php`, create a new route for the `index()` action method in `StudentController`.

## Seeder

Copy the two **JSON** files - `institution-data.json` & `student-data.json` into the `database\seeders` directory. Create two `Seeder` classes which will seed the `students` and `institutions` tables separately with the appropriate **JSON** file. To do this, run the following commands:

```bash
php artisan make:seeder InstitutionSeeder
php artisan make:seeder StudentSeeder
```

Spend a minute looking through the contents of both **JSON** files. You will notice a new key called `institution_id`. The value maps to the object's index in `institution-data.json`. For example, **Stanford University** is index is 1 & **Dominykas Roy's** `institution_id` is 1, so we can assume that **Dominykas Roy** attends **Stanford University**. 

In the `InstitutionSeeder` and `StudentSeeder`, you will be given a method called `run()`. 

In the `run()` method in `InstitutionSeeder`, add the following code:

```php
...
public function run() {
    $json_file = File::get('database\seeders\institution-data.json'); // Get institution-data.json 
    DB::table('institutions')->delete(); // Delete all records from the institutions database table 
    $data = json_decode($json_file); // Convert the JSON object in institution-data.json to a PHP variable
    foreach ($data as $obj) { // For each object (contains key/value pairs), create a new record in the institutions database table 
        Institution::create(array( // Remember an Institution has three values - name, region and country. Make 
                                   // sure your JSON file matches the schema of your database table
            'name' => $obj->name,
            'region' => $obj->region,
            'country' => $obj->country
        ));
    } 
}
```

In the `run()` method in `StudentSeeder`, add the following code:


```php
...
public function run() {
    $json_file = File::get('database\seeders\student-data.json'); 
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

Also, you will need to include three new imports:

```php
...
use App\Models\Institution; // Include this import. Without this, you can not access the Institution model
use Illuminate\Database\Seeder; // This import comes by default
use Illuminate\Support\Facades\DB; // Include this import. Without this, you can not access the institutions database table
use Illuminate\Support\Facades\File; // Include this import. Without this, you can not access institution-data.json 

class InstitutionSeeder extends Seeder {
...
```

**Note:** Make sure you import the `Student` model in `StudentSeeder`. If you do not, when you seed the students database table, you will get an error. The error is not obvious so please be careful.

In `DatabaseSeeder.php`, you have also been given a `run()` method. Call `InstitutionSeeder` and `StudentSeeder` as follows:
```php
...
public function run() {
    // \App\Models\User::factory(10)->create();
    $this->call(InstitutionSeeder::class); // The Institution model is the parent of the Student model. The institutions 
                                           // database table must be seeded before the students database table
    $this->call(StudentSeeder::class);
}
```

Once you have done this, you can use the following command to seed your tables:

```bash
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
    protected $appends = ['students_count']; // The value must match the name between the get and 
                                             // Attribute keywords, and separated by an underscore. Note:
                                             // It is case-sensitive.
                                             
    ...    
    public function getStudentsCountAttribute() {
        return $this->students()->count(); // Get the number of students per institution
    }
}
```

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/04-laravel-api-2/04-postman-5.PNG?raw=true)

**Resource:** https://laravel.com/docs/8.x/eloquent-serialization#appending-values-to-json

## Formative Assessment
Create a new branch called **04-laravel-api-2** by running the command:

```bash
git checkout -b 04-laravel-api-2
```

Open your project in **Visual Studio Code**. Setup your relationships between models and start thinking about the **API** data you want to return.

Once you have complete this, make a pull request and assign **grayson-orr** as a reviewer.

If you finish earlier, I recommend moving onto the next concept.
