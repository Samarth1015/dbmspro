import psycopg2
import psycopg2.extras

DB_NAME = "laundrymanagement"
DB_USER = "postgres"
DB_PASS = "Jenil.p12"
DB_HOST = "localhost"
DB_PORT = "5432"

def get_db_connection():
    """Establishes a new database connection and returns it."""
    return psycopg2.connect(
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

def add_new_laundry(customer_id, service_id, quantity, staff_id, order_date):
    """Adds a new laundry order to the database."""
    conn = None
    cur = None
    try:
        # ✅ Establish a new connection and cursor
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        # ✅ Generate a new order_id
        cur.execute("SELECT COALESCE(MAX(order_id), 0) + 1 FROM orders")
        order_id = cur.fetchone()[0]

        # ✅ Fetch service price
        cur.execute("SELECT price_per_item FROM services WHERE service_id = %s", (service_id,))
        service = cur.fetchone()
        if not service:
            raise Exception("Service ID not found")
        
        price_per_item = service['price_per_item']
        subtotal = price_per_item * quantity

        # ✅ Calculate total previous payments for the customer
        cur.execute("""
            SELECT COALESCE(SUM(amount), 0) 
            FROM payments 
            INNER JOIN orders ON orders.order_id = payments.order_id 
            WHERE orders.customer_id = %s
        """, (customer_id,))
        
        final_total = cur.fetchone()[0]  # Default to 0 if no payments found

        # ✅ Insert into orders
        cur.execute(
            "INSERT INTO orders (order_id, customer_id, staff_id, order_date, final_total) VALUES (%s, %s, %s, %s, %s)",
            (order_id, customer_id, staff_id, order_date, final_total)
        )

        # ✅ Insert into order_details
        cur.execute(
            "INSERT INTO order_details (order_id, service_id, quantity, subtotal) VALUES (%s, %s, %s, %s)",
            (order_id, service_id, quantity, subtotal)
        )
        
        # ✅ Generate a new order_id
        cur.execute("SELECT COALESCE(MAX(payment_id), 0) + 1 FROM Payments")
        payment_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO Payments values (%s , %s , %s , %s ,%s,%s)",(
                payment_id , order_id , subtotal  , "cash" , "paid",order_date 
            )
            )

        conn.commit()
        print(f"Order {order_id} placed successfully!")

    except Exception as e:
        if conn:
            conn.rollback()  # Rollback only if connection is open
        print(f"Error placing order: {e}")
        raise  # Re-raise exception to return error to Flask

    finally:
        if cur:
            cur.close()  # ✅ Ensure cursor is closed
        if conn:
            conn.close()  # ✅ Ensure connection is closed
