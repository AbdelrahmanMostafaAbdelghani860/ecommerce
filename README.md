
 # **Overview**

##  This project is an e-commerce platform designed to cater to two types of users: administrators (admins) and customers. Admins have the capabilities to manage product listings and perform critical administrative tasks such as adding, editing, and deleting products. They can also create discount coupons and track inventory levels. Customers can browse products, add items to their cart, and complete purchases with integrated payment options.

# Features

## Admins

### Product Management:

Add, edit, and delete products from the inventory.

### Coupon Management: 

Create and manage discount codes for promotions.

### Inventory Tracking:
Monitor and update the number of products left in stock after purchases.

## Customers

### Shopping Cart:

Add items to the cart and modify quantities before checkout.

### Checkout Process:
Integrated payment processing through Stripe.

## Technologies Used
Node.js and Express: Backend server

Mongoose: MongoDB object modeling

Bcrypt: Password hashing

Cloudinary: Image upload and management

Dotenv: Environment variable management

Joi: Data validation

jsonwebtoken: Authentication and token management

Morgan: HTTP request logger

Multer: File upload handling

Nanoid: Unique string generator

Nodemailer: Email sending

PDFKit: PDF document generation

Randomstring: Random string generation

Slugify: URL string slug generator

Stripe: Payment processing

Voucher-code-generator: Generate coupon codes

## Setup Instructions

Clone the repository:


### git clone [https://ecommerce-url.git](https://github.com/AbdelrahmanMostafaAbdelghani860/ecommerce)

### cd your-project-directory

 ### Install dependencies:


npm install

Set up environment variables:

Create a .env file in the root directory and update it with your environment-specific details:


DATABASE_URL=mongodb://localhost:27017/your-database

STRIPE_KEY=your-stripe-key

CLOUDINARY_URL=your-cloudinary-url

Run the server:


npm start

How to Contribute

## Interested in contributing? Great! Here’s how you can help:

Fork the repository.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
