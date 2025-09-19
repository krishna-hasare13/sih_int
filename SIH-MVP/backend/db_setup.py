import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash

def setup_database():
    try:
        combined_df = pd.read_csv("students_data.csv")
    except FileNotFoundError as e:
        print(f"Error: Missing CSV file. Please ensure students_data.csv is in the directory.")
        return

    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()

    print("Creating database tables...")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            student_id TEXT PRIMARY KEY,
            attendance_percentage REAL,
            fee_status TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_scores (
            test_id INTEGER PRIMARY KEY,
            student_id TEXT,
            subject TEXT,
            test_score REAL,
            test_number INTEGER,
            FOREIGN KEY (student_id) REFERENCES students(student_id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT,
            role TEXT
        )
    ''')
    
    print("Populating 'students' table...")
    students_to_add = combined_df[['student_id', 'attendance_percentage', 'fee_status']].drop_duplicates()
    students_to_add.to_sql('students', conn, if_exists='replace', index=False)
    
    print("Populating 'test_scores' table...")
    test_scores_to_add = combined_df[['student_id', 'subject', 'test_score', 'test_number']]
    test_scores_to_add.to_sql('test_scores', conn, if_exists='replace', index=False)
    
    print("Adding default 'admin' user for authentication...")
    admin_password_hash = generate_password_hash("admin")
    cursor.execute("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)", 
                   ('admin', admin_password_hash, 'admin'))

    conn.commit()
    conn.close()
    print("✅ Database 'students.db' created and populated successfully.")

if __name__ == '__main__':
    setup_database()