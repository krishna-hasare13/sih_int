import sqlite3

DB_PATH = 'students.db'

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Delete all users with the counselor role
deleted = cursor.execute("DELETE FROM users WHERE role = ?", ('counselor',)).rowcount
conn.commit()

print(f"Deleted {deleted} counselor user(s) from the database.")

conn.close()
