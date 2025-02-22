# MSSE 635 Week 6 Assignment 
### David Belett 

## Introduction

- I will be doing this a bit different because while trying Papyrus Designer, I kept getting a screen each time I went to create the code that a JDT project needed to get generated for code generation, which I clicked on yes and nothing ever happened 
    - Also tried no and got the same.
    - Per the gitlab readme, this is common for the first project, but and I am supposed to click yes and something will auto populate, but that never happened with me, I believe it might have to do with me using an ARM-based processor while the only download for Windows was an AMD one, so problems tend to occur if an ARM version is not available, seeing that the download will not have support come 2026 I am not surprised only one version is available for Windows, another reason for me to switch to Mac in the future.

-	Due to this, I was unable to get Papyrus Designer to generate code for me, so instead I am creating Java code following the instructions, instead of doing it through Papyrus Designer
    
![Papyrus Image](papyrus_img/image.png)

- The actual code will be located in different parts of this repo.


## Logical Viewpoint

#### UML Component Diagram

![UML](logical_view/logical_uml.png)

#### Explanation of Customer class code

- The `Customer` class represents a customer entity.

- Attributes
    - `customerId`: Integer uniquely identifying the customer.
    - `name`: Customer's name.
    - `email`: Customer's email address.

- Constructors
    - Creates empty `Customer` object.
    - `Customer` is then initialized with specific values/parameters.

- Getters and Setters
    - Provide access/modification methods for each private attribute.
        - Maintains encapsulation.

- toString() Method
    - Returns string of the `Customer`.
        - Including all the attributes.
        