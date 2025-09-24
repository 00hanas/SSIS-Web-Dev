from flask import Blueprint, request, jsonify
from app.models.college import College
from app.extensions import db
from app.forms.college_form import CollegeForm

college_bp = Blueprint("college_bp", __name__, url_prefix="/api/colleges")

@college_bp.route('/create', methods=['POST'])
def create_college():
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

    return jsonify({'message': 'College created', 'college': college.serialize()}), 201

@college_bp.route('/<collegeCode>', methods=['GET'])
def get_college(collegeCode):
    college = College.query.get_or_404(collegeCode)
    return jsonify(college.serialize())

@college_bp.route('/<collegeCode>', methods=['PUT'])
def update_college(collegeCode):
    college = College.query.get_or_404(collegeCode)
    data = request.get_json()
    for key, value in data.items():
        setattr(college, key, value)
    db.session.commit()
    return jsonify({'message': 'College updated'})

@college_bp.route('/<collegeCode>', methods=['DELETE'])
def delete_college(collegeCode):
    college = College.query.get_or_404(collegeCode)
    db.session.delete(college)
    db.session.commit()
    return jsonify({'message': 'College deleted'})

@college_bp.route('', methods=['GET'])
def list_colleges():
    query = College.query

    search = request.args.get('search')
    if search:
        query = query.filter(College.collegeName.ilike(f'%{search}%'))

    sort_by = request.args.get('sort_by', 'collegeName')
    order = request.args.get('order', 'asc')
    if hasattr(College, sort_by):
        sort_column = getattr(College, sort_by)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    colleges = query.paginate(page=page, per_page=per_page, error_out=False)

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
