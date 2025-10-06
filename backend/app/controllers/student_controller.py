from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.forms.student_form import StudentForm
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import get_db

student_bp = Blueprint("student_bp", __name__, url_prefix="/api/students")

# Create
@student_bp.route('/create', methods=['POST'])
@jwt_required()
def create_student():
    current_user_id = get_jwt_identity()
    form = StudentForm(request.get_json())

    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if Student.exists(form.studentID):
        return jsonify({"error": "Student ID already exists"}), 409

    student = Student(form.studentID, form.firstName, form.lastName, form.programCode, form.yearLevel, form.gender)
    student.add()

    print(f"[CREATE] User {current_user_id} created student {student.studentID}")
    return jsonify({'message': 'Student created', 'student': student.serialize()}), 201

# Read
@student_bp.route('/<studentID>', methods=['GET'])
@jwt_required()
def get_student(studentID):
    student = Student.get(studentID)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    print(f"[READ] Student {studentID} data accessed")
    return jsonify(student.serialize())

# Update
@student_bp.route('/<studentID>', methods=['PUT'])
@jwt_required()
def update_student(studentID):
    current_user_id = get_jwt_identity()
    existing_student = Student.get(studentID)
    if not existing_student:
        return jsonify({"error": "Student not found"}), 404

    form = StudentForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if form.studentID.lower() != studentID.lower() and Student.exists(form.studentID):
        return jsonify({"error": "Student ID already exists"}), 409

    updated_student = Student(form.studentID, form.firstName, form.lastName, form.programCode, form.yearLevel, form.gender)
    updated_student.update(studentID)

    print(f"[UPDATE] User {current_user_id} updated student {studentID}")
    return jsonify({'message': 'Student updated', 'student': updated_student.serialize()})

# Delete
@student_bp.route('/<studentID>', methods=['DELETE'])
@jwt_required()
def delete_student(studentID):
    current_user_id = get_jwt_identity()
    student = Student.get(studentID)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    student.delete()
    print(f"[DELETE] User {current_user_id} deleted student {studentID}")
    return jsonify({'message': f'Student {studentID} deleted'})

@student_bp.route('', methods=['GET'])
@jwt_required()
def list_students():
    try:
        current_user_id = get_jwt_identity()
        db = get_db()
        cursor = db.cursor()

        search = request.args.get('search', '').lower()
        searchBy = request.args.get('searchBy', 'all')
        sortBy = request.args.get('sortBy', 'lastName')
        order = request.args.get('order', 'asc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 15))
        offset = (page - 1) * per_page

        # Build WHERE clause
        where_clauses = []
        params = []

        if search:
            like = f"%{search}%"
            if searchBy == 'studentid':
                where_clauses.append("LOWER(studentid) LIKE %s")
                params.append(like)
            elif searchBy == 'firstname':
                where_clauses.append("LOWER(firstname) LIKE %s")
                params.append(like)
            elif searchBy == 'lastname':
                where_clauses.append("LOWER(lastname) LIKE %s")
                params.append(like)
            elif searchBy == 'programcode':
                where_clauses.append("LOWER(programcode) LIKE %s")
                params.append(like)
            elif searchBy == 'yearlevel':
                where_clauses.append("LOWER(yearlevel) LIKE %s")
                params.append(like)
            elif searchBy == 'gender':
                where_clauses.append("LOWER(gender) LIKE %s")
                params.append(like)
            elif searchBy == 'all':
                where_clauses.append("(" +
                    "LOWER(studentid) LIKE %s OR " +
                    "LOWER(firstname) LIKE %s OR " +
                    "LOWER(lastname) LIKE %s OR " +
                    "LOWER(programcode) LIKE %s OR " +
                    "CAST(yearlevel AS TEXT) LIKE %s OR " +  # ✅ cast to text
                    "LOWER(gender) LIKE %s" +
                ")")
                params.extend([like] * 6)

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        sort_sql = f"ORDER BY {sortBy} {'DESC' if order == 'desc' else 'ASC'}"

        cursor.execute(f"SELECT COUNT(*) FROM student {where_sql}", params)
        total = cursor.fetchone()[0]

        # Fetch paginated results
        cursor.execute(
            f"SELECT studentid, firstname, lastname, programcode, yearlevel, gender FROM student {where_sql} {sort_sql} LIMIT %s OFFSET %s",
            params + [per_page, offset]
        )
        rows = cursor.fetchall()
        students = [Student(studentid, firstname, lastname, programcode, yearlevel, gender).serialize() for studentid, firstname, lastname, programcode, yearlevel, gender in rows]
        pages = (total + per_page - 1) // per_page

        print(f"[LIST] User {current_user_id} viewed student list with search='{search}' and sort='{sortBy}:{order}'")
        return jsonify({
            "students": students,
            "total": total,
            "pages": pages,
            "current_page": page
        })

    except Exception as e:
        print("🔥 Error in list_students:", str(e))
        return jsonify({"error": "Internal server error"}), 500

@student_bp.route("/by-program", methods=["GET"])
@jwt_required()
def get_students_by_program():
    program_code = request.args.get("programCode")

    try:
        if not program_code or program_code.lower() == "all":
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT studentid, firstname, lastname, programcode, yearlevel, gender FROM student ORDER BY lastname")
            rows = cursor.fetchall()
            cursor.close()
            students = [Student(*row).serialize() for row in rows]
        else:
            students = [s.serialize() for s in Student.students_by_prog(program_code)]

        return jsonify({"students": students}), 200

    except Exception as e:
        print("Error fetching students by program:", e)
        return jsonify({"error": "Failed to fetch students"}), 500

@student_bp.route("/count-by-program", methods=["GET"])
@jwt_required()
def count_by_program():
    try:
        rows = Student.student_count_by_prog()
        return jsonify([
            {"programCode": row[0], "count": row[1]} for row in rows
        ]), 200
    except Exception as e:
        print("Error fetching student counts:", e)
        return jsonify({"error": "Failed to fetch student counts"}), 500

@student_bp.route("/count-by-gender", methods=["GET"])
@jwt_required()
def count_by_gender():
    try:
        rows = Student.gender_count()
        return jsonify([
            {"gender": row[0], "count": row[1]} for row in rows
        ]), 200
    except Exception as e:
        print("Error fetching gender counts:", e)
        return jsonify({"error": "Failed to fetch gender counts"}), 500

