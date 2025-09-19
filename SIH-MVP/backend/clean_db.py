import pandas as pd
import sqlite3

def clean_database():
    try:
        conn = sqlite3.connect('students.db')
    except sqlite3.Error as e:
        print(f"Database connection error: {e}")
        return

    # Clean the 'students' table
    print("Cleaning 'students' table...")
    students_df = pd.read_sql_query("SELECT * FROM students", conn)
    students_df.drop_duplicates(subset=['student_id'], keep='first', inplace=True)
    students_df.to_sql('students', conn, if_exists='replace', index=False)
    
    # Clean the 'test_scores' table (in case of duplicate test entries for a student)
    print("Cleaning 'test_scores' table...")
    test_scores_df = pd.read_sql_query("SELECT * FROM test_scores", conn)
    test_scores_df.drop_duplicates(subset=['student_id', 'subject', 'test_number'], keep='first', inplace=True)
    test_scores_df.to_sql('test_scores', conn, if_exists='replace', index=False)

    conn.close()
    print("✅ Database cleaned successfully! Duplicates have been removed.")

if __name__ == "__main__":
    clean_database()