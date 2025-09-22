import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash
import glob
import os

REQUIRED_COLUMNS = {
    "student_id",
    "attendance_percentage",
    "fee_status",
    "subject",
    "test_score",
    "test_number"
}

def validate_csv(file_path):
    """Validate if the CSV has all required columns."""
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"❌ Error reading '{file_path}': {e}")
        return None

    # Check columns
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        print(f"❌ Error: '{file_path}' is missing required columns: {', '.join(missing)}")
        return None
    
    print(f"✅ CSV validation successful: {file_path}")
    return df


def setup_database():
    # Look for CSV files in current directory
    csv_files = glob.glob("*.csv")

    if not csv_files:
        print("❌ No CSV file found in the directory. Please upload a valid file.")
        return

    # Pick the first valid CSV
    combined_df = None
    for file in csv_files:
        print(f"🔍 Checking file: {file}")
        combined_df = validate_csv(file)
        if combined_df is not None:
            chosen_file = file
            break

    if combined_df is None:
        print("❌ No valid CSV file found. Please upload a correct file.")
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
            test_id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    print(f"✅ Database 'students.db' created and populated successfully using file: {chosen_file}")


if __name__ == '__main__':
    setup_database()
