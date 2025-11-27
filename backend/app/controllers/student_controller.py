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
    data = request.get_json()
    form = StudentForm(data)

    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if Student.exists(form.studentID):
        return jsonify({"error": "Student ID already exists"}), 409

    photo_url = data.get("photoUrl", "/student-icon.jpg")

    student = Student(
        form.studentID,
        form.firstName,
        form.lastName,
        form.programCode,
        form.yearLevel,
        form.gender,
        photo_url  
    )
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
    
    photo_url = form.photoUrl if form.photoUrl not in [None, "", "null"] else "/student-icon.jpg"

    updated_student = Student(form.studentID, form.firstName, form.lastName, form.programCode, form.yearLevel, form.gender, photo_url)
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

#list
@student_bp.route('/list', methods=['GET'])
@jwt_required()
def list_students():
    try:
        current_user_id = get_jwt_identity()
        print("Authenticated user:", current_user_id)

        students = [s.serialize() for s in Student.all()]
        return jsonify({'students': students}), 200

    except Exception as e:
        print("🔥 Error in list_students:", str(e))
        return jsonify({"error": "Internal server error"}), 500
    
#page display with search, sort, pagination
@student_bp.route('', methods=['GET'])
@jwt_required()
def list_students_filtered():
    try:
        current_user_id = get_jwt_identity()
        print("Authenticated user:", current_user_id)

        search = request.args.get('search', '').lower()
        search_by = request.args.get('searchBy', 'all')
        sort_by = request.args.get('sortBy', 'studentID')
        sort_order = request.args.get('order', 'asc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        students, total = Student.query(
            search=search,
            search_by=search_by,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            page_size=per_page
        )

        pages = (total + per_page - 1) // per_page

        return jsonify({
            'students': [s.serialize() for s in students],
            'total': total,
            'pages': pages,
            'current_page': page
        }), 200
    except Exception as e:
        print("🔥 Error in list_students:", str(e))
        return jsonify({"error": "Internal server error"}), 500


@student_bp.route("/by-program", methods=["GET"])
@jwt_required()
def get_students_by_program():
    program_code = request.args.get("programCode")

    try:
        if not program_code or program_code.lower() == "all":
            students = [s.serialize() for s in Student.all()]
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
    
#total students
@student_bp.route("/total", methods=["GET"])
@jwt_required()
def get_total_students():
    try:
        total = Student.total()
        return jsonify({"total": total}), 200
    except Exception as e:
        print("🔥 Error in get_total_students:", str(e))
        return jsonify({"error": "Internal server error"}), 500

