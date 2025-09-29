from flask import Blueprint, request, jsonify
from app.models.college import College
from app.extensions import db
from app.forms.college_form import CollegeForm
from sqlalchemy import cast
from flask_jwt_extended import jwt_required, get_jwt_identity

college_bp = Blueprint("college_bp", __name__, url_prefix="/api/colleges")

#add
@college_bp.route('/create', methods=['POST'])
@jwt_required()
def create_college():
    current_user_id = get_jwt_identity()
    form = CollegeForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    existing = College.query.filter(
        db.func.lower(College.collegeCode) == form.collegeCode.lower()
    ).first()
    if existing:
        return jsonify({"error": "College code already exists"}), 409

    college = College(**form.to_dict())
    db.session.add(college)
    db.session.commit()

    print(f"[CREATE] User {current_user_id} created college {form.collegeCode}")
    return jsonify({'message': 'College created', 'college': college.serialize()}), 201

#edit (for pre-filled data)
@college_bp.route('/<collegeCode>', methods=['GET'])
@jwt_required()
def get_college(collegeCode):
    current_user_id = get_jwt_identity()
    college = College.query.get_or_404(collegeCode)
    print(f"[READ] User {current_user_id} accessed college {collegeCode}")
    return jsonify(college.serialize())

#update
@college_bp.route('/<collegeCode>', methods=['PUT'])
@jwt_required()
def update_college(collegeCode):
    current_user_id = get_jwt_identity()
    college = College.query.get_or_404(collegeCode)
    data = request.get_json()
    form = CollegeForm(data)

    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if form.collegeCode.lower() != college.collegeCode.lower():
        existing = College.query.filter(
            db.func.lower(College.collegeCode) == form.collegeCode.lower(),
            db.func.lower(College.collegeCode) != college.collegeCode.lower()
        ).first()
        if existing:
            return jsonify({"error": "College code already exists"}), 409

    college.collegeCode = form.collegeCode
    college.collegeName = form.collegeName
    db.session.commit()

    print(f"[UPDATE] User {current_user_id} updated college {collegeCode}")
    return jsonify({'message': 'College updated', 'college': college.serialize()})

#delete
from app.models.program import Program
@college_bp.route('/<collegeCode>', methods=['DELETE'])
@jwt_required()
def delete_college(collegeCode):
    current_user_id = get_jwt_identity()
    college = College.query.get_or_404(collegeCode)

    try:
        programs = Program.query.filter_by(collegeCode=collegeCode).all()
        for program in programs:
            program.collegeCode = None

        db.session.delete(college)
        db.session.commit()

        print(f"[DELETE] User {current_user_id} deleted college {collegeCode}")
        return jsonify({'message': f'College {collegeCode} deleted and programs updated.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#page display with search and sort
@college_bp.route('', methods=['GET'])
@jwt_required()
def list_colleges():
    current_user_id = get_jwt_identity()
    query = College.query

    search = request.args.get('search', '').lower()
    searchBy = request.args.get('searchBy', 'all')
    if search:
        if searchBy == 'collegeCode':
            query = query.filter(cast(College.collegeCode, db.String).ilike(f'%{search}%'))
        elif searchBy == 'collegeName':
            query = query.filter(cast(College.collegeName, db.String).ilike(f'%{search}%'))
        elif searchBy == 'all':
            query = query.filter(
                db.or_(
                    cast(College.collegeCode, db.String).ilike(f'%{search}%'),
                    cast(College.collegeName, db.String).ilike(f'%{search}%')
                )
            )

    sortBy = request.args.get('sortBy', 'collegeCode')
    order = request.args.get('order', 'asc')
    if hasattr(College, sortBy):
        sort_column = getattr(College, sortBy)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 15))
    colleges = query.paginate(page=page, per_page=per_page, error_out=False)

    print(f"[LIST] User {current_user_id} viewed college list with search='{search}' and sort='{sortBy}:{order}'")
    return jsonify({
        'colleges': [c.serialize() for c in colleges.items],
        'total': colleges.total,
        'pages': colleges.pages,
        'current_page': colleges.page
    })

@college_bp.route('/dropdown', methods=['GET'])
def list_colleges_for_dropdown():
    colleges = College.query.order_by(College.collegeName).all()
    return jsonify({
        'colleges': [c.serialize() for c in colleges]
    })
