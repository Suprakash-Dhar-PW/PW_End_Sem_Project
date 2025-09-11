# app.py - Your Flask Backend Server with a REAL MySQL Connection
# Make sure you have installed the necessary libraries:
# pip install Flask Flask-Cors mysql-connector-python bcrypt

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt # For secure password hashing
import logging

# --- Basic Setup ---
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# --- MySQL Database Configuration ---
# IMPORTANT: This section MUST match your local MySQL setup.
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '12345',
    'database': 'physics_wallah_db'
}

# Function to get a database connection
def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(**db_config)
        logging.info("Database connection successful")
        return conn
    except mysql.connector.Error as err:
        logging.error(f"Error connecting to MySQL: {err}")
        return None

# 🖥️ THE SIGN-UP ENDPOINT
@app.route('/signup', methods=['POST'])
def signup():
    """Handles new user registration."""
    data = request.get_json()
    fullName = data.get('fullName')
    username = data.get('username')
    contact = data.get('contact') # This will be the email
    password = data.get('password')

    if not all([fullName, username, contact, password]):
        return jsonify({"message": "All fields are required."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error."}), 500
    
    cursor = conn.cursor(dictionary=True) # Use dictionary cursor to check by column name

    try:
        # Check if username or email already exists
        cursor.execute("SELECT username, email FROM users WHERE username = %s OR email = %s", (username, contact))
        existing_user = cursor.fetchone()
        if existing_user:
            if existing_user['username'] == username:
                return jsonify({"message": "This username is already taken."}), 409
            if existing_user['email'] == contact:
                return jsonify({"message": "An account with this email already exists."}), 409

        # 🔒 Hash the password for security before storing it
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert the new user into the database
        cursor.execute(
            "INSERT INTO users (full_name, username, email, password_hash) VALUES (%s, %s, %s, %s)",
            (fullName, username, contact, hashed_password)
        )
        conn.commit()
        logging.info(f"New user created: {username}")
        return jsonify({"success": True, "message": "Account created successfully!"}), 201

    except mysql.connector.Error as err:
        logging.error(f"Database Insert Error: {err}")
        return jsonify({"message": "Failed to create account due to a server error."}), 500
    finally:
        cursor.close()
        conn.close()


# 🖥️ THE LOGIN ENDPOINT
@app.route('/login', methods=['POST'])
def login():
    """Handles user login."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection error."}), 500
        
    cursor = conn.cursor(dictionary=True) # dictionary=True lets us access columns by name

    try:
        # Find the user by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "No account found. Please create an account first."}), 404

        # Check if the entered password matches the stored hash
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            logging.info(f"Successful login for: {email}")
            return jsonify({"success": True, "message": "Login successful!"}), 200
        else:
            logging.warning(f"Failed login attempt for: {email}")
            return jsonify({"success": False, "message": "Invalid email or password."}), 401
            
    except mysql.connector.Error as err:
        logging.error(f"Database Select Error: {err}")
        return jsonify({"message": "An error occurred during login."}), 500
    finally:
        cursor.close()
        conn.close()

# --- Run the Server ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
