import sqlite3
import pandas as pd

def check_database_content():
    try:
        conn = sqlite3.connect('students.db')
        
        # Check the number of student records
        students_df = pd.read_sql_query("SELECT * FROM students", conn)
        print(f"Found {len(students_df)} student records in the 'students' table.")
        
        if not students_df.empty:
            print("--- Sample of student data: ---")
            print(students_df.head())
        
        # Check the number of test scores
        test_scores_df = pd.read_sql_query("SELECT * FROM test_scores", conn)
        print(f"\nFound {len(test_scores_df)} test score records in the 'test_scores' table.")
        
    except sqlite3.Error as e:
        print(f"❌ An error occurred: {e}")
        print("This likely means 'students.db' does not exist or is corrupted.")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    check_database_content()