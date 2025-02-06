# Professional Service Business (PSB) Web Application 

### Initial Peer Review -- David Belett

## Introduction

My goal is to create a web application for a business called "Professional Service Business" (PSB).
The business business in question provides tax services (business or individual), payroll services, and accounting services to other businesses.
- i.e. Trucking company coming to PSB so all their accounting/tax/payroll is taken care of. 

Part of the web application will engage the potential customer to make an account with PSB. 
- This will be done with the use of a landing page to the PSB website.

The other part of the web application provides customers with a portal to sign up, log in, and access the professional services. The portal will educate the customers about each offer, helping them understand how the PSB expertise can support their business growth.

Guests without login credentials can view the basic information (landing page) but without access to any personalized features or detailed resources (portal).


## User Portal

**Sign up**
- Customers can register by providing their business name, contact details, and selecting the desired services.
    - If no business name or contact details are given, then sign up should not be accepted.

**Login**
- Registered customers can securely access their accounts to manage services and view personalized content for them.
    - i.e. A business can view how important payroll management can be for them.

**Security**
- Ensures passwords and confidential data are stored and encrypted.
    - This is important since people will input their SSNs during taxes.

**Contact**
- Feature for customers to send messages/requests to staff.
    - This will be optional for this project and will depend on time.


## Profile Management

**User Profile**
- Allow customers to update their profile information.
    - Contact details, business information, password.

**Service Preferences**
- Let customers modify their selected services and manage their "subscriptions".

**Accesses** 
- Staff can view/edit user profiles and manage service offerings. They can also make posts and directly respond to customer questions.
    - This will be optional for this project and will depend on time.


## Technology

**Frontend**
- HTML/CSS
- JavaScript
    - AJAX for asynchronous data handling.
    - Possibly will use React or Angular (JS frameworks) depending on time and learning curve.
    

**Backend**
- Node.js
    - Runtime environment, also great that it comes with a package manager (npm).

- Express.js
    - As we learned, great for building a web server.

- Database
    - MySQL

**Servers**
- Web Server
    - http://localhost:3000 
        - This is where Express.js will be used.
- Data Service Layer
    - http://localhost:3001
        - Handles API requests, communicates with database.


**Testing**
- Unit Testing
    - I plan to use Postman since it worked for the web/data server lessons. There are also interesting options like Jest or Mocha which are great for unit testing that I might explore depending on time and learning curve.

**Security**
- Password Encryption
    - bcrypt to hash and securely store passwords.







