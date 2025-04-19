# SQL Queries Documentation

This file documents all SQL queries used in the Laundry Management System backend API.

## Authentication Queries

### Staff Login

```sql
SELECT email, password, staff_id FROM staff WHERE email=? AND password=?
```

Used to authenticate staff members by validating email and password.

### Customer Login

```sql
SELECT email, password, customer_id FROM customers WHERE email=? AND password=?
```

Used to authenticate customers by validating email and password.

## Registration Queries

### Staff Registration

```sql
INSERT INTO staff(staff_id, name, email, address, password) VALUES(?, ?, ?, ?, ?)
```

Creates a new staff record with a generated staff_id.

### Customer Registration

```sql
INSERT INTO customers(customer_id, name, email, address, password) VALUES(?, ?, ?, ?, ?)
```

Creates a new customer record with a generated customer_id.

## Order Management Queries

### Create Order

```sql
INSERT INTO orders (order_id, customer_id, staff_id, order_date) VALUES (?, ?, ?, ?)
```

Creates a new order with customer ID, staff ID, and timestamp.

### Add Order Details

```sql
INSERT INTO order_details (order_id, service_id, quantity) VALUES (?, ?, ?)
```

Adds a specific service with quantity to an order.

### Get Order Total

```sql
SELECT Final_Total FROM orders WHERE order_id=?
```

Retrieves the calculated total amount for an order.

### Create Payment Record (Pending)

```sql
INSERT INTO payments (payment_id, order_id, amount, status) VALUES (?, ?, ?, ?)
```

Creates a pending payment record for an order.

### Create Payment Record (With Method)

```sql
INSERT INTO payments (payment_id, order_id, amount, status, payment_mode) VALUES (?, ?, ?, ?, ?)
```

Creates a payment record with payment method specified.

## Order Retrieval Queries

### Get Staff Orders

```sql
SELECT * FROM orders WHERE staff_id=?
```

Retrieves all orders assigned to a specific staff member.

### Get Customer Orders with Natural Join

```sql
SELECT orders.*, payments.status, payments.payment_mode
FROM orders
NATURAL JOIN payments
WHERE orders.customer_id=?
```

Retrieves all orders with payment information for a specific customer using a natural join on the order_id column, which exists in both tables.

### Get Payment Status with Natural Join

```sql
SELECT payments.status
FROM orders
NATURAL JOIN payments
WHERE orders.order_id=?
```

Retrieves the payment status for a specific order using a natural join, which automatically joins on the common order_id column.

### Get Payment Details

```sql
SELECT status, payment_mode FROM payments WHERE order_id=?
```

Retrieves both payment status and payment method for an order.

## Order Details Queries

### Get Order Services with Natural Join

```sql
SELECT service_id, quantity FROM orders NATURAL JOIN order_details WHERE order_id=?
```

Retrieves service details for a specific order using a natural join on order_id.

### Get Complete Order Details with Multiple Natural Joins

```sql
SELECT o.order_id, o.order_date, o.Final_Total,
       c.name AS customer_name, c.email AS customer_email,
       s.service_id, s.name AS service_name, od.quantity, od.subtotal
FROM orders o
NATURAL JOIN customers c
NATURAL JOIN order_details od
NATURAL JOIN services s
WHERE o.order_id=?
```

Retrieves complete order information including customer details and service items using multiple natural joins. This works because the tables share common column names for their relationships.

### Get Order Basic Info

```sql
SELECT order_id, customer_id FROM orders WHERE order_id=?
```

Retrieves basic order information including the customer ID.

## Payment Processing Queries

### Update Payment Status

```sql
UPDATE payments SET status='paid' WHERE order_id=?
```

Marks a payment as paid.

### Update Payment Details

```sql
UPDATE payments SET status=?, payment_mode=?, payment_date=? WHERE order_id=?
```

Updates payment with status, payment method, and current date.

## Service Management Queries

### Get All Services

```sql
SELECT service_id, service_name, price FROM services
```

Retrieves all available laundry services with pricing.

### Get Services with Order Counts using Left Join

```sql
SELECT s.service_id, s.name, s.price_per_item,
       COUNT(od.order_id) AS total_orders
FROM services s
LEFT JOIN order_details od ON s.service_id = od.service_id
GROUP BY s.service_id, s.name, s.price_per_item
```

Retrieves all services with the count of orders for each service, including services that haven't been ordered (using LEFT JOIN).

## Order Update Queries

### Update Service Quantity

```sql
UPDATE order_details SET quantity=? WHERE order_id=? AND service_id=?
```

Updates the quantity of a specific service in an order.

## Order Deletion Queries

### Delete Order Details

```sql
DELETE FROM order_details WHERE order_id=?
```

Removes all service details for an order.

### Delete Order

```sql
DELETE FROM orders WHERE order_id=?
```

Removes the order record.

### Delete Payment

```sql
DELETE FROM payments WHERE order_id=?
```

Removes the payment record for an order.

## Customer Lookup Queries

### Find Customer by Email

```sql
SELECT customer_id FROM customers WHERE email=?
```

Looks up a customer ID based on email address.

### Get Customer Email

```sql
SELECT email FROM customers WHERE customer_id=?
```

Retrieves a customer's email for notification purposes.

### Get Customer Orders with Staff Info using Natural Join

```sql
SELECT o.order_id, o.order_date, o.Final_Total,
       s.name AS staff_name, s.email AS staff_email
FROM orders o
NATURAL JOIN staff s
WHERE o.customer_id=?
```

Retrieves a customer's orders with the assigned staff information using a natural join on staff_id.

## Advanced Queries

### Get Top Services by Order Quantity

```sql
SELECT s.name AS service_name, SUM(od.quantity) AS total_quantity,
       COUNT(DISTINCT o.order_id) AS order_count
FROM services s
NATURAL JOIN order_details od
NATURAL JOIN orders o
GROUP BY s.service_id, s.name
ORDER BY total_quantity DESC
LIMIT 5
```

Retrieves the top 5 most ordered services with total quantities and order counts using natural joins.

### Get Customer Order Summary

```sql
SELECT c.customer_id, c.name, c.email,
       COUNT(o.order_id) AS total_orders,
       SUM(o.Final_Total) AS total_spent,
       MAX(o.order_date) AS last_order_date
FROM customers c
NATURAL JOIN orders o
GROUP BY c.customer_id, c.name, c.email
```

Generates a summary of each customer's ordering activity using a natural join between customers and orders.

## Database Setup Queries

### Services Table Setup

```sql
CREATE TABLE IF NOT EXISTS services (
    service_id INT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT
)
```

Creates the services table if it doesn't exist.

### Seed Services Data

```sql
INSERT INTO services (service_id, service_name, price, description) VALUES
(101, 'Wash & Iron', 150.00, 'Regular washing with ironing service'),
(102, 'Dry Cleaning', 100.00, 'Professional dry cleaning for delicate fabrics'),
(103, 'Ironing Only', 80.00, 'Ironing service for pre-washed clothes'),
(104, 'Stain Removal', 200.00, 'Special service for removing tough stains'),
(105, 'Fabric Softening', 50.00, 'Extra fabric softening treatment')
```

Populates the services table with predefined service options.

## Database Triggers

### Calculate Subtotal Trigger

```sql
DELIMITER //

CREATE TRIGGER subtotal_insert
BEFORE INSERT ON order_details
FOR EACH ROW
BEGIN
    -- Declare variable to store the price per item
    DECLARE subtota FLOAT;

    -- Fetch the price per item from the services table
    SELECT price_per_item INTO subtota
    FROM services
    WHERE service_id = NEW.service_id;

    -- Assign the calculated subtotal to the NEW row
    SET NEW.subtotal = subtota * NEW.quantity;
END //

DELIMITER ;
```

This trigger automatically calculates the subtotal (price × quantity) before inserting a new record into the order_details table.

### Update Final Total Trigger

```sql
DELIMITER //

CREATE TRIGGER final_total
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    -- Declare variable to store the sum of subtotals
    DECLARE final FLOAT;

    -- Calculate the sum of subtotals for the order and store it
    SELECT SUM(subtotal) INTO final
    FROM order_details
    WHERE order_id = NEW.order_id;

    -- Update the Final_total in the orders table
    UPDATE orders
    SET Final_Total = final
    WHERE order_id = NEW.order_id;
END //

DELIMITER ;
```

This trigger automatically updates the Final_Total in the orders table whenever a new item is added to order_details, by summing all subtotals for that order.
