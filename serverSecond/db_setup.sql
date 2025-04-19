-- This script ensures that the services table is populated with correct service IDs
-- that match the IDs used in the frontend

-- First, check if the services table exists and create it if needed
CREATE TABLE IF NOT EXISTS services (
    service_id INT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT
);

-- Delete any existing services to avoid conflicts
DELETE FROM services;

-- Insert services with specific IDs that match the frontend
INSERT INTO services (service_id, service_name, price, description) VALUES
(101, 'Wash & Iron', 150.00, 'Regular washing with ironing service'),
(102, 'Dry Cleaning', 100.00, 'Professional dry cleaning for delicate fabrics'),
(103, 'Ironing Only', 80.00, 'Ironing service for pre-washed clothes'),
(104, 'Stain Removal', 200.00, 'Special service for removing tough stains'),
(105, 'Fabric Softening', 50.00, 'Extra fabric softening treatment');

-- Display the updated services table
SELECT * FROM services; 