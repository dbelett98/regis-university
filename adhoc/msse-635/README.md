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

#### Explanation of code

- Key Entities defined
    - `Customer`, `Order`, `Inventory`, and `Payment` defined as the components of the system.

- Unified Database
    - This was a change from the UML diagram I drew, but I felt doing one single `Database` was better than doing a database for every component, as this simplies data storage.

- JUnit Testing
    - Each of the test cases ensure that each `toString()` method functions as expected.


## Scenario Viewpoint

### UML Use Case Diagram

![use case diagram](scenario_view/use_case_uml.png)

#### Explanation of the code

- Focused on the use cases from the scenarion view (see picture above).

- Implemented methods represent each use case directly
    - `Customer.registerCustomer()`: register's customer.
    - `Inventory.isAvailable()`: checks inventory.
    - `Order.placeOrder()`: places an order.
    - `Payment.makePayment()`: processes payment.

- `toString()` methods reflect attributes and relationships.

- JUnit tests verify each use case works.
