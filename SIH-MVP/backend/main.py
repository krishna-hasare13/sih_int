import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import pandas as pd
import numpy as np
import sqlite3
import io
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from werkzeug.security import generate_password_hash, check_password_hash
import joblib

# Set up Flask
app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
)
# Allow all origins (fix for frontend fetch issues)
CORS(app)

# Historical data (used only if DB is empty)
historical_data = {
    'student_id': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'],
    'attendance_percentage': [82, 65, 90, 72, 55, 95, 68, 85, 78, 62],
    'avg_test_score': [81.5, 37.5, 90.0, 50.0, 32.0, 88.0, 55.0, 75.0, 60.0, 45.0],
    'fee_status': ['Paid', 'Overdue', 'Paid', 'Overdue', 'Overdue', 'Paid', 'Overdue', 'Paid', 'Paid', 'Overdue'],
    'risk_label': ['Low', 'High', 'Low', 'Medium', 'High', 'Low', 'High', 'Low', 'Medium', 'High']
}
historical_df = pd.DataFrame(historical_data)

MODEL_FILE = 'risk_model.joblib'
SCALER_FILE = 'scaler.joblib'
ENCODER_FILE = 'encoder.joblib'
MODEL = None
SCALER = None
ENCODER = None
FEATURES = None

# -------------------- Database Helper --------------------
def get_data_from_db():
    conn = None
    try:
        conn = sqlite3.connect('students.db')
        students_df = pd.read_sql_query("SELECT * FROM students", conn)
        test_scores_df = pd.read_sql_query("SELECT * FROM test_scores", conn)
        
        students_df['student_id'] = students_df['student_id'].astype(str)
        test_scores_df['student_id'] = test_scores_df['student_id'].astype(str)

        avg_scores_df = test_scores_df.groupby("student_id")['test_score'].mean().reset_index()
        avg_scores_df.rename(columns={"test_score": "avg_test_score"}, inplace=True)

        merged_df = pd.merge(students_df, avg_scores_df, on='student_id', how='left')
        merged_df['avg_test_score'] = merged_df['avg_test_score'].fillna(0)
        
        return merged_df, test_scores_df, None
    except sqlite3.Error as e:
        return pd.DataFrame(), pd.DataFrame(), f"Database connection error: {e}"
    finally:
        if conn:
            conn.close()

# -------------------- AI Model --------------------
def train_model_once():
    global MODEL, SCALER, ENCODER, FEATURES

    if os.path.exists(MODEL_FILE) and os.path.exists(SCALER_FILE) and os.path.exists(ENCODER_FILE):
        MODEL = joblib.load(MODEL_FILE)
        SCALER = joblib.load(SCALER_FILE)
        ENCODER = joblib.load(ENCODER_FILE)
        FEATURES = ['attendance_percentage', 'avg_test_score'] + ENCODER.get_feature_names_out(['fee_status']).tolist()
        print("✅ AI model loaded successfully.")
        return

    print("⚠️ Training a new AI model...")
    train_df, _, _ = get_data_from_db()

    if train_df.empty:
        train_df = historical_df.copy()

    if 'risk_label' not in train_df.columns:
        def get_label(row):
            if row['attendance_percentage'] < 70 and row['avg_test_score'] < 50:
                return 'High'
            elif row['attendance_percentage'] < 80 or row['avg_test_score'] < 60 or row['fee_status'] == 'Overdue':
                return 'Medium'
            else:
                return 'Low'
        train_df['risk_label'] = train_df.apply(get_label, axis=1)

    ENCODER = OneHotEncoder(handle_unknown='ignore')
    train_encoded = pd.DataFrame(
        ENCODER.fit_transform(train_df[['fee_status']]).toarray(),
        columns=ENCODER.get_feature_names_out(['fee_status'])
    )

    train_df_processed = pd.concat([train_df.drop('fee_status', axis=1), train_encoded], axis=1)

   
    # FEATURES = ['attendance_percentage', 'avg_test_score'] + list(train_encoded.columns)
    FEATURES = ['attendance_percentage', 'avg_test_score'] + ENCODER.get_feature_names_out(['fee_status']).tolist()
    X_train = train_df_processed[FEATURES]
    y_train = train_df_processed['risk_label']

    SCALER = StandardScaler()
    X_train_scaled = SCALER.fit_transform(X_train)

    MODEL = LogisticRegression(random_state=42, max_iter=200)
    MODEL.fit(X_train_scaled, y_train)

    joblib.dump(MODEL, MODEL_FILE)
    joblib.dump(SCALER, SCALER_FILE)
    joblib.dump(ENCODER, ENCODER_FILE)
    print("✅ AI model trained and saved.")

def predict_risk(current_df):
    if MODEL is None or SCALER is None or ENCODER is None:
        return current_df, "AI model not loaded. Restart server."

    current_encoded = pd.DataFrame(
        ENCODER.transform(current_df[['fee_status']]).toarray(),
        columns=ENCODER.get_feature_names_out(['fee_status'])
    )

    current_df_processed = pd.concat([current_df.drop('fee_status', axis=1), current_encoded], axis=1)
    
    X_predict = current_df_processed[FEATURES]
    
    
    
    X_predict_scaled = SCALER.transform(X_predict)
  
    
    
    predictions = MODEL.predict_proba(X_predict_scaled)
    class_order = ['High', 'Medium', 'Low']
    class_map = {cls: predictions[:, np.where(MODEL.classes_ == cls)[0][0]]
                 for cls in class_order if cls in MODEL.classes_}

    current_df['high_risk_prob'] = class_map.get('High', np.zeros(len(current_df)))
    current_df['risk_level'] = MODEL.predict(X_predict_scaled)

    return current_df, None

def get_counseling_insights(student_data, model, features):
    reasons = []
    advice = "No specific advice. The student's data looks good."

    if student_data['attendance_percentage'] < 75:
        reasons.append(f"Low attendance ({student_data['attendance_percentage']}%).")
        advice = "Encourage regular class attendance. "

    if student_data['avg_test_score'] < 50:
        reasons.append(f"Low average test score ({student_data['avg_test_score']}).")
        advice += "Suggest tutoring or extra practice. "

    if student_data['fee_status'].lower() == 'overdue':
        reasons.append("Overdue fee status.")
        advice += "Consider financial counseling."

    return reasons, advice

# -------------------- Routes --------------------
@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route("/api/login", methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    cursor.execute("SELECT password, role FROM users WHERE username=?", (username,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data and check_password_hash(user_data[0], password):
        return jsonify({'message': 'Login successful', 'role': user_data[1], 'username': username}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route("/api/register", methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'message': 'All fields required'}), 400

    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    try:
        password_hash = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (username, password_hash, role))
        conn.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already exists.'}), 409
    finally:
        conn.close()

@app.route("/api/students", methods=["GET"])
def get_students():
    merged_df, _, error = get_data_from_db()

    if error:
       
        return jsonify({"message": error}), 500
    if merged_df.empty:
        return jsonify({"message": "No data found."}), 404

    final_df, model_error = predict_risk(merged_df)
   
    if model_error:
        return jsonify({"message": model_error}), 500

    search_query = request.args.get('search', '').strip().lower()
    risk_filter = request.args.get('filter', '').strip().lower()

    if search_query:
        final_df = final_df[final_df['student_id'].str.contains(search_query, case=False, na=False)]
    if risk_filter and risk_filter != 'all':
        final_df = final_df[final_df['risk_level'].str.lower() == risk_filter]

    final_df = final_df.replace({np.nan: None})
    return jsonify(final_df.to_dict(orient="records"))

@app.route("/api/student/<student_id>", methods=["GET"])
def get_student(student_id):
    merged_df, test_scores_df, error = get_data_from_db()
    if error:
        return jsonify({"message": error}), 500

    student_info_df = merged_df[merged_df['student_id'] == student_id]
    if student_info_df.empty:
        return jsonify({"message": "Student not found."}), 404

    final_df, model_error = predict_risk(merged_df)
    if model_error:
        return jsonify({"message": model_error}), 500

    student_info_final = final_df[final_df['student_id'] == student_id]
    student_info = student_info_final.to_dict(orient="records")[0]
    student_info['fee_status'] = merged_df[merged_df['student_id'] == student_id]['fee_status'].iloc[0]

    reasons, advice = get_counseling_insights(student_info, MODEL, FEATURES)
    student_info['reasons'] = reasons
    student_info['advice'] = advice

    student_scores = test_scores_df[test_scores_df['student_id'] == student_id].to_dict(orient="records")
    return jsonify({"info": student_info, "scores": student_scores})

@app.route("/api/subjects/scores", methods=["GET"])
def get_subject_scores():
    try:
        conn = sqlite3.connect('students.db')
        test_scores_df = pd.read_sql_query("SELECT subject, test_score FROM test_scores", conn)
        conn.close()
        avg_scores_by_subject = test_scores_df.groupby('subject')['test_score'].mean().reset_index()
        return jsonify(avg_scores_by_subject.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"message": f"Error fetching subject scores: {e}"}), 500

@app.route("/api/upload", methods=["POST"])
def upload_data():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No file selected"}), 400

    try:
        df = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8")))
        conn = sqlite3.connect('students.db')

        existing_ids_df = pd.read_sql_query("SELECT student_id FROM students", conn)
        existing_ids = existing_ids_df['student_id'].astype(str).tolist()
        df['student_id'] = df['student_id'].astype(str)

        required_cols = ['student_id', 'attendance_percentage', 'fee_status', 'subject', 'test_score', 'test_number']
        if not all(col in df.columns for col in required_cols):
            conn.close()
            return jsonify({"message": "Missing required columns"}), 400

        new_students_df = df[~df['student_id'].isin(existing_ids)]
        if new_students_df.empty:
            conn.close()
            return jsonify({"message": "No new student data to upload."}), 200

        students_to_add = new_students_df[['student_id', 'attendance_percentage', 'fee_status']]
        test_scores_to_add = new_students_df[['student_id', 'subject', 'test_score', 'test_number']]

        students_to_add.to_sql('students', conn, if_exists='append', index=False)
        test_scores_to_add.to_sql('test_scores', conn, if_exists='append', index=False)

        conn.close()
        return jsonify({"message": f"Uploaded {len(new_students_df)} new student(s)."}), 200
    except Exception as e:
        return jsonify({"message": f"Error processing file: {e}"}), 500

@app.route("/api/student/trends/<student_id>", methods=["GET"])
def get_student_trends(student_id):
    try:
        conn = sqlite3.connect('students.db')
        test_scores_df = pd.read_sql_query(
            f"SELECT test_number, test_score FROM test_scores WHERE student_id='{student_id}' ORDER BY test_number", conn
        )
        conn.close()

        if test_scores_df.empty:
            return jsonify({"message": "No trend data available."}), 404

        return jsonify(test_scores_df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"message": f"Error fetching trends: {e}"}), 500

@app.route("/api/users", methods=["GET"])
def get_users():
    try:
        conn = sqlite3.connect('students.db')
        users_df = pd.read_sql_query("SELECT username, role FROM users", conn)
        conn.close()
        return jsonify(users_df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"message": f"Error fetching users: {e}"}), 500
    

@app.route("/api/student/delete/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    conn = None
    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        
        # Start a transaction
        conn.execute("BEGIN TRANSACTION")
        
        # Delete from the test_scores table first
        cursor.execute("DELETE FROM test_scores WHERE student_id = ?", (student_id,))
        
        # Then delete from the students table
        cursor.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
        
        # Check if any student was deleted
        if cursor.rowcount == 0:
            conn.execute("ROLLBACK")
            return jsonify({'message': f'Student {student_id} not found.'}), 404
        
        conn.execute("COMMIT")
        return jsonify({'message': f'Student {student_id} and their records deleted successfully.'}), 200
        
    except Exception as e:
        conn.execute("ROLLBACK")
        return jsonify({'message': f'Error deleting student: {e}'}), 500
    finally:
        if conn:
            conn.close()
            

@app.route("/api/student/update", methods=["POST"])
def update_student():
    data = request.json
    student_id = data.get('student_id')
    updates = data.get('updates')
    
    if not student_id or not updates:
        return jsonify({"message": "Student ID and updates are required."}), 400

    conn = None
    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        values = list(updates.values())
        values.append(student_id)
        
        sql = f"UPDATE students SET {set_clause} WHERE student_id = ?"
        cursor.execute(sql, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': f'Student {student_id} not found.'}), 404
        
        return jsonify({'message': f'Student {student_id} updated successfully.'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error updating student: {e}'}), 500
    finally:
        if conn:
            conn.close()
            
            
# Student-only login endpoint
@app.route("/api/student-login", methods=['POST'])
def student_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    cursor.execute("SELECT password, role FROM users WHERE username=?", (username,))
    user_data = cursor.fetchone()
    conn.close()

    if user_data and user_data[1] == 'student' and check_password_hash(user_data[0], password):
        return jsonify({'message': 'Login successful', 'role': 'student', 'username': username}), 200
    return jsonify({'message': 'Invalid credentials or not a student account.'}), 401


# Delete a user by username
@app.route("/api/user/delete/<username>", methods=["DELETE"])
def delete_user(username):
    conn = None
    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE username = ?", (username,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': f'User {username} not found.'}), 404
        return jsonify({'message': f'User {username} deleted successfully.'}), 200
    except Exception as e:
        return jsonify({'message': f'Error deleting user: {e}'}), 500
    finally:
        if conn:
            conn.close()

# Update a user's role (only allow 'admin' or 'student')
@app.route("/api/user/update", methods=["POST"])
def update_user():
    data = request.json
    username = data.get('username')
    role = data.get('role')
    if not username or not role:
        return jsonify({'message': 'Username and role are required.'}), 400
    if role not in ['admin', 'student']:
        return jsonify({'message': 'Invalid role. Only admin or student allowed.'}), 400
    conn = None
    try:
        conn = sqlite3.connect('students.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role = ? WHERE username = ?", (role, username))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': f'User {username} not found.'}), 404
        return jsonify({'message': f'User {username} role updated to {role}.'}), 200
    except Exception as e:
        return jsonify({'message': f'Error updating user: {e}'}), 500
    finally:
        if conn:
            conn.close()


# Get current student info (for dashboard)
@app.route("/api/student/me", methods=["GET"])
def get_student_me():
    # For demo: get username from query param (frontend should send ?username=...)
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username required as query param."}), 400
    merged_df, test_scores_df, error = get_data_from_db()
    if error:
        return jsonify({"message": error}), 500
    student_info_df = merged_df[merged_df['student_id'] == username]
    if student_info_df.empty:
        return jsonify({"message": "Student not found."}), 404
    final_df, model_error = predict_risk(merged_df)
    if model_error:
        return jsonify({"message": model_error}), 500
    student_info_final = final_df[final_df['student_id'] == username]
    student_info = student_info_final.to_dict(orient="records")[0]
    student_info['fee_status'] = merged_df[merged_df['student_id'] == username]['fee_status'].iloc[0]
    reasons, advice = get_counseling_insights(student_info, MODEL, FEATURES)
    student_info['reasons'] = reasons
    student_info['advice'] = advice
    # Get test scores for this student
    student_scores = test_scores_df[test_scores_df['student_id'] == username].to_dict(orient="records")
    return jsonify({"info": student_info, "scores": student_scores})


# -------------------- Run --------------------
if __name__ == "__main__":
    train_model_once()
    app.run(debug=True)
