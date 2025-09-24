from flask import Blueprint, request, jsonify
from app.models.program import Program
from app.extensions import db
from app.forms.program_form import ProgramForm

program_bp = Blueprint("program_bp", __name__, url_prefix="/api/programs")

@program_bp.route('/create', methods=['POST'])
def create_program():
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

    return jsonify({'message': 'Program created', 'program': program.serialize()}), 201

@program_bp.route('/<programCode>', methods=['GET'])
def get_program(programCode):
    program = Program.query.get_or_404(programCode)
    return jsonify(program.serialize())

@program_bp.route('/<programCode>', methods=['PUT'])
def update_program(programCode):
    program = Program.query.get_or_404(programCode)
    data = request.get_json()
    for key, value in data.items():
        setattr(program, key, value)
    db.session.commit()
    return jsonify({'message': 'Program updated'})

@program_bp.route('/<programCode>', methods=['DELETE'])
def delete_program(programCode):
    program = Program.query.get_or_404(programCode)
    db.session.delete(program)
    db.session.commit()
    return jsonify({'message': 'Program deleted'})

@program_bp.route('', methods=['GET'])
def list_programs():
    query = Program.query

    search = request.args.get('search')
    if search:
        query = query.filter(Program.programName.ilike(f'%{search}%'))

    sort_by = request.args.get('sort_by', 'programName')
    order = request.args.get('order', 'asc')
    if hasattr(Program, sort_by):
        sort_column = getattr(Program, sort_by)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    programs = query.paginate(page=page, per_page=per_page, error_out=False)

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
