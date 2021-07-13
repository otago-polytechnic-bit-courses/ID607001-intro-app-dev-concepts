# PHP Basics

## What is PHP?
**PHP** or **PHP Hypertext Preprocessor** is one of the most widely-used open-source general-purpose scripting languages used mainly for web development.  

A **PHP** page contains **HTML** with embedded **PHP** code, for example:

```php
<html>
  <head>
    <title>PHP Examples</title>
  </head>
  <body>
    <?php
        echo "Hello, World!"
    ?>
  </body>
</html>
```

Much like the `<script>` and `</script>` in **JavaScript**, **PHP** uses `<?php` and `?>` to enclose its code.

So, what is the difference between **PHP** and **JavaScript**?
The code is executed on the server, generating **HTML** which is then sent to the client. The client receives the **HTML**, but does not know how it was generated or even the underlying code.

## Basic Syntax 

### Variables
In **PHP**, a variable starts with the `$` sign, followed by the name of the variable:

```php
<?php 
    $a = "Hello, World!"; // string
    $b = 1; // integer
    $c = 1.5; // float or double
    $d = false; // boolean
    echo $a // Hello, World!
?> 
```

**Question:** What is one syntax difference between **C#** and **PHP**?

**PHP** also allows type casting or explicit casting and is handled by the interpreter. 

```php
<?php 
    $x = 1;
    $y = 1.5;
    $z = $x + $y;
    $z = $x + (int) $y;
    echo $z; // 2
?> 
```

`var_dump` is use to check a variable's data type.

```php
<?php 
    $a = "Hello, World!";
    $b = 1; 
    var_dump($a); // string(13) "Hello, World!"
    var_dump($b); // int(1) 
?> 
```

**Question:** What does 13 in `string(13)` represent?

**Resource:** https://www.php.net/manual/en/language.variables.php

There are **four** main types of operators - arithmetic, assignment, comparison and logical. 

**Resource:** https://www.php.net/manual/en/language.operators.php

Other rules for **PHP** variables:
- Must start with a letter or the `_` underscore character.
- Can not start with a number.
Can only contain alpha numeric characters and underscores.
- Names are case sensitive, i.e., `$hello` and `$HELLO` are two different variables.

### Control Structures
Code is grouped into two categories:
- **sequential** - executing the code in the order in which it is written.
- **decision** - executing the code depending on the value of a condition.

**Question:** What is a control structure?

Lets look at an example:

```php
<?php
    if (some condition) { 
        block one
    } else {
        block two
    }
?>
```

- `if (some condition)` - the control structure.
- block one - the code to be executed, if the condition is `true`.
- `else` is the fallback, if the condition is `false`.
- block two - the code to be executed if the condition is `false`.

As you can see, this is same as **C#** and **JavaScript**.

Another example:

```php
<?php
    $first_number = 5;
    $second_number = 10;

    if ($first_number > $second_number) {
        echo "$first_number is greater than $second_number";
    } else {
        echo "$second_number is greater than $first_number";
    }
    
    // 10 is greater than 5
?>
```

**Resources:** 
- https://www.php.net/manual/en/control-structures.if.php
- https://www.php.net/manual/en/control-structures.else.php
- https://www.php.net/manual/en/control-structures.elseif.php
- https://www.php.net/manual/en/control-structures.alternative-syntax.php

**PHP** also has a **switch statement**.

```php
<?php
    switch (condition) {
        case one:
            // Some code
        break;

        case two:
            // Some code
        break;

        default:
            // Some code
        break;
    }
?>
```

- `switch (condition)` - the control structure.
- `case` - the code to be executed depending on the value of the condition.
- `default` - the code to be executed if the value of the condition is not met.

Lets look at example:

```php
<?php
    $today = "Wednesday";

    switch ($today) {
        case "Friday":
            echo "I am done for the week";
        break;

        case "Saturday":
            echo "Time for some housework";
        break;

        case "Sunday":
            echo "Oh man! Back to work tomorrow";
        break;

        default:
            echo "Have a nice day at work";
        break;
    }
?>
```

**Resource:** https://www.php.net/manual/en/control-structures.switch.php

### Loops
For, for-each, do and do-while loop much the same as **C#** and **JavaScript**.

Here are some examples:

```php
<?php
    for ($i = 0; $i < 10; $i++) {
        $value = 10 * $i;
        echo "$value \n";
    }
    
    // 0 10 20 30 40 50 60 70 80 90
?>
```

```php
<?php
    $numbers = array(0, 1, 2, 3, 4, 5);

    foreach($numbers as $nums) {
        $value = 10 * $nums;
        echo "$value \n";
    }
    
     // 0 10 20 30 40 50
?>
```

**Resources:**
- https://www.php.net/manual/en/control-structures.for.php
- https://www.php.net/manual/en/control-structures.foreach.php
- https://www.php.net/manual/en/control-structures.while.php
- https://www.php.net/manual/en/control-structures.do.while.php

### Functions
**Resources:**
You may define a function such as the following:
```php
<?php
    function sum($arg_one, $arg_two) {
        return $arg_one + $arg_two;
    }

    echo sum(1, 2); // 3
?>
```

Function names use underscores between lowercased words, i.e., `some_function` not `someFunction`.

**Resource:** https://www.php.net/manual/en/functions.user-defined.php

You can define a function without a name. This called an **anonymous function** or a **closure**. 

```php
<?php
    $greeting = function($name) {
        printf("Hello my name is $name");
    };

    $greeting("John Doe"); // Hello my name is John Doe
?>
```

**Resource:** https://www.php.net/manual/en/functions.anonymous.php

Below are additional resources to other types of functions:
- https://www.php.net/manual/en/functions.arrow.php
- https://www.php.net/manual/en/functions.internal.php
- https://www.php.net/manual/en/functions.variable-functions.php

### Classes

Classes are very similar to what you saw in **Programming 2** with **C#**. Naming conventions are the same, i.e., `SomeClass` not `someClass`. Properties must be defined as public (default), private or protected. If you use `var`, the property will have public visibility.

```php
<?php
    class Person {
        private $first_name;
        private $last_name;
      
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
    
    $person_one = new Person;
    $person_one->set_first_name("John");
    $person_one->set_last_name("Doe");
    echo $person_one->get_first_name() . " " . $person_one->get_last_name(); // John Doe
?>
```

**Question:** What happens when I try and access `first_name` or `last_name` directly, i.e., $person_one->first_name;?

### Error Handling

Firstly, we must answer the following questions:
- **What is an error?**

  An unexpected result that cannot be handled by the program itself. Errors are resolved by fixing the program. An example of error is an infinite loop. 

- **What is an exception?**

  An exception is an unexpected result that can be handled by the program itself. An example of an exception is opening a file that does not exist. 
  
- **How do we handle this?** 

    By either creating the file or giving the option to select a file from your file system.
  
- **Why exception handling?**

  Avoid unexpected results that can annoy end users and improving security by not exposing information which malicious may use. 

Let look at a common example:

```php
<?php
    $denominator = 0;
    echo 2 / $denominator;
?>
```

**Question:** What is the value of `2 / $denominator`?

Modified example:

```php
<?php
    $denominator = 0;

    if ($denominator != 0) {
        echo 2 / $denominator;
    } else {
        echo "Cannot divide by zero (0)";
    }
?>
```

For more thorough exception handling, we will look at try/catch blocks:

```php
<?php
    try {
        // Code that could potentially throw an exception
    } catch (Exception $e) {
        // Exception handling code
    }
?>
```

A more practical example:
```php
<?php
    try {
        $some_msg = "Some exception message...";
        throw new Exception($some_msg); // Throwing a new exception
    } catch (Exception $e) {
        echo "Error message: " . $e->getMessage();
    }
?>
```

From here, we will go on a small tangent...what is the `.` equivalent to in **C#** and **JavaScript**?

**Resource:** https://www.php.net/manual/en/language.exceptions.php

### File Processing
There may be a time where you need to create, update or delete a file. 

The example below is checking if a file exists:

```php
<?php
    if (file_exists("sample.txt")) {    
        echo "sample.txt does exist";
    } else {
        echo "sample.txt does not exist";
    } 
?>
```

How about reading the contents:
```php
echo file_get_contents("sample.txt");
```

or deleting the file:

```php
<?php
    if (!unlink("sample.txt")) {
        echo "Could not delete sample.txt";
    } else {
        echo "sample.txt successfully deleted"; 
    }
?>
```

**Resource:** https://www.php.net/manual/en/ref.filesystem.php

## Setting Up Your Development Environment
In this course, we will be using **Visual Studio Code** and **Laragon**. **Laragon** makes building and maintaining **PHP** applications simple. If you do not have **Laragon** installed, you can download it [here](https://laragon.org/download/). Going forward...the lecture notes, i.e., code snippets, screenshots, etc will be **Windows** specific. If you are using **macOS** or **Linux**, you will need to use **XAMMP** as there is no available **Laragon** client.

Open a **Git Bash** terminal and run the following commands:

```bash
cd /c/laragon
./laragon.exe
```

- `cd /c/laragon` - navigate you to the laragon directory in the C drive.
- `./laragon.exe` - run the laragon executable in the laragon directory.

You should see the following window:

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/01-php-basics/01-laragon-1.jpg?raw=true)

Make sure the **PHP** version is set to 8.0.2. If it is not, right-click on the window > PHP > Version > php-8.0.2-Win32-vs16-x64
  
Click the **Start All** button. This will start a new instance of **Apache** and **MySQL**.
  
![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/01-php-basics/01-laragon-2.jpg?raw=true)
  
Go back to the **Git Bash** terminal and run the following commands:

```bash
mkdir -p www
cd www
code .
```
  
- `mkdir -p www` - create a new directory if does not exist called **www**. This is where your **PHP** files will go. 
- `cd www` - change to the **www** directory.
- `code .` - open **Visual Studio Code** in the **www** directory.

When you open **Visual Studio Code**, you may be prompted with the following:

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/01-php-basics/01-vs-code-1.PNG?raw=true)

Click on the "Yes, I trust the authors" button.
  
Create a new file called `index.php`

![](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/s2-2021/resources/img/01-php-basics/01-vs-code-2.PNG?raw=true)
  
Add some code from the lecture notes, then navigate to http://localhost:81
  
## Practical
This week you will work on a series of programming problems to familiarise yourself with **PHP**. 
