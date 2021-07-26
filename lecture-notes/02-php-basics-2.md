
# 02: PHP Basics 2

- Every question has more than one solution. It is important to think about different ways of solving a problem. Do not be comfortable writing code the same way you have in the previously.
- With a new language like **PHP**, it will most likely have a language feature than can solve your problem in one line rather than three or four...good example is getting the sum of an array. If you do use a language feature, make sure you understand what it does.
- Start becoming familiar with the principle of open for extension...good example is question five. What happens if we want to add new item or remove an existing item?

## Classes

Classes are very similar to what you saw in **Programming 2** with **C#**. Naming conventions are the same, i.e., `SomeClass` not `someClass`. Properties must be defined as public (default), private or protected. If you use `var`, the property will have public visibility.

```php
<?php
    class Person {
        private $first_name;
        private $last_name;

        public function __construct($first_name, $last_name) {
            $this->first_name = $first_name;
            $this->last_name = $last_name;
        }
                
        public function set_first_name($first_name) {
            $this->first_name = $first_name;
        }
      
        public function get_first_name() {
            return $this->first_name;
        }
      
        public function set_last_name($last_name) {
            $this->last_name = $last_name;
        }
      
        public function get_last_name() {
           return $this->last_name;
        }
    }
    
    $person_one = new Person("John", "Doe");
    $person_one->set_first_name("Jane");
    $person_one->set_last_name("Roe");
    echo $person_one->get_first_name() . " " . $person_one->get_last_name(); // Jane Roe
?>
```

**Question:** What happens when I try and access `first_name` or `last_name` directly, i.e., `$person_one->first_name;`?

## Magic Functions

Instead of `$person_one->get_first_name() . " " . $person_one->get_last_name();`, we can create a special function called `__toString()`. This function does not accept any arguments and returns a **string**.

Special functions in **PHP** are reserved and they can not be used for unintended purposes. **Note:** special functions that start with a double underscore are reserved for **Objects**.

Lets look at how we can implement a `__toString()` function in our `Person` class.

```php
<?php
    class Person {
        ...

        public function __toString() {
            return $this->first_name . " " . $this->last_name;
        }
    }
    
    $person_one = new Person("John", "Doe");
    $person_one->set_first_name("Jane");
    $person_one->set_last_name("Roe");
    echo $person_one // Jane Roe
?>
```

## Inheritance

Very similar to what you have seen in the past. The `extends` keyword is used to derive a class from another class, i.e., `Banana` extends `Fruit`. 

```php
<?php
    class Fruit {
        protected $name;
        protected $colour;

        public function __construct($name, $colour) {
            $this->name = $name;
            $this->colour = $colour;
        }
    }

    class Banana extends Fruit { // Note the extends keyword
        // Overriding the parent's ctor
        public function __construct($name, $colour, $weight) {
            $this->name = $name;
            $this->colour = $colour;
            $this->weight = $weight;
        }

        // Overriding the parent's some_message method
        public function some_message() {
            echo "name => $this->name, colour => $this->colour, weight => $this->weight";
        }
    }
    
    $apple = new Fruit("apple", "red");
    $apple->some_message(); // name => apple, colour => red
    $banana = new Banana("banana", "yellow", 20);
    $banana->some_message(); // name => banana, colour => yellow, weight => 20
?>
```

## Interfaces

Given the scenario of driverless cars. I hate driving in town, but on the open road, I love it because I can go 100km. My requirements for a driverless car are very simple. I need it to accept a location, drive me to the destination and wake me up when it gets there. I do not care which company achieves this first or how it gets done. The car just has to be capable of performing my three tasks. You can think of these tasks as a contract of three methods, `set_location`, `drive` and `wake_up` for a class. That is what an interface is...it is a contract that states any class implementing this interface can be typed as the interface and guarantees the methods listed in the interface will be implemented.

Lets take a look at a simple example:

```php
 <?php
    interface Animal {
        public function make_sound();
    }

    class Bear implements Animal { // Note the implements keyword
        public function make_sound() {
            echo "Growl!";
        }
    }

    class Lion implements Animal {
        public function make_sound() {
            echo "Roar!";
        }
    }

    class Frog implements Animal {
        public function make_sound() {
            echo "Ribbit!";
        }
    }

    $bear = new Bear();
    $lion = new Lion();
    $frog = new Frog();
    $animals = array($bear, $lion, $frog);

    foreach($animals as $animal) {
        $animal->make_sound() . "<br>"; // Growl! 
                                        // Roar!
                                        // Ribbit!
    }
?>
```

## Practical
Today's in-class activity can be found [here](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/raw/master/in-class-activities/in-class-activity-php-basics-2.pdf).
