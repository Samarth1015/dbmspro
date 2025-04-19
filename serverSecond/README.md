# Laundry Management System - Backend

This is the backend server for the Laundry Management System, written in Go.

## Setup Instructions

### Database Setup

1. Make sure you have MySQL installed and running
2. Create a database named `laundrymanagement` if it doesn't exist:
   ```sql
   CREATE DATABASE IF NOT EXISTS laundrymanagement;
   USE laundrymanagement;
   ```
3. Run the database setup script to create the necessary tables and seed data:

   ```bash
   mysql -u root -p laundrymanagement < db_setup.sql
   ```

   If you're having issues with foreign key constraints in the `order_details` table, make sure to run the service setup script:

   ```bash
   mysql -u root -p laundrymanagement < db_setup.sql
   ```

### Running the Server

1. Install Go dependencies:

   ```bash
   go mod download
   ```

2. Run the server:
   ```bash
   go run main.go
   ```

The server will start on port 8000.

## API Endpoints

- `/api/signup` - Register a new user (customer or staff)
- `/api/login` - User login
- `/api/addorder` - Add a new order
- `/api/getstaffdata` - Get all orders for a staff member
- `/api/getcutomeritem` - Get all orders for a customer
- `/api/staff/{id}` - Update or delete staff records
- `/api/updateamt/{id}` - Update order amount
- `/api/services` - Get all available services

## Common Issues

### Service ID Foreign Key Constraint

If you're encountering a foreign key constraint error when adding orders:

```
Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`laundrymanagement`.`order_details`, CONSTRAINT `service_id` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`))
```

Make sure you've run the `db_setup.sql` script to populate the services table with the correct service IDs. The frontend expects services with IDs 101, 102, 103, 104, and 105.
