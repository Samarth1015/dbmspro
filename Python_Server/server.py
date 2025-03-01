from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Jenil.p12@localhost/store_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Customer(db.Model):
    __tablename__ = 'customers'
    
    customer_id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)  

    def __repr__(self):
        return f'<Customer {self.name}>'


with app.app_context():
    db.create_all()
# ////////////////////////////////for singup

# # 
# {
#     "phone": "12345cfg67890",
#     "email": "john@example.com",
#     "name": "John Doe",
#     "address": "123 Main St"
# }
@app.route('/api/customer/signup', methods=['POST'])
def customer_signup():
    try:
        data = request.get_json()
        
        required_fields = ['phone', 'email', 'name', 'address']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400

        existing_customer = Customer.query.filter_by(email=data['email']).first()
        if existing_customer:
            return jsonify({'error': 'Customer with this email already exists'}), 409

        new_customer = Customer(
            phone=data['phone'],
            email=data['email'],
            name=data['name'],
            address=data['address']
        )

        db.session.add(new_customer)
        db.session.commit()

        return jsonify({
            'message': 'Customer registered successfully',
            'customer': {
                'customer_id': new_customer.customer_id,
                'phone': new_customer.phone,
                'email': new_customer.email,
                'name': new_customer.name,
                'address': new_customer.address
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Something went wrong', 'message': str(e)}), 500



# //////////////////////login funcationality


@app.route('/api/customer/login', methods=['POST'])
def customer_login():
    try:
      
        data = request.get_json()

        required_fields = ['email', 'phone']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400

        
        customer = Customer.query.filter_by(email=data['email']).first()

        if not customer:
            return jsonify({'error': 'Invalid email or phone'}), 401  # Unauthorized

        if customer.phone != data['phone']:
            return jsonify({'error': 'Invalid email or phone'}), 401  # Unauthorized

     
        return jsonify({
            'message': 'Login successful',
            'customer': {
                'customer_id': customer.customer_id,
                'phone': customer.phone,
                'email': customer.email,
                'name': customer.name,
                'address': customer.address
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Something went wrong', 'message': str(e)}), 500





# Run the application
if __name__ == '__main__':
    app.run(debug=True)


