from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db

user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(userID=data['userID'], username=data['username'], role=data['role'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'userID': user.userID}), 201

@user_bp.route('/<userID>', methods=['GET'])
def get_user(userID):
    user = User.query.get_or_404(userID)
    return jsonify(user.serialize())

@user_bp.route('/<userID>', methods=['PUT'])
def update_user(userID):
    user = User.query.get_or_404(userID)
    data = request.get_json()
    for key, value in data.items():
        if key == 'password':
            user.set_password(value)
        else:
            setattr(user, key, value)
    db.session.commit()
    return jsonify({'message': 'User updated'})

@user_bp.route('/<userID>', methods=['DELETE'])
def delete_user(userID):
    user = User.query.get_or_404(userID)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

@user_bp.route('', methods=['GET'])
def list_users():
    query = User.query

    search = request.args.get('search')
    if search:
        query = query.filter(User.username.ilike(f'%{search}%'))

    sort_by = request.args.get('sort_by', 'username')
    order = request.args.get('order', 'asc')
    if hasattr(User, sort_by):
        sort_column = getattr(User, sort_by)
        query = query.order_by(db.desc(sort_column) if order == 'desc' else sort_column)

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    users = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'users': [u.serialize() for u in users.items],
        'total': users.total,
        'pages': users.pages,
        'current_page': users.page
    })
