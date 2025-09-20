import sqlite3
from werkzeug.security import generate_password_hash

def create_new_user():
    print("--- Create New User ---")
    username = input("Enter a new username: ")
    password = input("Enter a password: ")
    role = input("Enter user role (e.g., 'admin', 'counselor', or 'student'): ")

    password_hash = generate_password_hash(password)

    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        
        # Check if username already exists
        cursor.execute("SELECT * FROM users WHERE username=?", (username,))
        if cursor.fetchone():
            print(f"Error: Username '{username}' already exists.")
            return

        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (username, password_hash, role))
        conn.commit()
        print(f"✅ User '{username}' with role '{role}' created successfully!")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_new_user()