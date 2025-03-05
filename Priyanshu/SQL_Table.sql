CREATE database IF NOT EXISTS  LaundryManagement;
USE LaundryManagement;

-- CUSTOMERS Table
CREATE TABLE CUSTOMERS (
    customer_id int PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(150)
    );

-- STAFF Table
CREATE TABLE STAFF (
    staff_id int PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(150)
);

-- SERVICES Table
CREATE TABLE SERVICES (
    service_id int PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_item FLOAT NOT NULL
);


CREATE TABLE ORDERS (
    order_id int PRIMARY KEY,
    customer_id int NOT NULL,
    staff_id int,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Final_Total FLOAT NOT NULL,
   
    
    FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id) ON DELETE SET NULL
);

CREATE TABLE ORDER_DETAILS (
    order_detail_id int PRIMARY KEY,
    order_id int NOT NULL,
    service_id int NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id) ON DELETE CASCADE
);

-- PAYMENTS Table
CREATE TABLE PAYMENTS (
    payment_id int PRIMARY KEY,
    order_id int NOT NULL,
    amount FLOAT NOT NULL,
    payment_mode ENUM('cash', 'card', 'online') NOT NULL,
    status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);





