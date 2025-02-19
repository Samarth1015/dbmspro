CREATE IF NOT EXISTS DATABASE LaundryManagement;
USE LaundryManagement;

-- CUSTOMERS Table
CREATE TABLE CUSTOMERS (
    customer_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    
);

-- STAFF Table
CREATE TABLE STAFF (
    staff_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    
);

-- SERVICES Table
CREATE TABLE SERVICES (
    service_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_item FLOAT NOT NULL
);

-- ORDERS Table
CREATE TABLE ORDERS (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
   
    FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id) ON DELETE SET NULL
);

-- ORDER_DETAILS Table (Many-to-Many relationship between Orders and Services)
CREATE TABLE ORDER_DETAILS (
    order_detail_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal FLOAT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id) ON DELETE CASCADE
);

-- PAYMENTS Table
CREATE TABLE PAYMENTS (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL,
    payment_mode ENUM('cash', 'card', 'online') NOT NULL,
    status ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);
