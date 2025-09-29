from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.extensions import db
from app.forms.student_form import StudentForm
from sqlalchemy import cast, or_
from flask_jwt_extended import jwt_required, get_jwt_identity

student_bp = Blueprint("student_bp", __name__, url_prefix="/api/students")

#add
@student_bp.route('/create', methods=['POST'])
@jwt_required()
def create_student():
    current_user_id = get_jwt_identity()

    form = StudentForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    existing = Student.query.filter(
        db.func.lower(Student.studentID) == form.studentID.lower()
    ).first()
    if existing:
        return jsonify({"error": "Student ID already exists"}), 409

    student = Student(**form.to_dict())
    db.session.add(student)
    db.session.commit()

    print(f"[CREATE] User {current_user_id} created student {student.studentID}")
    return jsonify({'message': 'Student created', 'student': student.serialize()}), 201

#edit (for pre-filled data)
@student_bp.route('/<studentID>', methods=['GET'])
@jwt_required()
def get_student(studentID):
    student = Student.query.get_or_404(studentID)
    print(f"[READ] Student {studentID} data accessed")
    return jsonify(student.serialize())

#update
@student_bp.route('/<studentID>', methods=['PUT'])
@jwt_required()
def update_student(studentID):
    current_user_id = get_jwt_identity()
    student = Student.query.get_or_404(studentID)
    data = request.get_json()
    form = StudentForm(data)

    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400
    
    if form.studentID.lower() != student.studentID.lower():
        existing = Student.query.filter(
            db.func.lower(Student.studentID) == form.studentID.lower(),
            db.func.lower(Student.studentID) != student.studentID.lower()
        ).first()
        if existing:
            return jsonify({"error": "Student ID already exists"}), 409
        
    student.studentID = form.studentID
    student.firstName = form.firstName
    student.lastName = form.lastName
    student.programCode = form.programCode
    student.yearLevel = form.yearLevel
    student.gender = form.gender
    db.session.commit()

    print(f"[UPDATE] User {current_user_id} updated student {student.studentID}")
    return jsonify({'message': 'Student updated', 'student': student.serialize()})

#delete
@student_bp.route('/<studentID>', methods=['DELETE'])
@jwt_required()
def delete_student(studentID):
    current_user_id = get_jwt_identity()
    student = Student.query.get_or_404(studentID)
    db.session.delete(student)
    db.session.commit()

    print(f"[DELETE] User {current_user_id} deleted student {studentID}")
    return jsonify({'message': f'Student {studentID} deleted'})

#page display with search and sort
@student_bp.route('', methods=['GET'])
@jwt_required()
def list_students():
    current_user_id = get_jwt_identity()
    query = Student.query

    search = request.args.get('search', '').lower()
    searchBy = request.args.get('searchBy', 'all')
    if search:
        if searchBy == 'studentID':
            query = query.filter(cast(Student.studentID, db.String).ilike(f'%{search}%'))
        elif searchBy == 'firstName':
            query = query.filter(cast(Student.firstName, db.String).ilike(f'%{search}%'))
        elif searchBy == 'lastName':
            query = query.filter(cast(Student.lastName, db.String).ilike(f'%{search}%'))
        elif searchBy == 'programCode':
            query = query.filter(cast(Student.programCode, db.String).ilike(f'%{search}%'))
        elif searchBy == 'yearLevel':
            query = query.filter(cast(Student.yearLevel, db.String).ilike(f'%{search}%'))
        elif searchBy == 'gender':
            query = query.filter(cast(Student.gender, db.String).ilike(f'%{search}%'))
        elif searchBy == 'all':
            query = query.filter(
                or_(
                    cast(Student.studentID, db.String).ilike(f'%{search}%'),
                    cast(Student.firstName, db.String).ilike(f'%{search}%'),
                    cast(Student.lastName, db.String).ilike(f'%{search}%'),
                    cast(Student.programCode, db.String).ilike(f'%{search}%'),
                    cast(Student.yearLevel, db.String).ilike(f'%{search}%'),
                    cast(Student.gender, db.String).ilike(f'%{search}%')
                )
            )

    sortBy = request.args.get('sortBy', 'lastName')
    order = request.args.get('order', 'asc')
    if hasattr(Student, sortBy):
        sort_column = getattr(Student, sortBy)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 15))
    students = query.paginate(page=page, per_page=per_page, error_out=False)

    print(f"[LIST] User {current_user_id} viewed student list with search='{search}' and sort='{sortBy}:{order}'")
    return jsonify({
        'students': [s.serialize() for s in students.items],
        'total': students.total,
        'pages': students.pages,
        'current_page': students.page
    })

