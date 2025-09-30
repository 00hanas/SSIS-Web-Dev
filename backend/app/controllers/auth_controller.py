from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies
from app.extensions import db
from app.models.user import User
from app.forms.login_form import LoginForm
from app.forms.signup_form import SignUpForm
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth_bp', __name__, url_prefix="/api/auth")

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    try:
        if request.method == "OPTIONS":
            return jsonify({}), 200 
    
        data = request.get_json()
        print("Received login data:", data)

        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        form = LoginForm(data)
        print("Parsed login form:", form.email)

        if not form.email:
            return jsonify({"error": "Email is required."}), 400


        if not form.is_valid():
            return jsonify({"error": form.errors[0]}), 400

        user = User.query.filter_by(email=form.email).first()
        print("Queried user:", user)

        if user is None:
            return jsonify({"error": "Email is not registered."}), 404

        if not user.check_password(form.password):
            return jsonify({"error": "Incorrect password."}), 401

        access_token = create_access_token(identity=str(user.userID)) 
        response = jsonify({"message": "Login successful"})
        set_access_cookies(response, access_token)
        return response, 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Server error during login"}), 500


@auth_bp.route("/signup", methods=["POST"])
def signup():
    form = SignUpForm(request.get_json())
    if not form.is_valid():
        return jsonify({"error": form.errors[0]}), 400

    if User.query.filter((User.email == form.email) | (User.username == form.username)).first():
        return jsonify({"error": "Email or username already exists."}), 409

    hashed_pw = generate_password_hash(form.password)
    new_user = User(username=form.username, email=form.email)
    new_user.set_password(form.password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully."}), 201

@auth_bp.route('/ping', methods=['GET'])
@jwt_required()
def ping():
    try:
        user_id = get_jwt_identity()
        print("Ping user_id:", user_id)

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user_id": user_id,
            "user": {
                "name": user.username,
                "email": user.email
            }
        }), 200
    except Exception as e:
        print("Ping error:", repr(e))
        return jsonify({"error": "Invalid token"}), 422


@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

from flask_jwt_extended import decode_token

@auth_bp.route("/debug-token", methods=["GET"])
def debug_token():
    token = request.cookies.get("access_token_cookie")
    print("Raw token:", token)
    try:
        decoded = decode_token(token)
        print("Decoded token:", decoded)
        return jsonify(decoded)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400
