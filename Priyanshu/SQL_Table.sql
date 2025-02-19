CREATE IF NOT EXISTS DATABASE LaundryManagement;
USE LaundryManagement;

-- CUSTOMERS Table
CREATE TABLE CUSTOMERS (
    customer_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- STAFF Table
CREATE TABLE STAFF (
    staff_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
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


CREATE TABLE ORDERS (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    total_cost FLOAT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id) ON DELETE SET NULL
);

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


DELIMITER $$

CREATE TRIGGER update_total_cost
AFTER INSERT ON ORDER_DETAILS
FOR EACH ROW
BEGIN
    UPDATE ORDERS
    SET total_cost = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM ORDER_DETAILS 
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER create_payment_entry
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    INSERT INTO PAYMENTS (payment_id, order_id, amount, payment_mode, status)
    VALUES (
        UUID(), NEW.order_id, NEW.total_cost, 'cash', 'pending'
    );
END $$

DELIMITER ;


