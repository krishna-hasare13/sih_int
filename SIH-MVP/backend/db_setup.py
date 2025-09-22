import pandas as pd
import sqlite3
import json
import os
from typing import List, Dict

def load_and_validate_csv(file_path: str) -> pd.DataFrame:
    """Load and validate the CSV file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file {file_path} not found")
    
    df = pd.read_csv(file_path)
    expected_columns = [
        'student_id', 'name', 'prn', 'fee_status', 'attendance_percentage',
        'avgMarks', 'sem1_att', 'sem2_att', 'sem3_att', 'sem4_att', 'sem5_att',
        'sem6_att', 'sem1_cgpa', 'sem2_cgpa', 'sem3_cgpa', 'sem4_cgpa',
        'sem5_cgpa', 'sem6_cgpa', 'credits', 'wellbeing', 'subjects_json'
    ]
    
    missing = [col for col in expected_columns if col not in df.columns]
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")
    
    return df

def parse_subjects_json(subjects_json: str) -> List[Dict]:
    """Parse subjects_json into a list of subject-score dictionaries."""
    try:
        return json.loads(subjects_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing subjects_json: {e}")
        return []

def transform_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Transform CSV data into students and test_scores DataFrames."""
    students_data = []
    test_scores_data = []
    
    for _, row in df.iterrows():
        # Student data
        student = {
            'student_id': row['student_id'],
            'name': row['name'],
            'prn': row['prn'],
            'fee_status': row['fee_status'],
            'attendance_percentage': row['attendance_percentage'],
            'avgMarks': row['avgMarks'],
            'sem1_att': row['sem1_att'],
            'sem2_att': row['sem2_att'],
            'sem3_att': row['sem3_att'],
            'sem4_att': row['sem4_att'],
            'sem5_att': row['sem5_att'],
            'sem6_att': row['sem6_att'],
            'sem1_cgpa': row['sem1_cgpa'],
            'sem2_cgpa': row['sem2_cgpa'],
            'sem3_cgpa': row['sem3_cgpa'],
            'sem4_cgpa': row['sem4_cgpa'],
            'sem5_cgpa': row['sem5_cgpa'],
            'sem6_cgpa': row['sem6_cgpa'],
            'credits': row['credits'],
            'wellbeing': row['wellbeing']
        }
        students_data.append(student)
        
        # Test scores data
        subjects = parse_subjects_json(row['subjects_json'])
        for test_num, subject_entry in enumerate(subjects, start=1):
            test_scores_data.append({
                'student_id': row['student_id'],
                'subject': subject_entry['subject'],
                'test_number': test_num,
                'test_score': subject_entry['score']
            })
    
    students_df = pd.DataFrame(students_data)
    test_scores_df = pd.DataFrame(test_scores_data)
    return students_df, test_scores_df

def create_database(db_name: str) -> sqlite3.Connection:
    """Create SQLite database and tables."""
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Drop existing tables to ensure correct schema
    cursor.execute("DROP TABLE IF EXISTS test_scores")
    cursor.execute("DROP TABLE IF EXISTS students")
    
    # Create students table
    cursor.execute("""
        CREATE TABLE students (
            student_id TEXT PRIMARY KEY,
            name TEXT,
            prn TEXT UNIQUE,
            fee_status TEXT,
            attendance_percentage INTEGER,
            avgMarks REAL,
            sem1_att INTEGER,
            sem2_att INTEGER,
            sem3_att INTEGER,
            sem4_att INTEGER,
            sem5_att INTEGER,
            sem6_att INTEGER,
            sem1_cgpa REAL,
            sem2_cgpa REAL,
            sem3_cgpa REAL,
            sem4_cgpa REAL,
            sem5_cgpa REAL,
            sem6_cgpa REAL,
            credits INTEGER,
            wellbeing INTEGER
        )
    """)
    
    # Create test_scores table
    cursor.execute("""
        CREATE TABLE test_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            subject TEXT,
            test_number INTEGER,
            test_score INTEGER,
            FOREIGN KEY (student_id) REFERENCES students (student_id)
        )
    """)
    
    conn.commit()
    return conn

def insert_data(conn: sqlite3.Connection, students_df: pd.DataFrame, test_scores_df: pd.DataFrame):
    """Insert data into the database."""
    cursor = conn.cursor()
    
    # Insert into students table
    for _, row in students_df.iterrows():
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO students (
                    student_id, name, prn, fee_status, attendance_percentage,
                    avgMarks, sem1_att, sem2_att, sem3_att, sem4_att, sem5_att,
                    sem6_att, sem1_cgpa, sem2_cgpa, sem3_cgpa, sem4_cgpa,
                    sem5_cgpa, sem6_cgpa, credits, wellbeing
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                row['student_id'], row['name'], row['prn'], row['fee_status'],
                row['attendance_percentage'], row['avgMarks'], row['sem1_att'],
                row['sem2_att'], row['sem3_att'], row['sem4_att'], row['sem5_att'],
                row['sem6_att'], row['sem1_cgpa'], row['sem2_cgpa'], row['sem3_cgpa'],
                row['sem4_cgpa'], row['sem5_cgpa'], row['sem6_cgpa'], row['credits'],
                row['wellbeing']
            ))
        except sqlite3.Error as e:
            print(f"Error inserting student {row['student_id']}: {e}")
    
    # Insert into test_scores table
    for _, row in test_scores_df.iterrows():
        try:
            cursor.execute("""
                INSERT INTO test_scores (student_id, subject, test_number, test_score)
                VALUES (?, ?, ?, ?)
            """, (
                row['student_id'], row['subject'], row['test_number'], row['test_score']
            ))
        except sqlite3.Error as e:
            print(f"Error inserting test score for {row['student_id']}: {e}")
    
    conn.commit()

def main():
    csv_file = 'students_data.csv'
    db_name = 'students.db'
    
    try:
        # Load and validate CSV
        df = load_and_validate_csv(csv_file)
        print(f"--- Inspecting '{csv_file}' ---")
        print("Headers found:", list(df.columns))
        print("\nFirst 5 rows (sample):")
        print(df.head().to_string())
        
        # Transform data
        students_df, test_scores_df = transform_data(df)
        
        # Create database and tables
        conn = create_database(db_name)
        
        # Insert data
        insert_data(conn, students_df, test_scores_df)
        
        print(f"\nSuccessfully loaded data into {db_name}")
        print(f"Students table: {len(students_df)} records")
        print(f"Test scores table: {len(test_scores_df)} records")
        
        # Verify mappings
        required_schema = ['student_id', 'name', 'prn', 'fee_status', 'attendance_percentage', 
                         'subject', 'test_number', 'test_score']
        combined_columns = list(students_df.columns) + ['subject', 'test_number', 'test_score']
        missing = [col for col in required_schema if col not in combined_columns]
        if missing:
            print(f"❌ Missing after mapping: {missing}")
        else:
            print("✅ All required columns mapped successfully")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()