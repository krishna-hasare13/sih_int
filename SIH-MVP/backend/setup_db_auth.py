import sqlite3
from werkzeug.security import generate_password_hash

def setup_auth_database():
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()

    # Create the users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')

    # Add a default admin user
    admin_username = 'admin'
    admin_password_hash = generate_password_hash('password')
    admin_role = 'admin'
    cursor.execute("SELECT * FROM users WHERE username=?", (admin_username,))
    if not cursor.fetchone():
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (admin_username, admin_password_hash, admin_role))
        print("Default admin user created: username='admin', password='password'")


    conn.commit()
    conn.close()

if __name__ == "__main__":
    setup_auth_database()