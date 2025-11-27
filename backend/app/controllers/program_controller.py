from flask import Blueprint, request, jsonify
from app.models.program import Program
from app.forms.program_form import ProgramForm
from app.database import get_db
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

    if Program.exists(form.programCode):
        return jsonify({"error": "Program code already exists"}), 409

    program = Program(form.programCode, form.programName, form.collegeCode)
    program.add()

    print(f"[CREATE] User {current_user_id} created program {form.programCode}")
    return jsonify({'message': 'Program created', 'program': program.serialize()}), 201

#edit (for pre-filled data)
@program_bp.route('/<programCode>', methods=['GET'])
@jwt_required()
def get_program(programCode):
    current_user_id = get_jwt_identity()
    program = Program.get(programCode)
    if not program:
        return jsonify({"error": "Program not found"}), 404
    
    print(f"[READ] User {current_user_id} accessed program {programCode}")
    return jsonify(program.serialize())

#update
@program_bp.route('/<programCode>', methods=['PUT'])
@jwt_required()
def update_program(programCode):
    current_user_id = get_jwt_identity()
    existing_program = Program.get(programCode)
    if not existing_program:
        return jsonify({"error": "Program not found"}), 404
    
    form = ProgramForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400
    
    if form.programCode.lower() != programCode.lower() and Program.exists (form.programCode):
        return jsonify({"error": "Program code already exists"}), 409
    
    updated_program = Program(form.programCode, form.programName, form.collegeCode)
    updated_program.update(programCode)

    print(f"[UPDATE] User {current_user_id} updated program {programCode}")
    return jsonify({'message': 'Program updated', 'program': updated_program.serialize()})

#delete
@program_bp.route('/<programCode>', methods=['DELETE'])
@jwt_required()
def delete_program(programCode):
    current_user_id = get_jwt_identity()
    program = Program.get(programCode)
    if not program:
        return jsonify({"error": "Program not found"}), 404
    
    try:
        program.delete_with_student_update()
        print(f"[DELETE] User {current_user_id} deleted program {programCode}")
        return jsonify({'message': f'Program {programCode} deleted and students updated.'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#list
@program_bp.route('', methods=['GET'])
@jwt_required()
def list_programs():
    try:
        current_user_id = get_jwt_identity()
        print("Authenticated user:", current_user_id)

        programs = [p.serialize() for p in Program.all()]
        return jsonify({'programs': programs}), 200
    except Exception as e:
        print("🔥 Error in list_programs:", str(e))
        return jsonify({"error": "Internal server error"}), 500

#dropdown
@program_bp.route('/dropdown', methods=['GET'])
@jwt_required()
def list_program_for_dropdown():
    programs = Program.all()
    return jsonify({
        'programs': [p.serialize() for p in programs]
    })

#total programs
@program_bp.route("/total", methods=["GET"])
@jwt_required()
def get_total_programs():
    try:
        total = Program.total()
        return jsonify({"total": total}), 200
    except Exception as e:
        print("🔥 Error in get_total_programs:", str(e))
        return jsonify({"error": "Internal server error"}), 500
