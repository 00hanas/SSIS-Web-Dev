from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies
from app.models.user import User

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.userID)
        response = jsonify({"message": "Login successful"})
        set_access_cookies(response, access_token)
        return response

    return jsonify({"error": "Invalid credentials"}), 401
