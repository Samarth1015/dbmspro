-- Create the LaundryManagement database if it doesn't exist
CREATE DATABASE IF NOT EXISTS LaundryManagement;

-- Use the LaundryManagement database
USE LaundryManagement;

-- CUSTOMERS Table
CREATE TABLE `customers` (
    `customer_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(10) DEFAULT NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` VARCHAR(150) DEFAULT NULL,
    `password` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`customer_id`),
    UNIQUE KEY `uk_name` (`name`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- STAFF Table
CREATE TABLE `staff` (
    `staff_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(10) DEFAULT NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` VARCHAR(150) DEFAULT NULL,
    `password` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`staff_id`),
    UNIQUE KEY `uk_name` (`name`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- SERVICES Table
CREATE TABLE `services` (
    `service_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `price_per_item` FLOAT NOT NULL,
    PRIMARY KEY (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ORDERS Table
CREATE TABLE `orders` (
    `order_id` VARCHAR(50) NOT NULL,
    `customer_id` VARCHAR(50) NOT NULL,
    `staff_id` VARCHAR(50) DEFAULT NULL,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Final_Total` FLOAT DEFAULT NULL,
    PRIMARY KEY (`order_id`),
    KEY `idx_customer_id` (`customer_id`),
    KEY `idx_staff_id` (`staff_id`),
    CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
    CONSTRAINT `fk_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ORDER_DETAILS Table
CREATE TABLE `order_details` (
    `order_id` VARCHAR(50) NOT NULL,
    `service_id` VARCHAR(50) NOT NULL,
    `quantity` INT NOT NULL,
    `subtotal` FLOAT DEFAULT NULL,
    KEY `idx_order_id` (`order_id`),
    KEY `idx_service_id` (`service_id`),
    CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
    CONSTRAINT `fk_service_id` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
    CONSTRAINT `chk_quantity_positive` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- PAYMENTS Table
CREATE TABLE `payments` (
    `payment_id` VARCHAR(50) NOT NULL,
    `order_id` VARCHAR(50) NOT NULL,
    `amount` FLOAT NOT NULL,
    `payment_mode` ENUM('cash', 'card', 'online') NOT NULL,
    `status` ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





-- Define the delimiter to allow multi-line trigger creation
DELIMITER //

-- Trigger 1: Calculate subtotal before inserting into order_details
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

-- Trigger 2: Update Final_total in orders after inserting into order_details
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

-- Reset the delimiter back to default
DELIMITER ;
