from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.extensions import db
from app.forms.student_form import StudentForm

student_bp = Blueprint("student_bp", __name__, url_prefix="/api/students")

#add
@student_bp.route('/create', methods=['POST'])
def create_student():
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

    return jsonify({'message': 'Student created', 'student': student.serialize()}), 201

#edit (for pre-filled data)
@student_bp.route('/<studentID>', methods=['GET'])
def get_student(studentID):
    student = Student.query.get_or_404(studentID)
    return jsonify(student.serialize())

#update
@student_bp.route('/<studentID>', methods=['PUT'])
def update_student(studentID):
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

    return jsonify({'message': 'Student updated', 'student': student.serialize()})

@student_bp.route('/<studentID>', methods=['DELETE'])
def delete_student(studentID):
    student = Student.query.get_or_404(studentID)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted'})

@student_bp.route('', methods=['GET'])
def list_students():
    query = Student.query

    search = request.args.get('search')
    if search:
        query = query.filter(Student.lastName.ilike(f'%{search}%'))

    sort_by = request.args.get('sort_by', 'lastName')
    order = request.args.get('order', 'asc')
    if hasattr(Student, sort_by):
        sort_column = getattr(Student, sort_by)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    students = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'students': [s.serialize() for s in students.items],
        'total': students.total,
        'pages': students.pages,
        'current_page': students.page
    })

