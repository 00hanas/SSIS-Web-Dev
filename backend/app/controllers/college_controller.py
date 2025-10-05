from flask import Blueprint, request, jsonify
from app.models.college import College
from app.forms.college_form import CollegeForm
from app.database import get_db
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

    if College.exists(form.collegeCode):
        return jsonify({"error": "College code already exists"}), 409

    college = College(form.collegeCode, form.collegeName)
    college.add()

    print(f"[CREATE] User {current_user_id} created college {form.collegeCode}")
    return jsonify({'message': 'College created', 'college': college.serialize()}), 201

#edit (for pre-filled data)
@college_bp.route('/<collegeCode>', methods=['GET'])
@jwt_required()
def get_college(collegeCode):
    current_user_id = get_jwt_identity()
    college = College.get(collegeCode)
    if not college:
        return jsonify({"error": "College not found"}), 404

    print(f"[READ] User {current_user_id} accessed college {collegeCode}")
    return jsonify(college.serialize())

#update
@college_bp.route('/<collegeCode>', methods=['PUT'])
@jwt_required()
def update_college(collegeCode):
    current_user_id = get_jwt_identity()
    existing_college = College.get(collegeCode)
    if not existing_college:
        return jsonify({"error": "College not found"}), 404

    form = CollegeForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if form.collegeCode.lower() != collegeCode.lower() and College.exists(form.collegeCode):
        return jsonify({"error": "College code already exists"}), 409

    updated_college = College(form.collegeCode, form.collegeName)
    updated_college.update(collegeCode)

    print(f"[UPDATE] User {current_user_id} updated college {collegeCode}")
    return jsonify({'message': 'College updated', 'college': updated_college.serialize()})

#delete
@college_bp.route('/<collegeCode>', methods=['DELETE'])
@jwt_required()
def delete_college(collegeCode):
    current_user_id = get_jwt_identity()
    college = College.get(collegeCode)
    if not college:
        return jsonify({"error": "College not found"}), 404

    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("UPDATE program SET collegeCode = NULL WHERE collegeCode = %s", (collegeCode,))
        college.delete()

        print(f"[DELETE] User {current_user_id} deleted college {collegeCode}")
        return jsonify({'message': f'College {collegeCode} deleted and programs updated.'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#page display with search and sort
@college_bp.route('', methods=['GET'])
@jwt_required()
def list_colleges():
    try:
        current_user_id = get_jwt_identity()
        print("Authenticated user:", current_user_id)

        search = request.args.get('search', '').lower()
        searchBy = request.args.get('searchBy', 'all')
        sortBy = request.args.get('sortBy', 'collegeCode')
        order = request.args.get('order', 'asc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 15))
        offset = (page - 1) * per_page

        db = get_db()
        cursor = db.cursor()

        # Build WHERE clause
        where_clauses = []
        params = []

        if search:
            like = f"%{search}%"
            if searchBy == 'collegeCode':
                where_clauses.append("LOWER(collegecode) LIKE %s")
                params.append(like)
            elif searchBy == 'collegeName':
                where_clauses.append("LOWER(collegename) LIKE %s")
                params.append(like)
            elif searchBy == 'all':
                where_clauses.append("(LOWER(collegecode) LIKE %s OR LOWER(collegename) LIKE %s)")
                params.extend([like, like])

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        sort_sql = f"ORDER BY {sortBy} {'DESC' if order == 'desc' else 'ASC'}"

        # Count total
        cursor.execute(f"SELECT COUNT(*) FROM college {where_sql}", params)
        total = cursor.fetchone()[0]

        # Fetch paginated results
        cursor.execute(
            f"SELECT collegecode, collegename FROM college {where_sql} {sort_sql} LIMIT %s OFFSET %s",
            params + [per_page, offset]
        )
        rows = cursor.fetchall()
        colleges = [College(code, name).serialize() for code, name in rows]

        pages = (total + per_page - 1) // per_page

        return jsonify({
            'colleges': colleges,
            'total': total,
            'pages': pages,
            'current_page': page
        })

    except Exception as e:
        print("🔥 Error in list_colleges:", str(e))
        return jsonify({"error": "Internal server error"}), 500


# Dropdown
@college_bp.route('/dropdown', methods=['GET'])
@jwt_required()
def list_colleges_for_dropdown():
    colleges = College.all()
    return jsonify({
        'colleges': [c.serialize() for c in colleges]
    })
