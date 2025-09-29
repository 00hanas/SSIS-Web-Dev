from flask import Blueprint, request, jsonify
from app.models.program import Program
from app.extensions import db
from app.forms.program_form import ProgramForm
from sqlalchemy import cast
from flask_jwt_extended import jwt_required, get_jwt_identity

program_bp = Blueprint("program_bp", __name__, url_prefix="/api/programs")

#add
@program_bp.route('/create', methods=['POST'])
@jwt_required()
def create_program():
    current_user_id = get_jwt_identity()
    form = ProgramForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    existing = Program.query.filter(
        db.func.lower(Program.programCode) == form.programCode.lower()
    ).first()
    if existing:
        return jsonify({"error": "Program code already exists"}), 409

    program = Program(**form.to_dict())
    db.session.add(program)
    db.session.commit()

    print(f"[CREATE] User {current_user_id} created program {form.programCode}")
    return jsonify({'message': 'Program created', 'program': program.serialize()}), 201

#edit (for pre-filled data)
@program_bp.route('/<programCode>', methods=['GET'])
@jwt_required()
def get_program(programCode):
    current_user_id = get_jwt_identity()
    program = Program.query.get_or_404(programCode)
    print(f"[READ] User {current_user_id} accessed program {programCode}")
    return jsonify(program.serialize())

#update
@program_bp.route('/<programCode>', methods=['PUT'])
@jwt_required()
def update_program(programCode):
    current_user_id = get_jwt_identity()
    program = Program.query.get_or_404(programCode)
    data = request.get_json()
    form = ProgramForm(data)

    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400
    
    if form.programCode.lower() != program.programCode.lower():
        existing = Program.query.filter(
            db.func.lower(Program.programCode) == form.programCode.lower(),
            db.func.lower(Program.programCode) != program.programCode.lower()
        ).first()
        if existing:
            return jsonify({"error": "Program code already exists"}), 409
        
    program.programCode = form.programCode
    program.programName = form.programName
    program.collegeCode = form.collegeCode
    db.session.commit()

    print(f"[UPDATE] User {current_user_id} updated program {programCode}")
    return jsonify({'message': 'Program updated', 'program': program.serialize()})

#delete
from app.models.student import Student
@program_bp.route('/<programCode>', methods=['DELETE'])
@jwt_required()
def delete_program(programCode):
    current_user_id = get_jwt_identity()
    program = Program.query.get_or_404(programCode)
    students = Student.query.filter_by(programCode=programCode).all()
    for student in students:
        student.programCode = None

    db.session.delete(program)
    db.session.commit()

    print(f"[DELETE] User {current_user_id} deleted program {programCode}")
    return jsonify({'message': f'Program {programCode} deleted and students updated'})

#page display with search and sort
@program_bp.route('', methods=['GET'])
@jwt_required()
def list_programs():
    current_user_id = get_jwt_identity()
    query = Program.query

    search = request.args.get('search', '').lower()
    searchBy = request.args.get('searchBy', 'all')
    if search:
        if searchBy == 'programCode':
            query = query.filter(cast(Program.programCode, db.String).ilike(f'%{search}%'))
        elif searchBy == 'programName':
            query = query.filter(cast(Program.programName, db.String).ilike(f'%{search}%'))
        elif searchBy == 'collegeCode':
            query = query.filter(cast(Program.collegeCode, db.String).ilike(f'%{search}%'))
        elif searchBy == 'all':
            query = query.filter(
                db.or_(
                    cast(Program.programCode, db.String).ilike(f'%{search}%'),
                    cast(Program.programName, db.String).ilike(f'%{search}%'),
                    cast(Program.collegeCode, db.String).ilike(f'%{search}%')
                )
            )
    
    sortBy = request.args.get('sortBy', 'programCode')
    order = request.args.get('order', 'asc')
    if hasattr(Program, sortBy):
        sort_column = getattr(Program, sortBy)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 15))
    programs = query.paginate(page=page, per_page=per_page, error_out=False)

    print(f"[LIST] User {current_user_id} viewed program list with search='{search}' and sort='{sortBy}:{order}'")
    return jsonify({
        'programs': [p.serialize() for p in programs.items],
        'total': programs.total,
        'pages': programs.pages,
        'current_page': programs.page
    })

@program_bp.route('/dropdown', methods=['GET'])
def list_program_for_dropdown():
    programs = Program.query.order_by(Program.programName).all()
    return jsonify({
        'programs': [p.serialize() for p in programs]
    })
