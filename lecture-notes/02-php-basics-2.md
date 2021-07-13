
# 02: PHP Basics 2

## Practical 
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

**Question:** What happens when I try and access `first_name` or `last_name` directly, i.e., $person_one->first_name;?

## Inheritance

```php
<?php
    class Fruit {
        private $name;
        private $colour;

        public function __construct($name, $colour) {
            $this->name = $name;
            $this->colour = $colour;
        }
    }

    class Apple extends Fruit {
        public function some_message() {
            echo "I am an apple."
        }
    }
    
    $apple = new Fruit("apple", "red");
    $apple->some_message();
    $banana = new Fruit("banana", "yellow");
?>
```

## Practical
